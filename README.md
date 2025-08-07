# 🔐 Full-Stack Authentication Template

A modern, production-ready authentication system built with **Spring Boot** and **Next.js**, featuring JWT authentication, OAuth2 integration, email verification, and role-based authorization.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
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

- **IDE**: IntelliJ IDEA / VS Code
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

### Database Schema

- **users**: User accounts and profiles
- **roles**: User roles and permissions
- **categories**: Sample entity for CRUD operations
- **refresh_tokens**: JWT refresh token storage
- **one_time_passwords**: OTP for email verification

## 🚀 Installation

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- pnpm (recommended) or npm

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
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
   Edit `src/main/resources/application.yml`:

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

## 🏃‍♂️ How to Run

### Development Mode

1. **Start Backend** (Port 4000)

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend** (Port 3000)

   ```bash
   cd client
   pnpm dev
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api

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

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| `POST` | `/api/auth/register`              | User registration         |
| `POST` | `/api/auth/login`                 | User login                |
| `POST` | `/api/auth/logout`                | User logout               |
| `POST` | `/api/auth/refresh-token`         | Refresh JWT token         |
| `POST` | `/api/auth/send-otp`              | Send email OTP            |
| `POST` | `/api/auth/verify-account`        | Verify account with OTP   |
| `POST` | `/api/auth/verify-password-reset` | Verify password reset OTP |
| `POST` | `/api/auth/change-password`       | Change user password      |
| `GET`  | `/api/auth/user`                  | Get user by email         |

### Category Endpoints

| Method   | Endpoint             | Description         |
| -------- | -------------------- | ------------------- |
| `GET`    | `/api/category`      | Get all categories  |
| `GET`    | `/api/category/{id}` | Get category by ID  |
| `POST`   | `/api/category`      | Create new category |
| `PUT`    | `/api/category/{id}` | Update category     |
| `DELETE` | `/api/category/{id}` | Delete category     |

### OAuth2 Endpoints

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| `GET`  | `/api/oauth2/authorization/google` | Initiate Google OAuth2 |
| `GET`  | `/api/login/oauth2/code/google`    | Google OAuth2 callback |

### Request/Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Environment Variables

### Backend Configuration

Create `src/main/resources/application.yml`:

```yaml
server:
  port: 4000
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/auth_template
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: create-drop
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your_google_client_id
            client-secret: your_google_client_secret

auth:
  jwt:
    secret-key: your_jwt_secret_key
    expiration: 5m
  refresh-token:
    expiration: 7d
  otp:
    expiration: 5m
```

### Frontend Configuration

Update `next.config.ts` for API proxy:

```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};
```

## 📁 Folder Structure

```
auth-template/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/lerneon/backend/
│   │   ├── controllers/              # REST API controllers
│   │   │   ├── implementations/      # Controller implementations
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   └── BaseController.java   # Base CRUD interface
│   │   ├── services/                 # Business logic layer
│   │   │   ├── implementations/      # Service implementations
│   │   │   ├── AuthService.java      # Authentication logic
│   │   │   ├── JwtService.java       # JWT operations
│   │   │   └── MailService.java      # Email operations
│   │   ├── repositories/             # Data access layer
│   │   ├── models/                   # Data models
│   │   │   ├── entity/               # JPA entities
│   │   │   ├── payload/              # DTOs and requests
│   │   │   └── enums/                # Enumerations
│   │   ├── configurations/           # Spring configurations
│   │   ├── handlers/                 # Exception handlers
│   │   ├── filter/                   # Security filters
│   │   └── utils/                    # Utility classes
│   ├── src/main/resources/
│   │   ├── application.yml           # Application configuration
│   │   └── templates/                # Email templates
│   └── pom.xml                       # Maven dependencies
│
├── client/                           # Next.js application
│   ├── app/                          # App Router pages
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Registration page
│   │   │   ├── forgot-password/      # Password reset
│   │   │   └── verify-account/       # Account verification
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # UI components
│   │   ├── ui/                       # Base UI components
│   │   ├── layouts/                  # Layout components
│   │   └── providers/                # Context providers
│   ├── services/                     # API services
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript types
│   ├── lib/                          # Utility functions
│   └── package.json                  # Node.js dependencies
│
└── README.md                         # Project documentation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add proper TypeScript types
- Include error handling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

### Code Style

- **Backend**: Follow Java conventions and Spring Boot best practices
- **Frontend**: Use TypeScript, follow React hooks patterns
- **Database**: Use meaningful table and column names
- **API**: Follow RESTful conventions

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [TanStack Query](https://tanstack.com/query) - Data fetching

## 📞 Support

If you have any questions or need help:

- Create an [issue](https://github.com/your-repo/issues)
- Check the [documentation](https://your-repo-docs.com)
- Join our [discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ by [Your Name]**
