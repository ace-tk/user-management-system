# User Management System

A robust, full-stack User Management System built to handle standard CRUD operations for user profiles. This project was developed with a focus on enterprise-level architecture, strict data validation, and clean code practices.

## 🚀 Project Overview

The system allows administrators to create, read, update, and soft-delete user records. It implements strict validation rules for Indian government IDs (Aadhaar, PAN), formats dates properly, and utilizes pagination for efficient data retrieval. The backend follows a strict **Controller-Service-Repository** layered architecture to ensure separation of concerns and high testability.

## 🏗️ Architecture Diagram

```mermaid
graph TD
    Client[React Frontend] -->|HTTP/REST| Router[Express Router]
    Router --> Validation[Zod Middleware]
    Validation --> Controller[User Controller]
    Controller --> Service[User Service Business Logic]
    Service --> Repository[User Data Access Layer]
    Repository --> ORM[Prisma ORM]
    ORM <--> Database[(MySQL)]
```

## 💻 Tech Stack

**Frontend:**
*   React 18 (Vite)
*   TypeScript
*   React Router DOM (Routing)
*   React Hook Form + Zod (Form state & validation)
*   Axios (API Client with Interceptors)
*   Vanilla CSS (Clean, responsive layout)

**Backend:**
*   Node.js & Express.js
*   TypeScript
*   Zod (Schema validation)
*   Jest & Supertest (Integration testing)

**Database:**
*   MySQL
*   Prisma ORM (Data modeling & migrations)

## 🗄️ Database Schema

The `User` model is designed with data integrity in mind:

| Field | Type | Attributes |
| :--- | :--- | :--- |
| `id` | String (UUID) | `@id`, `@default(uuid())` |
| `name` | String | |
| `email` | String | `@unique` |
| `primaryMobile` | String | `@unique` |
| `secondaryMobile` | String | *Optional* |
| `aadhaar` | String | `@unique`, `@db.VarChar(12)` |
| `pan` | String | `@unique`, `@db.VarChar(10)` |
| `dateOfBirth` | DateTime | `@db.Date` |
| `placeOfBirth` | String | *Optional* |
| `currentAddress`| String | `@db.Text` |
| `permanentAddress`| String | `@db.Text` |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |
| `isDeleted` | Boolean | Soft delete flag, `@default(false)` |
| `deletedAt` | DateTime | *Optional* |

*Note: An index is applied to the `isDeleted` field to optimize queries filtering out deleted records.*

## 🔌 API Endpoints

All endpoints are prefixed with `/api/users`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Create a new user (Validated via Zod) |
| `GET` | `/?page=1&limit=10`| Fetch paginated, active users |
| `GET` | `/:id` | Fetch a specific user by UUID |
| `PUT` | `/:id` | Update an existing user |
| `DELETE` | `/:id` | Soft-delete a user |

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MySQL Server running locally or remotely.

### 1. Clone & Install
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the **root directory**:
```env
PORT=8000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/user_management"
```

Create a `.env` file in the **`/client` directory**:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Database Migration
```bash
# Run Prisma migrations to construct the MySQL schema
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Running the Application
Open two terminal instances.

**Terminal 1 (Backend):**
```bash
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 🧪 Running Tests

The backend includes a comprehensive integration test suite utilizing Jest and Supertest. It spins up the Express app and tests the API directly against the database (cleaning up after itself).

```bash
# From the root directory
npm test
```

## 🧗 Challenges Faced

1.  **Port Conflicts**: During development on macOS, port 5000 was suddenly hijacked by the native `ControlCenter` (AirPlay Receiver) service, causing silent API failures and CORS issues. I learned how to debug port bindings using `lsof` and successfully reconfigured the backend to default to port `8000`.
2.  **Date Handling Across Boundaries**: Prisma returns database dates as ISO strings (`1990-01-01T00:00:00.000Z`), but HTML5 `<input type="date">` exclusively requires the `YYYY-MM-DD` format. I had to implement an interception layer in the frontend to gracefully parse and format dates before injecting them into `react-hook-form`'s state.

## 🧠 Key Learnings

1.  **Layered Architecture**: Transitioning from "fat controllers" to a strict Controller-Service-Repository pattern was a game changer. It made writing the Jest integration tests incredibly straightforward because the HTTP layer is completely decoupled from the database logic.
2.  **Prisma Transactions**: I learned how to optimize pagination endpoints by wrapping `prisma.user.count()` and `prisma.user.findMany()` inside a `prisma.$transaction`. This executes both queries concurrently, cutting database latency in half.
3.  **Axios Interceptors**: By implementing a centralized Axios Response Interceptor on the frontend, I was able to automatically unwrap standard API payloads (`response.data.data`) and normalize backend Zod validation errors globally, drastically reducing boilerplate in the React components.

## 🔮 Future Improvements

*   **Authentication**: Implement JWT-based auth (Login/Register) to secure the API endpoints.
*   **Containerization**: Add a `Dockerfile` and `docker-compose.yml` to spin up the MySQL database, Backend, and Frontend via a single command.
*   **Caching**: Integrate Redis to cache the `GET /api/users` paginated results, invalidating the cache upon Create/Update/Delete operations to improve read throughput.
