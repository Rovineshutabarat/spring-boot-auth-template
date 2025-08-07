# 🔐 Full-Stack Authentication Template


A modern, production-ready authentication system built with **Spring Boot** and **Next.js**, featuring JWT authentication, OAuth2 integration, email verification, and role-based authorization.

![Authentication Flow](client/public/img.png)
 
## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [License](#license)

## 🎯 Overview

This authentication template provides a complete solution for user authentication and authorization in modern web applications. It includes secure login/registration, email verification, password reset functionality, OAuth2 social login, and role-based access control.

### Key Highlights

- **🔒 Secure Authentication**: JWT tokens with refresh token rotation
- **📧 Email Verification**: OTP-based account verification
- **🔄 OAuth2 Integration**: Google OAuth2 login support
- **👥 Role-Based Access**: User and Admin role management
- **📱 Modern UI**: Responsive design with Tailwind CSS
- **⚡ Type Safety**: Full TypeScript support
- **🛡️ Security First**: CSRF protection, secure headers, and validation

## ✨ Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Refresh token rotation
- ✅ Password reset via email OTP
- ✅ Google OAuth2 integration
- ✅ Role-based access control (USER/ADMIN)
- ✅ Account verification workflow
- ✅ Secure logout with token invalidation

### User Management
- ✅ User profile management
- ✅ Email-based user lookup
- ✅ Account status tracking
- ✅ Password change functionality
- ✅ Account provider tracking (Local/Google)

### Security Features
- ✅ JWT token authentication
- ✅ Refresh token cookies
- ✅ CORS configuration
- ✅ Input validation with Bean Validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Secure password hashing

### Frontend Features
- ✅ Modern React components
- ✅ Form validation with Zod
- ✅ OTP input components
- ✅ Responsive design
- ✅ Dark/light theme support
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security 6
- **Authentication**: JWT + OAuth2
- **Email**: Spring Mail (SMTP)
- **Build Tool**: Maven
- **Validation**: Bean Validation
- **Utilities**: Lombok, Jackson

### Frontend
- **Framework**: Next.js 15.4.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI + Custom Components
- **HTTP Client**: Ky
- **Notifications**: Sonner
- **Package Manager**: pnpm

### Development Tools
- **IDE**: IntelliJ IDEA
- **Version Control**: Git
- **API Testing**: Postman/Insomnia
- **Database**: MySQL Workbench

## 🏗️ Architecture

### Backend Architecture
```
backend/
├── src/main/java/com/lerneon/backend/
│   ├── controllers/          # REST API endpoints
│   ├── services/            # Business logic
│   ├── repositories/        # Data access layer
│   ├── models/              # Entities, DTOs, enums
│   ├── configurations/      # Security, CORS, etc.
│   ├── handlers/            # Exception handling
│   ├── filter/              # JWT authentication filter
│   └── utils/               # Utility classes
```

### Frontend Architecture
```
client/
├── app/                     # Next.js App Router
│   ├── auth/               # Authentication pages
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
├── services/               # API service layer
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── lib/                    # Utility functions
```
## 🚀 Installation

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- pnpm (recommended) or npm

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rovineshutabarat/spring-boot-auth-template.git
   cd auth-template/backend
   ```

2. **Configure Database**
   ```bash
   # Create MySQL database
   CREATE DATABASE auth_template;
   ```

3. **Configure Environment**
   ```bash
   # Copy example configuration
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   ```

4. **Update Configuration**
   - Edit `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/auth_template
       username: your_username
       password: your_password
     mail:
       username: your_email@gmail.com
       password: your_app_password
   auth:
     jwt:
       secret-key: your_jwt_secret_key
   ```

5. **Build and Run**
   ```bash
   # Using Maven wrapper
   ./mvnw clean install
   ./mvnw spring-boot:run
   
   # Or using Maven
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### Production Build

1. **Build Backend**
   ```bash
   cd backend
   ./mvnw clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

2. **Build Frontend**
   ```bash
   cd client
   pnpm build
   pnpm start
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `POST` | `/api/auth/refresh-token` | Refresh JWT token |
| `POST` | `/api/auth/send-otp` | Send email OTP |
| `POST` | `/api/auth/verify-account` | Verify account with OTP |
| `POST` | `/api/auth/verify-password-reset` | Verify password reset OTP |
| `POST` | `/api/auth/change-password` | Change user password |
| `GET` | `/api/auth/user` | Get user by email |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/category` | Get all categories |
| `GET` | `/api/category/{id}` | Get category by ID |
| `POST` | `/api/category` | Create new category |
| `PUT` | `/api/category/{id}` | Update category |
| `DELETE` | `/api/category/{id}` | Delete category |

### OAuth2 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/oauth2/authorization/google` | Initiate Google OAuth2 |
| `GET` | `/api/login/oauth2/code/google` | Google OAuth2 callback |

### Request/Response Format

- Success Response
```json
{
  "success": "SUCCESS",
  "code": 200,
  "message": "Operation successful",
  "data": {}
}
```

- Error Response
```json
{
  "success": "ERROR",
  "code": 404,
  "message": "Data was not found.",
  "path": "/api/auth/user",
  "timestamp": "05-08-2025 18:11:54"
}
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
