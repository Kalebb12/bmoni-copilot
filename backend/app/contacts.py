"""User-scoped contacts: CRUD plus fuzzy/LLM-assisted name lookup.

Two behaviors called out in the spec:
  - On save, a name collision within the same user's contacts requires a
    disambiguating label (e.g. "Musa" -> "Musa Office").
  - On lookup, matching is fuzzy/LLM-assisted rather than exact string
    match (Whisper transcriptions vary), and ambiguous matches return
    `clarification_needed` with the candidate list instead of guessing.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import agent
from app.db import get_db
from app.models import Contact, LocalUser
from app.schemas import ContactCreate, ContactLookupResponse, ContactOut, ContactUpdate

router = APIRouter(prefix="/contacts", tags=["contacts"])


def get_or_create_local_user(db: Session, user_id: str) -> LocalUser:
    user = db.get(LocalUser, user_id)
    if user is None:
        user = LocalUser(bmoni_user_id=user_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def _find_name_collisions(db: Session, user_id: str, name: str, exclude_id: str | None = None) -> list[Contact]:
    query = db.query(Contact).filter(
        Contact.user_id == user_id, func.lower(Contact.name) == name.lower()
    )
    if exclude_id:
        query = query.filter(Contact.id != exclude_id)
    return query.all()


@router.post("", response_model=ContactOut, status_code=201)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)) -> Contact:
    get_or_create_local_user(db, payload.user_id)

    collisions = _find_name_collisions(db, payload.user_id, payload.name)
    if collisions:
        if not payload.label:
            example = collisions[0]
            raise HTTPException(
                status_code=409,
                detail={
                    "error": "name_collision",
                    "message": (
                        f"A contact named '{payload.name}' already exists. Add a label to tell them apart, "
                        f"e.g. '{payload.name} Office'."
                    ),
                    "existing": [ContactOut.model_validate(c).model_dump(mode="json") for c in collisions],
                },
            )
        if any((c.label or "").lower() == payload.label.lower() for c in collisions):
            raise HTTPException(
                status_code=409,
                detail={
                    "error": "duplicate_contact",
                    "message": f"A contact named '{payload.name} {payload.label}' already exists.",
                },
            )

    contact = Contact(
        user_id=payload.user_id,
        name=payload.name,
        label=payload.label,
        account_number=payload.account_number,
        bank_code=payload.bank_code,
        bank_name=payload.bank_name,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("", response_model=list[ContactOut])
def list_contacts(user_id: str, db: Session = Depends(get_db)) -> list[Contact]:
    return db.query(Contact).filter(Contact.user_id == user_id).order_by(Contact.name).all()


@router.get("/lookup", response_model=ContactLookupResponse)
async def lookup_contact(user_id: str, query: str, db: Session = Depends(get_db)) -> ContactLookupResponse:
    contacts = db.query(Contact).filter(Contact.user_id == user_id).all()
    candidates = [{"id": c.id, "display_name": c.display_name} for c in contacts]

    result = await agent.match_contact_name(query, candidates)

    if result["status"] == "matched":
        matched = db.get(Contact, result["contact_id"])
        return ContactLookupResponse(status="matched", contact=matched)

    if result["status"] == "ambiguous":
        matched_ids = {c["id"] for c in result["candidates"]}
        candidate_contacts = [c for c in contacts if c.id in matched_ids]
        return ContactLookupResponse(status="clarification_needed", candidates=candidate_contacts)

    return ContactLookupResponse(status="none")


@router.get("/{contact_id}", response_model=ContactOut)
def get_contact(contact_id: str, user_id: str, db: Session = Depends(get_db)) -> Contact:
    contact = db.get(Contact, contact_id)
    if contact is None or contact.user_id != user_id:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/{contact_id}", response_model=ContactOut)
def update_contact(
    contact_id: str, user_id: str, payload: ContactUpdate, db: Session = Depends(get_db)
) -> Contact:
    contact = db.get(Contact, contact_id)
    if contact is None or contact.user_id != user_id:
        raise HTTPException(status_code=404, detail="Contact not found")

    new_name = payload.name if payload.name is not None else contact.name
    new_label = payload.label if payload.label is not None else contact.label
    if payload.name is not None or payload.label is not None:
        collisions = _find_name_collisions(db, user_id, new_name, exclude_id=contact_id)
        if collisions and not new_label:
            raise HTTPException(
                status_code=409,
                detail={
                    "error": "name_collision",
                    "message": f"A contact named '{new_name}' already exists. Add a label to tell them apart.",
                },
            )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=204)
def delete_contact(contact_id: str, user_id: str, db: Session = Depends(get_db)) -> None:
    contact = db.get(Contact, contact_id)
    if contact is None or contact.user_id != user_id:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
