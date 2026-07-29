{
  "openapi": "3.0.0",
  "paths": {
    "/v1/health": {
      "get": {
        "operationId": "AppController_health",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Service is healthy",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HealthOutput"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "summary": "Health check",
        "tags": [
          "Health"
        ]
      }
    },
    "/v1/users": {
      "post": {
        "description": "Creates user in BMoni, submits KYC data, and stores locally. The partner is derived automatically from the API key used. For Nigerian users, provide a BVN to auto-fill lastName, middleName, address, and dateOfBirth from the BVN record. Explicitly provided values always take precedence over BVN data.",
        "operationId": "UserController_createUser",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "409": {
            "description": "User already exists",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConflictErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a new user",
        "tags": [
          "Users"
        ]
      },
      "get": {
        "description": "Returns all users created under the partner associated with the API key, plus employees linked to the partner via the employer-link flow. Linked employees carry a non-null linkedAt and a null phoneNumber (they signed up in the BMONI app themselves).",
        "operationId": "UserController_listUsers",
        "parameters": [
          {
            "name": "page",
            "required": false,
            "in": "query",
            "description": "Page number to return",
            "schema": {
              "minimum": 1,
              "default": 1,
              "example": 1,
              "type": "number"
            }
          },
          {
            "name": "limit",
            "required": false,
            "in": "query",
            "description": "Maximum number of users to return",
            "schema": {
              "minimum": 1,
              "maximum": 100,
              "default": 20,
              "example": 20,
              "type": "number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Users under the authenticated partner",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ListUsersResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List partner users",
        "tags": [
          "Users"
        ]
      }
    },
    "/v1/users/{userId}": {
      "get": {
        "description": "Returns the stored profile for the given user. Also resolves employees linked via the employer-link flow (non-null linkedAt).",
        "operationId": "UserController_getProfile",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "User profile",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get user profile",
        "tags": [
          "Users"
        ]
      },
      "patch": {
        "operationId": "UserController_updateUser",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Update user",
        "tags": [
          "Users"
        ]
      },
      "delete": {
        "operationId": "UserController_deleteUser",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "User removed in BMoni and locally",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteUserResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Delete user account",
        "tags": [
          "Users"
        ]
      }
    },
    "/v1/users/{userId}/kyc/occupations": {
      "get": {
        "description": "Use this endpoint to populate the occupation selector during KYC onboarding. The response returns active occupations that can be submitted later as the user employment occupation. Pass a search term to filter by job title or alias, or omit it to return the default occupation list.",
        "operationId": "KycController_getOccupations",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "search",
            "required": false,
            "in": "query",
            "description": "Optional occupation search term, such as a job title, role, or common alias.",
            "schema": {
              "example": "engineer",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Matching occupations",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/OccupationOutput"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Search KYC occupations",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/options": {
      "get": {
        "description": "Use this endpoint to build KYC forms with the exact enum values accepted by BMoni. It returns selectable values for personal information, employment details, source of funds, identification documents, account purpose, and expected account volume.",
        "operationId": "KycController_getOptions",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "KYC field options",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KycOptionsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get KYC field options",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc": {
      "get": {
        "description": "Returns the KYC profile sectioned for review UIs: basic, identity, address, and work — each with its own derived verification status. Uploads include short-lived presigned URLs for the latest identification document and proof-of-address document.",
        "operationId": "KycController_getProfile",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Sectioned KYC profile",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "profileHeader": {
                      "initials": "CO",
                      "displayName": "Chiamaka Okafor",
                      "displayImageUrl": null
                    },
                    "basicDetails": {
                      "status": "verified",
                      "name": "Chiamaka Okafor",
                      "phoneNumber": "+2348012345678",
                      "emailAddress": "chiamaka@example.com"
                    },
                    "identityDetails": {
                      "status": "verified",
                      "country": {
                        "code": "NGA",
                        "name": "Nigeria"
                      },
                      "selectedId": {
                        "type": "bvn",
                        "label": "BVN"
                      },
                      "idNumber": "22345678901",
                      "bvn": "22345678901",
                      "nin": null,
                      "upload": {
                        "fileId": "kyc-doc-1",
                        "filename": "id_front.jpg",
                        "url": "https://files.example/presigned/...",
                        "mimeType": "image/jpeg"
                      }
                    },
                    "addressDetails": {
                      "status": "pending",
                      "country": {
                        "code": "NGA",
                        "name": "Nigeria"
                      },
                      "state": "Lagos",
                      "postalCode": "101241",
                      "address": "15 Admiralty Way, Lagos",
                      "proofOfAddress": {
                        "type": "utility_bill",
                        "label": "Utility bill"
                      },
                      "upload": null
                    },
                    "workDetails": {
                      "status": "not_started",
                      "employmentStatus": null,
                      "occupation": null,
                      "employerName": null
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get KYC profile",
        "tags": [
          "KYC"
        ]
      },
      "patch": {
        "description": "Null keys are stripped before sending to the upstream API. Use countryCode for addresses, occupationCode from the occupations endpoint for employment, and state for the state/province value. The upstream profile stores state as subdivisionName internally.",
        "operationId": "KycController_updateProfile",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateKycInput"
              },
              "examples": {
                "updateKycProfile": {
                  "summary": "KYC update payload",
                  "value": {
                    "personalInfo": {
                      "firstName": "Chiamaka",
                      "lastName": "Okafor",
                      "middleName": "Ngozi",
                      "phoneNumber": "+2348012345678",
                      "dateOfBirth": "1990-01-01",
                      "gender": "female"
                    },
                    "address": {
                      "streetLine1": "15 Admiralty Way",
                      "city": "Lagos",
                      "state": "Lagos",
                      "postalCode": "101241",
                      "countryCode": "NGA"
                    },
                    "employment": {
                      "occupationCode": "15-1252",
                      "employerName": "ACME Corp",
                      "employmentStatus": "employed"
                    },
                    "sourceOfFunds": "salary",
                    "estimatedMonthlyVolume": 5000,
                    "accountPurpose": "personal",
                    "actingAsIntermediary": false,
                    "identificationNumbers": [
                      {
                        "type": "bvn",
                        "number": "22345678901",
                        "issuingCountryCode": "NGA"
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "KYC profile updated",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "success": true,
                    "saved": {
                      "personalInfo": true,
                      "address": true,
                      "employment": true,
                      "identifications": 1,
                      "agreementId": true
                    },
                    "errors": [
                      {
                        "field": "dateOfBirth",
                        "message": "Date of birth is required"
                      }
                    ],
                    "canActivate": false,
                    "missing": [
                      "dateOfBirth",
                      "nationality"
                    ]
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Update KYC profile with partial data",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/bvn-lookup/{bvn}": {
      "get": {
        "operationId": "KycController_bvnLookup",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "bvn",
            "required": true,
            "in": "path",
            "description": "Bank Verification Number (11 digits)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "BVN lookup result",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BvnLookupOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "BVN not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Lookup BVN data without saving",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/readiness": {
      "get": {
        "operationId": "KycController_getReadiness",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Readiness status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProxyResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Check if KYC profile is ready for activation",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/usd-readiness": {
      "get": {
        "description": "Returns whether the user has all the data required to provision a USD virtual bank account, plus a list of any missing fields. This is a separate check from the general KYC activation readiness above. Gate POST /users/{userId}/onboarding/start-usa on `ready` being true.",
        "operationId": "KycController_getUsdAccountReadiness",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Readiness flag and any missing fields.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsdAccountReadinessOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Check USD virtual bank account provisioning readiness",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/status": {
      "get": {
        "description": "Returns the most recent KYC review for the user, including rejection labels and moderation comments when verification failed. The proxy reads the persisted snapshot first and refreshes from the KYC provider when the local copy is missing, in-flight, or older than 60 seconds.",
        "operationId": "KycController_getStatus",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Latest KYC review snapshot"
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get the latest KYC review status",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/retry": {
      "post": {
        "description": "Re-syncs the user's latest stored documents to their existing KYC applicant and requests a new review. Only valid when the applicant is currently in `action_required` (typically RETRY with BAD_SELFIE or BAD_DOC_QUALITY). The partner should first re-upload the failing document via /kyc/documents/* before calling this.",
        "operationId": "KycController_retry",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/KycRetryInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Retry triggered — new KYC review requested"
          },
          "400": {
            "description": "Applicant not in a retryable state",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Retry KYC verification after action_required",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/nin-lookup/{nin}": {
      "get": {
        "description": "Nigeria-only. Fetches NIN data from QoreID for preview without writing to the KYC profile. The user must already have firstName + lastName saved — those are sent to QoreID for name-match verification.",
        "operationId": "KycController_ninLookup",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "nin",
            "required": true,
            "in": "path",
            "description": "National Identification Number (11 digits)",
            "schema": {
              "example": "12345678901",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "NIN data from QoreID"
          },
          "400": {
            "description": "NIN must be exactly 11 digits",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "NIN not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Lookup NIN data without saving",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/activate": {
      "post": {
        "description": "Submits the completed KYC profile for verification. Canada (CAD) routes to PayTrie; every other country routes to SumSub. sumsubLevelName is required (ignored for Canada). Mexico (MXN) is not served by this endpoint — activate via POST /etherfuse/kyc/activate.",
        "operationId": "KycController_activate",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ActivateKycInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "KYC profile activated",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "activated": true,
                    "message": "Account activated"
                  }
                }
              }
            }
          },
          "400": {
            "description": "KYC profile is not ready for activation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Activate KYC profile (standard onboarding)",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/documents/identification": {
      "post": {
        "operationId": "KycController_uploadIdentification",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Multipart form-data payload. Send the front document image as the first files entry and the back image as the second entry when applicable.",
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "files",
                  "type",
                  "documentNumber",
                  "issuingCountry"
                ],
                "properties": {
                  "files": {
                    "type": "array",
                    "description": "One or two files. The first file is the front image; the second file is the back image when needed.",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    }
                  },
                  "type": {
                    "type": "string",
                    "example": "passport",
                    "description": "One of the identificationTypes returned by GET /users/{userId}/kyc/options."
                  },
                  "documentNumber": {
                    "type": "string",
                    "example": "A12345678"
                  },
                  "issuingCountry": {
                    "type": "string",
                    "example": "NGA",
                    "description": "ISO 3166-1 alpha-3 country code."
                  },
                  "expirationDate": {
                    "type": "string",
                    "format": "date",
                    "example": "2030-01-01"
                  },
                  "issueDate": {
                    "type": "string",
                    "format": "date",
                    "example": "2020-01-01"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Identification document uploaded",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "id": "doc-1",
                    "type": "passport",
                    "documentNumber": "A12345678",
                    "issuingCountryCode": "NG",
                    "expirationDate": "2030-01-01",
                    "issueDate": "2020-01-01",
                    "status": "verified",
                    "verificationNotes": null,
                    "verifiedAt": "2024-01-03T00:00:00.000Z",
                    "verifiedBy": "system",
                    "createdAt": "2024-01-01T00:00:00.000Z",
                    "updatedAt": "2024-01-02T00:00:00.000Z",
                    "files": [
                      {
                        "fileType": "front",
                        "url": "https://...",
                        "mimeType": "image/jpeg",
                        "fileSize": 204800,
                        "originalFilename": "passport_front.jpg",
                        "createdAt": "2024-01-01T00:00:00.000Z"
                      }
                    ]
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid document or missing files",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Upload identification document",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/documents/proof-of-address": {
      "post": {
        "operationId": "KycController_uploadProofOfAddress",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Multipart form-data payload. Send the front proof-of-address image as the first files entry and an additional image as the second entry when applicable.",
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "files",
                  "type"
                ],
                "properties": {
                  "files": {
                    "type": "array",
                    "description": "One or two files. The first file is the front image; the second file is an additional image when needed.",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    }
                  },
                  "type": {
                    "type": "string",
                    "example": "utility_bill"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Proof of address uploaded",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "id": "poa-1",
                    "type": "utility_bill",
                    "createdAt": "2024-01-01T00:00:00.000Z",
                    "updatedAt": "2024-01-02T00:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid document or missing files",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Upload proof of address document",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/kyc/documents/biometric": {
      "post": {
        "operationId": "KycController_uploadBiometric",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Multipart form-data payload with one selfie file.",
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": [
                  "selfie",
                  "type"
                ],
                "properties": {
                  "selfie": {
                    "type": "array",
                    "description": "Selfie image file.",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    }
                  },
                  "type": {
                    "type": "string",
                    "example": "selfie"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Biometric document uploaded",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "id": "bio-1",
                    "type": "selfie",
                    "createdAt": "2024-01-01T00:00:00.000Z",
                    "updatedAt": "2024-01-02T00:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid document or missing files",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Upload biometric document (Optional)",
        "tags": [
          "KYC"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/start-nigeria": {
      "post": {
        "operationId": "OnboardingController_startNigeria",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StartNigeriaOnboardingInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Nigeria onboarding started (201 on success, no body parsed)",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "message": "Nigeria onboarding started successfully"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Start Nigeria onboarding flow",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/start-canada": {
      "post": {
        "operationId": "OnboardingController_startCanada",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StartCanadaOnboardingInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Canada onboarding started (201 on success, no body parsed)",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "message": "Canada onboarding started successfully"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Start Canada onboarding flow",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/start-monerium": {
      "post": {
        "operationId": "OnboardingController_startMonerium",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StartMoneriumOnboardingInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "EU onboarding started (201 on success, no body parsed)",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "message": "EU onboarding started successfully"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Start EU onboarding flow",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/start-mexico": {
      "post": {
        "operationId": "OnboardingController_startMexico",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StartMexicoOnboardingInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Mexico onboarding started (201 on success, no body parsed)",
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "message": "Mexico onboarding started successfully"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Start Mexico onboarding flow",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/start-usa": {
      "post": {
        "description": "Starts provisioning of a named USD virtual bank account for the user. Idempotent — repeated calls do not create duplicate accounts. `smartWalletId` is the destination smart wallet that receives USDB when USD lands in the account. Check GET /users/{userId}/kyc/usd-readiness first, and poll GET /users/{userId}/vba/usd for the account lifecycle status.",
        "operationId": "OnboardingController_startUsa",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StartUsaOnboardingInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Provisioning workflow started.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/StartUsaOnboardingOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed or the user is not ready for provisioning.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Start USA onboarding flow",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/onboarding/status": {
      "get": {
        "description": "Use this endpoint after starting onboarding to check which provider rails are ready for the user. Each provider status tells the client whether onboarding has not started, is pending review, is active, requires resubmission, or has been rejected. When PayTrie requires resubmission, optional rejection fields explain what the user should correct.",
        "operationId": "OnboardingController_getStatus",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Current onboarding status for each supported provider and any resubmission guidance.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OnboardingStatusOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get onboarding status",
        "tags": [
          "Onboarding"
        ]
      }
    },
    "/v1/users/{userId}/exchange/rate/{from}/{to}": {
      "get": {
        "description": "Returns the current exchange rate between two supported currencies. Use displayRate and displayLabel for user-facing display. Supported currencies include stablecoins (USDB, USDC, cNGN) and fiat references (USD, NGN, EUR, GBP, CAD, CNY).",
        "operationId": "ExchangeController_getRate",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "from",
            "required": true,
            "in": "path",
            "description": "Source currency code to convert from.",
            "schema": {
              "example": "USD",
              "type": "string"
            }
          },
          {
            "name": "to",
            "required": true,
            "in": "path",
            "description": "Target currency code to convert to.",
            "schema": {
              "example": "NGN",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Current exchange rate with display-ready labels.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExchangeRateOutput"
                }
              }
            }
          },
          "400": {
            "description": "Unsupported currency pair.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get exchange rate between two currencies",
        "tags": [
          "Exchange"
        ]
      }
    },
    "/v1/users/{userId}/exchange/convert": {
      "post": {
        "description": "Fetches the live exchange rate and returns the converted amount. Use this to show users a conversion preview before initiating a swap or withdrawal.",
        "operationId": "ExchangeController_convert",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ConvertCurrencyInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Converted amount with the exchange rate applied.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConvertCurrencyOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid amount, unsupported currency, or unsupported currency pair.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Convert an amount between two currencies",
        "tags": [
          "Exchange"
        ]
      }
    },
    "/v1/users/{userId}/exchange/quote": {
      "post": {
        "description": "Returns a firm, time-boxed swap quote including the output amount, exchange rate, and itemised fees. Quote for a known input amount (\"exactIn\") or a known output amount (\"exactOut\"). Quotes expire shortly after generation — see expiresAt / expiresInSeconds.",
        "operationId": "ExchangeController_getQuote",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GetSwapQuoteInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Swap quote with rate, output amount, fees, and expiry.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwapQuoteOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid amount, unsupported currency, or unsupported currency pair.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a swap quote between two currencies",
        "tags": [
          "Exchange"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/owner-proof-challenges": {
      "post": {
        "description": "Returns a short-lived EIP-191 message that must be signed by the `userOwnerAddress` private key before calling create-managed. The challenge is bound to the calling user, group ID, currency, and owner address, expires after 10 minutes, and is consumed on successful wallet creation.",
        "operationId": "SmartWalletController_createOwnerProofChallenge",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateOwnerProofChallengeInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Challenge message ready to sign",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OwnerProofChallengeResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create an owner-address proof challenge",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/create-managed": {
      "post": {
        "description": "Atomic prepare + KMS-sign + deploy + register-owner-address sequence. The BMoni KMS custodian EVM address is auto-derived server-side and added to the on-chain owner set together with the supplied `userOwnerAddress`, but the address must first prove control by signing a challenge from `POST /v1/users/{userId}/smart-wallets/owner-proof-challenges`. Partners do not need to handle the BMoni signature client-side. When the user already has a deployed treasury for another currency, the new currency wallet reuses that smart account and is activated immediately without signing. Proxy-created managed wallets default to an approval threshold of 2 for the end-user owner plus the BMoni KMS custodian.",
        "operationId": "SmartWalletController_createManagedSmartWallet",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateManagedSmartWalletInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Managed smart wallet created and deployed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletDetailResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a smart wallet",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/account/wallets": {
      "get": {
        "operationId": "SmartWalletController_listSmartWalletsByGroup",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Smart wallets for the account",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SmartWalletDetailResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List smart wallets for an account",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/account/balances": {
      "get": {
        "description": "Returns one balance entry per active smart wallet on the account (per-currency). Designed for the wallet-detail UX where a single smart account holds multiple stablecoins (e.g. USDB + CNGN + GBPe via treasury reuse) — fans out the on-chain `balanceOf` reads in parallel so the partner only needs one round-trip. Per-currency RPC failures degrade gracefully (`balance: null` + `error` on the affected entry only).",
        "operationId": "SmartWalletController_listSmartWalletBalancesByGroup",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Per-currency balances for the account",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletBalancesByGroupResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get balances for every smart wallet",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}": {
      "get": {
        "operationId": "SmartWalletController_getSmartWallet",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Smart wallet details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletDetailResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Smart wallet not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a smart wallet by ID",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/balance": {
      "get": {
        "description": "Returns the balance, currency, and smartWalletId for the given smart wallet.",
        "operationId": "SmartWalletController_getSmartWalletBalance",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Smart wallet balance",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletBalanceSimpleResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Smart wallet not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a smart wallet balance",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/proposals/{proposalId}/sign": {
      "post": {
        "description": "Submit the EIP-712 hex signature produced by the admin's BKey-derived owner key (the `userOwnerAddress` registered at wallet creation). The upstream recovers the signer address from the signature, validates it against the proposal's signer snapshot, and records it. Once `requiredSignatures` signatures are collected the workflow submits the user operation on-chain via the Pimlico bundler. The backend can append a server-side KMS co-signature without requiring any extra client request and may enforce that co-signature for protected proposal categories (for example smart-wallet offramps). For offramp proposals the off-chain payout (NIP) starts automatically after on-chain confirmation.",
        "operationId": "SmartWalletController_signProposal",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "proposalId",
            "required": true,
            "in": "path",
            "description": "Proposal ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SubmitProposalSignatureInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Signature recorded; returns updated proposal",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletProposalMutationResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid signature or signer not authorised",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Proposal not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Submit a cryptographic signature for a proposal",
        "tags": [
          "Smart Wallets",
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/transactions": {
      "get": {
        "operationId": "SmartWalletController_listTransactions",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of smart wallet transactions",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletTransactionsResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List transactions for a smart wallet",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/transactions/{transactionId}": {
      "get": {
        "operationId": "SmartWalletController_getTransaction",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "transactionId",
            "required": true,
            "in": "path",
            "description": "Transaction ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Transaction details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SmartWalletTransactionResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a single smart wallet transaction with approvals",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/offramp/nigeria": {
      "post": {
        "description": "Builds a proposal to send the offramp amount to the selected Nigerian bank account. Supported source currencies: USDB (auto-swapped to NGN) and cNGN (sent directly). The bank account must belong to the calling user (an active admin of the smart wallet).",
        "operationId": "SmartWalletController_offrampNigeria",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OfframpNigeriaInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Offramp proposal created — waiting for admin approvals",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OfframpProposalResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid amount or bank account",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "Caller is not an active admin of the smart wallet"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a Nigerian offramp proposal — smart wallet → Nigerian bank account",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/migrate-to-safe": {
      "post": {
        "description": "Legacy smart wallets (created before the Safe rollout) do not support cards. This one-time migration sweeps the full balance into a freshly derived Safe and flips the smart wallet over once the sweep confirms. The proxy auto-approves the sweep proposal as the caller and attaches `signPayload` — sign it and submit via POST /smart-wallet/proposals/{proposalId}/sign (single owner signature, no other approvals). Zero-balance smart wallets migrate immediately (`migrationComplete: true`) with nothing to sign. New smart wallets are created as Safes and never need this. The caller must be an on-chain admin owner of the smart wallet. Idempotent: repeated calls return the in-flight sweep proposal.",
        "operationId": "SmartWalletController_migrateToSafe",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Sweep proposal created (sign and submit it), or migration already complete for a zero-balance smart wallet",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MigrateToSafeResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "Caller is not an on-chain admin owner of the smart wallet"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Migrate a legacy smart wallet to a Safe (one-time)",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/onramp/vba/nigeria": {
      "post": {
        "description": "Routes incoming Anchor NGN deposits to the smart account (cNGN onramp). The bank account must belong to the calling user (active admin).",
        "operationId": "SmartWalletController_linkNigeriaVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LinkVbaNigeriaInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA linked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Link a Nigerian VBA to this smart wallet for bank deposits",
        "tags": [
          "Smart Wallets"
        ]
      },
      "delete": {
        "operationId": "SmartWalletController_unlinkNigeriaVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UnlinkVbaInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA unlinked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnlinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Unlink a Nigerian VBA from this smart wallet",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/onramp/vba/eu": {
      "post": {
        "description": "Reserves the EU VBA for smart-wallet routing. Full Monerium SEPA→EURe crediting will be wired in a follow-up phase.",
        "operationId": "SmartWalletController_linkEuVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LinkVbaEuInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA linked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Link an EU IBAN to this smart wallet (Monerium routing TBD)",
        "tags": [
          "Smart Wallets"
        ]
      },
      "delete": {
        "operationId": "SmartWalletController_unlinkEuVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UnlinkVbaInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA unlinked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnlinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Unlink an EU IBAN from this smart wallet",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/onramp/vba/usd/provision": {
      "post": {
        "description": "Provisions a USD virtual bank account (Graph Finance rail) whose incoming USD deposits are credited as USDB to this smart wallet. Idempotent — repeated calls do not create duplicate accounts. Check GET /users/{userId}/kyc/usd-readiness first, and poll GET /users/{userId}/vba/usd for the account lifecycle status.",
        "operationId": "SmartWalletController_provisionUsdVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Provisioning workflow started",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProvisionVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed or the smart wallet is not ready",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Provision a smart wallet VBA (USD)",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/onramp/vba/usd": {
      "post": {
        "description": "Routes incoming USD deposits to the smart account (USDB onramp). The bank account must belong to the calling user (active admin).",
        "operationId": "SmartWalletController_linkUsdVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LinkVbaUsdInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA linked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Link a smart wallet VBA (USD) for bank deposits",
        "tags": [
          "Smart Wallets"
        ]
      },
      "delete": {
        "operationId": "SmartWalletController_unlinkUsdVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID (GroupWallet.id)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UnlinkVbaInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA unlinked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnlinkVbaResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Unlink a smart wallet VBA (USD)",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/account/send": {
      "post": {
        "description": "Sends stablecoins to the smart wallet account without choosing a specific currency wallet. The server picks a same-currency wallet when one exists (direct transfer, no swap), otherwise the oldest active wallet with a signed-quote swap. Optionally pass expectedTargetCurrency to reject if the resolved wallet currency differs. To target a specific wallet, use POST /fund.",
        "operationId": "SmartWalletController_sendToGroup",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SendToGroupInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Send signature request created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FundSmartWalletResponse"
                }
              }
            }
          },
          "400": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Send to the smart wallet account (server resolves the wallet)",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/smart-wallets/supported-currencies": {
      "get": {
        "description": "Returns the stablecoin currencies a smart wallet can be denominated in. Use this to populate the currency selector before creating a smart wallet.",
        "operationId": "SupportedCurrenciesController_getSupportedCurrencies",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Supported smart wallet currencies",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SupportedSmartWalletCurrenciesOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get supported smart wallet currencies",
        "tags": [
          "Smart Wallets"
        ]
      }
    },
    "/v1/users/{userId}/cards": {
      "post": {
        "description": "Initiates card creation. May return a signature request when an on-chain creation fee applies. The first time a card owner is issued a card, pass the owner's 11-digit Nigerian NIN in the `nin` field to enrol them — omitting it for a never-enrolled owner returns 400 E101. Subsequent cards for an already-enrolled owner do not need `nin`.",
        "operationId": "CardController_createCard",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCardInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Card creation started",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCardOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a card",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/status": {
      "get": {
        "description": "Check the current status of a card creation workflow.",
        "operationId": "CardController_getCreationStatus",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "workflowId",
            "required": true,
            "in": "query",
            "description": "Workflow ID returned from card creation",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Creation status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CardCreationStatusOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Poll card creation status",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/sensitive-data": {
      "post": {
        "description": "Returns full card number (PAN), CVV, expiry date, and billing address.",
        "operationId": "CardController_getSensitiveData",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GetSensitiveDataInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sensitive card data",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SensitiveCardDataOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get sensitive card data",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/activate/request": {
      "post": {
        "description": "Validates activation context and sends an OTP for physical card activation.",
        "operationId": "CardController_requestActivation",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ActivateCardRequestInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Activation OTP issued",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ActivateCardRequestOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Request physical card activation OTP",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/activate/confirm": {
      "post": {
        "description": "Verifies the OTP and activates the physical card.",
        "operationId": "CardController_confirmActivation",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ActivateCardConfirmInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Card activated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessMessageOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Confirm physical card activation with OTP",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/status": {
      "put": {
        "description": "Set status to BLOCKED to freeze or ACTIVE to unfreeze the card.",
        "operationId": "CardController_updateStatus",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCardStatusInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessMessageOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid status value",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Freeze or unfreeze a card",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/reset": {
      "post": {
        "description": "Resets the card PIN to a new 4-digit value.",
        "operationId": "CardController_resetPin",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetCardPinInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "PIN reset successful",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResetPinOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Reset card PIN",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/transactions": {
      "get": {
        "description": "Returns the transaction history for a card.",
        "operationId": "CardController_getTransactions",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "size",
            "required": false,
            "in": "query",
            "description": "Page size",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "status",
            "required": false,
            "in": "query",
            "description": "Filter by status (e.g. COMPLETED)",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "from",
            "required": false,
            "in": "query",
            "description": "Start date (ISO 8601)",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "to",
            "required": false,
            "in": "query",
            "description": "End date (ISO 8601)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Transaction list",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CardTransactionsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get card transactions",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/set-limit": {
      "put": {
        "description": "Sets the daily spending limit and max single transaction amount.",
        "operationId": "CardController_setLimits",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetCardLimitsInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Limits updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SetCardLimitsOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid limit values",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Set card spending limits",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/limits": {
      "get": {
        "description": "Returns the current spending limits and available daily limit.",
        "operationId": "CardController_getLimits",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Current limits",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CardLimitsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get card spending limits",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/pin": {
      "put": {
        "description": "Sets or changes the 4-digit PIN on the card.",
        "operationId": "CardController_setPin",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetCardPinInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "PIN updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessMessageOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid PIN format",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Set card PIN",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/cards/{cardId}/deactivate": {
      "put": {
        "description": "Permanently deactivates and cancels a card. This action cannot be reversed.",
        "operationId": "CardController_deactivateCard",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Card deactivated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeactivateCardOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Card not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Deactivate (cancel) a card",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/cards": {
      "get": {
        "description": "Every card created against a smart wallet is listed here, not under `GET /users/{userId}/cards` (which returns only cards held directly by the user).",
        "operationId": "SmartWalletCardController_getCards",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Cards belonging to the smart wallet",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ListGroupCardsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List the smart wallet cards",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/cards/{cardId}": {
      "get": {
        "description": "Card detail plus the balance in minor units and the most recent 100 ledger entries.",
        "operationId": "SmartWalletCardController_getCard",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Card detail with balance and transactions",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GroupCardDetailOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "No such card on this smart wallet",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a smart wallet card with its balance and ledger",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/smart-wallets/{smartWalletId}/cards/{cardId}/sensitive": {
      "get": {
        "description": "Returns the provider card identity for the card. PAN and CVV are not exposed on this route.",
        "operationId": "SmartWalletCardController_getSensitive",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "cardId",
            "required": true,
            "in": "path",
            "description": "Card ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Card identity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GroupCardSensitiveOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "No such card on this smart wallet",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get the card identity",
        "tags": [
          "Cards"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts": {
      "get": {
        "description": "Returns all deposit and withdrawal bank accounts for the user in a single call. Deposit accounts are virtual accounts that the user can fund by bank transfer; incoming funds are automatically swept to the linked wallet. Withdrawal accounts are saved payout destinations used when the user withdraws from their wallet to a bank account.",
        "operationId": "BankAccountController_getAccounts",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "All deposit and withdrawal bank accounts grouped by region.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BankAccountsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List all bank accounts",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/deposit-accounts": {
      "get": {
        "description": "Returns only the deposit virtual accounts for the user, grouped by region. Each account can receive bank transfers that are automatically swept to the linked wallet.",
        "operationId": "BankAccountController_getDepositAccounts",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Deposit bank accounts grouped by region (Nigeria, Europe).",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DepositAccountsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List deposit bank accounts",
        "tags": [
          "Deposit"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/deposit-accounts/{currency}": {
      "get": {
        "description": "Returns only the deposit accounts matching the given currency (e.g. NGN, EUR, USD). For NGN this includes both regular and activation accounts.",
        "operationId": "BankAccountController_getDepositAccountsByCurrency",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "currency",
            "required": true,
            "in": "path",
            "description": "Currency to filter accounts by.",
            "schema": {
              "enum": [
                "NGN",
                "USD",
                "CAD",
                "EUR",
                "GBP",
                "MXN"
              ],
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deposit accounts for the requested currency.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DepositAccountsByCurrencyOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List deposit bank accounts for a currency",
        "tags": [
          "Deposit"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/withdrawal-accounts": {
      "get": {
        "description": "Returns only the saved payout destinations for the user, grouped by region. These accounts are used as the target when the user initiates a wallet withdrawal.",
        "operationId": "BankAccountController_getWithdrawalAccounts",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Withdrawal bank accounts grouped by region (Nigeria, Europe, USA).",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WithdrawalAccountsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List withdrawal bank accounts",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/withdrawal-accounts/{currency}": {
      "get": {
        "description": "Returns only the saved payout destinations matching the given currency (e.g. NGN, EUR, USD).",
        "operationId": "BankAccountController_getWithdrawalAccountsByCurrency",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "currency",
            "required": true,
            "in": "path",
            "description": "Currency to filter accounts by.",
            "schema": {
              "enum": [
                "NGN",
                "USD",
                "CAD",
                "EUR",
                "GBP",
                "MXN"
              ],
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Withdrawal accounts for the requested currency.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WithdrawalAccountsByCurrencyOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List withdrawal bank accounts for a currency",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/withdrawal-accounts/nigeria": {
      "post": {
        "description": "Looks up an existing Nigerian bank account for the user, or creates one if it does not exist. Call the nigerian-banks endpoint to get valid bank codes and verify-nigerian-account to confirm the account number and retrieve the registered holder name before submitting.",
        "operationId": "BankAccountController_getOrCreateNigerianWithdrawalAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNigerianWithdrawalAccountInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Retrieved or newly created Nigerian withdrawal account.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NigerianWithdrawalAccountOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed or the bank code is not supported.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get or create a Nigerian withdrawal account",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/nigerian-banks": {
      "get": {
        "description": "Returns all Nigerian banks supported for withdrawal account creation. Use the returned bank codes and names when calling the withdrawal-accounts/nigeria and verify-nigerian-account endpoints.",
        "operationId": "BankAccountController_getNigerianBanks",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "All supported Nigerian banks with their names and CBN codes.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NigerianBanksOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List supported Nigerian banks",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/verify-nigerian-account": {
      "post": {
        "description": "Looks up the registered account holder name for a Nigerian bank account number. Call this before creating a withdrawal account to confirm the account is valid and to retrieve the exact account holder name to submit.",
        "operationId": "BankAccountController_verifyNigerianAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/VerifyNigerianAccountInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Verified account details including the registered account holder name.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VerifyNigerianAccountOutput"
                }
              }
            }
          },
          "400": {
            "description": "Invalid account number or bank code format.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "404": {
            "description": "No account found for the given account number and bank code.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Verify a Nigerian bank account",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/deposit-accounts/{accountId}/deactivate": {
      "put": {
        "description": "Marks an EUR virtual bank account as inactive. The account is deactivated with the upstream provider (Monerium) and will no longer accept incoming transfers.",
        "operationId": "BankAccountController_deactivateDepositAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "accountId",
            "required": true,
            "in": "path",
            "description": "ID of the deposit account to deactivate.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deposit account deactivated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeactivateAccountOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "404": {
            "description": "Deposit account not found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Deactivate a virtual bank account",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/bank-accounts/withdrawal-accounts/nigeria/{accountId}/deactivate": {
      "put": {
        "description": "Marks a saved Nigerian withdrawal account as inactive. The account will no longer appear as a payout destination for new withdrawals.",
        "operationId": "BankAccountController_deactivateNigerianWithdrawalAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "accountId",
            "required": true,
            "in": "path",
            "description": "ID of the Nigerian withdrawal account to deactivate.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Nigerian withdrawal account deactivated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeactivateAccountOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "404": {
            "description": "Withdrawal account not found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Deactivate a Nigerian withdrawal account",
        "tags": [
          "Bank Accounts"
        ]
      }
    },
    "/v1/users/{userId}/vba/usd": {
      "get": {
        "description": "Returns the lifecycle status of the user USD virtual bank account. Account details are populated only when the status is `active`; a rejection reason is populated only when the status is `rejected`. Provision readiness is checked via GET /users/{userId}/kyc/usd-readiness.",
        "operationId": "VbaController_getUsdVba",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "USD virtual bank account status and details.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsdAccountStatusOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get USD virtual bank account status",
        "tags": [
          "VBAs"
        ]
      }
    },
    "/v1/users/{userId}/transactions/receipt/pdf": {
      "post": {
        "description": "Use this endpoint when a user needs a downloadable receipt for a completed transaction. The smart wallet and transaction must belong to the user in the path. The response is a binary PDF file, not JSON.",
        "operationId": "TransactionController_getTransactionReceiptPdf",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TransactionReceiptPdfInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Binary PDF receipt file. Clients should download or display the response as application/pdf.",
            "content": {
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Wallet or transaction not found",
            "content": {
              "application/pdf": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Generate transaction receipt PDF",
        "tags": [
          "Transactions"
        ]
      }
    },
    "/v1/users/{userId}/transactions/group-wallet/receipt/pdf": {
      "post": {
        "description": "Use this endpoint when a user needs a downloadable receipt for a completed group wallet transaction. The smart wallet and transaction must belong to the user in the path. The response is a binary PDF file, not JSON.",
        "operationId": "TransactionController_getGroupWalletTransactionReceiptPdf",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GroupWalletReceiptPdfInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Binary PDF receipt file. Clients should download or display the response as application/pdf.",
            "content": {
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Wallet or transaction not found",
            "content": {
              "application/pdf": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Generate group wallet transaction receipt PDF",
        "tags": [
          "Transactions"
        ]
      }
    },
    "/v1/users/{userId}/transactions/user/{otherUserId}": {
      "get": {
        "description": "Returns all transactions between the user in the path and another user. Each item includes the direction relative to the acting user, amount, currency, and timestamp, along with the other user details.",
        "operationId": "TransactionController_getUserTransactions",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "otherUserId",
            "required": true,
            "in": "path",
            "description": "The bmoniUserId of the other user in the transactions.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Transaction list, count, and other user details.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserTransactionsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get transactions with another user",
        "tags": [
          "Transactions"
        ]
      }
    },
    "/v1/users/{userId}/transactions/{smartWalletId}/{transactionId}/fees": {
      "get": {
        "description": "Use this endpoint to show the user a fee breakdown for a specific smart wallet transaction. The response includes individual visible fees and per-currency totals. Swap premium fees are excluded by the upstream API.",
        "operationId": "TransactionController_getTransactionFees",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet that owns the transaction and belongs to the user.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "transactionId",
            "required": true,
            "in": "path",
            "description": "Transaction whose visible fees should be returned.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Transaction fees",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TransactionFeesOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Wallet or transaction not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get transaction fees",
        "tags": [
          "Transactions"
        ]
      }
    },
    "/v1/users/{userId}/transactions/{smartWalletId}": {
      "get": {
        "description": "Returns all transactions for a specific smart wallet ordered by creation date. Each transaction includes direction, amount, status, counterparty details, and a narration type for UI display.",
        "operationId": "TransactionController_getWalletTransactions",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "smartWalletId",
            "required": true,
            "in": "path",
            "description": "Smart wallet whose transaction history should be returned.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Transaction list and total count for the smart wallet.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WalletTransactionsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "Wallet not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get smart wallet transactions",
        "tags": [
          "Transactions"
        ]
      }
    },
    "/v1/users/{userId}/announcements": {
      "get": {
        "description": "Returns global broadcasts and user-targeted announcements together, ordered newest first, with per-item read status.",
        "operationId": "AnnouncementsController_list",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "page",
            "required": false,
            "in": "query",
            "schema": {
              "example": 1,
              "type": "number"
            }
          },
          {
            "name": "limit",
            "required": false,
            "in": "query",
            "schema": {
              "example": 10,
              "type": "number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Paginated announcement inbox."
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List the user's announcements",
        "tags": [
          "Announcements"
        ]
      }
    },
    "/v1/users/{userId}/announcements/unread": {
      "get": {
        "operationId": "AnnouncementsController_unreadCount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Unread announcement count."
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get the unread announcement count for the user",
        "tags": [
          "Announcements"
        ]
      }
    },
    "/v1/users/{userId}/announcements/read": {
      "post": {
        "operationId": "AnnouncementsController_markRead",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MarkAnnouncementReadInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Read marker stored."
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner."
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Mark a single announcement as read",
        "tags": [
          "Announcements"
        ]
      }
    },
    "/v1/users/{userId}/withdrawal/wallet/nigeria": {
      "post": {
        "description": "Creates an offramp proposal, auto-approves it, and returns the EIP-712 sign payload in a single call. Sign the returned `signPayload` with the `userOwnerAddress` private key and submit via `POST /v1/users/{userId}/smart-wallets/proposals/{proposalId}/sign`. On successful on-chain execution the equivalent NGN amount is sent to the target bank account via Anchor NIP. Supported wallet currencies: USDB (auto-swapped to NGN) and cNGN (sent directly).",
        "operationId": "WithdrawalController_walletWithdrawalNigeria",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/WalletNigeriaWithdrawalInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Withdrawal initiated — sign signPayload and submit via POST …/smart-wallets/proposals/:proposalId/sign",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OfframpWithSignPayloadResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "Bank account not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Initiate withdrawal — smart wallet → Nigerian bank account",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/withdrawal/smart-wallet/crypto/supported/{currency}": {
      "get": {
        "description": "Lists the destination chains and tokens supported for withdrawing a smart wallet currency to an external crypto address.",
        "operationId": "WithdrawalController_getSupportedCryptoDestinations",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "currency",
            "required": true,
            "in": "path",
            "description": "Source smart wallet currency to list destinations for",
            "schema": {
              "example": "USD",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Supported destination chains and tokens"
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "Unsupported currency",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List supported crypto withdrawal destinations",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/withdrawal/smart-wallet/crypto": {
      "post": {
        "description": "Creates a crypto offramp proposal, auto-approves it, and returns the EIP-712 sign payload in a single call. Sign the returned `signPayload` with the `userOwnerAddress` private key and submit via `POST /v1/users/{userId}/smart-wallets/proposals/{proposalId}/sign`. On successful on-chain execution the funds are converted and sent to the destination address on the target chain via Bridge. Bridge KYC is required.",
        "operationId": "WithdrawalController_smartWalletWithdrawalCrypto",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SmartWalletCryptoWithdrawalInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Withdrawal initiated — sign signPayload and submit via POST …/smart-wallets/proposals/:proposalId/sign",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OfframpWithSignPayloadResponse"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "404": {
            "description": "Smart wallet not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Initiate withdrawal — smart wallet → external crypto address",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/withdrawal/card": {
      "post": {
        "description": "Initiates a withdrawal from a card to a wallet. No signature is required — the card service debits the card and the buffer pool transfers stablecoins to the user wallet.",
        "operationId": "WithdrawalController_cardWithdrawal",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CardWithdrawalInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Card withdrawal initiated. The card is debited and stablecoins are transferred to the user wallet — no signature required.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CardWithdrawalOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Initiate card withdrawal to wallet — Phase 1",
        "tags": [
          "Withdrawal"
        ]
      }
    },
    "/v1/users/{userId}/deposit/wallet": {
      "post": {
        "description": "Returns a one-time crypto deposit address for the specified chain and currency. Any supported crypto sent to that address is automatically converted and credited to the smart wallet. No signature is required — the user sends crypto to the returned address.",
        "operationId": "DepositController_walletDeposit",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/WalletDepositInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Deposit address for the requested chain and currency. The user sends crypto directly to this address — no signature required.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WalletDepositOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Deposit to wallet from crypto",
        "tags": [
          "Deposit"
        ]
      }
    },
    "/v1/users/{userId}/deposit/card": {
      "post": {
        "description": "Initiates card funding from a wallet. Returns a signatureRequest containing a hashToSign and workflowId. The user must sign the hash with their wallet and submit the signature via the submit-signature endpoint.",
        "operationId": "DepositController_cardDeposit",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CardDepositInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Card funding initiated — client must sign the hashToSign and submit via POST …/submit-signature",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignatureRequestOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Fund card from wallet — Phase 1",
        "tags": [
          "Deposit"
        ]
      }
    },
    "/v1/deposit/supported-assets": {
      "get": {
        "description": "Returns the chains and tokens currently enabled for crypto deposits, grouped by chain. Use this to populate chain and token selectors before calling the wallet deposit endpoint.",
        "operationId": "SupportedAssetsController_getSupportedAssets",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Enabled deposit chains, each with its supported tokens",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SupportedDepositAssetsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get enabled deposit chains and tokens",
        "tags": [
          "Deposit"
        ]
      }
    },
    "/v1/partners/employees/invite": {
      "post": {
        "description": "Sends a co-branded invitation email to the employee containing a per-employee deep link (encoding the partner and the employee email) and a QR code of that link. Re-inviting the same email refreshes the invitation.",
        "operationId": "EmployerLinkController_inviteEmployee",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/InviteEmployeeInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Invitation processed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InviteEmployeeOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed, or the email domain is not among the partner's verified domains",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Invite an employee",
        "tags": [
          "Employer Link"
        ]
      }
    },
    "/v1/partners/employees/batch": {
      "post": {
        "description": "Upserts up to 500 invitation rows in one call without sending any invitation emails — trigger the single invite endpoint per employee to send the email. Rows are processed independently: a rejected row (e.g. unverified email domain) never fails the rest of the batch.",
        "operationId": "EmployerLinkController_batchUpsertEmployees",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/BatchEmployeesInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Per-row results, in input order",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BatchEmployeesOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Upsert the employee roster (no emails sent)",
        "tags": [
          "Employer Link"
        ]
      }
    },
    "/v1/partners/employees": {
      "get": {
        "description": "Paginated list of the invitations created by the calling partner, newest first.",
        "operationId": "EmployerLinkController_listEmployees",
        "parameters": [
          {
            "name": "page",
            "required": false,
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "limit",
            "required": false,
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "status",
            "required": false,
            "in": "query",
            "schema": {
              "enum": [
                "INVITED",
                "LINKED",
                "UNLINKED"
              ],
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Paginated list of invitations",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ListEmployeesOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List the partner's employee invitations",
        "tags": [
          "Employer Link"
        ]
      }
    },
    "/v1/partners/employees/{id}": {
      "delete": {
        "description": "Cancels a pending invitation (deletes the row) or, for a linked employee, marks them UNLINKED and emits the employee.unlinked webhook.",
        "operationId": "EmployerLinkController_offboardEmployee",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Offboarding processed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OffboardEmployeeOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "No invitation with this id belongs to the calling partner"
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Offboard an employee",
        "tags": [
          "Employer Link"
        ]
      }
    },
    "/v1/internal/employees/link": {
      "post": {
        "description": "Called by bmoni-api once it has verified the work-email OTP. Attaches the invitation to the BMONI account, submits the employer-held KYC data, and emits the employee.linked webhook. HMAC-signed; not for partner use.",
        "operationId": "EmployerLinkInternalController_link",
        "parameters": [
          {
            "name": "x-webhook-signature",
            "required": true,
            "in": "header",
            "description": "HMAC-SHA256 signature of the raw request body",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LinkEmployeeInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Employee linked",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LinkEmployeeOutput"
                }
              }
            }
          },
          "401": {
            "description": "Invalid signature",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          }
        },
        "summary": "Link an employee to a BMONI account (internal)",
        "tags": [
          "Employer Link (internal)"
        ]
      }
    },
    "/v1/internal/employees/vba": {
      "post": {
        "description": "Called by bmoni-api once a linked employee's VBA has been provisioned. Stores the VBA details on the invitation (keyed by currency; idempotent per currency) and emits the employee.vba.registered webhook. HMAC-signed; not for partner use.",
        "operationId": "EmployerLinkInternalController_registerVba",
        "parameters": [
          {
            "name": "x-webhook-signature",
            "required": true,
            "in": "header",
            "description": "HMAC-SHA256 signature of the raw request body",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterEmployeeVbaInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "VBA registered",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterEmployeeVbaOutput"
                }
              }
            }
          },
          "401": {
            "description": "Invalid signature",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "No LINKED invitation exists for this BMONI user"
          }
        },
        "summary": "Register a linked employee's virtual bank account (internal)",
        "tags": [
          "Employer Link (internal)"
        ]
      }
    },
    "/v1/webhooks/config": {
      "post": {
        "description": "Register the callback URL that should receive partner webhook deliveries.\n\nSupported event types:\n- `wallet.deposit.completed`\n- `wallet.deposit.failed`\n- `wallet.deposit.refunded`\n- `wallet.withdrawal.completed`\n- `wallet.withdrawal.failed`\n- `wallet.withdrawal.processing`\n- `card.fulfillment.updated`\n- `onboarding.completed`\n- `onboarding.failed`\n- `kyc.action_required`\n- `employee.linked`\n- `employee.vba.registered`\n- `employee.unlinked`\n- `employee.deposit.completed`\n- `employee.deposit.failed`\n- `employee.deposit.refunded`\n- `employee.withdrawal.completed`\n- `employee.withdrawal.failed`\n- `employee.withdrawal.processing`\n\nCallback deliveries are signed with the `x-webhook-signature` header.\n\nEach delivery has the shape:\n```json\n{\n  \"id\": \"stable-event-id\",\n  \"eventType\": \"wallet.deposit.completed\",\n  \"payload\": {\n    \"userId\": \"user-uuid\",\n    \"...\": \"event-specific fields\"\n  },\n  \"timestamp\": \"2026-04-08T10:24:00.000Z\"\n}\n```\n\nEvent-specific payload fields can vary by provider. See the examples on the internal receive endpoint for concrete JSON bodies for every supported event type.",
        "operationId": "WebhookController_createConfig",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateWebhookConfigInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Webhook configuration created. Outbound webhook example payloads are included in the response examples.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookConfigOutput"
                },
                "examples": {
                  "walletDepositCompleted": {
                    "summary": "wallet.deposit.completed",
                    "value": {
                      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                      "eventType": "wallet.deposit.completed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "transactionId": "7c1f0a2e-3b4d-4e5f-8a9b-0c1d2e3f4a5b",
                        "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                        "amount": "250.00",
                        "currency": "USD",
                        "transferId": "transfer-abc-123"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "walletDepositFailed": {
                    "summary": "wallet.deposit.failed",
                    "value": {
                      "id": "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
                      "eventType": "wallet.deposit.failed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "transactionId": "7c1f0a2e-3b4d-4e5f-8a9b-0c1d2e3f4a5b",
                        "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                        "amount": "120000.00",
                        "currency": "NGN",
                        "status": "failed",
                        "failureReason": "Swap slippage exceeded threshold"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "walletDepositRefunded": {
                    "summary": "wallet.deposit.refunded",
                    "value": {
                      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                      "eventType": "wallet.deposit.refunded",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "depositId": "deposit-123",
                        "amount": "80000.00",
                        "currency": "NGN",
                        "provider": "anchor",
                        "refundCode": "returned",
                        "refundReason": "invalid_account_number"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "walletWithdrawalCompleted": {
                    "summary": "wallet.withdrawal.completed",
                    "value": {
                      "id": "c3d4e5f6-a7b8-9012-cdef-1234567890ab",
                      "eventType": "wallet.withdrawal.completed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                        "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                        "amount": "80000.00",
                        "currency": "NGN",
                        "status": "completed"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "walletWithdrawalFailed": {
                    "summary": "wallet.withdrawal.failed",
                    "value": {
                      "id": "d4e5f6a7-b8c9-0123-def1-234567890abc",
                      "eventType": "wallet.withdrawal.failed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                        "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                        "amount": "80000.00",
                        "currency": "NGN",
                        "status": "failed"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "walletWithdrawalProcessing": {
                    "summary": "wallet.withdrawal.processing",
                    "value": {
                      "id": "e5f6a7b8-c9d0-1234-ef12-34567890abcd",
                      "eventType": "wallet.withdrawal.processing",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                        "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                        "amount": "80000.00",
                        "currency": "NGN"
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "cardFulfillmentUpdated": {
                    "summary": "card.fulfillment.updated",
                    "value": {
                      "id": "card.fulfillment.updated:019e0186-9f9e-7118-91a9-4e2b159b9b30:OUT_FOR_DELIVERY",
                      "eventType": "card.fulfillment.updated",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "cardId": "019e0186-9f9e-7118-91a9-4e2b159b9b30",
                        "type": "physical",
                        "currency": "NGN",
                        "fulfillmentStatus": "OUT_FOR_DELIVERY",
                        "deliveryAddress": "12 Marina Road",
                        "state": "Lagos"
                      },
                      "timestamp": "2026-06-02T12:00:00.000Z"
                    }
                  },
                  "onboardingCompleted": {
                    "summary": "onboarding.completed",
                    "value": {
                      "id": "f6a7b8c9-d0e1-2345-f123-4567890abcde",
                      "eventType": "onboarding.completed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "provider": "sumsub",
                        "status": "approved",
                        "applicantId": "sumsub-applicant-123",
                        "rejectLabels": []
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "onboardingFailed": {
                    "summary": "onboarding.failed",
                    "value": {
                      "id": "a7b8c9d0-e1f2-3456-1234-567890abcdef",
                      "eventType": "onboarding.failed",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "provider": "sumsub",
                        "status": "rejected",
                        "applicantId": "sumsub-applicant-123",
                        "rejectType": "FINAL",
                        "rejectLabels": [
                          "FORGERY",
                          "DOCUMENT_TEMPLATE"
                        ],
                        "moderationComment": "The document appears to be tampered with and cannot be accepted.",
                        "clientComment": "Forgery detected on submitted identity document."
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  },
                  "kycActionRequired": {
                    "summary": "kyc.action_required",
                    "value": {
                      "id": "kyc.action_required:sumsub-applicant-123:action_required",
                      "eventType": "kyc.action_required",
                      "payload": {
                        "userId": "550e8400-e29b-41d4-a716-446655440000",
                        "provider": "sumsub",
                        "status": "action_required",
                        "applicantId": "sumsub-applicant-123",
                        "rejectType": "RETRY",
                        "rejectLabels": [
                          "DOCUMENT_PAGE_MISSING"
                        ],
                        "moderationComment": "A page of the submitted document is missing. Please resubmit.",
                        "clientComment": "Please upload the back side of your ID."
                      },
                      "timestamp": "2026-04-08T10:24:00.000Z"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Register webhook callback URL and subscribed events",
        "tags": [
          "Webhooks"
        ]
      },
      "get": {
        "operationId": "WebhookController_getConfig",
        "parameters": [
          {
            "name": "partnerId",
            "required": false,
            "in": "query",
            "description": "Select the config scoped to this partner. Omit for the legacy global config.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Current webhook configuration",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookConfigOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get current webhook configuration",
        "tags": [
          "Webhooks"
        ]
      },
      "patch": {
        "operationId": "WebhookController_updateConfig",
        "parameters": [
          {
            "name": "partnerId",
            "required": false,
            "in": "query",
            "description": "Select the config scoped to this partner. Omit for the legacy global config.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateWebhookConfigInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Webhook configuration updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookConfigOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Update webhook configuration",
        "tags": [
          "Webhooks"
        ]
      }
    },
    "/v1/webhooks/config/rotate-secret": {
      "post": {
        "operationId": "WebhookController_rotateSecret",
        "parameters": [
          {
            "name": "partnerId",
            "required": false,
            "in": "query",
            "description": "Select the config scoped to this partner. Omit for the legacy global config.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "New signing secret generated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookConfigOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Rotate the webhook signing secret",
        "tags": [
          "Webhooks"
        ]
      }
    },
    "/v1/webhooks/events": {
      "post": {
        "description": "Internal endpoint used by `bmoni-api` to push signed webhook events into this proxy before they are fanned out to the configured partner callback URL.\n\nIdempotency: every event carries a stable `id` (also mirrored in the `x-webhook-event-id` header). Replays of the same id are accepted but do not produce a duplicate delivery — the existing record is returned.\n\nSupported event types:\n- `wallet.deposit.completed`\n- `wallet.deposit.failed`\n- `wallet.deposit.refunded`\n- `wallet.withdrawal.completed`\n- `wallet.withdrawal.failed`\n- `wallet.withdrawal.processing`\n- `card.fulfillment.updated`\n- `onboarding.completed`\n- `onboarding.failed`\n- `kyc.action_required`\n- `employee.linked`\n- `employee.vba.registered`\n- `employee.unlinked`\n- `employee.deposit.completed`\n- `employee.deposit.failed`\n- `employee.deposit.refunded`\n- `employee.withdrawal.completed`\n- `employee.withdrawal.failed`\n- `employee.withdrawal.processing`\n\nThe signed JSON body includes a top-level `timestamp`, and each event type example is documented below.",
        "operationId": "WebhookController_receiveEvent",
        "parameters": [
          {
            "name": "x-webhook-signature",
            "required": true,
            "in": "header",
            "description": "HMAC-SHA256 signature of the request body",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "x-webhook-event-id",
            "in": "header",
            "description": "Stable event id, also present in the request body as `id`. Mismatch is rejected as a likely signing / replay anomaly.",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Signed inbound webhook request body from `bmoni-api`. A concrete JSON example is provided for every supported event type.",
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              },
              "examples": {
                "walletDepositCompleted": {
                  "summary": "wallet.deposit.completed",
                  "value": {
                    "id": "11111111-1111-4111-8111-111111111111",
                    "eventType": "wallet.deposit.completed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "transactionId": "7c1f0a2e-3b4d-4e5f-8a9b-0c1d2e3f4a5b",
                      "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                      "amount": "250.00",
                      "currency": "USD",
                      "transferId": "transfer-abc-123"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "walletDepositFailed": {
                  "summary": "wallet.deposit.failed",
                  "value": {
                    "id": "22222222-2222-4222-8222-222222222222",
                    "eventType": "wallet.deposit.failed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "transactionId": "7c1f0a2e-3b4d-4e5f-8a9b-0c1d2e3f4a5b",
                      "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                      "amount": "120000.00",
                      "currency": "NGN",
                      "status": "failed",
                      "failureReason": "Swap slippage exceeded threshold"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "walletDepositRefunded": {
                  "summary": "wallet.deposit.refunded",
                  "value": {
                    "id": "33333333-3333-4333-8333-333333333333",
                    "eventType": "wallet.deposit.refunded",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "depositId": "deposit-123",
                      "amount": "80000.00",
                      "currency": "NGN",
                      "provider": "anchor",
                      "refundCode": "returned",
                      "refundReason": "invalid_account_number"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "walletWithdrawalCompleted": {
                  "summary": "wallet.withdrawal.completed",
                  "value": {
                    "id": "44444444-4444-4444-8444-444444444444",
                    "eventType": "wallet.withdrawal.completed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                      "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                      "amount": "80000.00",
                      "currency": "NGN",
                      "status": "completed"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "walletWithdrawalFailed": {
                  "summary": "wallet.withdrawal.failed",
                  "value": {
                    "id": "55555555-5555-4555-8555-555555555555",
                    "eventType": "wallet.withdrawal.failed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                      "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                      "amount": "80000.00",
                      "currency": "NGN",
                      "status": "failed"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "walletWithdrawalProcessing": {
                  "summary": "wallet.withdrawal.processing",
                  "value": {
                    "id": "66666666-6666-4666-8666-666666666666",
                    "eventType": "wallet.withdrawal.processing",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "transactionId": "9d2e1b3f-4c5a-4d6e-9f8b-1a2c3d4e5f6a",
                      "smartWalletId": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
                      "amount": "80000.00",
                      "currency": "NGN"
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "cardFulfillmentUpdated": {
                  "summary": "card.fulfillment.updated",
                  "value": {
                    "id": "card.fulfillment.updated:019e0186-9f9e-7118-91a9-4e2b159b9b30:OUT_FOR_DELIVERY",
                    "eventType": "card.fulfillment.updated",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "cardId": "019e0186-9f9e-7118-91a9-4e2b159b9b30",
                      "type": "physical",
                      "currency": "NGN",
                      "fulfillmentStatus": "OUT_FOR_DELIVERY",
                      "deliveryAddress": "12 Marina Road",
                      "state": "Lagos"
                    },
                    "timestamp": "2026-06-02T12:00:00.000Z"
                  }
                },
                "onboardingCompleted": {
                  "summary": "onboarding.completed",
                  "value": {
                    "id": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
                    "eventType": "onboarding.completed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "provider": "sumsub",
                      "status": "approved",
                      "applicantId": "sumsub-applicant-123",
                      "rejectLabels": []
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "onboardingFailed": {
                  "summary": "onboarding.failed",
                  "value": {
                    "id": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
                    "eventType": "onboarding.failed",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "provider": "sumsub",
                      "status": "rejected",
                      "applicantId": "sumsub-applicant-123",
                      "rejectType": "FINAL",
                      "rejectLabels": [
                        "FORGERY",
                        "DOCUMENT_TEMPLATE"
                      ],
                      "moderationComment": "The document appears to be tampered with and cannot be accepted.",
                      "clientComment": "Forgery detected on submitted identity document."
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                },
                "kycActionRequired": {
                  "summary": "kyc.action_required",
                  "value": {
                    "id": "kyc.action_required:sumsub-applicant-123:action_required",
                    "eventType": "kyc.action_required",
                    "userId": "550e8400-e29b-41d4-a716-446655440000",
                    "payload": {
                      "provider": "sumsub",
                      "status": "action_required",
                      "applicantId": "sumsub-applicant-123",
                      "rejectType": "RETRY",
                      "rejectLabels": [
                        "DOCUMENT_PAGE_MISSING"
                      ],
                      "moderationComment": "A page of the submitted document is missing. Please resubmit.",
                      "clientComment": "Please upload the back side of your ID."
                    },
                    "timestamp": "2026-04-08T10:24:00.000Z"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Event accepted",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookEventOutput"
                }
              }
            }
          },
          "401": {
            "description": "Invalid webhook signature",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "summary": "Receive webhook events (internal endpoint)",
        "tags": [
          "Webhooks"
        ]
      },
      "get": {
        "operationId": "WebhookController_getEvents",
        "parameters": [
          {
            "name": "page",
            "required": false,
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "limit",
            "required": false,
            "in": "query",
            "schema": {
              "type": "number"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Paginated list of webhook events",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WebhookEventListOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List webhook event delivery history",
        "tags": [
          "Webhooks"
        ]
      }
    },
    "/v1/location/countries": {
      "get": {
        "description": "Use this endpoint to populate country selectors in onboarding and KYC forms. Each country includes postal code guidance and supported national identifier types so clients can validate user input before submitting KYC data.",
        "operationId": "LocationController_getCountries",
        "parameters": [],
        "responses": {
          "200": {
            "description": "List of supported countries",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CountryOutput"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get supported countries",
        "tags": [
          "Location"
        ]
      }
    },
    "/v1/location/countries/{countryCode}": {
      "get": {
        "description": "Use this endpoint when the client needs metadata for a single country, including its states, provinces, or regions. The country code may be alpha2 or alpha3, for example US or USA.",
        "operationId": "LocationController_getCountry",
        "parameters": [
          {
            "name": "countryCode",
            "required": true,
            "in": "path",
            "description": "Country code in alpha2 or alpha3 format. Examples: US, USA, NG, NGA.",
            "schema": {
              "example": "USA",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Country with subdivisions",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CountryWithSubdivisionsOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Country not found or not supported",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get country with subdivisions",
        "tags": [
          "Location"
        ]
      }
    },
    "/v1/location/countries/{countryCode}/subdivisions": {
      "get": {
        "description": "Use this endpoint to populate state, province, or region selectors after a user chooses a country. The returned subdivision code can be used in address and KYC payloads when required.",
        "operationId": "LocationController_getSubdivisions",
        "parameters": [
          {
            "name": "countryCode",
            "required": true,
            "in": "path",
            "description": "Country code in alpha2 or alpha3 format. Examples: US, USA, NG, NGA.",
            "schema": {
              "example": "USA",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of country subdivisions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SubdivisionOutput"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "Country not found or not supported",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get country subdivisions",
        "tags": [
          "Location"
        ]
      }
    },
    "/v1/location/subdivisions/{subdivisionCode}/cities": {
      "get": {
        "description": "Returns the cities/municipalities registered for a subdivision. Use this to populate the city dropdown after the user picks a state. Cities are available for every supported country; fall back to a free-text city input when this endpoint returns 404.",
        "operationId": "LocationController_getCities",
        "parameters": [
          {
            "name": "subdivisionCode",
            "required": true,
            "in": "path",
            "description": "ISO 3166-2 subdivision code without the country prefix (e.g. `JAL`, `CMX`). Case-insensitive — take this from `subdivision.code` in the subdivisions response.",
            "schema": {
              "example": "JAL",
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Cities for the subdivision, sorted alphabetically by name."
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "404": {
            "description": "No cities registered for this subdivision code — frontends should fall back to a free-text city input.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List cities for a subdivision",
        "tags": [
          "Location"
        ]
      }
    },
    "/v1/users/{userId}/eu/kyc": {
      "post": {
        "description": "Completes the EU provider KYC handshake using the authorization code and signature obtained from the provider redirect.",
        "operationId": "EuController_completeKyc",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CompleteEuKycInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "KYC completed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EuSuccessOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Complete EU (SEPA) KYC",
        "tags": [
          "EU (SEPA)"
        ]
      }
    },
    "/v1/users/{userId}/eu/orders/prepare": {
      "post": {
        "description": "Prepares a EUR redemption to a SEPA IBAN. Returns a messageToSign the user must sign, and — when an international payout fee applies — an additional signatureRequest for the fee transfer. Complete the order with the signature via POST …/orders/complete.",
        "operationId": "EuController_prepareOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PrepareEuOrderInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Order prepared — sign the messageToSign and complete the order",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PrepareEuOrderOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Prepare a EUR SEPA payout (redeem) order",
        "tags": [
          "EU (SEPA)"
        ]
      }
    },
    "/v1/users/{userId}/eu/orders/complete": {
      "post": {
        "description": "Submits the signature for a previously prepared order, finalizing the SEPA payout.",
        "operationId": "EuController_completeOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CompleteEuOrderInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Order completed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EuSuccessOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Complete a prepared EUR SEPA payout order",
        "tags": [
          "EU (SEPA)"
        ]
      }
    },
    "/v1/users/{userId}/eu/files": {
      "post": {
        "description": "Uploads a supporting document (PDF or JPEG, max 5 MB) and returns a fileId for use in KYC or order requests (e.g. supportingDocumentId for orders >= EUR 15,000).",
        "operationId": "EuController_uploadFile",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Multipart form-data with a single \"file\" field (PDF or JPEG).",
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary"
                  }
                },
                "required": [
                  "file"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "File uploaded",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EuUploadFileOutput"
                }
              }
            }
          },
          "400": {
            "description": "Missing or invalid file",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Upload a supporting document",
        "tags": [
          "EU (SEPA)"
        ]
      }
    },
    "/v1/users/{userId}/latam/cash/orders/fund": {
      "post": {
        "description": "Creates a cash pay-in order. Returns a provider redirect_url where the user pays cash; the wallet is credited once the provider confirms payment.",
        "operationId": "LatamCashController_createFundOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLatamCashOrderInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Fund order created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LatamCashOrderOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a LATAM cash fund (pay-in) order",
        "tags": [
          "LATAM Cash"
        ]
      }
    },
    "/v1/users/{userId}/latam/cash/orders/send": {
      "post": {
        "description": "Creates a cash pay-out order. Returns a signatureRequest the user must sign to fund the payout from their wallet; submit the signature via the wallet submit-signature endpoint.",
        "operationId": "LatamCashController_createSendOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLatamCashOrderInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Send order created — signature required",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LatamCashSendOrderOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a LATAM cash send (pay-out) order",
        "tags": [
          "LATAM Cash"
        ]
      }
    },
    "/v1/users/{userId}/latam/cash/orders": {
      "get": {
        "description": "Lists the user’s active cash orders, optionally filtered by type.",
        "operationId": "LatamCashController_listOrders",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "type",
            "required": false,
            "in": "query",
            "description": "Filter by order type (defaults to FUND upstream).",
            "schema": {
              "enum": [
                "FUND",
                "SEND"
              ],
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of cash order records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/LatamCashOrderRecord"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List LATAM cash orders",
        "tags": [
          "LATAM Cash"
        ]
      }
    },
    "/v1/users/{userId}/latam/cash/orders/{orderId}": {
      "get": {
        "operationId": "LatamCashController_getOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "orderId",
            "required": true,
            "in": "path",
            "description": "The cash order record ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Cash order details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LatamCashOrderOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a LATAM cash order by ID",
        "tags": [
          "LATAM Cash"
        ]
      }
    },
    "/v1/users/{userId}/latam/mx/kyc/activate": {
      "post": {
        "description": "Submits the user’s uploaded KYC documents to the provider for review. Requires the Mexican paternal/maternal surnames. A CLABE is provisioned and the bank account is registered automatically by the KYC workflow — no separate bank-account call is needed.",
        "operationId": "LatamMxController_activateKyc",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ActivateMxKycInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "KYC activation accepted",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MxKycActivateOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Activate Mexico (Etherfuse) KYC",
        "tags": [
          "LATAM Mexico"
        ]
      }
    },
    "/v1/users/{userId}/latam/mx/kyc/status": {
      "get": {
        "operationId": "LatamMxController_getKycStatus",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "Current KYC status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MxKycStatusOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get Mexico KYC status",
        "tags": [
          "LATAM Mexico"
        ]
      }
    },
    "/v1/users/{userId}/latam/mx/quote": {
      "post": {
        "description": "Returns a time-boxed offramp quote including a signatureRequest to transfer funds to the reserve. Onramps need no quote or order call: depositing MXN to the user’s Fintoc CLABE onramps automatically.",
        "operationId": "LatamMxController_createQuote",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateMxQuoteInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Quote created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MxQuoteOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a Mexico (MXN) offramp quote",
        "tags": [
          "LATAM Mexico"
        ]
      }
    },
    "/v1/users/{userId}/latam/mx/orders/{orderId}": {
      "get": {
        "description": "Returns order details. Offramp orders may include a burnSignatureRequest to sign.",
        "operationId": "LatamMxController_getOrder",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "orderId",
            "required": true,
            "in": "path",
            "description": "The order ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Order details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MxOrderOutput"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Get a Mexico order by ID",
        "tags": [
          "LATAM Mexico"
        ]
      }
    },
    "/v1/users/{userId}/payouts/countries": {
      "get": {
        "description": "Returns the countries supported for bank payouts.",
        "operationId": "PayoutsController_listCountries",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "responses": {
          "200": {
            "description": "List of supported payout countries"
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List supported payout countries",
        "tags": [
          "Bank Payouts"
        ]
      }
    },
    "/v1/users/{userId}/payouts/banks": {
      "get": {
        "description": "Returns the banks available for payouts in the given country.",
        "operationId": "PayoutsController_listBanks",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "country",
            "required": true,
            "in": "query",
            "description": "ISO alpha-3 country code",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of banks for the country"
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List banks for a country",
        "tags": [
          "Bank Payouts"
        ]
      }
    },
    "/v1/users/{userId}/payouts/bank-branches": {
      "get": {
        "description": "Returns the branches for the given bank (where applicable).",
        "operationId": "PayoutsController_listBankBranches",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          },
          {
            "name": "bankId",
            "required": true,
            "in": "query",
            "description": "Provider bank ID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of bank branches"
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "List branches for a bank",
        "tags": [
          "Bank Payouts"
        ]
      }
    },
    "/v1/users/{userId}/payouts/validate-account": {
      "post": {
        "description": "Validates and resolves the name of a destination bank account.",
        "operationId": "PayoutsController_validateAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ValidatePayoutAccountInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Account validation result"
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Validate a destination bank account",
        "tags": [
          "Bank Payouts"
        ]
      }
    },
    "/v1/users/{userId}/payouts": {
      "post": {
        "description": "Initiates a bank payout from the source smart wallet. Returns a signatureRequest the user must sign (plus a quote); submit the signature via the wallet submit-signature endpoint.",
        "operationId": "PayoutsController_createPayout",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePayoutInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Payout initiated — signature required",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignatureRequestWithQuoteOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Create a bank payout",
        "tags": [
          "Bank Payouts"
        ]
      }
    },
    "/v1/users/{userId}/payment/select-wallet": {
      "post": {
        "description": "Selects which smart wallet funds a pending payment workflow. Returns a signatureRequest the user must sign (plus a quote); submit the signature via the wallet submit-signature endpoint.",
        "operationId": "PaymentController_selectWallet",
        "parameters": [
          {
            "$ref": "#/components/parameters/docsUserId"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SelectPaymentWalletInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Wallet selected — signature required",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignatureRequestWithQuoteOutput"
                }
              }
            }
          },
          "400": {
            "description": "Validation failed",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BadRequestErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Missing or invalid API key",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnauthorizedErrorResponse"
                }
              }
            }
          },
          "403": {
            "description": "User does not belong to this partner"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InternalServerErrorResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "partner-api-key": []
          }
        ],
        "summary": "Select the funding wallet for a payment",
        "tags": [
          "Payment"
        ]
      }
    }
  },
  "info": {
    "title": "BMoni Embedded API",
    "description": "Embeddable API that lets partners access BMoni wallet and card services. Provides user management, KYC, wallets, smart (multi-sig) wallets, cards, bank accounts, transactions, deposits, and withdrawals.",
    "version": "1.0",
    "contact": {}
  },
  "tags": [],
  "servers": [],
  "components": {
    "securitySchemes": {
      "partner-api-key": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key",
        "description": "Partner API key required on all partner-facing endpoints."
      },
      "admin-bearer": {
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "type": "http",
        "description": "Admin JWT used only on admin endpoints."
      }
    },
    "schemas": {
      "HealthOutput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "ok"
          }
        },
        "required": [
          "status"
        ]
      },
      "InternalServerErrorResponse": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "number",
            "example": 500
          },
          "message": {
            "type": "string",
            "example": "Internal Server Error"
          },
          "error": {
            "type": "string",
            "example": "Internal Server Error",
            "description": "HTTP error name"
          }
        },
        "required": [
          "statusCode",
          "message"
        ]
      },
      "RegisterAdminInput": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Admin User"
          },
          "email": {
            "type": "string",
            "example": "admin@example.com"
          },
          "password": {
            "type": "string",
            "example": "super-secure-password"
          },
          "loginBaseUrl": {
            "type": "string",
            "example": "https://dashboard.example.com",
            "description": "Base URL used to build the admin login link. Defaults to PROXY_ADMIN_DASHBOARD_URL when omitted."
          }
        },
        "required": [
          "name",
          "email",
          "password"
        ]
      },
      "AdminAuthOutput": {
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          },
          "adminUserId": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "role": {
            "type": "string",
            "enum": [
              "bmoni_admin",
              "partner_admin"
            ]
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "object",
            "nullable": true
          },
          "emailSent": {
            "type": "boolean",
            "description": "Whether the admin account email was accepted by the configured email provider."
          },
          "emailError": {
            "type": "string",
            "description": "Email delivery error when emailSent is false."
          }
        },
        "required": [
          "accessToken",
          "adminUserId",
          "email",
          "name",
          "role",
          "partnerId",
          "partnerName"
        ]
      },
      "BadRequestErrorResponse": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "number",
            "description": "HTTP status code",
            "example": 400
          },
          "message": {
            "description": "Human-readable error message or list of validation errors",
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "example": "Validation failed"
          },
          "error": {
            "type": "string",
            "description": "HTTP error name",
            "example": "Bad Request"
          }
        },
        "required": [
          "statusCode",
          "message",
          "error"
        ]
      },
      "ConflictErrorResponse": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "number",
            "description": "HTTP status code",
            "example": 409
          },
          "message": {
            "description": "Human-readable error message or list of validation errors",
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "example": "Resource already exists"
          },
          "error": {
            "type": "string",
            "description": "HTTP error name",
            "example": "Conflict"
          }
        },
        "required": [
          "statusCode",
          "message",
          "error"
        ]
      },
      "LoginAdminInput": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "example": "admin@example.com"
          },
          "password": {
            "type": "string",
            "example": "super-secure-password"
          }
        },
        "required": [
          "email",
          "password"
        ]
      },
      "UnauthorizedErrorResponse": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "number",
            "description": "HTTP status code",
            "example": 401
          },
          "message": {
            "description": "Human-readable error message or list of validation errors",
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "example": "Unauthorized"
          },
          "error": {
            "type": "string",
            "description": "HTTP error name",
            "example": "Unauthorized"
          }
        },
        "required": [
          "statusCode",
          "message",
          "error"
        ]
      },
      "AcceptAdminInviteInput": {
        "type": "object",
        "properties": {
          "ownerAddress": {
            "type": "string",
            "description": "EVM address to register as smart account owner for this invitee"
          }
        },
        "required": [
          "ownerAddress"
        ]
      },
      "AdminUserOutput": {
        "type": "object",
        "properties": {
          "adminUserId": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "role": {
            "type": "string",
            "enum": [
              "bmoni_admin",
              "partner_admin"
            ]
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "object",
            "nullable": true
          },
          "allowProdAccess": {
            "type": "boolean",
            "description": "Whether the admin's partner can access the prod/live environment. Always false for BMoni admins (they have access via role)."
          },
          "acceptedAt": {
            "type": "object",
            "nullable": true
          },
          "deactivatedAt": {
            "type": "object",
            "nullable": true,
            "description": "When the account was deactivated by a BMoni admin. Null means active."
          },
          "lastLoginAt": {
            "type": "object",
            "nullable": true
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "adminUserId",
          "email",
          "name",
          "role",
          "partnerId",
          "partnerName",
          "allowProdAccess",
          "acceptedAt",
          "deactivatedAt",
          "lastLoginAt",
          "createdAt"
        ]
      },
      "PartnerOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "logo": {
            "type": "object",
            "nullable": true
          },
          "allowProdAccess": {
            "type": "boolean",
            "description": "Whether this partner can access the prod/live environment."
          },
          "admins": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AdminUserOutput"
            }
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          },
          "updatedAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "id",
          "name",
          "logo",
          "allowProdAccess",
          "admins",
          "createdAt",
          "updatedAt"
        ]
      },
      "CreatePartnerInput": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "PaidHR"
          },
          "logo": {
            "type": "string",
            "example": "https://cdn.example.com/logos/paidhr.png"
          }
        },
        "required": [
          "name"
        ]
      },
      "UpdatePartnerInput": {
        "type": "object",
        "properties": {
          "allowProdAccess": {
            "type": "boolean",
            "description": "Grant or revoke this partner's access to the prod/live environment."
          }
        }
      },
      "AddPartnerDomainInput": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "description": "An email domain the partner has verified ownership of, e.g. 'allora.mx'.",
            "example": "allora.mx"
          }
        },
        "required": [
          "domain"
        ]
      },
      "PartnerDomainsOutput": {
        "type": "object",
        "properties": {
          "partnerId": {
            "type": "string"
          },
          "domains": {
            "description": "The partner's verified email domains after the change.",
            "example": [
              "allora.mx"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "partnerId",
          "domains"
        ]
      },
      "InvitePartnerAdminInput": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "example": "dev@partner.com"
          },
          "name": {
            "type": "string",
            "example": "John Doe"
          },
          "inviteBaseUrl": {
            "type": "string",
            "example": "https://dashboard.example.com",
            "description": "Base URL used to build the invite acceptance link. Defaults to PROXY_ADMIN_DASHBOARD_URL when omitted."
          }
        },
        "required": [
          "email"
        ]
      },
      "PartnerAdminInviteOutput": {
        "type": "object",
        "properties": {
          "adminUserId": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "role": {
            "type": "string",
            "enum": [
              "bmoni_admin",
              "partner_admin"
            ]
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "object",
            "nullable": true
          },
          "allowProdAccess": {
            "type": "boolean",
            "description": "Whether the admin's partner can access the prod/live environment. Always false for BMoni admins (they have access via role)."
          },
          "acceptedAt": {
            "type": "object",
            "nullable": true
          },
          "deactivatedAt": {
            "type": "object",
            "nullable": true,
            "description": "When the account was deactivated by a BMoni admin. Null means active."
          },
          "lastLoginAt": {
            "type": "object",
            "nullable": true
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          },
          "inviteToken": {
            "type": "string",
            "description": "One-time invite token. Send this to the partner admin through the chosen channel."
          },
          "inviteExpiresAt": {
            "format": "date-time",
            "type": "string"
          },
          "inviteUrl": {
            "type": "string",
            "description": "Full invite acceptance URL sent to the partner admin."
          },
          "emailSent": {
            "type": "boolean",
            "description": "Whether the invite email was accepted by the configured email provider."
          },
          "emailError": {
            "type": "string",
            "description": "Email delivery error when emailSent is false. The invite link remains valid."
          }
        },
        "required": [
          "adminUserId",
          "email",
          "name",
          "role",
          "partnerId",
          "partnerName",
          "allowProdAccess",
          "acceptedAt",
          "deactivatedAt",
          "lastLoginAt",
          "createdAt",
          "inviteToken",
          "inviteExpiresAt",
          "inviteUrl",
          "emailSent"
        ]
      },
      "ResendPartnerAdminInviteInput": {
        "type": "object",
        "properties": {
          "inviteBaseUrl": {
            "type": "string",
            "example": "https://dashboard.example.com",
            "description": "Base URL used to build the invite acceptance link. Defaults to PROXY_ADMIN_DASHBOARD_URL when omitted."
          }
        }
      },
      "AdminAuditLogOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "actorAdminUserId": {
            "type": "object",
            "nullable": true
          },
          "actorEmail": {
            "type": "object",
            "nullable": true
          },
          "action": {
            "type": "string"
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "object",
            "nullable": true
          },
          "metadata": {
            "type": "object"
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "id",
          "actorAdminUserId",
          "actorEmail",
          "action",
          "partnerId",
          "partnerName",
          "metadata",
          "createdAt"
        ]
      },
      "CreateUserInput": {
        "type": "object",
        "properties": {
          "employeeId": {
            "type": "string",
            "description": "Partner employee identifier",
            "example": "EMP-2024-00142"
          },
          "identityId": {
            "type": "string",
            "description": "External identity identifier from the calling client",
            "example": "BKY-ID-00789"
          },
          "firstName": {
            "type": "string",
            "example": "Chiamaka"
          },
          "lastName": {
            "type": "string",
            "example": "Okafor",
            "description": "Optional. Auto-filled from BVN when available."
          },
          "middleName": {
            "type": "string",
            "example": "Ngozi"
          },
          "email": {
            "type": "string",
            "example": "chiamaka.okafor@example.com"
          },
          "phoneNumber": {
            "type": "string",
            "description": "E.164 formatted phone number",
            "example": "+2348012345678"
          },
          "bvn": {
            "type": "string",
            "example": "22345678901",
            "description": "Nigerian Bank Verification Number. When provided, lastName, middleName, address, and dateOfBirth are auto-filled from the BVN record. Explicitly provided values take precedence."
          },
          "monthlySalary": {
            "type": "string",
            "example": "450000.00"
          },
          "employerName": {
            "type": "string",
            "example": "Acme Corporation Ltd"
          },
          "occupation": {
            "type": "string",
            "example": "Software Engineer"
          },
          "addressStreet": {
            "type": "string",
            "description": "Street address",
            "example": "15 Admiralty Way"
          },
          "addressCity": {
            "type": "string",
            "example": "Lagos"
          },
          "addressState": {
            "type": "string",
            "example": "Lagos"
          },
          "addressCountry": {
            "type": "string",
            "example": "Nigeria"
          },
          "addressPostalCode": {
            "type": "string",
            "example": "101241"
          }
        },
        "required": [
          "firstName",
          "email",
          "phoneNumber"
        ]
      },
      "UserOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          "partnerName": {
            "type": "object",
            "description": "Partner associated with the API key that created this user",
            "example": "BMONI QA",
            "nullable": true
          },
          "employeeId": {
            "type": "object",
            "example": "EMP-2024-00142",
            "nullable": true
          },
          "identityId": {
            "type": "object",
            "description": "External identity identifier from the calling client",
            "example": "BKY-ID-00789",
            "nullable": true
          },
          "bmoniUserId": {
            "type": "string",
            "example": "bmoni-user-uuid-001"
          },
          "firstName": {
            "type": "string",
            "example": "Chiamaka"
          },
          "lastName": {
            "type": "object",
            "example": "Okafor",
            "nullable": true
          },
          "middleName": {
            "type": "object",
            "example": "Ngozi",
            "nullable": true
          },
          "email": {
            "type": "string",
            "example": "chiamaka.okafor@example.com"
          },
          "phoneNumber": {
            "type": "object",
            "example": "+2348012345678",
            "nullable": true,
            "description": "Null for employer-linked employees — they signed up in the BMONI app themselves, so their phone number is not held by the partner API"
          },
          "employerName": {
            "type": "object",
            "example": "Acme Corporation Ltd",
            "nullable": true
          },
          "occupation": {
            "type": "object",
            "example": "Software Engineer",
            "nullable": true
          },
          "monthlySalary": {
            "type": "object",
            "example": "450000.00",
            "nullable": true
          },
          "linkedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "description": "When the user was linked to the partner via the employer-link flow; null for users created through this API"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "id",
          "bmoniUserId",
          "firstName",
          "email",
          "createdAt",
          "updatedAt"
        ]
      },
      "CreateUserResponse": {
        "type": "object",
        "properties": {
          "user": {
            "$ref": "#/components/schemas/UserOutput"
          }
        },
        "required": [
          "user"
        ]
      },
      "ListUsersResponse": {
        "type": "object",
        "properties": {
          "users": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UserOutput"
            }
          },
          "total": {
            "type": "number",
            "description": "Total users matching the authenticated partner scope",
            "example": 124
          },
          "page": {
            "type": "number",
            "description": "Current result page",
            "example": 1
          },
          "limit": {
            "type": "number",
            "description": "Maximum users returned per page",
            "example": 20
          }
        },
        "required": [
          "users",
          "total",
          "page",
          "limit"
        ]
      },
      "NotFoundErrorResponse": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "number",
            "description": "HTTP status code",
            "example": 404
          },
          "message": {
            "description": "Human-readable error message or list of validation errors",
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "example": "Resource not found"
          },
          "error": {
            "type": "string",
            "description": "HTTP error name",
            "example": "Not Found"
          }
        },
        "required": [
          "statusCode",
          "message",
          "error"
        ]
      },
      "UpdateUserInput": {
        "type": "object",
        "properties": {
          "identityId": {
            "type": "string",
            "description": "External identity identifier from the calling client",
            "example": "BKY-ID-00789"
          },
          "firstName": {
            "type": "string",
            "example": "Chiamaka"
          },
          "lastName": {
            "type": "string",
            "example": "Okafor",
            "description": "Optional. Auto-filled from BVN when available."
          },
          "middleName": {
            "type": "string",
            "example": "Ngozi"
          },
          "monthlySalary": {
            "type": "string",
            "example": "450000.00"
          },
          "employerName": {
            "type": "string",
            "example": "Acme Corporation Ltd"
          },
          "occupation": {
            "type": "string",
            "example": "Software Engineer"
          },
          "displayName": {
            "type": "string",
            "example": "Chiamaka Okafor"
          }
        }
      },
      "UpdateUserResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "User updated"
          },
          "user": {
            "description": "Local user record after update, when present",
            "allOf": [
              {
                "$ref": "#/components/schemas/UserOutput"
              }
            ]
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "DeleteUserResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "User deleted"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "OccupationOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Stable occupation identifier to submit in KYC employment data.",
            "example": "occ-11-1011"
          },
          "socCode": {
            "type": "string",
            "description": "Standard Occupational Classification code for the occupation.",
            "example": "11-1011"
          },
          "displayName": {
            "type": "string",
            "description": "Human-readable occupation name shown to the user.",
            "example": "Chief Executives"
          },
          "category": {
            "type": "object",
            "description": "Optional high-level occupation category.",
            "example": "Management",
            "nullable": true
          },
          "aliases": {
            "description": "Alternative titles that match the same occupation during search.",
            "example": [
              "CEO",
              "President",
              "Executive Director"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "isActive": {
            "type": "boolean",
            "description": "Whether this occupation can currently be used for KYC.",
            "example": true
          }
        },
        "required": [
          "id",
          "socCode",
          "displayName",
          "aliases",
          "isActive"
        ]
      },
      "EstimatedMonthlyVolumeRangeOutput": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string",
            "description": "Display label for the expected monthly account volume range.",
            "example": "$0-$4,999"
          },
          "value": {
            "type": "number",
            "description": "Numeric value to submit when selecting this monthly volume range.",
            "example": 4999
          }
        },
        "required": [
          "label",
          "value"
        ]
      },
      "KycOptionsOutput": {
        "type": "object",
        "properties": {
          "genders": {
            "description": "Allowed gender values for KYC personal information.",
            "example": [
              "male",
              "female"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "employmentStatuses": {
            "description": "Allowed employment status values for KYC employment data.",
            "example": [
              "employed",
              "self_employed"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "fundsSources": {
            "description": "Allowed source-of-funds values for the user account.",
            "example": [
              "salary",
              "business_income"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "identificationTypes": {
            "description": "Allowed government identification document types for KYC submission.",
            "example": [
              "passport",
              "national_id",
              "driving_license"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "accountPurposes": {
            "description": "Allowed account purpose values for the KYC profile.",
            "example": [
              "personal",
              "business"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "estimatedMonthlyVolumeRanges": {
            "description": "Expected monthly volume ranges that can be submitted on the KYC profile.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EstimatedMonthlyVolumeRangeOutput"
            }
          }
        },
        "required": [
          "genders",
          "employmentStatuses",
          "fundsSources",
          "identificationTypes",
          "accountPurposes",
          "estimatedMonthlyVolumeRanges"
        ]
      },
      "IdentificationNumberInput": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "Identification type (e.g. ssn, bvn, nin, tin).",
            "example": "bvn"
          },
          "number": {
            "type": "string",
            "description": "Identification number.",
            "example": "22345678901"
          },
          "issuingCountryCode": {
            "type": "string",
            "description": "ISO 3166-1 alpha-3 issuing country code.",
            "example": "NGA"
          },
          "expirationDate": {
            "type": "string",
            "description": "Optional expiration date (ISO 8601).",
            "example": "2030-01-01"
          }
        },
        "required": [
          "type",
          "number",
          "issuingCountryCode"
        ]
      },
      "UpdateKycInput": {
        "type": "object",
        "properties": {
          "personalInfo": {
            "type": "object",
            "description": "Personal info (firstName, lastName, middleName, dateOfBirth, gender, email, phoneNumber, placeOfBirth, nationality, occupation, employerName, sourceOfIncome, estimatedAnnualIncome, incomeCurrency)",
            "example": {
              "firstName": "Chiamaka",
              "lastName": "Okafor",
              "middleName": "Ngozi",
              "email": "chiamaka@example.com",
              "phoneNumber": "+2341234567890",
              "dateOfBirth": "1990-01-01",
              "gender": "female",
              "placeOfBirth": "Lagos",
              "nationality": "NG"
            }
          },
          "address": {
            "type": "object",
            "description": "Address (streetLine1, streetLine2, city, state, postalCode, countryCode). Send state/province in state; it is stored upstream as subdivisionName.",
            "example": {
              "streetLine1": "15 Admiralty Way",
              "city": "Lagos",
              "state": "Lagos",
              "postalCode": "101241",
              "countryCode": "NGA"
            }
          },
          "employment": {
            "type": "object",
            "description": "Employment (occupationCode, employerName, employmentStatus). Use occupationCode from the occupations endpoint.",
            "example": {
              "occupationCode": "15-1252",
              "employerName": "ACME Corp",
              "employmentStatus": "employed"
            }
          },
          "sourceOfFunds": {
            "type": "string",
            "enum": [
              "salary",
              "business",
              "investments",
              "pension",
              "government",
              "inheritance",
              "savings"
            ],
            "example": "salary"
          },
          "estimatedMonthlyVolume": {
            "type": "number",
            "example": 5000
          },
          "accountPurpose": {
            "type": "string",
            "enum": [
              "personal",
              "business",
              "investment"
            ],
            "example": "personal"
          },
          "actingAsIntermediary": {
            "type": "boolean",
            "example": false
          },
          "identificationNumbers": {
            "description": "Identification numbers (SSN, BVN, NIN, TIN). Each item requires type, number, and issuingCountryCode; expirationDate is optional (ISO date).",
            "example": [
              {
                "type": "bvn",
                "number": "22345678901",
                "issuingCountryCode": "NGA",
                "expirationDate": "2030-01-01"
              }
            ],
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/IdentificationNumberInput"
            }
          }
        }
      },
      "BvnLookupOutput": {
        "type": "object",
        "properties": {
          "bvn": {
            "type": "string",
            "example": "22345678901"
          },
          "firstName": {
            "type": "string",
            "example": "Chiamaka"
          },
          "lastName": {
            "type": "string",
            "example": "Okafor"
          },
          "middleName": {
            "type": "object",
            "example": "Ngozi",
            "nullable": true
          },
          "dateOfBirth": {
            "type": "string",
            "example": "1990-01-15",
            "description": "Date of birth in YYYY-MM-DD format"
          },
          "gender": {
            "type": "string",
            "example": "female"
          },
          "email": {
            "type": "object",
            "example": "chiamaka@example.com",
            "nullable": true
          },
          "phoneNumber": {
            "type": "object",
            "example": "+2348012345678",
            "nullable": true
          },
          "residentialAddress": {
            "type": "object",
            "example": "15 Admiralty Way, Lagos",
            "nullable": true
          },
          "stateOfResidence": {
            "type": "object",
            "example": "Lagos",
            "nullable": true
          },
          "lgaOfOrigin": {
            "type": "object",
            "example": "Eti-Osa",
            "nullable": true
          },
          "nin": {
            "type": "object",
            "example": "12345678901",
            "nullable": true
          },
          "photo": {
            "type": "object",
            "description": "Base64-encoded photo from BVN record",
            "nullable": true
          }
        },
        "required": [
          "bvn",
          "firstName",
          "lastName",
          "dateOfBirth",
          "gender"
        ]
      },
      "ProxyResponse": {
        "type": "object",
        "properties": {
          "data": {
            "type": "object",
            "description": "Response data from the upstream BMoni API",
            "example": {}
          }
        }
      },
      "UsdAccountReadinessOutput": {
        "type": "object",
        "properties": {
          "ready": {
            "type": "boolean",
            "description": "True when every field required to provision a USD virtual bank account is present. There is no separate KYC-approval gate — the provider reviews the submitted documents itself.",
            "example": false
          },
          "missing": {
            "description": "Human-readable labels of the fields still required before provisioning. Empty when `ready` is true.",
            "example": [
              "Date of birth",
              "Proof of address (bank statement or utility bill)"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "ready",
          "missing"
        ]
      },
      "KycRetryInput": {
        "type": "object",
        "properties": {
          "sumsubLevelName": {
            "type": "string",
            "description": "KYC verification level for the retry attempt. Typically the same value the partner sent during the original /kyc/activate call.",
            "enum": [
              "id-only",
              "id-and-liveness",
              "idv-and-phone-verification",
              "bmoni-monerium"
            ],
            "example": "id-and-liveness"
          }
        },
        "required": [
          "sumsubLevelName"
        ]
      },
      "ActivateKycInput": {
        "type": "object",
        "properties": {
          "sumsubLevelName": {
            "type": "string",
            "description": "SumSub verification level. Required for every country except Canada, which routes to PayTrie and ignores this field.",
            "enum": [
              "id-only",
              "id-and-liveness",
              "idv-and-phone-verification",
              "bmoni-monerium"
            ],
            "example": "id-and-liveness"
          }
        }
      },
      "StartNigeriaOnboardingInput": {
        "type": "object",
        "properties": {
          "bvn": {
            "type": "string",
            "description": "Bank Verification Number used to start Nigeria onboarding and verify the user for NGN rails.",
            "example": "22345678901"
          },
          "ngnWalletAddress": {
            "type": "string",
            "description": "NGN wallet address to associate with the Nigeria onboarding flow.",
            "example": "0xabcdef1234567890abcdef1234567890abcdef12"
          },
          "ngnWalletIndex": {
            "type": "number",
            "description": "Index of the NGN wallet in the user wallet set. This identifies which NGN wallet is being onboarded.",
            "example": 1
          }
        },
        "required": [
          "bvn",
          "ngnWalletAddress",
          "ngnWalletIndex"
        ]
      },
      "StartCanadaOnboardingInput": {
        "type": "object",
        "properties": {
          "cadWalletAddress": {
            "type": "string",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "cadWalletIndex": {
            "type": "number",
            "example": 0
          }
        },
        "required": [
          "cadWalletAddress",
          "cadWalletIndex"
        ]
      },
      "StartMoneriumOnboardingInput": {
        "type": "object",
        "properties": {
          "eurWalletAddress": {
            "type": "string",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "eurWalletIndex": {
            "type": "number",
            "example": 0
          }
        },
        "required": [
          "eurWalletAddress",
          "eurWalletIndex"
        ]
      },
      "StartMexicoOnboardingInput": {
        "type": "object",
        "properties": {
          "mxnWalletAddress": {
            "type": "string",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "mxnWalletIndex": {
            "type": "number",
            "example": 0
          }
        },
        "required": [
          "mxnWalletAddress",
          "mxnWalletIndex"
        ]
      },
      "StartUsaOnboardingInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet that receives USDB credited to the USD virtual bank account.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          }
        },
        "required": [
          "smartWalletId"
        ]
      },
      "StartUsaOnboardingOutput": {
        "type": "object",
        "properties": {
          "workflowId": {
            "type": "string",
            "description": "Workflow ID for the provisioning process. Poll status via GET /v1/users/{userId}/vba/usd.",
            "example": "usd-account-provision-abc123"
          }
        },
        "required": [
          "workflowId"
        ]
      },
      "OnboardingStatusOutput": {
        "type": "object",
        "properties": {
          "anchorStatus": {
            "type": "string",
            "description": "Anchor onboarding status for Nigeria-based fiat account access.",
            "enum": [
              "not_started",
              "pending",
              "active",
              "resubmission_required",
              "rejected"
            ],
            "example": "not_started"
          },
          "anchorRejectionReason": {
            "type": "string",
            "description": "Anchor onboarding rejection reason when anchorStatus is rejected (e.g. the BVN is already registered to another customer). Terminal — the client should not offer a retry.",
            "example": "BVN is already registered to another customer"
          },
          "moneriumStatus": {
            "type": "string",
            "description": "Monerium onboarding status for EU account provisioning.",
            "enum": [
              "not_started",
              "pending",
              "active",
              "resubmission_required",
              "rejected"
            ],
            "example": "not_started"
          },
          "paytrieStatus": {
            "type": "string",
            "description": "PayTrie onboarding status for Canada-based fiat access.",
            "enum": [
              "not_started",
              "pending",
              "active",
              "resubmission_required",
              "rejected"
            ],
            "example": "not_started"
          },
          "paytrieRejectionReason": {
            "type": "string",
            "description": "PayTrie rejection reason when Canadian onboarding requires resubmission.",
            "example": "Identity verification document could not be validated"
          },
          "etherfuseStatus": {
            "type": "string",
            "description": "Etherfuse onboarding status for Mexico-based fiat access.",
            "enum": [
              "not_started",
              "pending",
              "active",
              "resubmission_required",
              "rejected"
            ],
            "example": "not_started"
          },
          "etherfuseRejectionReason": {
            "type": "string",
            "description": "Etherfuse rejection reason when Mexican onboarding is rejected.",
            "example": "Identity verification could not be completed"
          }
        },
        "required": [
          "anchorStatus",
          "moneriumStatus",
          "paytrieStatus",
          "etherfuseStatus"
        ]
      },
      "ExchangeRateOutput": {
        "type": "object",
        "properties": {
          "exchangeRate": {
            "type": "string",
            "description": "Exchange rate normalized to NGN. For non-NGN pairs this is the legacy computed value; prefer displayRate for user-facing display.",
            "example": "1580.50"
          },
          "displayRate": {
            "type": "string",
            "description": "Exchange rate expressed from the source currency perspective. Use this value for UI display.",
            "example": "1580.50"
          },
          "displayLabel": {
            "type": "string",
            "description": "Human-readable label for the rate, e.g. \"1 USD = 1,580.50 NGN\".",
            "example": "1 USD = 1,580.50 NGN"
          },
          "inverseRate": {
            "type": "string",
            "description": "Inverse of the display rate, useful for showing the reverse conversion.",
            "example": "0.000633"
          },
          "inverseLabel": {
            "type": "string",
            "description": "Human-readable label for the inverse rate, e.g. \"1 NGN = 0.000633 USD\".",
            "example": "1 NGN = 0.000633 USD"
          },
          "rateSource": {
            "type": "string",
            "description": "Identifies which provider or mechanism supplied this rate (e.g. \"oanda\", \"busha\", \"chainlink\").",
            "example": "oanda"
          }
        },
        "required": [
          "exchangeRate"
        ]
      },
      "ConvertCurrencyInput": {
        "type": "object",
        "properties": {
          "amount": {
            "type": "number",
            "description": "Amount to convert in the source currency. Must be greater than zero.",
            "example": 100
          },
          "from": {
            "type": "string",
            "description": "Source currency code to convert from. Accepts stablecoins (USDB, USDC, cNGN) and fiat references (USD, NGN, EUR, GBP, CAD, CNY).",
            "example": "USD"
          },
          "to": {
            "type": "string",
            "description": "Target currency code to convert to. Accepts stablecoins (USDB, USDC, cNGN) and fiat references (USD, NGN, EUR, GBP, CAD, CNY).",
            "example": "NGN"
          }
        },
        "required": [
          "amount",
          "from",
          "to"
        ]
      },
      "ConvertCurrencyOutput": {
        "type": "object",
        "properties": {
          "amount": {
            "type": "number",
            "description": "The original amount that was converted.",
            "example": 100
          },
          "from": {
            "type": "string",
            "description": "Source currency code.",
            "example": "USD"
          },
          "to": {
            "type": "string",
            "description": "Target currency code.",
            "example": "NGN"
          },
          "exchangeRate": {
            "type": "string",
            "description": "Live exchange rate applied to the conversion, as a decimal string.",
            "example": "1580.50"
          },
          "convertedAmount": {
            "type": "string",
            "description": "Result of the conversion in the target currency, as a decimal string.",
            "example": "158050.00"
          }
        },
        "required": [
          "amount",
          "from",
          "to",
          "exchangeRate",
          "convertedAmount"
        ]
      },
      "SwapAmountInput": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "Which side of the swap the amount refers to. Use \"exactIn\" to quote for a known input amount, or \"exactOut\" to quote for a known output amount.",
            "enum": [
              "exactIn",
              "exactOut"
            ],
            "example": "exactIn"
          },
          "amountIn": {
            "type": "string",
            "description": "The input amount as a decimal string. Required when type is \"exactIn\".",
            "example": "100.00"
          },
          "amountOut": {
            "type": "string",
            "description": "The output amount as a decimal string. Required when type is \"exactOut\".",
            "example": "158050.00"
          }
        },
        "required": [
          "type"
        ]
      },
      "GetSwapQuoteInput": {
        "type": "object",
        "properties": {
          "swapAmount": {
            "description": "The amount to quote, specified as either an exact input or exact output.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SwapAmountInput"
              }
            ]
          },
          "fromCurrency": {
            "type": "string",
            "description": "Source currency code to quote from. One of USD, NGN, CAD, EUR, GBP, MXN, CNY.",
            "enum": [
              "USD",
              "NGN",
              "CAD",
              "EUR",
              "GBP",
              "MXN",
              "CNY"
            ],
            "example": "USD"
          },
          "toCurrency": {
            "type": "string",
            "description": "Target currency code to quote to. One of USD, NGN, CAD, EUR, GBP, MXN, CNY.",
            "enum": [
              "USD",
              "NGN",
              "CAD",
              "EUR",
              "GBP",
              "MXN",
              "CNY"
            ],
            "example": "NGN"
          }
        },
        "required": [
          "swapAmount",
          "fromCurrency",
          "toCurrency"
        ]
      },
      "SwapQuoteFee": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "string",
            "description": "Currency the fee is charged in.",
            "example": "USD"
          },
          "amount": {
            "type": "string",
            "description": "Fee amount as a decimal string.",
            "example": "1.00"
          },
          "description": {
            "type": "string",
            "description": "Human-readable description of the fee.",
            "example": "Network fee"
          }
        },
        "required": [
          "currency",
          "amount"
        ]
      },
      "SwapQuoteSwapFee": {
        "type": "object",
        "properties": {
          "percentage": {
            "type": "number",
            "description": "Fee as a decimal, e.g. 0.01 = 1%.",
            "example": 0.01
          },
          "description": {
            "type": "string",
            "description": "Human-readable description of the swap fee.",
            "example": "1.00% swap premium"
          }
        },
        "required": [
          "percentage",
          "description"
        ]
      },
      "SwapQuoteOutput": {
        "type": "object",
        "properties": {
          "fromCurrency": {
            "type": "string",
            "description": "Source currency code.",
            "example": "USD"
          },
          "toCurrency": {
            "type": "string",
            "description": "Target currency code.",
            "example": "NGN"
          },
          "amountIn": {
            "type": "string",
            "description": "Input amount as a decimal string.",
            "example": "100.00"
          },
          "amountOut": {
            "type": "string",
            "description": "Output amount as a decimal string.",
            "example": "158050.00"
          },
          "exchangeRate": {
            "type": "string",
            "description": "Exchange rate applied, as a decimal string.",
            "example": "1580.50"
          },
          "toUsdExchangeRate": {
            "type": "string",
            "description": "Exchange rate of the source currency to USD, as a decimal string.",
            "example": "1.00"
          },
          "fees": {
            "description": "Itemised fees applied to the quote.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SwapQuoteFee"
            }
          },
          "quoteId": {
            "type": "string",
            "description": "Unique identifier for this quote.",
            "format": "uuid",
            "example": "b9fa08b5-46ae-4d85-9ac2-6ca2f4d91234"
          },
          "quotedAt": {
            "type": "string",
            "description": "ISO-8601 timestamp when the quote was generated.",
            "example": "2026-06-02T12:00:00.000Z"
          },
          "expiresAt": {
            "type": "string",
            "description": "ISO-8601 timestamp after which the quote is no longer valid.",
            "example": "2026-06-02T12:00:20.000Z"
          },
          "expiresInSeconds": {
            "type": "number",
            "description": "Seconds until the quote expires from generation.",
            "example": 20
          },
          "displayRate": {
            "type": "string",
            "description": "Display-ready rate from the source currency perspective.",
            "example": "1580.50"
          },
          "displayLabel": {
            "type": "string",
            "description": "Human-readable label for the rate.",
            "example": "1 USD = 1,580.50 NGN"
          },
          "inverseRate": {
            "type": "string",
            "description": "Inverse of the display rate.",
            "example": "0.000633"
          },
          "inverseLabel": {
            "type": "string",
            "description": "Human-readable label for the inverse rate.",
            "example": "1 NGN = 0.000633 USD"
          },
          "rateSource": {
            "type": "string",
            "description": "Identifies which provider or mechanism supplied this rate.",
            "example": "oanda"
          },
          "midMarketRate": {
            "type": "string",
            "description": "Mid-market rate as a decimal string.",
            "example": "1582.00"
          },
          "fee": {
            "description": "Swap fee details, distinct from the itemised `fees` array. Present only when a swap premium applies.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SwapQuoteSwapFee"
              }
            ]
          }
        },
        "required": [
          "fromCurrency",
          "toCurrency",
          "amountIn",
          "amountOut",
          "exchangeRate",
          "toUsdExchangeRate",
          "fees",
          "quoteId",
          "quotedAt",
          "expiresAt",
          "expiresInSeconds"
        ]
      },
      "ProvisionUsdcWalletOutput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string",
            "description": "BMoni user identifier.",
            "example": "9edf8a20-54a4-46ab-a8be-fa4f1530f870"
          },
          "walletAddress": {
            "type": "string",
            "description": "EVM address of the provisioned USDC wallet.",
            "example": "0x3127718e3E962ef45C6EA447b0F67d31835c7Af0"
          },
          "walletIndex": {
            "type": "number",
            "description": "Deterministic wallet index for this user and asset.",
            "example": 0
          },
          "chain": {
            "type": "string",
            "description": "EVM chain identifier.",
            "example": "base"
          },
          "currency": {
            "type": "string",
            "description": "Stablecoin ticker.",
            "example": "USDC"
          }
        },
        "required": [
          "userId",
          "walletAddress",
          "walletIndex",
          "chain",
          "currency"
        ]
      },
      "UsdcWalletBalanceOutput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string",
            "description": "BMoni user identifier.",
            "example": "9edf8a20-54a4-46ab-a8be-fa4f1530f870"
          },
          "walletAddress": {
            "type": "string",
            "description": "EVM address of the USDC wallet.",
            "example": "0x3127718e3E962ef45C6EA447b0F67d31835c7Af0"
          },
          "raw": {
            "type": "string",
            "description": "Balance in smallest units (integer string), e.g. wei-style for USDC.",
            "example": "0"
          },
          "formatted": {
            "type": "string",
            "description": "Human-readable balance string (same units as `decimals`).",
            "example": "0"
          },
          "decimals": {
            "type": "number",
            "description": "ERC-20 decimals for USDC (typically 6).",
            "example": 6
          }
        },
        "required": [
          "userId",
          "walletAddress",
          "raw",
          "formatted",
          "decimals"
        ]
      },
      "AuthorizeUsdcInput": {
        "type": "object",
        "properties": {
          "to": {
            "type": "string",
            "description": "Recipient EVM address (0x-prefixed 20-byte hex).",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "amount": {
            "type": "string",
            "description": "USDC amount as a positive decimal string (up to 6 decimal places).",
            "example": "10.50"
          },
          "validBefore": {
            "type": "number",
            "description": "Unix timestamp (seconds) after which the authorization is no longer valid.",
            "example": 1893456000,
            "minimum": 1
          },
          "nonce": {
            "type": "string",
            "description": "32-byte hex nonce (0x-prefixed). When omitted, the upstream generates one.",
            "example": "0x0000000000000000000000000000000000000000000000000000000000000001"
          }
        },
        "required": [
          "to",
          "amount",
          "validBefore"
        ]
      },
      "AuthorizeUsdcDomainOutput": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "USDC"
          },
          "version": {
            "type": "string",
            "example": "2"
          },
          "chainId": {
            "type": "number",
            "description": "EVM chain id for the verifying contract.",
            "example": 84532
          },
          "verifyingContract": {
            "type": "string",
            "description": "USDC token contract address.",
            "example": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
          }
        },
        "required": [
          "name",
          "version",
          "chainId",
          "verifyingContract"
        ]
      },
      "AuthorizeUsdcOutput": {
        "type": "object",
        "properties": {
          "from": {
            "type": "string",
            "description": "Sender (payer) EVM address.",
            "example": "0x3127718e3E962ef45C6EA447b0F67d31835c7Af0"
          },
          "to": {
            "type": "string",
            "description": "Recipient EVM address.",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "value": {
            "type": "string",
            "description": "Transfer amount in smallest units (integer string).",
            "example": "10500000"
          },
          "validAfter": {
            "type": "string",
            "description": "Unix timestamp (seconds) before which the authorization is not valid.",
            "example": "1778693793"
          },
          "validBefore": {
            "type": "string",
            "description": "Unix timestamp (seconds) after which the authorization is not valid.",
            "example": "1778693813"
          },
          "nonce": {
            "type": "string",
            "description": "32-byte hex nonce (0x-prefixed).",
            "example": "0x0000000000000000000000000000000000000000000000000000000000000001"
          },
          "signature": {
            "type": "string",
            "description": "ECDSA signature over the EIP-712 digest (65-byte 0x-prefixed hex).",
            "example": "0xbfe36123055c4894176feebf4bebc5aa7fa9af28d32f5b7c6fad3a23db12e2196f82dccdf182d8505b8c71bd76e8aa8f884888e9baa47cae3e0fbca4fc57df8d1b"
          },
          "v": {
            "type": "number",
            "description": "Recovery id (27 or 28 for standard secp256k1).",
            "example": 27
          },
          "r": {
            "type": "string",
            "description": "Signature `r` component (32-byte 0x-prefixed hex).",
            "example": "0xbfe36123055c4894176feebf4bebc5aa7fa9af28d32f5b7c6fad3a23db12e219"
          },
          "s": {
            "type": "string",
            "description": "Signature `s` component (32-byte 0x-prefixed hex).",
            "example": "0x6f82dccdf182d8505b8c71bd76e8aa8f884888e9baa47cae3e0fbca4fc57df8d"
          },
          "domain": {
            "$ref": "#/components/schemas/AuthorizeUsdcDomainOutput"
          }
        },
        "required": [
          "from",
          "to",
          "value",
          "validAfter",
          "validBefore",
          "nonce",
          "signature",
          "v",
          "r",
          "s",
          "domain"
        ]
      },
      "SendUsdcInput": {
        "type": "object",
        "properties": {
          "to": {
            "type": "string",
            "description": "Recipient EVM address (0x-prefixed 20-byte hex).",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "amount": {
            "type": "string",
            "description": "USDC amount as a positive decimal string (up to 6 decimal places).",
            "example": "10.50"
          }
        },
        "required": [
          "to",
          "amount"
        ]
      },
      "SendUsdcOutput": {
        "type": "object",
        "properties": {
          "txHash": {
            "type": "string",
            "description": "On-chain transaction hash.",
            "pattern": "^0x[a-fA-F0-9]{64}$",
            "example": "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
          },
          "from": {
            "type": "string",
            "description": "Sender EVM address (0x-prefixed 20-byte hex).",
            "pattern": "^0x[a-fA-F0-9]{40}$",
            "example": "0x3127718e3E962ef45C6EA447b0F67d31835c7Af0"
          },
          "to": {
            "type": "string",
            "description": "Recipient EVM address (0x-prefixed 20-byte hex).",
            "pattern": "^0x[a-fA-F0-9]{40}$",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "amount": {
            "type": "string",
            "description": "USDC amount as a positive decimal string (up to 6 decimal places); all-zero values are rejected.",
            "pattern": "^(?!0+(?:\\.0+)?$)\\d+(\\.\\d{1,6})?$",
            "example": "10.50"
          },
          "nonce": {
            "type": "string",
            "description": "32-byte hex nonce (0x-prefixed).",
            "pattern": "^0x[a-fA-F0-9]{64}$",
            "example": "0x0000000000000000000000000000000000000000000000000000000000000001"
          }
        },
        "required": [
          "txHash",
          "from",
          "to",
          "amount",
          "nonce"
        ]
      },
      "CreateOwnerProofChallengeInput": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "string",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ],
            "description": "Stablecoin currency for the smart wallet creation flow."
          },
          "userOwnerAddress": {
            "type": "string",
            "description": "End-user EVM address that will sign the returned ownership message.",
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          }
        },
        "required": [
          "currency",
          "userOwnerAddress"
        ]
      },
      "OwnerProofChallengeResponse": {
        "type": "object",
        "properties": {
          "challengeId": {
            "type": "string",
            "description": "One-time challenge ID to include in create-managed."
          },
          "groupId": {
            "type": "string",
            "description": "Upstream chat group ID created for this smart wallet flow and bound to the challenge."
          },
          "message": {
            "type": "string",
            "description": "Exact EIP-191 personal_sign message that userOwnerAddress must sign."
          },
          "expiresAt": {
            "type": "string",
            "description": "ISO timestamp after which the challenge cannot be used."
          }
        },
        "required": [
          "challengeId",
          "groupId",
          "message",
          "expiresAt"
        ]
      },
      "CreateManagedSmartWalletInput": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "string",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ],
            "description": "Stablecoin currency for the new smart wallet"
          },
          "userOwnerAddress": {
            "type": "string",
            "description": "End-user EVM address from the bmoni embedded SDK. Registered as the calling user's smart wallet owner address and added to the on-chain owner set together with the BMoni KMS custodian."
          },
          "ownerProofChallengeId": {
            "type": "string",
            "description": "Challenge ID returned by POST /v1/users/{userId}/smart-wallets/owner-proof-challenges. The challenge must be signed by userOwnerAddress and is consumed once."
          },
          "ownerProofSignature": {
            "type": "string",
            "description": "EIP-191 personal_sign signature over the exact owner-proof challenge message. The recovered signer must equal userOwnerAddress.",
            "example": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b"
          }
        },
        "required": [
          "currency",
          "userOwnerAddress",
          "ownerProofChallengeId",
          "ownerProofSignature"
        ]
      },
      "SmartWalletDetailResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "0649ef6c-6d67-43cf-a911-3babfbb7a7aa"
          },
          "currency": {
            "type": "string",
            "example": "USD"
          },
          "walletAddress": {
            "type": "object",
            "example": "0xDD9Cd9EBaF276722ACF45e68E77f7bb05Dd2c983",
            "nullable": true
          },
          "isActive": {
            "type": "boolean",
            "example": true
          },
          "pendingDeployUserOperation": {
            "type": "object",
            "nullable": true
          },
          "deploySigningPayloadHash": {
            "type": "object",
            "nullable": true
          },
          "createdByUserId": {
            "type": "object",
            "example": "dc9d00e0-bef1-4efa-9905-52a910c86242",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "example": "2026-05-13T14:10:15.971Z"
          },
          "updatedAt": {
            "type": "string",
            "example": "2026-05-13T14:10:15.971Z"
          }
        },
        "required": [
          "id",
          "currency",
          "isActive",
          "createdAt",
          "updatedAt"
        ]
      },
      "SmartWalletBalanceItemOutput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
            "description": "Smart wallet (per-currency) row ID."
          },
          "currency": {
            "type": "string",
            "example": "USD",
            "description": "Partner-facing currency code."
          },
          "balance": {
            "type": "object",
            "example": "123.450000",
            "nullable": true,
            "description": "Human-readable balance string. `null` when the on-chain read failed for this currency (see `error`)."
          },
          "error": {
            "type": "object",
            "example": null,
            "nullable": true,
            "description": "Per-currency error message when `balance` is null."
          }
        },
        "required": [
          "smartWalletId",
          "currency"
        ]
      },
      "SmartWalletBalancesByGroupDataOutput": {
        "type": "object",
        "properties": {
          "smartAccountAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true,
            "description": "Shared on-chain smart account address when all wallets on the account reuse the same Coinbase treasury; `null` otherwise."
          },
          "balances": {
            "description": "One entry per active smart wallet on the account.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletBalanceItemOutput"
            }
          }
        },
        "required": [
          "balances"
        ]
      },
      "SmartWalletBalancesByGroupResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletBalancesByGroupDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "SmartWalletBalanceSimpleResponse": {
        "type": "object",
        "properties": {
          "balance": {
            "type": "string",
            "example": "20"
          },
          "currency": {
            "type": "string",
            "example": "USD"
          },
          "smartWalletId": {
            "type": "string",
            "example": "0649ef6c-6d67-43cf-a911-3babfbb7a7aa"
          }
        },
        "required": [
          "balance",
          "currency",
          "smartWalletId"
        ]
      },
      "RegisterOwnerAddressInput": {
        "type": "object",
        "properties": {
          "ownerAddress": {
            "type": "string",
            "description": "Admin EVM owner address. Must match an on-chain owner of the smart wallet account. Registered after local biometric verification."
          },
          "derivedDerivationIndex": {
            "type": "number",
            "description": "Derivation index used to produce `ownerAddress`. When set, it must match the canonical server-side derivation index.",
            "minimum": 0
          },
          "derivedAccount": {
            "type": "number",
            "description": "BKey account number (defaults to 1 for shared wallets).",
            "minimum": 0
          }
        },
        "required": [
          "ownerAddress"
        ]
      },
      "RegisterOwnerAddressDataOutput": {
        "type": "object",
        "properties": {
          "ownerAddress": {
            "type": "string",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "registeredAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          }
        },
        "required": [
          "ownerAddress"
        ]
      },
      "RegisterOwnerAddressResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/RegisterOwnerAddressDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "PatchApprovalPolicyInput": {
        "type": "object",
        "properties": {
          "approvalThreshold": {
            "type": "number",
            "description": "New approval threshold. Creates a `CHANGE_THRESHOLD` proposal and records the requester as the first approver.",
            "minimum": 1
          }
        },
        "required": [
          "approvalThreshold"
        ]
      },
      "SmartWalletProposalApprovalOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "object",
            "example": "09e18f1a-9e5f-4446-b27f-3d2d37e91234",
            "nullable": true
          },
          "approverUserId": {
            "type": "object",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234",
            "nullable": true
          },
          "status": {
            "type": "string",
            "example": "APPROVED",
            "description": "Approval vote state for this approver."
          },
          "approvedAt": {
            "type": "object",
            "example": "2026-04-22T10:20:00.000Z",
            "nullable": true
          }
        }
      },
      "SmartWalletProposalSignatureOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "object",
            "example": "5ad43464-594f-4518-a791-becaf1a51234",
            "nullable": true
          },
          "signerUserId": {
            "type": "object",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234",
            "nullable": true
          },
          "signerAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true
          },
          "signature": {
            "type": "object",
            "example": "0xdeadbeef",
            "nullable": true,
            "description": "Hex signature payload if the upstream echoes it back."
          },
          "signedAt": {
            "type": "object",
            "example": "2026-04-22T10:25:00.000Z",
            "nullable": true
          }
        }
      },
      "SmartWalletProposalOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "47665949-8654-4461-b52a-3ef3624b1234"
          },
          "smartWalletId": {
            "type": "object",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234",
            "description": "Smart wallet that owns this proposal.",
            "nullable": true
          },
          "type": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "ADD_MEMBER",
              "REMOVE_MEMBER",
              "ADMIN_DEMOTE_OWNER",
              "CHANGE_THRESHOLD",
              "SWAP"
            ],
            "description": "Type of governance / transfer proposal."
          },
          "status": {
            "type": "string",
            "example": "PENDING_SIGNATURES",
            "description": "Current lifecycle state of the proposal."
          },
          "description": {
            "type": "object",
            "example": "Treasury transfer for April stipends",
            "nullable": true
          },
          "toAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true
          },
          "toUserId": {
            "type": "object",
            "example": "fd404a2d-2183-4afe-974c-4fc3292b1234",
            "nullable": true
          },
          "targetUserId": {
            "type": "object",
            "example": "fd404a2d-2183-4afe-974c-4fc3292b1234",
            "nullable": true
          },
          "targetRole": {
            "type": "string",
            "enum": [
              "ADMIN",
              "MEMBER"
            ],
            "nullable": true
          },
          "amount": {
            "type": "object",
            "example": "25.00",
            "nullable": true
          },
          "newThreshold": {
            "type": "object",
            "example": 2,
            "nullable": true
          },
          "newApprovalMode": {
            "type": "string",
            "enum": [
              "ANY_ADMIN",
              "ADMIN_THRESHOLD",
              "OWNER_APPROVAL"
            ],
            "nullable": true
          },
          "userOpHash": {
            "type": "object",
            "example": "0xabcdef1234567890",
            "nullable": true
          },
          "signingPayloadHash": {
            "type": "object",
            "example": "0xabcdef1234567890",
            "nullable": true
          },
          "safeTxHash": {
            "type": "object",
            "example": "0xabcdef1234567890",
            "nullable": true
          },
          "workflowId": {
            "type": "object",
            "example": "wf-proposal-123",
            "nullable": true
          },
          "approvals": {
            "description": "Approvals already collected for the proposal.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletProposalApprovalOutput"
            }
          },
          "signatures": {
            "description": "Cryptographic signatures already submitted for execution.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletProposalSignatureOutput"
            }
          },
          "createdAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          },
          "updatedAt": {
            "type": "object",
            "example": "2026-04-22T10:16:00.000Z",
            "nullable": true
          }
        },
        "required": [
          "id"
        ]
      },
      "SmartWalletProposalDataOutput": {
        "type": "object",
        "properties": {
          "proposal": {
            "$ref": "#/components/schemas/SmartWalletProposalOutput"
          }
        },
        "required": [
          "proposal"
        ]
      },
      "SmartWalletProposalResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletProposalDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "AddMemberInput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string",
            "description": "User ID to add to the smart wallet membership"
          },
          "role": {
            "type": "string",
            "enum": [
              "ADMIN",
              "MEMBER"
            ],
            "default": "MEMBER"
          }
        },
        "required": [
          "userId"
        ]
      },
      "SmartWalletOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "currency": {
            "type": "string",
            "example": "USDB",
            "description": "Wallet currency / settlement token code."
          },
          "status": {
            "type": "string",
            "example": "ACTIVE",
            "description": "Lifecycle status of the smart wallet."
          },
          "smartAccountAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true,
            "description": "Counterfactual or deployed smart account address, depending on status."
          },
          "safeAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true,
            "description": "Alias some upstream payloads use instead of smartAccountAddress."
          },
          "threshold": {
            "type": "object",
            "example": 2,
            "nullable": true,
            "description": "Current owner / approval threshold."
          },
          "approvalMode": {
            "type": "string",
            "enum": [
              "ANY_ADMIN",
              "ADMIN_THRESHOLD",
              "OWNER_APPROVAL"
            ],
            "nullable": true,
            "description": "Approval policy currently applied to the wallet."
          },
          "pendingUserOpHash": {
            "type": "object",
            "example": "0xabcdef1234567890",
            "nullable": true,
            "description": "Pending deployment user operation hash when the wallet is only prepared."
          },
          "userOpHash": {
            "type": "object",
            "example": "0xabcdef1234567890",
            "nullable": true,
            "description": "Alias some upstream responses use for pendingUserOpHash."
          },
          "createdAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          },
          "updatedAt": {
            "type": "object",
            "example": "2026-04-22T10:16:30.000Z",
            "nullable": true
          }
        },
        "required": [
          "id",
          "currency",
          "status"
        ]
      },
      "SmartWalletMemberUserOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234"
          },
          "firstName": {
            "type": "string",
            "example": "Ada"
          },
          "lastName": {
            "type": "string",
            "example": "Lovelace"
          },
          "email": {
            "type": "string",
            "example": "ada@example.com"
          }
        },
        "required": [
          "id"
        ]
      },
      "SmartWalletMemberOutput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234"
          },
          "role": {
            "type": "string",
            "enum": [
              "ADMIN",
              "MEMBER"
            ],
            "description": "Role this member currently has in the smart wallet."
          },
          "isAdmin": {
            "type": "boolean",
            "example": true,
            "description": "Convenience flag some upstream payloads include for admins."
          },
          "status": {
            "type": "string",
            "example": "ACTIVE",
            "description": "Membership status on the smart wallet account."
          },
          "ownerAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true
          },
          "joinedAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          },
          "user": {
            "description": "Expanded user details when the upstream includes them.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SmartWalletMemberUserOutput"
              }
            ]
          }
        },
        "required": [
          "userId"
        ]
      },
      "SmartWalletMemberMutationDataOutput": {
        "type": "object",
        "properties": {
          "smartWallet": {
            "$ref": "#/components/schemas/SmartWalletOutput"
          },
          "member": {
            "$ref": "#/components/schemas/SmartWalletMemberOutput"
          },
          "proposal": {
            "$ref": "#/components/schemas/SmartWalletProposalOutput"
          }
        }
      },
      "SmartWalletMemberMutationResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletMemberMutationDataOutput"
          }
        }
      },
      "DemoteAdminInput": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string",
            "description": "Optional description recorded on the demotion proposal"
          }
        }
      },
      "CreateAdminInviteInput": {
        "type": "object",
        "properties": {
          "targetUserId": {
            "type": "string",
            "description": "User ID to invite as smart wallet admin"
          }
        },
        "required": [
          "targetUserId"
        ]
      },
      "SmartWalletAdminInviteOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "c178a319-d14c-4c40-9cf0-b2367c1f1234"
          },
          "targetUserId": {
            "type": "object",
            "example": "fd404a2d-2183-4afe-974c-4fc3292b1234",
            "nullable": true
          },
          "inviterUserId": {
            "type": "object",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234",
            "nullable": true
          },
          "status": {
            "type": "string",
            "example": "PENDING",
            "description": "Invitation lifecycle status."
          },
          "ownerAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true
          },
          "expiresAt": {
            "type": "object",
            "example": "2026-04-29T10:15:00.000Z",
            "nullable": true
          },
          "createdAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          },
          "updatedAt": {
            "type": "object",
            "example": "2026-04-22T10:16:00.000Z",
            "nullable": true
          }
        },
        "required": [
          "id"
        ]
      },
      "SmartWalletAdminInviteDataOutput": {
        "type": "object",
        "properties": {
          "adminInvite": {
            "$ref": "#/components/schemas/SmartWalletAdminInviteOutput"
          }
        },
        "required": [
          "adminInvite"
        ]
      },
      "SmartWalletAdminInviteResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletAdminInviteDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "BulkAdminInviteInput": {
        "type": "object",
        "properties": {
          "targetUserIds": {
            "description": "User IDs to invite as smart wallet admins",
            "minItems": 1,
            "maxItems": 50,
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "targetUserIds"
        ]
      },
      "SmartWalletBulkAdminInvitesDataOutput": {
        "type": "object",
        "properties": {
          "adminInvites": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletAdminInviteOutput"
            }
          }
        },
        "required": [
          "adminInvites"
        ]
      },
      "SmartWalletBulkAdminInvitesResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletBulkAdminInvitesDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "AcceptAdminInviteDataOutput": {
        "type": "object",
        "properties": {
          "adminInvite": {
            "$ref": "#/components/schemas/SmartWalletAdminInviteOutput"
          },
          "proposal": {
            "$ref": "#/components/schemas/SmartWalletProposalOutput"
          },
          "ownerAddress": {
            "type": "object",
            "example": "0x1234567890abcdef1234567890abcdef12345678",
            "nullable": true
          }
        }
      },
      "AcceptAdminInviteResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/AcceptAdminInviteDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "SmartWalletProposalData": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "ADD_MEMBER",
              "REMOVE_MEMBER",
              "ADMIN_DEMOTE_OWNER",
              "CHANGE_THRESHOLD",
              "SWAP"
            ],
            "description": "Kind of proposal to create"
          },
          "toAddress": {
            "type": "string",
            "description": "TRANSFER: recipient wallet address (resolved from `toUserId` if omitted). Must be a 0x-prefixed 20-byte EVM hex address.",
            "example": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          },
          "toUserId": {
            "type": "string",
            "description": "TRANSFER: recipient user ID — the recipient address is resolved server-side."
          },
          "amount": {
            "type": "string",
            "description": "TRANSFER: amount expressed in token decimals as a numeric string.",
            "example": "100.00"
          },
          "currency": {
            "type": "string",
            "description": "TRANSFER: token currency. Required for SME multi-token wallets to disambiguate which token to send.",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ]
          },
          "targetUserId": {
            "type": "string",
            "description": "ADD_MEMBER / REMOVE_MEMBER / ADMIN_DEMOTE_OWNER: target user ID."
          },
          "targetRole": {
            "type": "string",
            "description": "ADD_MEMBER: role to assign on success",
            "enum": [
              "ADMIN",
              "MEMBER"
            ],
            "default": "MEMBER"
          },
          "adminInviteId": {
            "type": "string",
            "description": "ADD_MEMBER: optional admin invite ID this proposal satisfies"
          },
          "newThreshold": {
            "type": "number",
            "description": "CHANGE_THRESHOLD: new signature threshold",
            "minimum": 1
          },
          "newApprovalMode": {
            "type": "string",
            "description": "CHANGE_THRESHOLD: optional approval mode switch",
            "enum": [
              "ANY_ADMIN",
              "ADMIN_THRESHOLD",
              "OWNER_APPROVAL"
            ]
          },
          "fromStablecoin": {
            "type": "string",
            "description": "SWAP: stablecoin to swap from.",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ]
          },
          "toStablecoin": {
            "type": "string",
            "description": "SWAP: stablecoin to swap into.",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ]
          },
          "fromAmount": {
            "type": "string",
            "description": "SWAP: input amount expressed as a decimal string.",
            "example": "100.00"
          },
          "slippageBps": {
            "type": "number",
            "description": "SWAP: acceptable downward drift (basis points) of executed-out vs indicative-out. Between 1 and 500.",
            "minimum": 1,
            "maximum": 500
          },
          "description": {
            "type": "string",
            "description": "Free-form description surfaced in approvers UI"
          }
        },
        "required": [
          "type"
        ]
      },
      "CreateSmartWalletProposalInput": {
        "type": "object",
        "properties": {
          "proposal": {
            "$ref": "#/components/schemas/SmartWalletProposalData"
          }
        },
        "required": [
          "proposal"
        ]
      },
      "SubmitProposalSignatureInput": {
        "type": "object",
        "properties": {
          "signature": {
            "type": "string",
            "description": "ECDSA signature hex. Relay-only proposals: signature over the EIP-712 user operation hash. Multi-sig proposals: signature over the Safe transaction hash."
          }
        },
        "required": [
          "signature"
        ]
      },
      "SmartWalletProposalMutationDataOutput": {
        "type": "object",
        "properties": {
          "proposal": {
            "$ref": "#/components/schemas/SmartWalletProposalOutput"
          }
        }
      },
      "SmartWalletProposalMutationResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletProposalMutationDataOutput"
          }
        }
      },
      "SmartWalletTransactionApprovalOutput": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "object",
            "example": "4b0c6ddd-31e4-4899-8e5a-2a7f0cb31234",
            "nullable": true
          },
          "status": {
            "type": "string",
            "example": "APPROVED"
          },
          "createdAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          }
        }
      },
      "SmartWalletTransactionOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "tx_12345"
          },
          "type": {
            "type": "string",
            "example": "TRANSFER"
          },
          "status": {
            "type": "string",
            "example": "SUCCESS"
          },
          "amount": {
            "type": "string",
            "example": "25.00"
          },
          "currency": {
            "type": "string",
            "example": "USDB"
          },
          "description": {
            "type": "object",
            "example": "Treasury transfer",
            "nullable": true
          },
          "createdAt": {
            "type": "object",
            "example": "2026-04-22T10:15:00.000Z",
            "nullable": true
          },
          "approvals": {
            "description": "Approvals attached to the transaction detail view.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletTransactionApprovalOutput"
            }
          }
        },
        "required": [
          "id"
        ]
      },
      "SmartWalletTransactionsDataOutput": {
        "type": "object",
        "properties": {
          "transactions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SmartWalletTransactionOutput"
            }
          }
        },
        "required": [
          "transactions"
        ]
      },
      "SmartWalletTransactionsResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletTransactionsDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "SmartWalletTransactionDataOutput": {
        "type": "object",
        "properties": {
          "transaction": {
            "$ref": "#/components/schemas/SmartWalletTransactionOutput"
          }
        },
        "required": [
          "transaction"
        ]
      },
      "SmartWalletTransactionResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SmartWalletTransactionDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "OfframpNigeriaInput": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "ID of the Nigerian bank account belonging to the calling user (active admin). Supported wallet currencies: USDB (auto-swapped to NGN) and cNGN (sent directly).",
            "format": "uuid"
          },
          "fromAmount": {
            "type": "string",
            "description": "Amount to offramp expressed as a decimal string (e.g. \"100.00\").",
            "example": "100.00"
          }
        },
        "required": [
          "bankAccountId",
          "fromAmount"
        ]
      },
      "OfframpFeeOutput": {
        "type": "object",
        "properties": {
          "amount": {
            "type": "string",
            "example": "0.30"
          },
          "currency": {
            "type": "string",
            "example": "USD"
          },
          "description": {
            "type": "string",
            "example": "Offramp fee"
          }
        },
        "required": [
          "amount",
          "currency",
          "description"
        ]
      },
      "OfframpQuoteOutput": {
        "type": "object",
        "properties": {
          "fromCurrency": {
            "type": "string",
            "example": "USD",
            "description": "Source currency of the on-chain transfer."
          },
          "toCurrency": {
            "type": "string",
            "example": "NGN",
            "description": "Target currency of the bank payout."
          },
          "amountIn": {
            "type": "string",
            "example": "100.00",
            "description": "Amount of source stablecoin being sent."
          },
          "amountOut": {
            "type": "string",
            "example": "163591.00",
            "description": "Estimated bank payout amount."
          },
          "exchangeRate": {
            "type": "string",
            "example": "1635.91",
            "description": "Exchange rate used (fromCurrency per toCurrency unit)."
          },
          "fees": {
            "description": "Itemised fee breakdown deducted from the transfer.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/OfframpFeeOutput"
            }
          }
        },
        "required": [
          "fromCurrency",
          "toCurrency",
          "amountIn",
          "amountOut",
          "exchangeRate",
          "fees"
        ]
      },
      "OfframpProposalDataOutput": {
        "type": "object",
        "properties": {
          "proposalId": {
            "type": "string",
            "example": "47665949-8654-4461-b52a-3ef3624b1234",
            "description": "ID of the GroupProposal created for this offramp. Use it to approve, sign, and track the proposal lifecycle."
          },
          "status": {
            "type": "string",
            "example": "PENDING_APPROVALS",
            "description": "Initial proposal status. Transitions to PENDING_SIGNATURES once the approval threshold is reached, then COMPLETED after successful on-chain execution and off-chain payout."
          },
          "quote": {
            "$ref": "#/components/schemas/OfframpQuoteOutput"
          }
        },
        "required": [
          "proposalId",
          "status",
          "quote"
        ]
      },
      "OfframpProposalResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/OfframpProposalDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "MigrateToSafeDataOutput": {
        "type": "object",
        "properties": {
          "proposalId": {
            "type": "string",
            "example": "47665949-8654-4461-b52a-3ef3624b1234",
            "description": "ID of the balance-sweep proposal. Use it to fetch the sign payload and submit the signature."
          },
          "proposalStatus": {
            "type": "string",
            "example": "PENDING_APPROVALS",
            "description": "Sweep proposal status. COMPLETED means the smart wallet migrated synchronously (zero balance) with nothing to sign."
          },
          "migrationComplete": {
            "type": "boolean",
            "example": false,
            "description": "True when the migration finished in this call (zero-balance smart wallet). When false, sign `signPayload` and submit it via POST /smart-wallet/proposals/{proposalId}/sign to execute the sweep; the wallet flips to a Safe once the sweep confirms."
          },
          "signPayload": {
            "type": "object",
            "description": "The EVM payload the caller signs to authorise the balance sweep (single owner signature, no other approvals). Absent only when `migrationComplete` is true or `signPayloadPending` is set.",
            "additionalProperties": true
          },
          "signPayloadPending": {
            "type": "boolean",
            "example": false,
            "description": "True when the sign payload was not ready in time to be attached (it is prepared asynchronously after approval). Poll GET /smart-wallet/proposals/{proposalId}/sign-payload, then sign + submit."
          },
          "signPayloadHint": {
            "type": "string",
            "description": "Present with `signPayloadPending` — human-readable next-step guidance."
          },
          "signPayloadError": {
            "type": "string",
            "description": "Present only if fetching the sign payload failed with an unexpected (non-\"not ready\") error."
          }
        },
        "required": [
          "proposalStatus",
          "migrationComplete"
        ]
      },
      "MigrateToSafeResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/MigrateToSafeDataOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "LinkVbaNigeriaInput": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "ID of the Nigerian virtual bank account belonging to the calling user (active admin). Incoming Anchor NGN deposits will be credited to the group smart account instead of the personal wallet.",
            "format": "uuid"
          }
        },
        "required": [
          "bankAccountId"
        ]
      },
      "LinkVbaResponse": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "Bank account that was linked."
          },
          "groupWalletId": {
            "type": "string",
            "description": "Group wallet the account was linked to."
          },
          "linked": {
            "type": "boolean",
            "description": "Whether the account is now linked."
          }
        },
        "required": [
          "bankAccountId",
          "groupWalletId",
          "linked"
        ]
      },
      "LinkVbaEuInput": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "ID of the EU IBAN bank account belonging to the calling user (active admin). Monerium SEPA → EURe routing is reserved for a follow-up release; the linkage is stored now so the account is ready.",
            "format": "uuid"
          }
        },
        "required": [
          "bankAccountId"
        ]
      },
      "UnlinkVbaInput": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "Bank account row ID to unlink from the smart wallet.",
            "format": "uuid"
          },
          "restoreSweepToWalletId": {
            "type": "string",
            "description": "Optional: restore personal-wallet routing by setting sweepToWalletId to this BlockchainWallet.id. Recommended only for Anchor (Nigeria) VBAs."
          }
        },
        "required": [
          "bankAccountId"
        ]
      },
      "UnlinkVbaResponse": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "Bank account that was unlinked."
          },
          "unlinked": {
            "type": "boolean",
            "description": "Whether the account is now unlinked."
          }
        },
        "required": [
          "bankAccountId",
          "unlinked"
        ]
      },
      "ProvisionVbaResponse": {
        "type": "object",
        "properties": {
          "workflowId": {
            "type": "string",
            "description": "Workflow ID for the USD VBA provisioning process.",
            "example": "usd-account-provision-abc123"
          }
        },
        "required": [
          "workflowId"
        ]
      },
      "LinkVbaUsdInput": {
        "type": "object",
        "properties": {
          "bankAccountId": {
            "type": "string",
            "description": "ID of the US virtual bank account belonging to the calling user (active admin). Incoming USD deposits will be credited to the group smart account (USDB onramp) instead of the personal wallet.",
            "format": "uuid"
          }
        },
        "required": [
          "bankAccountId"
        ]
      },
      "PatchOwnerMustSignInput": {
        "type": "object",
        "properties": {
          "ownerMustSign": {
            "type": "boolean",
            "description": "When true, the owner's approval is mandatory for non-owner-initiated proposals on OWNER_APPROVAL wallets; when false, any admin may approve in the owner's place. Only the group owner may change this."
          }
        },
        "required": [
          "ownerMustSign"
        ]
      },
      "ReconcileRoleParityInput": {
        "type": "object",
        "properties": {
          "dryRun": {
            "type": "boolean",
            "description": "When true (default), reports the chat-vs-wallet admin drift without applying any changes.",
            "default": true
          }
        }
      },
      "SendToGroupInput": {
        "type": "object",
        "properties": {
          "fromWalletId": {
            "type": "string",
            "description": "Sender personal wallet ID"
          },
          "amount": {
            "type": "string",
            "description": "Amount to send expressed as a positive decimal string.",
            "example": "100.00"
          },
          "note": {
            "type": "string",
            "description": "Optional note for the transfer"
          },
          "expectedTargetCurrency": {
            "type": "string",
            "description": "If set, the server rejects the request when the resolved group wallet currency differs. Guards against the group changing its wallets between the time the client read the group and the time it sends.",
            "enum": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe",
              "USDC",
              "USDG"
            ]
          }
        },
        "required": [
          "fromWalletId",
          "amount"
        ]
      },
      "SignatureRequestOutput": {
        "type": "object",
        "properties": {
          "method": {
            "type": "string",
            "example": "evm",
            "enum": [
              "evm",
              "solana"
            ],
            "description": "Signing method / chain type"
          },
          "walletIndex": {
            "type": "number",
            "example": 0,
            "description": "Wallet index the signature must come from"
          },
          "workflowId": {
            "type": "string",
            "example": "card-fund-abc123",
            "description": "Temporal workflow ID — pass this back when submitting the signature"
          },
          "hashToSign": {
            "type": "string",
            "example": "0xabcdef…",
            "description": "The UserOperation hash the user must sign"
          },
          "payload": {
            "type": "string",
            "example": "0xabcdef…",
            "description": "Raw payload (equals hashToSign for EVM)"
          },
          "deadline": {
            "type": "string",
            "example": "2026-04-13T12:01:00.000Z",
            "description": "ISO-8601 deadline after which the signature is rejected"
          }
        },
        "required": [
          "method",
          "walletIndex",
          "workflowId",
          "hashToSign",
          "payload",
          "deadline"
        ]
      },
      "SignatureRequestWithQuoteOutput": {
        "type": "object",
        "properties": {
          "signatureRequest": {
            "$ref": "#/components/schemas/SignatureRequestOutput"
          },
          "quote": {
            "type": "object",
            "description": "Exchange-rate quote details (offramp only)",
            "additionalProperties": true
          }
        },
        "required": [
          "signatureRequest"
        ]
      },
      "FundSmartWalletResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true,
            "description": "Upstream endpoints sometimes include an explicit operation result flag."
          },
          "message": {
            "type": "string",
            "example": "Operation completed successfully",
            "description": "Optional upstream message surfaced by the proxy without modification."
          },
          "data": {
            "$ref": "#/components/schemas/SignatureRequestWithQuoteOutput"
          }
        },
        "required": [
          "data"
        ]
      },
      "SupportedSmartWalletCurrenciesOutput": {
        "type": "object",
        "properties": {
          "currencies": {
            "description": "Stablecoin currencies a smart wallet can be denominated in. Use one of these as the `currency` when creating a smart wallet.",
            "example": [
              "USDB",
              "CNGN",
              "CADC",
              "EURe",
              "GBPe",
              "MXNe"
            ],
            "type": "array",
            "items": {
              "type": "array"
            }
          }
        },
        "required": [
          "currencies"
        ]
      },
      "IssuePartnerApiKeyInput": {
        "type": "object",
        "properties": {
          "partnerName": {
            "type": "string",
            "example": "Acme Corporation Ltd"
          },
          "name": {
            "type": "string",
            "example": "Production integration key"
          },
          "environment": {
            "type": "string",
            "enum": [
              "dev",
              "prod"
            ],
            "example": "prod"
          },
          "logo": {
            "type": "string",
            "example": "https://cdn.example.com/logos/acme.png"
          },
          "allowedOrigins": {
            "description": "Allowed CORS origins for this partner key. Requests from these origins will be permitted by the CORS policy. Accepts full origin strings (e.g. https://app.example.com).",
            "example": [
              "https://app.example.com",
              "https://admin.example.com"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "partnerName",
          "name",
          "environment"
        ]
      },
      "IssuedPartnerApiKeyOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "environment": {
            "type": "string",
            "enum": [
              "dev",
              "prod"
            ]
          },
          "logo": {
            "type": "object",
            "nullable": true
          },
          "allowedOrigins": {
            "description": "Allowed CORS origins for this partner key.",
            "example": [
              "https://app.example.com"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "keyPrefix": {
            "type": "string"
          },
          "active": {
            "type": "boolean"
          },
          "lastUsedAt": {
            "type": "object",
            "nullable": true
          },
          "revokedAt": {
            "type": "object",
            "nullable": true
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          },
          "updatedAt": {
            "format": "date-time",
            "type": "string"
          },
          "apiKey": {
            "type": "string",
            "description": "Plaintext API key. Admin users can retrieve this value later while the key is active."
          }
        },
        "required": [
          "id",
          "partnerId",
          "partnerName",
          "name",
          "environment",
          "logo",
          "allowedOrigins",
          "keyPrefix",
          "active",
          "lastUsedAt",
          "revokedAt",
          "createdAt",
          "updatedAt",
          "apiKey"
        ]
      },
      "PartnerApiKeyOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "partnerId": {
            "type": "object",
            "nullable": true
          },
          "partnerName": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "environment": {
            "type": "string",
            "enum": [
              "dev",
              "prod"
            ]
          },
          "logo": {
            "type": "object",
            "nullable": true
          },
          "allowedOrigins": {
            "description": "Allowed CORS origins for this partner key.",
            "example": [
              "https://app.example.com"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "keyPrefix": {
            "type": "string"
          },
          "active": {
            "type": "boolean"
          },
          "lastUsedAt": {
            "type": "object",
            "nullable": true
          },
          "revokedAt": {
            "type": "object",
            "nullable": true
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          },
          "updatedAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "id",
          "partnerId",
          "partnerName",
          "name",
          "environment",
          "logo",
          "allowedOrigins",
          "keyPrefix",
          "active",
          "lastUsedAt",
          "revokedAt",
          "createdAt",
          "updatedAt"
        ]
      },
      "RetrievedPartnerApiKeyOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "apiKey": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "apiKey"
        ]
      },
      "RevokePartnerApiKeyOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Partner API key revoked"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "UpdatePartnerApiKeyOriginsInput": {
        "type": "object",
        "properties": {
          "allowedOrigins": {
            "description": "Full replacement list of allowed CORS origins for this partner key. Accepts full origin strings (e.g. https://app.example.com). Pass an empty array to clear all origins.",
            "example": [
              "https://app.example.com",
              "https://admin.example.com"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "allowedOrigins"
        ]
      },
      "CreateCardInput": {
        "type": "object",
        "properties": {
          "cardName": {
            "type": "string",
            "example": "Payroll Card",
            "maxLength": 50
          },
          "cardColor": {
            "type": "string",
            "example": "#4285F4",
            "description": "Hex color (e.g. #RGB or #RRGGBB)"
          },
          "currency": {
            "type": "string",
            "enum": [
              "NGN",
              "USD"
            ],
            "description": "Card currency"
          },
          "type": {
            "type": "string",
            "enum": [
              "physical",
              "virtual"
            ],
            "description": "Physical or virtual card"
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet that funds this card.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "nin": {
            "type": "string",
            "description": "Card owner's 11-digit Nigerian NIN. Required the first time this owner is issued a card — a never-enrolled owner is enrolled for cards using this NIN. Omitting it for a first-time owner returns 400 E101 (\"Card owner is not enrolled for cards yet\"). Once the owner is enrolled, subsequent cards do not need it.",
            "example": "12345678901"
          },
          "ninIssueDate": {
            "type": "string",
            "description": "Currently unused by the card provider (a NIN has no issue date). Accepted for forward compatibility; safe to omit."
          },
          "ninExpiryDate": {
            "type": "string",
            "description": "Currently unused by the card provider (a NIN has no expiry date). Accepted for forward compatibility; safe to omit."
          },
          "deliveryAddress": {
            "type": "string"
          },
          "state": {
            "type": "string",
            "description": "Nigerian state for physical-card delivery. Required for physical cards in Journey B (no PAN supplied). Accepted in any common spelling — bmoni normalises to canonical names.",
            "example": "Lagos"
          },
          "deliveryState": {
            "type": "string",
            "description": "Free-text state/region for delivery when shipping to non-Nigerian addresses.",
            "example": "California"
          },
          "deliveryPhoneNumber": {
            "type": "string",
            "description": "Nigerian phone number for delivery contact. Accepts +234, 234, or 0-prefixed forms.",
            "example": "+2348012345678"
          },
          "pan": {
            "type": "string",
            "description": "Card PAN (13-19 digits) for Journey A — instant activation when the cardholder already has the physical card in hand. Skips the delivery flow. Omit for Journey B.",
            "example": "5422720311112222"
          },
          "otpChannel": {
            "type": "string",
            "description": "Preferred channel for the activation OTP sent during physical-card flows.",
            "enum": [
              "sms",
              "email"
            ],
            "example": "sms"
          }
        },
        "required": [
          "cardName",
          "cardColor",
          "currency",
          "type",
          "smartWalletId"
        ]
      },
      "CreateCardOutput": {
        "type": "object",
        "properties": {
          "flow": {
            "type": "string",
            "enum": [
              "personal",
              "group"
            ],
            "example": "group"
          },
          "signatureRequest": {
            "type": "object",
            "description": "Personal flow: when a creation fee applies, the client signs this EVM user operation payload.",
            "additionalProperties": true
          },
          "feeAmount": {
            "type": "string",
            "example": "1000"
          },
          "feeCurrency": {
            "type": "string",
            "example": "NGN"
          },
          "workflowId": {
            "type": "string",
            "description": "Personal flow only.",
            "example": "card-creation-user-wallet-virtual-NGN"
          },
          "proposalId": {
            "type": "string",
            "description": "Group flow only: approve + sign this proposal to issue.",
            "example": "b7c9e9a2-6a54-4f24-9a83-2f6f7c1d9e10"
          },
          "proposalStatus": {
            "type": "string",
            "description": "Group flow only.",
            "example": "PENDING_APPROVALS"
          },
          "signPayload": {
            "type": "object",
            "description": "Group flow only: the EVM payload the partner signs to authorise issuance (the proxy auto-approves the proposal and attaches it). Sign this, then POST the signature to /smart-wallet/proposals/{proposalId}/sign. Absent only when `signPayloadPending` is true (see below).",
            "additionalProperties": true
          },
          "signPayloadPending": {
            "type": "boolean",
            "description": "Group flow only: true when the sign payload was not ready in time to be attached (it is prepared asynchronously after approval). When true, poll GET /smart-wallet/proposals/{proposalId}/sign-payload until it returns, then sign + submit. See `signPayloadHint`.",
            "example": false
          },
          "signPayloadHint": {
            "type": "string",
            "description": "Group flow only: present with `signPayloadPending` — human-readable next-step guidance for obtaining and submitting the signature."
          },
          "signPayloadError": {
            "type": "string",
            "description": "Group flow only: present only if fetching the sign payload failed with an unexpected (non-\"not ready\") error — surfaced so the integrator can diagnose rather than seeing a silently missing payload."
          }
        },
        "required": [
          "flow",
          "feeAmount",
          "feeCurrency"
        ]
      },
      "CardCreationStatusOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "workflowId": {
            "type": "string",
            "example": "wf-1"
          },
          "status": {
            "type": "string",
            "example": "completed"
          },
          "cardholderId": {
            "type": "string",
            "example": "ch-1"
          },
          "providerReference": {
            "type": "string",
            "example": "ref-1"
          },
          "cardStatus": {
            "type": "string",
            "example": "ACTIVE"
          }
        },
        "required": [
          "success",
          "workflowId",
          "status"
        ]
      },
      "GetSensitiveDataInput": {
        "type": "object",
        "properties": {
          "identityId": {
            "type": "string",
            "example": "identity-1",
            "description": "Identity ID"
          },
          "cardId": {
            "type": "string",
            "example": "card-1",
            "description": "Card ID"
          }
        },
        "required": [
          "identityId",
          "cardId"
        ]
      },
      "SensitiveDataPayload": {
        "type": "object",
        "properties": {
          "cardNumber": {
            "type": "string",
            "example": "4242424242424242"
          },
          "cvv": {
            "type": "string",
            "example": "123"
          },
          "expiryDate": {
            "type": "string",
            "example": "12/25"
          },
          "postalCode": {
            "type": "string"
          },
          "billingAddress": {
            "type": "string"
          },
          "cardholderName": {
            "type": "string"
          }
        },
        "required": [
          "cardNumber",
          "cvv",
          "expiryDate"
        ]
      },
      "SensitiveCardDataOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "OK"
          },
          "data": {
            "$ref": "#/components/schemas/SensitiveDataPayload"
          }
        },
        "required": [
          "success",
          "message",
          "data"
        ]
      },
      "ActivateCardRequestInput": {
        "type": "object",
        "properties": {
          "pan": {
            "type": "string",
            "description": "Card PAN (13-19 digits). Optional if already available upstream.",
            "example": "5399838383838381"
          },
          "channel": {
            "type": "string",
            "enum": [
              "sms",
              "email"
            ],
            "description": "Channel used to deliver the activation OTP.",
            "example": "sms"
          }
        },
        "required": [
          "channel"
        ]
      },
      "ActivateCardRequestOutput": {
        "type": "object",
        "properties": {
          "otpId": {
            "type": "string",
            "description": "Activation OTP request identifier.",
            "format": "uuid",
            "example": "b9fa08b5-46ae-4d85-9ac2-6ca2f4d91234"
          },
          "expiresInMinutes": {
            "type": "number",
            "description": "OTP validity window in minutes.",
            "example": 10
          }
        },
        "required": [
          "otpId",
          "expiresInMinutes"
        ]
      },
      "ActivateCardConfirmInput": {
        "type": "object",
        "properties": {
          "otpId": {
            "type": "string",
            "description": "OTP request ID returned from the activation request endpoint.",
            "format": "uuid"
          },
          "code": {
            "type": "string",
            "description": "6-digit OTP code sent to the selected channel.",
            "example": "123456"
          }
        },
        "required": [
          "otpId",
          "code"
        ]
      },
      "SuccessMessageOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Operation completed"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "UpdateCardStatusInput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "BLOCKED"
            ],
            "example": "BLOCKED",
            "description": "Set to BLOCKED to freeze or ACTIVE to unfreeze"
          }
        },
        "required": [
          "status"
        ]
      },
      "ResetCardPinInput": {
        "type": "object",
        "properties": {
          "pin": {
            "type": "string",
            "example": "5678",
            "description": "New 4-digit numeric PIN"
          }
        },
        "required": [
          "pin"
        ]
      },
      "ResetPinOutput": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "OK"
          },
          "message": {
            "type": "string",
            "example": "PIN reset successful"
          },
          "success": {
            "type": "boolean",
            "example": true
          }
        },
        "required": [
          "code",
          "message",
          "success"
        ]
      },
      "TransactionItem": {
        "type": "object",
        "properties": {
          "reference": {
            "type": "string",
            "example": "ref-1"
          },
          "createdAt": {
            "type": "string",
            "example": "2026-04-08T10:00:00.000Z"
          },
          "amount": {
            "type": "number",
            "example": 25.5
          },
          "currency": {
            "type": "string",
            "example": "USD"
          },
          "description": {
            "type": "string"
          },
          "direction": {
            "type": "string",
            "example": "debit"
          },
          "settlementAmount": {
            "type": "number"
          },
          "settlementCurrency": {
            "type": "string"
          },
          "fxRate": {
            "type": "number"
          },
          "cardNumberMasked": {
            "type": "string",
            "example": "****4242"
          },
          "cardScheme": {
            "type": "string",
            "example": "MASTERCARD"
          }
        },
        "required": [
          "reference",
          "createdAt",
          "amount",
          "currency",
          "direction"
        ]
      },
      "TransactionsData": {
        "type": "object",
        "properties": {
          "transactions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TransactionItem"
            }
          }
        },
        "required": [
          "transactions"
        ]
      },
      "CardTransactionsOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Transactions retrieved"
          },
          "data": {
            "$ref": "#/components/schemas/TransactionsData"
          }
        },
        "required": [
          "success",
          "message",
          "data"
        ]
      },
      "SetCardLimitsInput": {
        "type": "object",
        "properties": {
          "totalDailyLimit": {
            "type": "number",
            "example": 100000,
            "description": "Maximum total amount that can be spent per day"
          },
          "maxSingleTransactionAmount": {
            "type": "number",
            "example": 50000,
            "description": "Maximum amount for a single transaction"
          }
        },
        "required": [
          "totalDailyLimit",
          "maxSingleTransactionAmount"
        ]
      },
      "SetCardLimitsOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Limits updated"
          },
          "data": {
            "type": "string",
            "nullable": true,
            "example": null,
            "description": "Always null for this endpoint"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "LimitsData": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "string",
            "example": "NGN"
          },
          "totalDailyLimit": {
            "type": "number",
            "example": 100000
          },
          "maxSingleTransactionAmount": {
            "type": "number",
            "example": 50000
          },
          "availableDailyLimit": {
            "type": "number",
            "example": 75000
          },
          "maxTotalDailyLimit": {
            "type": "number",
            "example": 1000000
          },
          "maxSingleTransactionLimitCap": {
            "type": "number",
            "example": 100000
          }
        },
        "required": [
          "currency",
          "totalDailyLimit",
          "maxSingleTransactionAmount",
          "availableDailyLimit",
          "maxTotalDailyLimit",
          "maxSingleTransactionLimitCap"
        ]
      },
      "CardLimitsOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Limits retrieved"
          },
          "data": {
            "$ref": "#/components/schemas/LimitsData"
          }
        },
        "required": [
          "success",
          "message",
          "data"
        ]
      },
      "SetCardPinInput": {
        "type": "object",
        "properties": {
          "pin": {
            "type": "string",
            "example": "1234",
            "description": "A 4-digit numeric PIN"
          }
        },
        "required": [
          "pin"
        ]
      },
      "DeactivateCardOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "example": "Card deactivated"
          },
          "data": {
            "type": "string",
            "nullable": true,
            "example": null,
            "description": "Always null for this endpoint"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "GroupCardItem": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "cbb7b03b-c8f3-4910-87d2-94097cb48a0c"
          },
          "cardName": {
            "type": "object",
            "example": "Lanre Adams 1",
            "nullable": true
          },
          "cardColor": {
            "type": "object",
            "example": "#4285F4",
            "nullable": true
          },
          "currency": {
            "type": "string",
            "example": "NGN"
          },
          "status": {
            "type": "string",
            "example": "ACTIVE"
          },
          "smartWalletId": {
            "type": "string",
            "description": "Smart wallet this card belongs to.",
            "example": "7eeeb692-25a7-40dd-8837-2018fc2e4466"
          },
          "fundingPolicy": {
            "type": "object",
            "description": "Who may fund the card: SAFE, PERSONAL or BOTH.",
            "example": "SAFE",
            "nullable": true
          },
          "fundLifecycle": {
            "type": "object",
            "description": "ONE_TIME cards accept a single funding; REPEATABLE may be funded again.",
            "example": "REPEATABLE",
            "nullable": true
          },
          "fundedAt": {
            "type": "object",
            "description": "First successful funding. Null until the card is funded.",
            "example": "2026-07-29T10:32:00.000Z",
            "nullable": true
          }
        },
        "required": [
          "id",
          "cardName",
          "cardColor",
          "currency",
          "status",
          "smartWalletId",
          "fundingPolicy",
          "fundLifecycle",
          "fundedAt"
        ]
      },
      "ListGroupCardsOutput": {
        "type": "object",
        "properties": {
          "cards": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/GroupCardItem"
            }
          }
        },
        "required": [
          "cards"
        ]
      },
      "GroupCardTransaction": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "b1f0c2de-2a1e-4f10-9c7c-6f5b1a2d3e4f"
          },
          "type": {
            "type": "string",
            "description": "FUND, SPEND, WITHDRAW, …",
            "example": "SPEND"
          },
          "direction": {
            "type": "string",
            "example": "DEBIT"
          },
          "amount": {
            "type": "string",
            "description": "Minor units (kobo for NGN, cents for USD).",
            "example": "250000"
          },
          "merchantName": {
            "type": "object",
            "example": "UBER TRIP",
            "nullable": true
          },
          "description": {
            "type": "object",
            "example": "Card spend",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "example": "2026-07-29T10:32:00.000Z"
          }
        },
        "required": [
          "id",
          "type",
          "direction",
          "amount",
          "merchantName",
          "description",
          "createdAt"
        ]
      },
      "GroupCardDetailOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "cbb7b03b-c8f3-4910-87d2-94097cb48a0c"
          },
          "cardName": {
            "type": "object",
            "example": "Lanre Adams 1",
            "nullable": true
          },
          "cardColor": {
            "type": "object",
            "example": "#4285F4",
            "nullable": true
          },
          "currency": {
            "type": "string",
            "example": "NGN"
          },
          "status": {
            "type": "string",
            "example": "ACTIVE"
          },
          "smartWalletId": {
            "type": "string",
            "description": "Smart wallet this card belongs to.",
            "example": "7eeeb692-25a7-40dd-8837-2018fc2e4466"
          },
          "fundingPolicy": {
            "type": "object",
            "description": "Who may fund the card: SAFE, PERSONAL or BOTH.",
            "example": "SAFE",
            "nullable": true
          },
          "fundLifecycle": {
            "type": "object",
            "description": "ONE_TIME cards accept a single funding; REPEATABLE may be funded again.",
            "example": "REPEATABLE",
            "nullable": true
          },
          "fundedAt": {
            "type": "object",
            "description": "First successful funding. Null until the card is funded.",
            "example": "2026-07-29T10:32:00.000Z",
            "nullable": true
          },
          "balanceMinor": {
            "type": "object",
            "description": "Card balance in minor units. Null when never funded.",
            "example": "250000",
            "nullable": true
          },
          "transactions": {
            "description": "Most recent 100 ledger entries, newest first.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/GroupCardTransaction"
            }
          }
        },
        "required": [
          "id",
          "cardName",
          "cardColor",
          "currency",
          "status",
          "smartWalletId",
          "fundingPolicy",
          "fundLifecycle",
          "fundedAt",
          "balanceMinor",
          "transactions"
        ]
      },
      "GroupCardSensitiveOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "cbb7b03b-c8f3-4910-87d2-94097cb48a0c"
          },
          "providerCardId": {
            "type": "string",
            "example": "blusalt-card-9f21"
          },
          "currency": {
            "type": "string",
            "example": "NGN"
          },
          "status": {
            "type": "string",
            "example": "ACTIVE"
          },
          "cardName": {
            "type": "object",
            "example": "Lanre Adams 1",
            "nullable": true
          }
        },
        "required": [
          "id",
          "providerCardId",
          "currency",
          "status"
        ]
      },
      "NigerianDepositAccountOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique bank account identifier.",
            "example": "ba_abc123"
          },
          "accountName": {
            "type": "string",
            "description": "Name on the bank account.",
            "example": "John Doe"
          },
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "Access Bank"
          },
          "currency": {
            "type": "string",
            "description": "Account currency.",
            "example": "NGN"
          },
          "depositMessage": {
            "type": "string",
            "description": "Deposit reference message required when sending to shared accounts.",
            "example": "REF-12345"
          },
          "accountNumber": {
            "type": "string",
            "description": "Bank account number.",
            "example": "0123456789"
          },
          "bankCode": {
            "type": "string",
            "description": "CBN bank code.",
            "example": "044"
          },
          "targetCurrency": {
            "type": "string",
            "description": "Stablecoin credited to the wallet when funds arrive at this account.",
            "example": "USDB"
          }
        },
        "required": [
          "id",
          "accountName",
          "bankName",
          "currency",
          "accountNumber",
          "bankCode",
          "targetCurrency"
        ]
      },
      "EuropeanDepositAccountOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique bank account identifier.",
            "example": "ba_abc123"
          },
          "accountName": {
            "type": "string",
            "description": "Name on the bank account.",
            "example": "John Doe"
          },
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "Access Bank"
          },
          "currency": {
            "type": "string",
            "description": "Account currency.",
            "example": "EUR"
          },
          "depositMessage": {
            "type": "string",
            "description": "Deposit reference message required when sending to shared accounts.",
            "example": "REF-12345"
          },
          "iban": {
            "type": "string",
            "description": "IBAN for SEPA transfers.",
            "example": "DE89370400440532013000"
          },
          "swiftCode": {
            "type": "string",
            "description": "SWIFT/BIC code for international transfers.",
            "example": "COBADEFFXXX"
          },
          "bicCode": {
            "type": "object",
            "description": "BIC code.",
            "example": "COBADEFF",
            "nullable": true
          },
          "targetCurrency": {
            "type": "string",
            "description": "Stablecoin credited to the wallet when funds arrive at this account.",
            "example": "EURC"
          },
          "status": {
            "type": "string",
            "description": "Current account status.",
            "enum": [
              "active",
              "inactive",
              "pending"
            ],
            "example": "active"
          }
        },
        "required": [
          "id",
          "accountName",
          "bankName",
          "currency",
          "iban",
          "swiftCode",
          "targetCurrency"
        ]
      },
      "DepositAccountsOutput": {
        "type": "object",
        "properties": {
          "nigerianAccounts": {
            "description": "Nigerian NGN virtual bank accounts for onramping.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NigerianDepositAccountOutput"
            }
          },
          "activationAccounts": {
            "description": "Static Nigerian activation accounts backed by Anchor pooled VBAs.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NigerianDepositAccountOutput"
            }
          },
          "europeanAccounts": {
            "description": "European SEPA accounts for EUR onramping.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EuropeanDepositAccountOutput"
            }
          }
        },
        "required": [
          "nigerianAccounts",
          "activationAccounts",
          "europeanAccounts"
        ]
      },
      "NigerianWithdrawalAccountOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique bank account identifier.",
            "example": "ba_abc123"
          },
          "accountName": {
            "type": "string",
            "description": "Name on the bank account.",
            "example": "John Doe"
          },
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "Access Bank"
          },
          "currency": {
            "type": "string",
            "description": "Account currency.",
            "example": "NGN"
          },
          "depositMessage": {
            "type": "string",
            "description": "Deposit reference message required when sending to shared accounts.",
            "example": "REF-12345"
          },
          "accountNumber": {
            "type": "string",
            "description": "Bank account number.",
            "example": "0123456789"
          },
          "bankCode": {
            "type": "string",
            "description": "CBN bank code.",
            "example": "044"
          }
        },
        "required": [
          "id",
          "accountName",
          "bankName",
          "currency",
          "accountNumber",
          "bankCode"
        ]
      },
      "EuropeanWithdrawalAccountOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique bank account identifier.",
            "example": "ba_eu_123"
          },
          "firstName": {
            "type": "string",
            "description": "Account holder first name.",
            "example": "Jane"
          },
          "lastName": {
            "type": "string",
            "description": "Account holder last name.",
            "example": "Doe"
          },
          "country": {
            "type": "string",
            "description": "ISO 3166-1 alpha-2 country code.",
            "example": "DE"
          },
          "iban": {
            "type": "string",
            "description": "IBAN for SEPA transfers.",
            "example": "DE89370400440532013000"
          }
        },
        "required": [
          "id",
          "firstName",
          "lastName",
          "country",
          "iban"
        ]
      },
      "WithdrawalAccountsOutput": {
        "type": "object",
        "properties": {
          "nigerianAccounts": {
            "description": "Nigerian bank accounts for NGN offramping.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NigerianWithdrawalAccountOutput"
            }
          },
          "europeanAccounts": {
            "description": "European SEPA counterparties for EUR offramping.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EuropeanWithdrawalAccountOutput"
            }
          }
        },
        "required": [
          "nigerianAccounts",
          "europeanAccounts"
        ]
      },
      "BankAccountsOutput": {
        "type": "object",
        "properties": {
          "depositAccounts": {
            "description": "Virtual bank accounts across all supported rails. Sending funds to these accounts credits the corresponding user wallet.",
            "allOf": [
              {
                "$ref": "#/components/schemas/DepositAccountsOutput"
              }
            ]
          },
          "withdrawalAccounts": {
            "description": "Saved payout destinations across all supported rails. These are used when the user withdraws from their wallet to a bank account.",
            "allOf": [
              {
                "$ref": "#/components/schemas/WithdrawalAccountsOutput"
              }
            ]
          }
        },
        "required": [
          "depositAccounts",
          "withdrawalAccounts"
        ]
      },
      "DepositAccountsByCurrencyOutput": {
        "type": "object",
        "properties": {
          "accounts": {
            "type": "array",
            "description": "Deposit accounts for the requested currency. For NGN this includes both regular and activation accounts.",
            "items": {
              "type": "object",
              "additionalProperties": true
            }
          }
        },
        "required": [
          "accounts"
        ]
      },
      "WithdrawalAccountsByCurrencyOutput": {
        "type": "object",
        "properties": {
          "accounts": {
            "type": "array",
            "description": "Withdrawal accounts for the requested currency.",
            "items": {
              "type": "object",
              "additionalProperties": true
            }
          }
        },
        "required": [
          "accounts"
        ]
      },
      "CreateNigerianWithdrawalAccountInput": {
        "type": "object",
        "properties": {
          "accountNumber": {
            "type": "string",
            "description": "Nigerian NUBAN account number. Must be exactly 10 digits. Use the verify-nigerian-account endpoint first to confirm the number is valid and retrieve the account holder name.",
            "example": "0123456789"
          },
          "bankCode": {
            "type": "string",
            "description": "CBN bank code identifying the destination bank. Use the nigerian-banks endpoint to get the full list of supported codes.",
            "example": "058"
          },
          "bankName": {
            "type": "string",
            "description": "Full name of the destination bank, as returned by the nigerian-banks endpoint.",
            "example": "Guaranty Trust Bank"
          },
          "accountHolderName": {
            "type": "string",
            "description": "Full name of the account holder. Use the verify-nigerian-account endpoint to retrieve the exact registered name.",
            "example": "Jane Doe"
          }
        },
        "required": [
          "accountNumber",
          "bankCode",
          "bankName",
          "accountHolderName"
        ]
      },
      "NigerianBankOutput": {
        "type": "object",
        "properties": {
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "GTBank"
          },
          "bankCode": {
            "type": "string",
            "description": "CBN bank code used when creating withdrawal accounts.",
            "example": "058"
          }
        },
        "required": [
          "bankName",
          "bankCode"
        ]
      },
      "NigerianBanksOutput": {
        "type": "object",
        "properties": {
          "banks": {
            "description": "Supported Nigerian banks.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NigerianBankOutput"
            }
          }
        },
        "required": [
          "banks"
        ]
      },
      "VerifyNigerianAccountInput": {
        "type": "object",
        "properties": {
          "bankCode": {
            "type": "string",
            "description": "CBN bank code of the bank that holds the account. Use the nigerian-banks endpoint to retrieve valid codes.",
            "example": "058"
          },
          "accountNumber": {
            "type": "string",
            "description": "Nigerian NUBAN account number to verify. Must be exactly 10 digits.",
            "example": "0123456789"
          }
        },
        "required": [
          "bankCode",
          "accountNumber"
        ]
      },
      "VerifyNigerianAccountOutput": {
        "type": "object",
        "properties": {
          "accountNumber": {
            "type": "string",
            "description": "The verified 10-digit account number.",
            "example": "0123456789"
          },
          "accountName": {
            "type": "string",
            "description": "Account holder's full name as held at the bank.",
            "example": "John Doe"
          },
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "GTBank"
          },
          "bankCode": {
            "type": "string",
            "description": "CBN bank code.",
            "example": "058"
          }
        },
        "required": [
          "accountNumber",
          "accountName",
          "bankName",
          "bankCode"
        ]
      },
      "DeactivateAccountOutput": {
        "type": "object",
        "properties": {
          "ok": {
            "type": "boolean",
            "description": "Indicates the account was deactivated successfully.",
            "example": true
          }
        },
        "required": [
          "ok"
        ]
      },
      "UsdAccountOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique bank account identifier.",
            "example": "ba_usd_123"
          },
          "accountName": {
            "type": "string",
            "description": "Name on the bank account.",
            "example": "John Doe"
          },
          "accountNumber": {
            "type": "string",
            "description": "US bank account number.",
            "example": "123456789"
          },
          "routingNumber": {
            "type": "string",
            "description": "ABA routing number.",
            "example": "021000021"
          },
          "bankName": {
            "type": "string",
            "description": "Bank name.",
            "example": "Lead Bank"
          },
          "bankAddress": {
            "type": "object",
            "description": "Bank mailing address.",
            "example": "1801 Main St, Kansas City, MO 64108",
            "nullable": true
          },
          "swiftCode": {
            "type": "object",
            "description": "SWIFT/BIC code.",
            "example": "LEADUS44",
            "nullable": true
          },
          "currency": {
            "type": "string",
            "description": "Account currency.",
            "example": "USD"
          },
          "accountType": {
            "type": "string",
            "description": "Account type.",
            "example": "checking"
          },
          "depositMessage": {
            "type": "object",
            "description": "Deposit reference message, when the account requires one.",
            "example": "REF-12345",
            "nullable": true
          }
        },
        "required": [
          "id",
          "accountName",
          "accountNumber",
          "routingNumber",
          "bankName",
          "currency",
          "accountType"
        ]
      },
      "UsdAccountStatusOutput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "description": "Lifecycle of the user USD virtual bank account. `none` (no account — show the provision CTA), `provisioning` (workflow running), `pending` (issued, awaiting bank backfill), `active` (ready — `account` populated), `rejected` (declined — `reason` populated), `failed` (provisioning did not complete — retry).",
            "enum": [
              "none",
              "provisioning",
              "failed",
              "active",
              "pending",
              "rejected"
            ],
            "example": "active"
          },
          "account": {
            "description": "Account details. Populated only when `status` is `active`.",
            "nullable": true,
            "type": "object",
            "allOf": [
              {
                "$ref": "#/components/schemas/UsdAccountOutput"
              }
            ]
          },
          "reason": {
            "type": "object",
            "description": "Rejection reason. Populated only when `status` is `rejected`.",
            "example": null,
            "nullable": true
          }
        },
        "required": [
          "status"
        ]
      },
      "TransactionReceiptPdfInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "Smart wallet that owns the transaction. The wallet must belong to the user in the path.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "transactionId": {
            "type": "string",
            "description": "Transaction to render as a PDF receipt.",
            "example": "txn_123"
          },
          "timezone": {
            "type": "string",
            "description": "IANA timezone used when rendering dates on the receipt. Use UTC if the user has no preferred timezone.",
            "example": "UTC"
          }
        },
        "required": [
          "smartWalletId",
          "transactionId",
          "timezone"
        ]
      },
      "GroupWalletReceiptPdfInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "Group smart wallet that owns the transaction. The wallet must belong to the user in the path.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "transactionId": {
            "type": "string",
            "description": "Transaction to render as a PDF receipt.",
            "example": "txn_123"
          },
          "timezone": {
            "type": "string",
            "description": "IANA timezone used when rendering dates on the receipt. Use UTC if the user has no preferred timezone.",
            "example": "UTC"
          }
        },
        "required": [
          "smartWalletId",
          "transactionId",
          "timezone"
        ]
      },
      "UserTransactionItemOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique transaction identifier.",
            "example": "txn_abc123"
          },
          "direction": {
            "type": "string",
            "description": "Direction of the transaction relative to the acting user. \"from\" means the other user sent funds to the acting user; \"to\" means the acting user sent funds to the other user.",
            "enum": [
              "from",
              "to"
            ],
            "example": "to"
          },
          "amount": {
            "type": "string",
            "description": "Transaction amount.",
            "example": "50.00"
          },
          "currency": {
            "type": "string",
            "description": "Currency of the transaction.",
            "enum": [
              "USD",
              "EUR",
              "NGN",
              "CNY",
              "CAD",
              "GBP",
              "MXN"
            ],
            "example": "USD"
          },
          "timestamp": {
            "type": "string",
            "description": "ISO 8601 timestamp when the transaction occurred.",
            "example": "2026-04-28T18:00:00.000Z"
          }
        },
        "required": [
          "id",
          "direction",
          "amount",
          "currency",
          "timestamp"
        ]
      },
      "OtherUserOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "bmoniUserId of the other user.",
            "example": "usr_xyz789"
          },
          "name": {
            "type": "string",
            "description": "Display name of the other user.",
            "example": "Jane Doe"
          },
          "phoneNumber": {
            "type": "string",
            "description": "Phone number of the other user.",
            "example": "+2348012345678"
          }
        },
        "required": [
          "id",
          "name",
          "phoneNumber"
        ]
      },
      "UserTransactionsOutput": {
        "type": "object",
        "properties": {
          "transactions": {
            "description": "List of transactions between the acting user and the other user.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UserTransactionItemOutput"
            }
          },
          "count": {
            "type": "number",
            "description": "Total number of transactions returned.",
            "example": 12
          },
          "otherUser": {
            "description": "Details of the other user in the transactions.",
            "allOf": [
              {
                "$ref": "#/components/schemas/OtherUserOutput"
              }
            ]
          }
        },
        "required": [
          "transactions",
          "count",
          "otherUser"
        ]
      },
      "TransactionFeeOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique fee record identifier.",
            "example": "fee_123"
          },
          "type": {
            "type": "string",
            "description": "Fee category. Exchange premium fees are excluded from this endpoint.",
            "example": "NETWORK"
          },
          "amount": {
            "type": "string",
            "description": "Fee amount represented as a decimal string to preserve precision.",
            "example": "1.25"
          },
          "currency": {
            "type": "string",
            "description": "Currency for this fee amount.",
            "example": "USD"
          },
          "description": {
            "type": "string",
            "description": "Human-readable fee description for receipts or UI display.",
            "example": "Network processing fee"
          }
        },
        "required": [
          "id",
          "type",
          "amount",
          "currency",
          "description"
        ]
      },
      "TransactionFeesValueOutput": {
        "type": "object",
        "properties": {
          "fees": {
            "description": "Individual visible fees charged for the transaction.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TransactionFeeOutput"
            }
          },
          "totalFees": {
            "type": "object",
            "description": "Total visible fees grouped by currency, using decimal strings for precision.",
            "example": {
              "USD": "1.25"
            }
          }
        },
        "required": [
          "fees",
          "totalFees"
        ]
      },
      "TransactionFeesOutput": {
        "type": "object",
        "properties": {
          "ok": {
            "type": "boolean",
            "description": "Indicates whether the upstream request completed successfully.",
            "example": true
          },
          "value": {
            "description": "Fee details and per-currency totals for the transaction.",
            "allOf": [
              {
                "$ref": "#/components/schemas/TransactionFeesValueOutput"
              }
            ]
          }
        },
        "required": [
          "ok",
          "value"
        ]
      },
      "FailureMessageOutput": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "example": "Transaction Failed"
          },
          "body": {
            "type": "string",
            "example": "The network rejected this transaction."
          },
          "fundsAreSafe": {
            "type": "boolean",
            "description": "Whether the user funds are safe despite the failure.",
            "example": true
          }
        },
        "required": [
          "title",
          "body",
          "fundsAreSafe"
        ]
      },
      "TransactionItemOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique transaction identifier.",
            "example": "txn_abc123"
          },
          "direction": {
            "type": "string",
            "description": "Direction of the transaction relative to the wallet. Incoming means funds arrived; outgoing means funds left.",
            "enum": [
              "incoming",
              "outgoing"
            ],
            "example": "outgoing"
          },
          "delta": {
            "type": "string",
            "description": "Signed amount change on the wallet. Negative for outgoing, positive for incoming.",
            "example": "-50.00"
          },
          "amount": {
            "type": "string",
            "description": "Absolute transaction amount without sign.",
            "example": "50.00"
          },
          "currency": {
            "type": "string",
            "description": "Currency of the transaction, such as USD or NGN.",
            "example": "USD"
          },
          "status": {
            "type": "string",
            "description": "Current processing state of the transaction.",
            "enum": [
              "pending",
              "processing",
              "completed",
              "failed",
              "cancelled",
              "expired",
              "refunded",
              "pending_review",
              "rejected"
            ],
            "example": "completed"
          },
          "counterpartyId": {
            "type": "string",
            "description": "ID of the counterparty wallet or account.",
            "example": "wallet_xyz"
          },
          "counterpartyType": {
            "type": "string",
            "description": "Type of the counterparty account.",
            "enum": [
              "wallet",
              "nigeria",
              "eu",
              "us",
              "crypto",
              "cash",
              "phone",
              "china",
              "bank",
              "fee"
            ],
            "example": "wallet"
          },
          "counterpartyName": {
            "type": "string",
            "description": "Display name of the counterparty.",
            "example": "Jane Doe"
          },
          "senderName": {
            "type": "string",
            "description": "Display name of the sender.",
            "example": "John Smith"
          },
          "receiverName": {
            "type": "string",
            "description": "Display name of the receiver.",
            "example": "Jane Doe"
          },
          "receiverBankName": {
            "type": "string",
            "description": "Bank name of the receiver for offramp transactions.",
            "example": "Access Bank"
          },
          "receiverBankAccount": {
            "type": "string",
            "description": "Bank account number of the receiver for offramp transactions.",
            "example": "0123456789"
          },
          "purpose": {
            "type": "string",
            "description": "Purpose of the transaction, used for China offramp.",
            "example": "Goods payment"
          },
          "beneficiaryCountry": {
            "type": "string",
            "description": "Country of the beneficiary, used for China offramp.",
            "example": "CHN"
          },
          "counterpartyAmount": {
            "type": "string",
            "description": "Amount on the counterparty side when a currency conversion occurred.",
            "example": "45000.00"
          },
          "counterpartyCurrency": {
            "type": "string",
            "description": "Currency of the counterparty amount.",
            "example": "NGN"
          },
          "exchangeRate": {
            "type": "string",
            "description": "Exchange rate applied to the transaction. Returns 1 when no conversion occurred.",
            "example": "1500.00"
          },
          "description": {
            "type": "string",
            "description": "Human-readable transaction description for display.",
            "example": "Transfer to Jane Doe"
          },
          "note": {
            "type": "object",
            "description": "Optional note entered by the user when creating the transaction.",
            "example": "Rent payment",
            "nullable": true
          },
          "failureType": {
            "type": "string",
            "description": "Classified failure reason. Only present when status is failed.",
            "enum": [
              "GAS",
              "PARTNER",
              "SIGNING",
              "UNKNOWN"
            ],
            "nullable": true
          },
          "failureMessage": {
            "description": "User-facing failure details including a title, body, and whether funds are safe. Only present when status is failed.",
            "nullable": true,
            "type": "object",
            "allOf": [
              {
                "$ref": "#/components/schemas/FailureMessageOutput"
              }
            ]
          },
          "createdAt": {
            "type": "string",
            "description": "ISO 8601 timestamp when the transaction was created.",
            "example": "2026-04-28T18:00:00.000Z"
          },
          "narrationType": {
            "type": "string",
            "description": "Narration type used for UI categorisation and icon selection.",
            "enum": [
              "fund_bank",
              "fund_friend",
              "fund_external_wallet",
              "fund_card",
              "send_to_bank",
              "send_to_friend",
              "send_to_external_wallet",
              "send_to_card",
              "card_issuing",
              "card_transaction_charge",
              "card_monthly_maintenance",
              "card_pin_change_fee",
              "reversed_bank_or_card",
              "refunded_card",
              "swap_between_wallets",
              "service_fee",
              "payout_naira",
              "stamp_duty_naira",
              "external_wallet_deposit",
              "external_wallet_withdrawal",
              "payout_china_rmb",
              "payout_china_usd",
              "payout_china_ngn",
              "payout_us",
              "payout_uk",
              "payout_eu",
              "payout_canada",
              "cash_deposit",
              "cash_withdrawal"
            ],
            "example": "send_to_friend"
          }
        },
        "required": [
          "id",
          "direction",
          "delta",
          "amount",
          "currency",
          "status",
          "description",
          "createdAt",
          "narrationType"
        ]
      },
      "WalletTransactionsOutput": {
        "type": "object",
        "properties": {
          "transactions": {
            "description": "List of transactions for the wallet.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TransactionItemOutput"
            }
          },
          "count": {
            "type": "number",
            "description": "Total number of transactions returned.",
            "example": 42
          }
        },
        "required": [
          "transactions",
          "count"
        ]
      },
      "MarkAnnouncementReadInput": {
        "type": "object",
        "properties": {
          "announcementId": {
            "type": "string",
            "description": "Announcement ID to mark as read for the calling user.",
            "example": "b9f7-...uuid"
          }
        },
        "required": [
          "announcementId"
        ]
      },
      "WalletNigeriaWithdrawalInput": {
        "type": "object",
        "properties": {
          "sourceSmartWalletId": {
            "type": "string",
            "description": "ID of the source smart wallet to offramp from.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "bankAccountId": {
            "type": "string",
            "description": "ID of the Nigerian bank account belonging to the calling user.",
            "format": "uuid"
          },
          "fromAmount": {
            "type": "string",
            "description": "Amount to offramp expressed as a decimal string (e.g. \"100.00\").",
            "example": "100.00"
          }
        },
        "required": [
          "sourceSmartWalletId",
          "bankAccountId",
          "fromAmount"
        ]
      },
      "OfframpWithSignPayloadResponse": {
        "type": "object",
        "properties": {
          "proposalId": {
            "type": "string",
            "example": "47665949-8654-4461-b52a-3ef3624b1234",
            "description": "ID of the offramp proposal. Use this to submit the signature via POST .../proposals/:proposalId/sign."
          },
          "signPayload": {
            "type": "object",
            "description": "EIP-712 typed-data sign payload returned by the upstream. Sign the `typedData` (or `hashToSign` for EVM) with the `userOwnerAddress` private key and submit via POST .../proposals/:proposalId/sign. Absent when `signPayloadPending` is true.",
            "additionalProperties": true
          },
          "signPayloadPending": {
            "type": "boolean",
            "description": "True when the sign payload was not ready within the request — it is prepared asynchronously after approval. Poll GET .../smart-wallets/proposals/:proposalId/sign-payload to retrieve it. The proposal is created and approved regardless."
          },
          "signPayloadHint": {
            "type": "string",
            "description": "Present with `signPayloadPending` — human-readable next step for the partner (which endpoint to poll, then sign and submit)."
          },
          "signPayloadError": {
            "type": "string",
            "description": "Present with `signPayloadPending` only when the payload fetch failed for a genuine (non-transient) reason — the error message from upstream."
          }
        },
        "required": [
          "proposalId"
        ]
      },
      "SmartWalletCryptoWithdrawalInput": {
        "type": "object",
        "properties": {
          "sourceSmartWalletId": {
            "type": "string",
            "description": "ID of the source smart wallet to offramp from.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "destinationChain": {
            "type": "string",
            "description": "Destination blockchain network.",
            "example": "Base"
          },
          "destinationCurrency": {
            "type": "string",
            "description": "Destination token/currency on the chain.",
            "example": "USDC"
          },
          "destinationAddress": {
            "type": "string",
            "description": "Destination address on the external chain.",
            "example": "0x1234abcd…"
          },
          "amount": {
            "type": "string",
            "description": "Amount to offramp expressed as a decimal string (e.g. \"100.00\").",
            "example": "100.00"
          }
        },
        "required": [
          "sourceSmartWalletId",
          "destinationChain",
          "destinationCurrency",
          "destinationAddress",
          "amount"
        ]
      },
      "CardWithdrawalInput": {
        "type": "object",
        "properties": {
          "cardId": {
            "type": "string"
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet to credit when withdrawing from card.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "amount": {
            "type": "number"
          },
          "currency": {
            "type": "string",
            "enum": [
              "NGN",
              "USD"
            ]
          }
        },
        "required": [
          "cardId",
          "smartWalletId",
          "amount",
          "currency"
        ]
      },
      "CardWithdrawalOutput": {
        "type": "object",
        "properties": {
          "transactionId": {
            "type": "string",
            "description": "Transaction ID that can be used to track the card withdrawal in the transaction history.",
            "example": "txn_abc123"
          },
          "workflowId": {
            "type": "string",
            "description": "Internal workflow ID used to track the withdrawal processing.",
            "example": "wf_xyz789"
          },
          "status": {
            "type": "string",
            "description": "Initial processing state of the withdrawal.",
            "enum": [
              "PENDING",
              "PROCESSING"
            ],
            "example": "PENDING"
          },
          "message": {
            "type": "string",
            "description": "Human-readable status message.",
            "example": "Card withdrawal initiated successfully"
          }
        },
        "required": [
          "transactionId",
          "workflowId",
          "status",
          "message"
        ]
      },
      "WalletDepositInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet to credit once the deposit is detected.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "chain": {
            "type": "string",
            "enum": [
              "Arbitrum",
              "Avalanche",
              "Base",
              "Ethereum",
              "Optimism",
              "Polygon",
              "Solana",
              "Stellar",
              "Tron"
            ]
          },
          "currency": {
            "type": "string",
            "enum": [
              "DAI",
              "EURC",
              "PYUSD",
              "USDB",
              "USDC",
              "USDP",
              "USDT"
            ]
          }
        },
        "required": [
          "smartWalletId",
          "chain",
          "currency"
        ]
      },
      "WalletDepositOutput": {
        "type": "object",
        "properties": {
          "address": {
            "type": "string",
            "description": "Blockchain address the user should send funds to. Funds sent to this address will be credited to the user wallet.",
            "example": "0x1234567890abcdef1234567890abcdef12345678"
          },
          "chain": {
            "type": "string",
            "description": "Blockchain network the deposit address belongs to.",
            "enum": [
              "Arbitrum",
              "Avalanche",
              "Base",
              "Ethereum",
              "Optimism",
              "Polygon",
              "Solana",
              "Stellar",
              "Tron"
            ],
            "example": "Base"
          },
          "currency": {
            "type": "string",
            "description": "Stablecoin currency expected at the deposit address.",
            "enum": [
              "DAI",
              "EURC",
              "PYUSD",
              "USDB",
              "USDC",
              "USDP",
              "USDT"
            ],
            "example": "USDC"
          }
        },
        "required": [
          "address",
          "chain",
          "currency"
        ]
      },
      "CardDepositInput": {
        "type": "object",
        "properties": {
          "cardId": {
            "type": "string"
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet that will fund the card.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "amount": {
            "type": "number"
          },
          "currency": {
            "type": "string",
            "enum": [
              "NGN",
              "USD"
            ]
          }
        },
        "required": [
          "cardId",
          "smartWalletId",
          "amount",
          "currency"
        ]
      },
      "ChainAssetsOutput": {
        "type": "object",
        "properties": {
          "chain": {
            "type": "string",
            "description": "Blockchain network the listed tokens can be deposited from.",
            "example": "Base"
          },
          "currencies": {
            "description": "Tokens that can be deposited from this chain.",
            "example": [
              "USDC"
            ],
            "type": "array",
            "items": {
              "type": "array"
            }
          }
        },
        "required": [
          "chain",
          "currencies"
        ]
      },
      "SupportedDepositAssetsOutput": {
        "type": "object",
        "properties": {
          "items": {
            "description": "Enabled deposit chains, each with its supported tokens.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ChainAssetsOutput"
            }
          }
        },
        "required": [
          "items"
        ]
      },
      "EmployeeKycInput": {
        "type": "object",
        "properties": {
          "profile": {
            "description": "Full KYC profile the employer holds. Same shape as `PATCH /v1/users/:userId/kyc` — submitted to /kyc/profile when the employee verifies the linkage OTP.",
            "example": {
              "personalInfo": {
                "firstName": "Chiamaka",
                "lastName": "Okafor",
                "middleName": "Ngozi",
                "dateOfBirth": "1990-01-15",
                "gender": "female",
                "nationality": "MX",
                "placeOfBirth": "Mexico City",
                "phoneNumber": "+5215555555555"
              },
              "address": {
                "streetLine1": "Av. Insurgentes Sur 123",
                "streetLine2": "Piso 4",
                "city": "Mexico City",
                "state": "CDMX",
                "postalCode": "03100",
                "countryCode": "MEX"
              },
              "employment": {
                "employmentStatus": "employed",
                "occupationCode": "15-1252",
                "employerName": "Allora HR"
              },
              "sourceOfFunds": "salary",
              "estimatedMonthlyVolume": 5000,
              "accountPurpose": "personal",
              "actingAsIntermediary": false,
              "identificationNumbers": [
                {
                  "type": "curp",
                  "number": "OKAC900115MDFXYZ01",
                  "issuingCountryCode": "MEX"
                }
              ]
            },
            "allOf": [
              {
                "$ref": "#/components/schemas/UpdateKycInput"
              }
            ]
          },
          "activate": {
            "description": "When present, KYC verification is triggered (/kyc/activate) right after the profile is submitted on linkage. Include sumsubLevelName for users whose country resolves to SumSub.",
            "allOf": [
              {
                "$ref": "#/components/schemas/ActivateKycInput"
              }
            ]
          }
        }
      },
      "InviteEmployeeInput": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "The employee's full name, used in the invitation email.",
            "example": "Chiamaka Okafor"
          },
          "email": {
            "type": "string",
            "description": "The employee's work email. The invitation (deep link + QR code) is sent here, and it later receives the verification OTP.",
            "example": "chiamaka.okafor@allora.mx"
          },
          "kyc": {
            "description": "Employer-held KYC data, collected up front and submitted on the employee's OTP linkage. Document images are not part of this payload — they follow the existing /kyc/documents/* flow after linkage.",
            "allOf": [
              {
                "$ref": "#/components/schemas/EmployeeKycInput"
              }
            ]
          }
        },
        "required": [
          "name",
          "email"
        ]
      },
      "InviteEmployeeOutput": {
        "type": "object",
        "properties": {
          "sent": {
            "type": "boolean",
            "description": "Whether the invitation email was sent."
          },
          "inviteUrl": {
            "type": "string",
            "description": "The per-employee invitation deep link encoded in the email.",
            "example": "https://app.bmoni.com/app/invite?partnerSource=allora&employeeRef=chiamaka.okafor%40allora.mx"
          },
          "error": {
            "type": "string",
            "description": "Present when the email could not be sent (e.g. provider rejected it)."
          }
        },
        "required": [
          "sent",
          "inviteUrl"
        ]
      },
      "BatchEmployeesInput": {
        "type": "object",
        "properties": {
          "employees": {
            "description": "Roster rows to upsert (max 500 per request). Same row shape as the single invite endpoint.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/InviteEmployeeInput"
            }
          }
        },
        "required": [
          "employees"
        ]
      },
      "BatchEmployeeRowResult": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "example": "chiamaka.okafor@allora.mx"
          },
          "status": {
            "type": "string",
            "enum": [
              "created",
              "updated",
              "rejected"
            ],
            "description": "'created' — new invitation row; 'updated' — existing row refreshed; 'rejected' — row not persisted (see reason)."
          },
          "reason": {
            "type": "string",
            "description": "Why the row was rejected, when applicable."
          }
        },
        "required": [
          "email",
          "status"
        ]
      },
      "BatchEmployeesOutput": {
        "type": "object",
        "properties": {
          "results": {
            "description": "One result per submitted row, in input order.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BatchEmployeeRowResult"
            }
          }
        },
        "required": [
          "results"
        ]
      },
      "EmployeeInvitationOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          "name": {
            "type": "string",
            "example": "Chiamaka Okafor"
          },
          "email": {
            "type": "string",
            "example": "chiamaka.okafor@allora.mx"
          },
          "status": {
            "type": "string",
            "enum": [
              "INVITED",
              "LINKED",
              "UNLINKED"
            ]
          },
          "linkedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "unlinkedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "id",
          "name",
          "email",
          "status",
          "createdAt"
        ]
      },
      "ListEmployeesOutput": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EmployeeInvitationOutput"
            }
          },
          "total": {
            "type": "number",
            "example": 42
          }
        },
        "required": [
          "data",
          "total"
        ]
      },
      "OffboardEmployeeOutput": {
        "type": "object",
        "properties": {
          "invitationId": {
            "type": "string",
            "example": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          "result": {
            "type": "string",
            "enum": [
              "invite_cancelled",
              "unlinked"
            ],
            "description": "'invite_cancelled' — the not-yet-linked invitation was deleted; 'unlinked' — the linked employee was marked UNLINKED and the employee.unlinked webhook emitted."
          },
          "unlinkedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "invitationId",
          "result"
        ]
      },
      "LinkEmployeeInput": {
        "type": "object",
        "properties": {
          "bmoniUserId": {
            "type": "string",
            "description": "The BMONI user id to link, derived by bmoni-api from the verified user session.",
            "example": "550e8400-e29b-41d4-a716-446655440000"
          },
          "companyEmail": {
            "type": "string",
            "description": "The work email proven by the OTP handshake.",
            "example": "chiamaka.okafor@allora.mx"
          },
          "partnerSource": {
            "type": "string",
            "description": "Partner slug, used to disambiguate when the same work email was invited by more than one partner.",
            "example": "allora-hr"
          },
          "name": {
            "type": "string",
            "description": "The employee's name, used when the invitation is created on-the-fly for a verified partner domain (unverified roster). Ignored when a pre-registered invitation exists.",
            "example": "Chiamaka Okafor"
          },
          "consentAt": {
            "type": "string",
            "description": "When the employee consented to processing of the employer-held KYC data (ISO 8601, LFPDPPP). Stored KYC is only replayed to BMONI once consent has been recorded.",
            "example": "2026-07-09T12:00:00.000Z"
          }
        },
        "required": [
          "bmoniUserId",
          "companyEmail"
        ]
      },
      "LinkEmployeeOutput": {
        "type": "object",
        "properties": {
          "invitationId": {
            "type": "string",
            "description": "The linked employee invitation id."
          },
          "status": {
            "type": "string",
            "enum": [
              "INVITED",
              "LINKED",
              "UNLINKED"
            ],
            "example": "LINKED"
          },
          "linkedAt": {
            "format": "date-time",
            "type": "string",
            "description": "When the link was established."
          },
          "kycSubmitted": {
            "type": "boolean",
            "description": "Whether the stored employer KYC data was submitted to BMONI on link. False when no KYC was collected, or when submission failed (see kycError) — the link itself still succeeds and KYC can be retried."
          },
          "kycError": {
            "type": "string",
            "description": "Reason KYC submission failed, when applicable."
          }
        },
        "required": [
          "invitationId",
          "status",
          "linkedAt",
          "kycSubmitted"
        ]
      },
      "EmployeeVbaInput": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "string",
            "description": "ISO 4217 currency the VBA receives.",
            "example": "USD"
          },
          "provider": {
            "type": "string",
            "description": "The provider the VBA was provisioned with.",
            "example": "bridge"
          },
          "accountNumber": {
            "type": "string",
            "example": "1234567890"
          },
          "routingNumber": {
            "type": "string",
            "example": "021000021"
          },
          "bankName": {
            "type": "string",
            "example": "Lead Bank"
          },
          "accountHolderName": {
            "type": "string",
            "example": "Chiamaka Okafor"
          }
        },
        "required": [
          "currency",
          "provider",
          "accountNumber",
          "routingNumber",
          "bankName",
          "accountHolderName"
        ]
      },
      "RegisterEmployeeVbaInput": {
        "type": "object",
        "properties": {
          "bmoniUserId": {
            "type": "string",
            "description": "The BMONI user id of the linked employee.",
            "example": "550e8400-e29b-41d4-a716-446655440000"
          },
          "vba": {
            "description": "The provisioned virtual bank account details.",
            "allOf": [
              {
                "$ref": "#/components/schemas/EmployeeVbaInput"
              }
            ]
          }
        },
        "required": [
          "bmoniUserId",
          "vba"
        ]
      },
      "RegisterEmployeeVbaOutput": {
        "type": "object",
        "properties": {
          "invitationId": {
            "type": "string",
            "description": "The employee invitation the VBA was stored on."
          },
          "currency": {
            "type": "string",
            "description": "The currency the VBA was registered for."
          },
          "registeredAt": {
            "type": "string",
            "description": "When this registration was recorded (ISO 8601)."
          }
        },
        "required": [
          "invitationId",
          "currency",
          "registeredAt"
        ]
      },
      "CreateWebhookConfigInput": {
        "type": "object",
        "properties": {
          "callbackUrl": {
            "type": "string",
            "description": "URL to receive webhook event payloads",
            "example": "https://api.example.com/webhooks/bmoni"
          },
          "events": {
            "type": "array",
            "description": "Event types to subscribe to. Supported values: `wallet.deposit.completed`, `wallet.deposit.failed`, `wallet.deposit.refunded`, `wallet.withdrawal.completed`, `wallet.withdrawal.failed`, `wallet.withdrawal.processing`, `card.fulfillment.updated`, `onboarding.completed`, `onboarding.failed`, `kyc.action_required`, `employee.linked`, `employee.vba.registered`, `employee.unlinked`, `employee.deposit.completed`, `employee.deposit.failed`, `employee.deposit.refunded`, `employee.withdrawal.completed`, `employee.withdrawal.failed`, `employee.withdrawal.processing`",
            "example": [
              "wallet.deposit.completed",
              "wallet.deposit.failed",
              "wallet.deposit.refunded",
              "wallet.withdrawal.completed",
              "wallet.withdrawal.failed",
              "wallet.withdrawal.processing",
              "card.fulfillment.updated",
              "onboarding.completed",
              "onboarding.failed",
              "kyc.action_required",
              "employee.linked",
              "employee.vba.registered",
              "employee.unlinked",
              "employee.deposit.completed",
              "employee.deposit.failed",
              "employee.deposit.refunded",
              "employee.withdrawal.completed",
              "employee.withdrawal.failed",
              "employee.withdrawal.processing"
            ],
            "items": {
              "type": "string",
              "enum": [
                "wallet.deposit.completed",
                "wallet.deposit.failed",
                "wallet.deposit.refunded",
                "wallet.withdrawal.completed",
                "wallet.withdrawal.failed",
                "wallet.withdrawal.processing",
                "card.fulfillment.updated",
                "onboarding.completed",
                "onboarding.failed",
                "kyc.action_required",
                "employee.linked",
                "employee.vba.registered",
                "employee.unlinked",
                "employee.deposit.completed",
                "employee.deposit.failed",
                "employee.deposit.refunded",
                "employee.withdrawal.completed",
                "employee.withdrawal.failed",
                "employee.withdrawal.processing"
              ]
            }
          },
          "active": {
            "type": "boolean",
            "description": "Whether the webhook is active",
            "default": true
          },
          "partnerId": {
            "type": "string",
            "description": "Partner this config is scoped to. Omit for the legacy global config that receives the original `wallet.*` events. Partner-scoped configs receive money-movement events remapped to `employee.*` names, and only for users belonging to that partner.",
            "format": "uuid",
            "example": "b7e6a1d0-4f3c-4c2a-9e8b-1a2b3c4d5e6f"
          }
        },
        "required": [
          "callbackUrl",
          "events",
          "active"
        ]
      },
      "WebhookConfigOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          "partnerId": {
            "type": "string",
            "description": "Partner this config is scoped to; null for the legacy global config",
            "example": "b7e6a1d0-4f3c-4c2a-9e8b-1a2b3c4d5e6f",
            "nullable": true
          },
          "callbackUrl": {
            "type": "string",
            "example": "https://example.com/webhooks"
          },
          "secretKey": {
            "type": "string",
            "example": "whsec_abc123..."
          },
          "active": {
            "type": "boolean",
            "example": true
          },
          "events": {
            "type": "array",
            "description": "Subscribed event types",
            "example": [
              "wallet.deposit.completed",
              "wallet.deposit.failed",
              "wallet.deposit.refunded",
              "wallet.withdrawal.completed",
              "wallet.withdrawal.failed",
              "wallet.withdrawal.processing",
              "card.fulfillment.updated",
              "onboarding.completed",
              "onboarding.failed",
              "kyc.action_required",
              "employee.linked",
              "employee.vba.registered",
              "employee.unlinked",
              "employee.deposit.completed",
              "employee.deposit.failed",
              "employee.deposit.refunded",
              "employee.withdrawal.completed",
              "employee.withdrawal.failed",
              "employee.withdrawal.processing"
            ],
            "items": {
              "type": "string",
              "enum": [
                "wallet.deposit.completed",
                "wallet.deposit.failed",
                "wallet.deposit.refunded",
                "wallet.withdrawal.completed",
                "wallet.withdrawal.failed",
                "wallet.withdrawal.processing",
                "card.fulfillment.updated",
                "onboarding.completed",
                "onboarding.failed",
                "kyc.action_required",
                "employee.linked",
                "employee.vba.registered",
                "employee.unlinked",
                "employee.deposit.completed",
                "employee.deposit.failed",
                "employee.deposit.refunded",
                "employee.withdrawal.completed",
                "employee.withdrawal.failed",
                "employee.withdrawal.processing"
              ]
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "id",
          "partnerId",
          "callbackUrl",
          "secretKey",
          "active",
          "events",
          "createdAt",
          "updatedAt"
        ]
      },
      "UpdateWebhookConfigInput": {
        "type": "object",
        "properties": {
          "callbackUrl": {
            "type": "string",
            "description": "URL to receive webhook event payloads",
            "example": "https://api.example.com/webhooks/bmoni"
          },
          "events": {
            "type": "array",
            "description": "Event types to subscribe to. Supported values: `wallet.deposit.completed`, `wallet.deposit.failed`, `wallet.deposit.refunded`, `wallet.withdrawal.completed`, `wallet.withdrawal.failed`, `wallet.withdrawal.processing`, `card.fulfillment.updated`, `onboarding.completed`, `onboarding.failed`, `kyc.action_required`, `employee.linked`, `employee.vba.registered`, `employee.unlinked`, `employee.deposit.completed`, `employee.deposit.failed`, `employee.deposit.refunded`, `employee.withdrawal.completed`, `employee.withdrawal.failed`, `employee.withdrawal.processing`",
            "example": [
              "wallet.deposit.completed",
              "wallet.deposit.failed",
              "wallet.deposit.refunded",
              "wallet.withdrawal.completed",
              "wallet.withdrawal.failed",
              "wallet.withdrawal.processing",
              "card.fulfillment.updated",
              "onboarding.completed",
              "onboarding.failed",
              "kyc.action_required",
              "employee.linked",
              "employee.vba.registered",
              "employee.unlinked",
              "employee.deposit.completed",
              "employee.deposit.failed",
              "employee.deposit.refunded",
              "employee.withdrawal.completed",
              "employee.withdrawal.failed",
              "employee.withdrawal.processing"
            ],
            "items": {
              "type": "string",
              "enum": [
                "wallet.deposit.completed",
                "wallet.deposit.failed",
                "wallet.deposit.refunded",
                "wallet.withdrawal.completed",
                "wallet.withdrawal.failed",
                "wallet.withdrawal.processing",
                "card.fulfillment.updated",
                "onboarding.completed",
                "onboarding.failed",
                "kyc.action_required",
                "employee.linked",
                "employee.vba.registered",
                "employee.unlinked",
                "employee.deposit.completed",
                "employee.deposit.failed",
                "employee.deposit.refunded",
                "employee.withdrawal.completed",
                "employee.withdrawal.failed",
                "employee.withdrawal.processing"
              ]
            }
          },
          "active": {
            "type": "boolean",
            "description": "Whether the webhook is active",
            "default": true
          },
          "partnerId": {
            "type": "string",
            "description": "Partner this config is scoped to. Omit for the legacy global config that receives the original `wallet.*` events. Partner-scoped configs receive money-movement events remapped to `employee.*` names, and only for users belonging to that partner.",
            "format": "uuid",
            "example": "b7e6a1d0-4f3c-4c2a-9e8b-1a2b3c4d5e6f"
          }
        }
      },
      "WebhookEventOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          "eventType": {
            "type": "string",
            "example": "kyc.approved"
          },
          "payload": {
            "type": "object",
            "example": {
              "userId": "user-uuid",
              "status": "approved"
            },
            "description": "Event payload data"
          },
          "status": {
            "type": "string",
            "example": "delivered",
            "enum": [
              "pending",
              "delivered",
              "failed"
            ]
          },
          "attempts": {
            "type": "number",
            "example": 1
          },
          "lastAttemptAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "errorMessage": {
            "type": "object",
            "nullable": true,
            "example": null
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "id",
          "eventType",
          "payload",
          "status",
          "attempts",
          "createdAt"
        ]
      },
      "WebhookEventListOutput": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/WebhookEventOutput"
            }
          },
          "total": {
            "type": "number",
            "example": 42
          }
        },
        "required": [
          "data",
          "total"
        ]
      },
      "NationalIdOutput": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "Identifier type accepted for this country, such as SSN, BVN, or national ID.",
            "example": "ssn"
          },
          "label": {
            "type": "string",
            "description": "User-facing label for the national identifier.",
            "example": "Social Security Number"
          },
          "format": {
            "type": "string",
            "description": "Optional regular expression describing the expected identifier format.",
            "example": "^\\d{3}-\\d{2}-\\d{4}$"
          }
        },
        "required": [
          "type",
          "label"
        ]
      },
      "CountryOutput": {
        "type": "object",
        "properties": {
          "alpha3Code": {
            "type": "string",
            "description": "ISO 3166-1 alpha-3 country code used by BMoni KYC APIs.",
            "example": "USA"
          },
          "alpha2Code": {
            "type": "string",
            "description": "ISO 3166-1 alpha-2 country code, for use where alpha-2 is required.",
            "example": "US"
          },
          "name": {
            "type": "string",
            "description": "Country name suitable for display in onboarding forms.",
            "example": "United States"
          },
          "postalCodeFormat": {
            "type": "object",
            "description": "Optional regular expression describing valid postal codes for the country.",
            "example": "^\\d{5}(-\\d{4})?$",
            "nullable": true
          },
          "postalCodeExamples": {
            "description": "Example postal codes that can be shown as hints in address forms.",
            "example": [
              "10001",
              "90210"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "nationalIds": {
            "description": "National identifiers supported for KYC users from this country.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NationalIdOutput"
            }
          }
        },
        "required": [
          "alpha3Code",
          "alpha2Code",
          "name",
          "postalCodeExamples",
          "nationalIds"
        ]
      },
      "SubdivisionOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Stable subdivision identifier in the form `<alpha3>-<code>` (uppercase).",
            "example": "MEX-JAL"
          },
          "countryAlpha3": {
            "type": "string",
            "description": "ISO 3166-1 alpha-3 country code this subdivision belongs to.",
            "example": "USA"
          },
          "name": {
            "type": "string",
            "description": "Subdivision name suitable for display in address forms.",
            "example": "California"
          },
          "code": {
            "type": "string",
            "description": "Short subdivision code to submit in address or KYC payloads when required.",
            "example": "CA"
          }
        },
        "required": [
          "id",
          "countryAlpha3",
          "name",
          "code"
        ]
      },
      "CountryWithSubdivisionsOutput": {
        "type": "object",
        "properties": {
          "alpha3Code": {
            "type": "string",
            "description": "ISO 3166-1 alpha-3 country code used by BMoni KYC APIs.",
            "example": "USA"
          },
          "alpha2Code": {
            "type": "string",
            "description": "ISO 3166-1 alpha-2 country code, for use where alpha-2 is required.",
            "example": "US"
          },
          "name": {
            "type": "string",
            "description": "Country name suitable for display in onboarding forms.",
            "example": "United States"
          },
          "postalCodeFormat": {
            "type": "object",
            "description": "Optional regular expression describing valid postal codes for the country.",
            "example": "^\\d{5}(-\\d{4})?$",
            "nullable": true
          },
          "postalCodeExamples": {
            "description": "Example postal codes that can be shown as hints in address forms.",
            "example": [
              "10001",
              "90210"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "nationalIds": {
            "description": "National identifiers supported for KYC users from this country.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NationalIdOutput"
            }
          },
          "subdivisions": {
            "description": "Administrative subdivisions, states, provinces, or regions for the country.",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SubdivisionOutput"
            }
          }
        },
        "required": [
          "alpha3Code",
          "alpha2Code",
          "name",
          "postalCodeExamples",
          "nationalIds",
          "subdivisions"
        ]
      },
      "CompleteEuKycInput": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "Authorization code returned by the EU provider (Monerium).",
            "example": "auth_code_abc123"
          },
          "signature": {
            "type": "string",
            "description": "Signature proving wallet ownership for provider authentication.",
            "example": "0xabc..."
          }
        },
        "required": [
          "code",
          "signature"
        ]
      },
      "EuSuccessOutput": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "message": {
            "type": "string",
            "description": "Human-readable result description.",
            "example": "KYC completed"
          }
        },
        "required": [
          "success",
          "message"
        ]
      },
      "EuCounterpartIdentifier": {
        "type": "object",
        "properties": {
          "standard": {
            "type": "string",
            "description": "Identifier standard. Only IBAN is currently supported.",
            "enum": [
              "iban"
            ],
            "example": "iban"
          },
          "iban": {
            "type": "string",
            "description": "Recipient IBAN.",
            "example": "DE89370400440532013000"
          }
        },
        "required": [
          "standard",
          "iban"
        ]
      },
      "EuCounterpartDetails": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "description": "Recipient first name.",
            "example": "Jane"
          },
          "lastName": {
            "type": "string",
            "description": "Recipient last name.",
            "example": "Doe"
          },
          "country": {
            "type": "string",
            "description": "Recipient ISO 3166-1 alpha-2 country code.",
            "example": "DE"
          }
        },
        "required": [
          "firstName",
          "lastName",
          "country"
        ]
      },
      "EuCounterpart": {
        "type": "object",
        "properties": {
          "identifier": {
            "$ref": "#/components/schemas/EuCounterpartIdentifier"
          },
          "details": {
            "$ref": "#/components/schemas/EuCounterpartDetails"
          }
        },
        "required": [
          "identifier",
          "details"
        ]
      },
      "PrepareEuOrderInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet to redeem EUR from.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "amount": {
            "type": "string",
            "description": "Amount to redeem as a decimal string (up to 2 decimals).",
            "example": "100.00"
          },
          "counterpart": {
            "$ref": "#/components/schemas/EuCounterpart"
          },
          "memo": {
            "type": "string",
            "description": "Payment reference / memo (5–140 characters).",
            "example": "Invoice 12345"
          },
          "supportingDocumentId": {
            "type": "string",
            "description": "Uploaded supporting-document ID. Required for orders of EUR 15,000 or more.",
            "format": "uuid"
          },
          "note": {
            "type": "string",
            "description": "Optional free-text note."
          }
        },
        "required": [
          "smartWalletId",
          "amount",
          "counterpart"
        ]
      },
      "PrepareEuOrderOutput": {
        "type": "object",
        "properties": {
          "workflowId": {
            "type": "string",
            "description": "Workflow ID to pass back when completing the order.",
            "example": "monerium-offramp-abc123"
          },
          "messageToSign": {
            "type": "string",
            "description": "Message the user must sign to authorize the redemption.",
            "example": "Send EUR 100.00 to DE89..."
          },
          "signatureRequest": {
            "description": "Present only when an international payout fee applies — the user must also sign this fee transfer.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SignatureRequestOutput"
              }
            ]
          }
        },
        "required": [
          "workflowId",
          "messageToSign"
        ]
      },
      "CompleteEuOrderInput": {
        "type": "object",
        "properties": {
          "workflowId": {
            "type": "string",
            "description": "Workflow ID returned by the prepare-order step.",
            "example": "monerium-offramp-abc123"
          },
          "signature": {
            "type": "string",
            "description": "Signature over the messageToSign returned by prepare-order.",
            "example": "0xabc..."
          }
        },
        "required": [
          "workflowId",
          "signature"
        ]
      },
      "EuUploadFileOutput": {
        "type": "object",
        "properties": {
          "fileId": {
            "type": "string",
            "description": "Uploaded file ID for use in KYC or order requests.",
            "format": "uuid",
            "example": "b9fa08b5-46ae-4d85-9ac2-6ca2f4d91234"
          }
        },
        "required": [
          "fileId"
        ]
      },
      "CreateLatamCashOrderInput": {
        "type": "object",
        "properties": {
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet this cash order is associated with.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "country": {
            "type": "string",
            "description": "ISO country code for the cash rail (e.g. MX, CL, CO).",
            "example": "MX"
          },
          "price": {
            "type": "string",
            "description": "Amount in local currency as a decimal string. Provider limits apply (e.g. 100–3000).",
            "example": "1500.00"
          },
          "priceCurrency": {
            "type": "string",
            "description": "Local currency ISO code (e.g. MXN, CLP, COP).",
            "example": "MXN"
          },
          "description": {
            "type": "string",
            "description": "Human-readable description of the order.",
            "example": "Wallet top-up"
          }
        },
        "required": [
          "smartWalletId",
          "country",
          "price",
          "priceCurrency",
          "description"
        ]
      },
      "LatamCashOrderOutput": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Provider order ID.",
            "example": "ord_abc123"
          },
          "price": {
            "type": "string",
            "description": "Amount in local currency.",
            "example": "1500.00"
          },
          "price_currency": {
            "type": "string",
            "description": "Local currency ISO code.",
            "example": "MXN"
          },
          "description": {
            "type": "string",
            "description": "Order description.",
            "example": "Wallet top-up"
          },
          "merchant_order_id": {
            "type": "string",
            "description": "Merchant order reference.",
            "example": "mo_abc123"
          },
          "status": {
            "type": "string",
            "description": "Provider order status.",
            "example": "created"
          },
          "redirect_url": {
            "type": "string",
            "description": "URL to redirect the user to in order to pay/collect cash.",
            "example": "https://pay.provider.com/o/abc123"
          },
          "return_url": {
            "type": "string",
            "description": "URL the provider returns the user to after the flow.",
            "example": "https://app.partner.com/return"
          }
        },
        "required": [
          "id",
          "price",
          "price_currency",
          "description",
          "merchant_order_id",
          "status",
          "redirect_url",
          "return_url"
        ]
      },
      "LatamCashSendOrderOutput": {
        "type": "object",
        "properties": {
          "signatureRequest": {
            "description": "Signature request the user must sign to fund the payout from their wallet.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SignatureRequestOutput"
              }
            ]
          }
        },
        "required": [
          "signatureRequest"
        ]
      },
      "LatamCashOrderRecord": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Internal order record ID.",
            "example": "rec_abc123"
          },
          "orderId": {
            "type": "string",
            "description": "Provider order ID.",
            "example": "ord_abc123"
          },
          "type": {
            "type": "string",
            "description": "Order type.",
            "enum": [
              "FUND",
              "SEND"
            ],
            "example": "FUND"
          },
          "status": {
            "type": "string",
            "description": "Order status.",
            "example": "created"
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet associated with the order.",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "price": {
            "type": "string",
            "description": "Amount in local currency.",
            "example": "1500.00"
          },
          "expiry": {
            "type": "string",
            "description": "ISO-8601 expiry timestamp.",
            "example": "2026-06-02T13:00:00.000Z"
          },
          "createdAt": {
            "type": "string",
            "example": "2026-06-02T12:00:00.000Z"
          },
          "updatedAt": {
            "type": "string",
            "example": "2026-06-02T12:00:00.000Z"
          }
        },
        "required": [
          "id",
          "orderId",
          "type",
          "status",
          "smartWalletId",
          "price",
          "expiry",
          "createdAt",
          "updatedAt"
        ]
      },
      "ActivateMxKycInput": {
        "type": "object",
        "properties": {
          "paternalLastName": {
            "type": "string",
            "description": "Paternal last name.",
            "example": "Pérez"
          },
          "maternalLastName": {
            "type": "string",
            "description": "Maternal last name.",
            "example": "García"
          },
          "birthCountryIsoCode": {
            "type": "string",
            "description": "Birth country ISO alpha-2. Defaults to MX upstream.",
            "example": "MX"
          }
        },
        "required": [
          "paternalLastName",
          "maternalLastName"
        ]
      },
      "MxKycActivateUploaded": {
        "type": "object",
        "properties": {
          "selfie": {
            "type": "boolean",
            "example": true
          },
          "document": {
            "type": "boolean",
            "example": true
          }
        },
        "required": [
          "selfie",
          "document"
        ]
      },
      "MxKycActivateOutput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "pending"
          },
          "uploaded": {
            "$ref": "#/components/schemas/MxKycActivateUploaded"
          }
        },
        "required": [
          "status",
          "uploaded"
        ]
      },
      "MxKycStatusOutput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "description": "KYC status.",
            "example": "approved"
          }
        },
        "required": [
          "status"
        ]
      },
      "CreateMxQuoteInput": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "Quote direction. Offramp only: upstream onramps became deposit-driven on Jul 3 (a deposit to the user Fintoc CLABE creates the order), so the onramp quote type no longer exists.",
            "enum": [
              "offramp"
            ],
            "example": "offramp"
          },
          "sourceAmount": {
            "type": "string",
            "description": "Source amount as a decimal string.",
            "example": "1000.00"
          },
          "note": {
            "type": "string",
            "description": "Optional free-text note."
          }
        },
        "required": [
          "type",
          "sourceAmount"
        ]
      },
      "MxQuoteAssets": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "offramp"
            ],
            "example": "offramp"
          },
          "sourceAsset": {
            "type": "string",
            "example": "MXN"
          },
          "targetAsset": {
            "type": "string",
            "example": "MXNe"
          }
        },
        "required": [
          "type",
          "sourceAsset",
          "targetAsset"
        ]
      },
      "MxQuoteOutput": {
        "type": "object",
        "properties": {
          "quoteId": {
            "type": "string",
            "format": "uuid"
          },
          "blockchain": {
            "type": "string",
            "example": "solana"
          },
          "quoteAssets": {
            "$ref": "#/components/schemas/MxQuoteAssets"
          },
          "sourceAmount": {
            "type": "string",
            "example": "1000.00"
          },
          "destinationAmount": {
            "type": "string",
            "example": "998.50"
          },
          "feeBps": {
            "type": "string",
            "example": "15"
          },
          "feeAmount": {
            "type": "string",
            "example": "1.50"
          },
          "exchangeRate": {
            "type": "string",
            "example": "1.00"
          },
          "expiresAt": {
            "type": "string",
            "example": "2026-06-02T12:00:30.000Z"
          },
          "signatureRequest": {
            "description": "Present for offramp quotes — sign to transfer funds to reserve.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SignatureRequestOutput"
              }
            ]
          }
        },
        "required": [
          "quoteId",
          "blockchain",
          "quoteAssets",
          "sourceAmount",
          "destinationAmount",
          "feeBps",
          "feeAmount",
          "exchangeRate",
          "expiresAt"
        ]
      },
      "MxOrderOutput": {
        "type": "object",
        "properties": {
          "orderId": {
            "type": "string",
            "format": "uuid"
          },
          "customerId": {
            "type": "string",
            "format": "uuid"
          },
          "orderType": {
            "type": "string",
            "enum": [
              "onramp",
              "offramp"
            ]
          },
          "status": {
            "type": "string",
            "enum": [
              "created",
              "funded",
              "completed",
              "failed",
              "refunded",
              "canceled"
            ]
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet associated with the order.",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "bankAccountId": {
            "type": "string",
            "format": "uuid"
          },
          "statusPage": {
            "type": "string",
            "description": "Provider-hosted status page URL."
          },
          "amountInFiat": {
            "type": "object",
            "nullable": true
          },
          "amountInTokens": {
            "type": "object",
            "nullable": true
          },
          "depositClabe": {
            "type": "object",
            "nullable": true
          },
          "depositClabeName": {
            "type": "object",
            "nullable": true
          },
          "memo": {
            "type": "object",
            "nullable": true
          },
          "confirmedTxSignature": {
            "type": "object",
            "nullable": true
          },
          "feeBps": {
            "type": "object",
            "nullable": true
          },
          "feeAmountInFiat": {
            "type": "object",
            "nullable": true
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "completedAt": {
            "type": "object",
            "description": "Timestamp when the order completed; null otherwise.",
            "nullable": true
          },
          "deletedAt": {
            "type": "object",
            "description": "Timestamp when the order was deleted; null otherwise.",
            "nullable": true
          },
          "burnSignatureRequest": {
            "description": "Present when an offramp order needs a burn signature.",
            "allOf": [
              {
                "$ref": "#/components/schemas/SignatureRequestOutput"
              }
            ]
          }
        },
        "required": [
          "orderId",
          "customerId",
          "orderType",
          "status",
          "smartWalletId",
          "bankAccountId",
          "statusPage",
          "createdAt",
          "updatedAt"
        ]
      },
      "ValidatePayoutAccountInput": {
        "type": "object",
        "properties": {
          "country": {
            "type": "string",
            "description": "Destination country ISO alpha-3 code.",
            "example": "NGA"
          },
          "currency": {
            "type": "string",
            "description": "Payout currency ISO 4217 code.",
            "example": "NGN"
          },
          "bankId": {
            "type": "string",
            "description": "Provider bank ID.",
            "example": "bank_123"
          },
          "accountNumber": {
            "type": "string",
            "description": "Destination account number.",
            "example": "0123456789"
          },
          "routingNumber": {
            "type": "string",
            "description": "Routing number (for rails that require it).",
            "example": "021000021"
          }
        },
        "required": [
          "country",
          "currency",
          "accountNumber"
        ]
      },
      "PayoutBankDetails": {
        "type": "object",
        "properties": {
          "bankId": {
            "type": "string",
            "description": "Provider bank ID.",
            "example": "bank_123"
          },
          "branchId": {
            "type": "string",
            "description": "Provider bank branch ID.",
            "example": "branch_1"
          },
          "accountNumber": {
            "type": "string",
            "description": "Destination account number.",
            "example": "0123456789"
          },
          "accountType": {
            "type": "string",
            "description": "Account type (e.g. savings, checking)."
          },
          "accountHolderName": {
            "type": "string",
            "description": "Account holder full name.",
            "example": "Jane Doe"
          },
          "routingNumber": {
            "type": "string",
            "description": "Routing number.",
            "example": "021000021"
          },
          "swiftCode": {
            "type": "string",
            "description": "SWIFT/BIC code.",
            "example": "ABNGNGLA"
          }
        },
        "required": [
          "bankId",
          "accountNumber",
          "accountHolderName"
        ]
      },
      "CreatePayoutInput": {
        "type": "object",
        "properties": {
          "sourceSmartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet funding the payout (USDB source).",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          },
          "amount": {
            "type": "string",
            "description": "Amount in USDB minor units as a string.",
            "example": "100000000"
          },
          "country": {
            "type": "string",
            "description": "Destination country ISO alpha-3 code.",
            "example": "NGA"
          },
          "currency": {
            "type": "string",
            "description": "Payout currency ISO 4217 code.",
            "example": "NGN"
          },
          "bankDetails": {
            "$ref": "#/components/schemas/PayoutBankDetails"
          },
          "note": {
            "type": "string",
            "description": "Optional note (max 500 chars)."
          }
        },
        "required": [
          "sourceSmartWalletId",
          "amount",
          "country",
          "currency",
          "bankDetails"
        ]
      },
      "SelectPaymentWalletInput": {
        "type": "object",
        "properties": {
          "workflowId": {
            "type": "string",
            "description": "The payment workflow ID to associate the selected wallet with.",
            "example": "payment-wf-abc123"
          },
          "smartWalletId": {
            "type": "string",
            "description": "ID of the smart wallet to fund the payment from.",
            "format": "uuid",
            "example": "7f4d6b88-80a0-4d3f-9538-9a4dfabc1234"
          }
        },
        "required": [
          "workflowId",
          "smartWalletId"
        ]
      }
    },
    "parameters": {
      "docsUserId": {
        "name": "userId",
        "in": "path",
        "required": true,
        "description": "The bmoniUserId field from the user. The same value is shared across endpoints in this reference while you try different operations.",
        "schema": {
          "type": "string"
        }
      }
    }
  }
}

