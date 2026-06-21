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

1. **Prisma Configuration & Database Connectivity**

   One of the biggest challenges was getting Prisma configured correctly with MySQL. During development, I ran into issues related to datasource configuration, environment variables, and Prisma client generation. Debugging these problems helped me better understand how Prisma establishes database connections and manages schema changes.

2. **Frontend–Backend Communication**

   While integrating the React frontend with the backend APIs, I encountered situations where the frontend was unable to retrieve data even though the backend appeared to be running correctly. Troubleshooting involved verifying API routes, Axios configuration, environment variables, CORS settings, and inspecting network requests through browser developer tools.

3. **Date Handling Across Different Layers**

   Handling the Date of Birth field required extra attention because dates are represented differently across HTML forms, TypeScript, Prisma, and MySQL. Ensuring consistent formatting during both creation and update operations was an interesting challenge.

4. **Writing Reliable Automated Tests**

   Setting up integration tests for the APIs required creating isolated test scenarios while ensuring that test executions did not interfere with development data. This highlighted the importance of having repeatable and reliable test cases when building production-quality applications.

## 🧠 Key Learnings

1. **Layered Architecture**
   Working with a Controller-Service-Repository structure reinforced the importance of separating responsibilities across different layers. By keeping business logic in services and database operations in repositories, the code became easier to maintain, test, and extend.

2. **Database Operations with Prisma**
   Gained deeper practical experience using Prisma ORM for schema management, database migrations, and efficient data retrieval while working with MySQL. Implementing CRUD operations and pagination helped me understand how Prisma simplifies database interactions while maintaining type safety.

3. **Frontend–Backend Integration**
   Improved understanding of how React applications communicate with backend APIs, including request handling, response processing, and error management. Integrating forms, API calls, and database-backed data helped strengthen my full-stack development workflow.

4. **Testing and Debugging**
   Writing API tests and troubleshooting integration issues highlighted the importance of validating application behavior early. It also improved my ability to debug problems across the frontend, backend, and database layers.
## 🔮 Future Improvements

*   **Authentication**: Implement JWT-based auth (Login/Register) to secure the API endpoints.
*   **Containerization**: Add a `Dockerfile` and `docker-compose.yml` to spin up the MySQL database, Backend, and Frontend via a single command.
*   **Caching**: Integrate Redis to cache the `GET /api/users` paginated results, invalidating the cache upon Create/Update/Delete operations to improve read throughput.
