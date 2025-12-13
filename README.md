# Sweet Shop Management System 🍬

## 1. Project Overview
The **Sweet Shop Management System** is a full-stack web application designed to manage the inventory and sales of a boutique sweet shop. It provides a seamless experience for both customers (purchasing sweets) and administrators (managing stock and products).

Build with a focus on simplicity, performance, and modern UI/UX practices, this project demonstrates a robust implementation of authentication, role-based access control, and real-time inventory updates.

**Target Audience:**
- **Customers:** Browse sweets, filter by category, add items to a cart, and make purchases.
- **Administrators:** Create new products, update prices, restock inventory, and delete obsolete items.

## 2. Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite (with SQLAlchemy ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Pytest

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** CSS Modules / Custom CSS (Dark Theme)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Tools
- **Version Control:** Git
- **API Testing:** Swagger UI / Postman

## 3. Features

### 🔐 Authentication & Security
- **Secure Registration & Login:** Users can sign up and log in securely.
- **JWT Authentication:** Stateless authentication using Bearer tokens.
- **Role-Based Access Control (RBAC):** Distinct permissions for `USER` and `ADMIN` roles.
- **Protected Routes:** Frontend guards prevent unauthorized access to admin pages.

### 🍭 Sweet Management (CRUD)
- **Browse & Search:** Filter sweets by name, category, or price range.
- **Admin Controls:** Admins can add, edit, and delete sweet products.
- **Rich UI:** responsive cards with stock indicators and category badges.

### 🛒 Shopping Experience
- **Cart System:** Users can add multiple items and adjust quantities.
- **Real-time Stock Checks:** Prevents adding more items than available in inventory.
- **Checkout Flow:** Sequential purchasing logic ensures accurate stock deduction.
- **Responsive Design:** Optimized for desktop and mobile viewports.

### 📦 Inventory Control
- **Automatic Stock Updates:** Inventory decreases immediately upon purchase.
- **Restocking:** Admins can quickly add stock to existing items without editing the full record.
- **Out of Stock Handling:** Visual indicators disables purchasing when stock is zero.

## 4. Project Structure

```bash
sweet-shop-management-system/
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (auth, sweets)
│   │   ├── core/           # Config and security logic
│   │   ├── db/             # Database connection and session
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic models for validation
│   │   └── main.py         # Application entry point
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   └── sweet_shop.db       # SQLite database (generated)
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios client setup
    │   ├── assets/         # Images and icons
    │   ├── auth/           # Login/Register components & Context
    │   ├── components/     # Reusable UI components (SweetCard, CartDrawer)
    │   ├── context/        # Global state (CartContext)
    │   ├── pages/          # Main views (Dashboard)
    │   └── utils/          # Helper functions
    ├── index.html          # Entry HTML
    └── vite.config.js      # Vite configuration
```

## 5. Setup & Run Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   > The API will be available at `http://localhost:8000`.
   > API Documentation is at `http://localhost:8000/docs`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   > The app will run at `http://localhost:5173`.

## 6. Testing

The project follows a **TDD (Test Driven Development)** approach, particularly for the backend API logic.

To run the backend tests:
```bash
cd backend
pytest
```
This will execute the test suite covering authentication, sweet CRUD operations, and inventory logic.

## 7. Screenshots
*(Placeholder for actual screenshots - In a real submission, images would be placed here to show the Login Page, Dashboard, Cart Drawer, and Admin features.)*

## 8. My AI Usage

In the development of this project, I utilized AI tools to accelerate the implementation while maintaining full control over the architecture and logic.

**Tools Used:**
- AI Coding Assistant (for scaffolding and refactoring)

**How AI Was Used:**
- **Scaffolding:** Rapidly generating boilerplate code for FastAPI models and React components.
- **Styling:** Suggesting modern CSS patterns (glassmorphism, gradients) to enhance the UI.
- **Debugging:** analyzing obscure error messages in the frontend-backend integration.
- **Test Generation:** Drafting initial Pytest cases which I then refined to cover specific edge cases.

**Manual Decisions & Oversight:**
- **Architecture:** I designed the folder structure and decided on the separate frontend/backend separation.
- **Business Logic:** The specific rules for inventory deduction (sequential purchasing) and role-based access were defined and verified by me.
- **Code Review:** I reviewed and "humanized" the generated code to ensure clarity, removing unnecessary comments and ensuring standard naming conventions.

**Reflection:**
Using AI allowed me to focus on high-level design and feature completeness rather than getting stuck on syntax. However, strictly verifying the output was crucial to ensure the "Purchase" logic correctly handled race conditions and stock limits.

## 9. Future Improvements
- **Payment Gateway Integration:** Connecting Stripe or PayPal for real transactions.
- **Order History:** Allowing users to view their past purchases.
- **Analytics Dashboard:** Visualizing sales data for admins.
- **Dockerization:** Containerizing the app for easier deployment.

---
