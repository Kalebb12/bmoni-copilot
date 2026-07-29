"""Voice I/O: Whisper for speech-to-text, YarnGPT for text-to-speech.

Whisper runs locally (CPU or GPU, whichever torch finds) — no network call,
no API key. YarnGPT is a hosted TTS API (https://yarngpt.ai/api/v1/tts) —
see https://yarngpt.ai for full docs, incl. the list of valid `voice` names.
"""

import asyncio
import tempfile
from pathlib import Path
from typing import Any

import httpx

from app.config import get_settings

_whisper_model: Any = None

_YARNGPT_MAX_CHARS = 2000
_YARNGPT_MEDIA_TYPES = {
    "mp3": "audio/mpeg",
    "wav": "audio/wav",
    "opus": "audio/opus",
    "flac": "audio/flac",
}


def _get_whisper_model() -> Any:
    global _whisper_model
    if _whisper_model is None:
        import whisper  # heavy (torch) import — deferred until first use

        _whisper_model = whisper.load_model(get_settings().whisper_model_size)
    return _whisper_model


class VoiceEngineError(Exception):
    """Raised when STT or TTS fails, so the caller can turn it into a clean
    error response instead of a 500 with a stack trace."""


async def transcribe(audio_bytes: bytes, filename_hint: str = "audio.wav") -> str:
    """Transcribes audio bytes to text using local Whisper.

    Runs the (CPU-bound) transcription in a worker thread so it doesn't
    block the event loop.
    """
    suffix = Path(filename_hint).suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        try:
            result = await asyncio.to_thread(_get_whisper_model().transcribe, tmp.name)
        except Exception as exc:  # whisper/ffmpeg failures are not typed consistently
            raise VoiceEngineError(f"Speech-to-text failed: {exc}") from exc
    return str(result.get("text", "")).strip()


def media_type_for(response_format: str) -> str:
    return _YARNGPT_MEDIA_TYPES.get(response_format, "application/octet-stream")


async def synthesize(text: str, voice: str = "Idera", response_format: str = "mp3") -> bytes:
    """Synthesizes speech audio for `text` via YarnGPT's hosted API.

    `voice` must be one of YarnGPT's named voices (e.g. "Idera", "Emma",
    "Chinenye", ...). `response_format` is one of mp3/wav/opus/flac.
    """
    if len(text) > _YARNGPT_MAX_CHARS:
        raise VoiceEngineError(
            f"Text is {len(text)} characters — YarnGPT's limit is {_YARNGPT_MAX_CHARS}."
        )
    if response_format not in _YARNGPT_MEDIA_TYPES:
        raise VoiceEngineError(
            f"Unsupported response_format '{response_format}'. Use one of: "
            f"{', '.join(_YARNGPT_MEDIA_TYPES)}."
        )

    settings = get_settings()
    if not settings.yarngpt_api_key:
        raise VoiceEngineError("YARNGPT_API_KEY is not configured.")

    url = f"{settings.yarngpt_api_base_url.rstrip('/')}/tts"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                headers={
                    "Authorization": f"Bearer {settings.yarngpt_api_key}",
                    "Content-Type": "application/json",
                },
                json={"text": text, "voice": voice, "response_format": response_format},
            )
    except httpx.RequestError as exc:
        raise VoiceEngineError(f"Could not reach YarnGPT: {exc}") from exc

    if response.status_code >= 400:
        raise VoiceEngineError(f"YarnGPT TTS failed ({response.status_code}): {response.text}")

    return response.content
