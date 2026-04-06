# Finance Dashboard Backend API

Backend system for managing financial records with role-based access control.

## 🚀 Features

✅ User registration and authentication (JWT)
✅ Role-based access control (Viewer, Analyst, Admin)
✅ Financial records CRUD operations
✅ Advanced filtering (date, category, type)
✅ Dashboard analytics and summaries
✅ Input validation and error handling
✅ SQLite database with Sequelize ORM

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcrypt

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. Clone the repository
```bash
git clone <repository-url>
cd finance-dashboard-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
PORT=3000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

4. Initialize database and seed data
```bash
npm run seed
```

5. Start the server
```bash
npm start        # Production
npm run dev      # Development (with nodemon)
```

Server will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
http://localhost:3000/api

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Financial Records

#### Create Record (Admin only)
```http
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2024-04-01",
  "notes": "Monthly salary"
}
```

#### Get All Records (with filters)
```http
GET /api/records?type=income&startDate=2024-01-01&endDate=2024-03-31
Authorization: Bearer <token>
```

#### Update Record (Admin only)
```http
PUT /api/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 55000,
  "notes": "Updated salary amount"
}
```

#### Delete Record (Admin only)
```http
DELETE /api/records/:id
Authorization: Bearer <token>
```

### Dashboard

#### Get Summary
```http
GET /api/dashboard/summary
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalIncome": 150000,
    "totalExpense": 85000,
    "netBalance": 65000,
    "recordCount": 24
  }
}
```

#### Get Category Breakdown
```http
GET /api/dashboard/category-breakdown
Authorization: Bearer <token>
```

#### Get Monthly Trends
```http
GET /api/dashboard/monthly-trends?months=6
Authorization: Bearer <token>
```

### User Management (Admin only)

#### List All Users
```http
GET /api/users
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "analyst"
}
```

## 🔐 Role-Based Permissions

| Role    | View Records | Create | Update | Delete | Manage Users | Analytics |
|---------|-------------|--------|--------|--------|--------------|-----------|
| Viewer  | ✅          | ❌     | ❌     | ❌     | ❌           | ✅        |
| Analyst | ✅          | ❌     | ❌     | ❌     | ❌           | ✅        |
| Admin   | ✅          | ✅     | ✅     | ✅     | ✅           | ✅        |

## 🧪 Testing

Run tests:
```bash
npm test
```

Or use the Postman collection in `/postman` folder.

## 📁 Project Structure
```
src/
├── config/          # Configuration files
├── models/          # Database models
├── middleware/      # Express middleware
├── services/        # Business logic
├── controllers/     # Request handlers
├── routes/          # API routes
├── utils/           # Utility functions
└── app.js           # Express app

database/
├── seeders/
│   └── seed.js      # Sample data

postman/
└── Finance-API.postman_collection.json
```

## 🤔 Design Decisions

### Architecture
- **Layered Architecture**: Clear separation between routes, controllers, services, and models
- **Service Layer**: All business logic isolated in services for reusability and testing
- **Middleware Pattern**: Authentication and authorization handled via Express middleware

### Database
- **SQLite**: Chosen for simplicity and portability
- **Sequelize ORM**: Provides abstraction and migration support
- **Trade-off**: SQLite has concurrency limitations, but for this assignment's scope it's ideal. Production deployment would use PostgreSQL.

### Authentication
- **JWT**: Stateless authentication suitable for REST APIs
- **bcrypt**: Industry-standard password hashing
- **Token expiry**: 24 hours for security

### Validation
- **Joi**: Schema-based validation for clean error messages
- **Early validation**: Input validated before reaching business logic

## 🚧 Assumptions

1. All monetary amounts are in INR
2. Users can only see their own records (except Admin)
3. Soft delete not implemented (records are permanently deleted)
4. Single currency support
5. No email verification (simplified for assignment)

## 🔮 Future Enhancements

- [ ] Pagination for large datasets
- [ ] Soft delete functionality
- [ ] Email notifications
- [ ] Export to CSV/PDF
- [ ] Multi-currency support
- [ ] Audit logs
- [ ] Rate limiting
- [ ] API versioning

## 📞 Support

For questions or issues, please open an issue in the repository.

## 📄 License

This project is for educational purposes.