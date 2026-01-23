# Full-Stack Authentication Template

A production-ready authentication system built with **Spring Boot** and **Next.js**, featuring JWT authentication, OAuth2, email verification, and role-based authorization.

## Overview

![Authentication Flow](client/public/img.png)

This project provides a complete authentication and authorization solution, including secure login/registration, email verification, password reset via OTP, OAuth2 social login, and role-based access control.

## Features

- User registration & email verification
- JWT authentication with refresh tokens
- Password reset via email OTP
- Google OAuth2 login
- Role-based authorization (USER / ADMIN)
- Secure logout & token invalidation

## Tech Stack

**Backend**

- Spring Boot 3
- Java 17
- MySQL
- Spring Security (JWT, OAuth2)
- Spring Data JPA

**Frontend**

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Hook Form + Zod
- Shadcn UI

## Project Structure

**Backend**

```
backend/
├── controllers
├── services
├── repositories
├── models
├── configurations
├── filter
└── utils
```

**Frontend**

```
client/
├── app
├── components
├── services
├── hooks
├── types
└── lib
```

## Setup (Local)

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL
- pnpm (recommended)

---

### Backend Setup

1. **Clone repository**

```
git clone https://github.com/Rovineshutabarat/spring-boot-auth-template.git
cd spring-boot-auth-template/backend
```

2. **Create database**

```
CREATE DATABASE auth_template;
```

3. **Configure environment**

```
cp src/main/resources/application.yml.example src/main/resources/application.yml
```

Edit `application.yml`:

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
    secret-key: your_jwt_secret
```

4. **Run backend**

```
./mvnw spring-boot:run
```

---

### Frontend Setup

1. **Go to client directory**

```
cd ../client
```

2. **Install dependencies**

```
pnpm install
```

3. **Run development server**

```
pnpm dev
```

Frontend runs at `http://localhost:3000`
Backend runs at `http://localhost:8080`

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
