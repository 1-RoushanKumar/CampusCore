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

### Admin Endpoints

#### Subjects
- **GET /api/admin/subjects**: Get all subjects (with pagination)
- **GET /api/admin/subjects/{id}**: Get a subject by ID
- **POST /api/admin/subjects**: Create a new subject
- **PUT /api/admin/subjects/{id}**: Update an existing subject
- **DELETE /api/admin/subjects/{id}**: Delete a subject
- **GET /api/admin/subjects/count**: Get the total count of subjects

#### Students
- **GET /api/admin/students**: Get all students (with pagination)
- **GET /api/admin/students/{id}**: Get a student by ID
- **POST /api/admin/students**: Create a new student (with profile image upload)
- **PUT /api/admin/students/{id}**: Update an existing student (with profile image upload)
- **DELETE /api/admin/students/{id}**: Delete a student
- **GET /api/admin/students/count**: Get the total count of students

#### News
- **GET /api/admin/news**: Get all news articles (with pagination)
- **GET /api/admin/news/{id}**: Get a news article by ID
- **POST /api/admin/news**: Create a new news article
- **PUT /api/admin/news/{id}**: Update an existing news article
- **DELETE /api/admin/news/{id}**: Delete a news article
- **GET /api/admin/news/published/count**: Get the total count of published news articles

#### Educators
- **GET /api/admin/educators**: Get all educators (with pagination)
- **GET /api/admin/educators/{id}**: Get an educator by ID
- **POST /api/admin/educators**: Create a new educator (with profile image upload)
- **PUT /api/admin/educators/{id}**: Update an existing educator (with profile image upload)
- **DELETE /api/admin/educators/{id}**: Delete an educator
- **GET /api/admin/educators/count**: Get the total count of educators

#### Classes
- **GET /api/admin/classes**: Get all classes (with pagination)
- **GET /api/admin/classes/{id}**: Get a class by ID
- **POST /api/admin/classes**: Create a new class
- **PUT /api/admin/classes/{id}**: Update an existing class
- **DELETE /api/admin/classes/{id}**: Delete a class
- **GET /api/admin/classes/count**: Get the total count of classes

### Educator Endpoints

- **GET /api/educator/students/{studentId}/classes/{classId}/feedback**: Get feedback for a specific student in a class
- **POST /api/educator/students/{studentId}/classes/{classId}/feedback**: Create or update feedback for a student in a class
- **GET /api/educator/students/{studentId}**: Get details of a specific student
- **GET /api/educator/profile**: Get the educator's own profile
- **GET /api/educator/classes**: Get all classes taught by the educator
- **GET /api/educator/classes/{classId}/students**: Get students enrolled in a specific class (with pagination)

### Student Endpoints

- **GET /api/student/subjects/all**: Get all subjects available to the student
- **GET /api/student/profile**: Get the student's own profile
- **GET /api/student/feedback**: Get all feedback for the student
- **GET /api/student/enrolled-class**: Get the class the student is currently enrolled in
- **GET /api/student/classes/all**: Get all classes available to the student

### Authentication Endpoints

- **POST /api/auth/register/admin**: Register a new admin user
- **POST /api/auth/login**: Log in a user
- **POST /api/auth/forgot-password/reset**: Reset a forgotten password
- **POST /api/auth/forgot-password/request**: Request a password reset

### Public Endpoints

- **GET /api/public/news/{id}**: Get details of a published news article
- **GET /api/public/news/titles**: Get titles of all published news articles

### File Uploads

- **GET /api/uploads/{filename}**: Serve (retrieve) a file by its filename

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
