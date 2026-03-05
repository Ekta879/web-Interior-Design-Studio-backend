# Interior Design Backend

This repository provides a Node.js backend API for an interior design application. It is inspired by the StudySathi Web backend and uses Express, Sequelize ORM, PostgreSQL, JWT authentication, and file uploads.

## Features

- **User management**: registration, login, CRUD operations
- **Design uploads**: images can be uploaded, downloaded, listed
- **JWT authentication** with middleware for protected routes
- **Sequelize models** for users and designs with relations
- **File storage** for design images (in `uploads/designs`)
- **Automated tests** using Jest and SequelizeMock

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL server running with a database named `interiordesign` (update credentials in `src/Database/db.js`)

### Installation

```bash
npm install
```

### Running the server

```bash
npm run dev
``` 

The server listens on port 5000 by default.

### Testing

```bash
npm test
```

### Environment Variables

Create a `.env` file at the project root with the following:

```
secretkey=your_jwt_secret
```

### Project Structure

```
index.js              # entry point
src/Database          # Sequelize configuration
src/Model             # Sequelize models
src/Controller        # Route handlers/business logic
src/Routes            # Express routers
src/middleware        # auth and upload middleware
src/security          # JWT utility
src/test              # unit/integration tests
uploads/designs       # stored image files
```

### Notes

- Update database credentials and JWT secret as needed.
- Adjust CORS origin for your frontend.
- Additional features such as role-based access, pagination, or reporting can be added.

---

This README can be expanded with API documentation and deployment instructions as the project grows.