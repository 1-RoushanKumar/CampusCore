# CampusCore Project Structure

A comprehensive campus management system built with Spring Boot backend and React frontend.

## 📁 Project Structure

```
CampusCore/
├── Backend/
│   ├── .mvn/
│   │   └── wrapper/
│   │       └── maven-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── campus/
│   │   │   │           └── backend/
│   │   │   │               ├── config/
│   │   │   │               │   ├── CustomUserDetailsService.java
│   │   │   │               │   └── SecurityConfig.java
│   │   │   │               ├── controller/
│   │   │   │               │   ├── AdminController.java
│   │   │   │               │   ├── AdminNewsController.java
│   │   │   │               │   ├── AuthController.java
│   │   │   │               │   ├── EducatorController.java
│   │   │   │               │   ├── ImageUploadController.java
│   │   │   │               │   ├── PublicNewsController.java
│   │   │   │               │   └── StudentController.java
│   │   │   │               ├── dtos/
│   │   │   │               │   ├── AuthRequest.java
│   │   │   │               │   ├── AuthResponse.java
│   │   │   │               │   ├── ClassDto.java
│   │   │   │               │   ├── EducatorDto.java
│   │   │   │               │   ├── FeedbackDto.java
│   │   │   │               │   ├── ForgotPasswordRequest.java
│   │   │   │               │   ├── NewsRequest.java
│   │   │   │               │   ├── NewsResponse.java
│   │   │   │               │   ├── NewsTitleResponse.java
│   │   │   │               │   ├── StudentDto.java
│   │   │   │               │   ├── SubjectDto.java
│   │   │   │               │   └── UserDto.java
│   │   │   │               ├── entity/
│   │   │   │               │   ├── enums/
│   │   │   │               │   │   └── Role.java
│   │   │   │               │   ├── Class.java
│   │   │   │               │   ├── Educator.java
│   │   │   │               │   ├── Feedback.java
│   │   │   │               │   ├── News.java
│   │   │   │               │   ├── PasswordResetToken.java
│   │   │   │               │   ├── Student.java
│   │   │   │               │   ├── Subject.java
│   │   │   │               │   └── User.java
│   │   │   │               ├── exceptions/
│   │   │   │               │   ├── MyGlobalExceptionHandler.java
│   │   │   │               │   └── ResourceNotFoundException.java
│   │   │   │               ├── repositories/
│   │   │   │               │   ├── ClassRepository.java
│   │   │   │               │   ├── EducatorRepository.java
│   │   │   │               │   ├── FeedbackRepository.java
│   │   │   │               │   ├── NewsRepository.java
│   │   │   │               │   ├── PasswordResetTokenRepository.java
│   │   │   │               │   ├── StudentRepository.java
│   │   │   │               │   ├── SubjectRepository.java
│   │   │   │               │   └── UserRepository.java
│   │   │   │               ├── security/
│   │   │   │               │   └── jwt/
│   │   │   │               │       ├── JwtAuthEntryPoint.java
│   │   │   │               │       ├── JwtAuthFilter.java
│   │   │   │               │       └── JwtHelper.java
│   │   │   │               ├── services/
│   │   │   │               │   ├── AdminService.java
│   │   │   │               │   ├── AuthService.java
│   │   │   │               │   ├── EducatorService.java
│   │   │   │               │   ├── EmailService.java
│   │   │   │               │   ├── ImageUploadService.java
│   │   │   │               │   ├── NewsService.java
│   │   │   │               │   └── StudentService.java
│   │   │   │               └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── campus/
│   │                   └── backend/
│   │                       └── BackendApplicationTests.java
│   ├── .gitattributes
│   ├── .gitignore
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── g1.jpg
│   │   │   │   ├── g2.jpg
│   │   │   │   ├── g3.jpg
│   │   │   │   ├── g4.jpg
│   │   │   │   ├── g5.jpg
│   │   │   │   ├── g6.jpg
│   │   │   │   ├── g7.jpg
│   │   │   │   ├── g8.jpg
│   │   │   │   ├── h1.jpg
│   │   │   │   ├── h2.jpg
│   │   │   │   └── h3.jpg
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── ClassManagement.jsx
│   │   │   │   ├── EducatorManagement.jsx
│   │   │   │   ├── NewsManagment.jsx
│   │   │   │   ├── StudentManagement.jsx
│   │   │   │   └── SubjectManagement.jsx
│   │   │   ├── common/
│   │   │   │   └── Modal.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EducatorDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NewsDetailPage.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── ContactPage.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── frontend.iml
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
├── uploads/
│   ├── 8e9d2a91-8d0b-48f4-9dc9-e7fcc7f5136a.jpg
│   └── ff147fc7-e03e-481b-a2c5-09ca8d7d6e9c.jpg
└── CampusCore.iml
```

## 🚀 Technologies Used

### Backend
- **Spring Boot** - Main framework
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **JPA/Hibernate** - Database ORM

### Frontend
- **React** - User interface library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **JavaScript/JSX** - Programming language

## 📋 Features

- **User Management**: Students, Educators, and Admin roles
- **Authentication**: JWT-based secure login system
- **News Management**: Create, update, and manage campus news
- **Class Management**: Handle class schedules and assignments
- **Subject Management**: Organize subjects and curriculum
- **Feedback System**: Student feedback collection
- **Image Upload**: File upload functionality
- **Password Reset**: Secure password recovery system

## 🏗️ Architecture

The project follows a clean architecture pattern with:

- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Data access abstraction
- **Entity Layer**: Database models
- **DTO Layer**: Data transfer objects
- **Security Layer**: Authentication and authorization

## 🔧 Setup Instructions

1. **Backend Setup**:
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📝 API Endpoints

- `/api/auth/**` - Authentication endpoints
- `/api/admin/**` - Admin management
- `/api/student/**` - Student operations
- `/api/educator/**` - Educator operations
- `/api/news/**` - News management
- `/api/upload/**` - File upload

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
