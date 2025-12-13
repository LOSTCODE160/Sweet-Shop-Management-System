# Sweet Shop Management System - Implementation Plan (Phase 0)

## 1. User Roles and Permissions

The system will have two distinct roles implemented via RBAC (Role-Based Access Control).

| Role | Permissions | Description |
| :--- | :--- | :--- |
| **USER** | Read-Only (Sweets), Buy (Place Orders) | Regular customers who can browse sweets and manage their own profile/orders. |
| **ADMIN** | Full CRUD (Sweets, Users), Manage Inventory | Store administrators who manage the product catalog, stock levels, and oversee the system. |

---

## 2. Database Entities

The database will use **SQLite**. Below are the core entities.

### **Entity: User**
| Field Name | Data Type | Constraints | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment | Unique identifier. |
| `username` | String | Unique, Not Null | specific username for login/display. |
| `email` | String | Unique, Not Null, Index | User's email address (used for login if preferred). |
| `hashed_password` | String | Not Null | Bcrypt hashed password (never store plain text). |
| `role` | Enum/String | Default='USER', Not Null | 'USER' or 'ADMIN'. |
| `is_active` | Boolean | Default=True | Soft delete/ban mechanism. |
| `created_at` | DateTime | Default=Now | Audit timestamp. |

### **Entity: Sweet (Product)**
| Field Name | Data Type | Constraints | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment | Unique identifier. |
| `name` | String | Unique, Not Null, Index | Name of the sweet (e.g., "Chocolate Fudge"). |
| `description` | Text | Optional | Details about ingredients, allergens, etc. |
| `price` | Float/Decimal | Not Null, > 0 | Price per unit. |
| `stock_quantity` | Integer | Not Null, >= 0 | Current inventory level. |
| `image_url` | String | Optional | URL to product image for frontend. |
| `created_at` | DateTime | Default=Now | Audit timestamp. |

*(Note: An 'Order' entity is implied for a full system but Phase 0 explicitly requested User and Sweet. We will assume 'Inventory' management is handled via the `stock_quantity` field on the Sweet entity.)*

---

## 3. API Endpoints Specification

### **Authentication**
| Method | Route | Access Level | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a new user (Default role: USER). |
| `POST` | `/auth/token` | Public | Login (returns JWT Access Token). |

### **Users**
| Method | Route | Access Level | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Protected (Any) | Get current logged-in user details. |
| `GET` | `/users` | Admin Only | List all users (for management). |

### **Sweets (Inventory)**
| Method | Route | Access Level | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/sweets` | Public | List all available sweets. |
| `GET` | `/sweets/{id}` | Public | Get details of a specific sweet. |
| `POST` | `/sweets` | Admin Only | Create a new sweet product. |
| `PUT` | `/sweets/{id}` | Admin Only | Update sweet details (price, description). |
| `PATCH` | `/sweets/{id}/stock`| Admin Only | Update inventory count specifically. |
| `DELETE` | `/sweets/{id}` | Admin Only | Remove a sweet from the catalog. |

---

## 4. Backend Folder Structure (FastAPI)

We will use a modular structure to ensure scalability and clean separation of concerns.

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Application entry point
│   ├── core/                
│   │   ├── __init__.py
│   │   ├── config.py        # Env vars, settings
│   │   └── security.py      # JWT handling, password hashing
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py          # SQLModel/SQLAlchemy base
│   │   └── session.py       # DB engine and session dependency
│   ├── models/              # Database Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── sweet.py
│   ├── schemas/             # Pydantic Schemas (Request/Response models)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── sweet.py
│   │   └── token.py
│   └── api/                 # Route Handlers
│       ├── __init__.py
│       └── v1/
│           ├── __init__.py
│           ├── api.py       # Router aggregator
│           ├── endpoints/
│           │   ├── auth.py
│           │   ├── users.py
│           │   └── sweets.py
├── tests/                   # Tests (Mirror app structure)
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures (DB override, TestClient)
│   ├── api/
│   │   └── v1/
│   │       ├── test_auth.py
│   │       ├── test_users.py
│   │       └── test_sweets.py
├── .env                     # Environment variables (GitIgnored)
└── requirements.txt         # Dependencies
```

---

## 5. TDD Strategy (Test-Driven Development)

We will strictly follow the **Red-Green-Refactor** cycle for all backend features.

### **Workflow for each feature:**
1. **Red (Write the Test):** 
   - Create a test case in `tests/` defining the expected behavior (e.g., `test_create_sweet_as_admin`).
   - Run the test -> It MUST fail (because the endpoint/logic doesn't exist yet).
2. **Green (Make it Pass):**
   - Write the *minimum* amount of code in `app/` to make the test pass.
   - Run the test -> It should pass.
3. **Refactor:**
   - Clean up the code, optimize, and ensure strict type hints.
   - Run tests again to ensure no regressions.

### **Specific Strategies:**
- **Auth:** Test login with valid/invalid credentials, test token expiration, test accessing protected routes without token.
- **Sweets:** Test CRUD operations. Ensure standard users cannot Create/Update/Delete.
- **Inventory:** Test stock updates. Test boundary conditions (stock cannot be negative).
- **Database Isolation:** Use a purely in-memory SQLite database or a temporary file for *tests* via `conftest.py` fixtures to ensure tests don't pollute the dev database.

---

## 6. Edge Cases & Failure Scenarios

These scenarios must be covered in the test suite:

**Authentication & Authorization:**
- **Token Expiry:** Accessing a protected route with an expired JWT.
- **Invalid Signature:** Accessing with a forged/tampered token.
- **Privilege Escalation:** A regular USER trying to POST/DELETE a sweet.
- **Duplicate Registration:** Trying to register with an email that already exists.

**Data Integrity (Sweets/Inventory):**
- **Negative Values:** Attempting to set Price < 0 or Stock < 0.
- **Invalid IDs:** Requesting GET/PUT/DELETE for a non-existent Sweet ID (Should return 404).
- **Data Types:** Sending a string for 'price' or 'stock' (Pydantic validation should catch this).
- **Empty Updates:** Sending an update request with no fields.

**System:**
- **Database Lock:** Concurrent writes to SQLite (though less critical for low-traffic assignment, handle gracefully).
- **Malformed JSON:** Sending broken JSON bodies.
