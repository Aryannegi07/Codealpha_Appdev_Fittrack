# FitTrack – Fitness Tracker App

Full-stack fitness tracking app built with **Spring Boot + PostgreSQL** (backend)
and **React** (frontend).

---

## Project Structure

```
fitness-tracker/
├── backend/                  ← Spring Boot (Java 17)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/fitness/tracker/
│       │   ├── FitnessTrackerApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   └── ActivityController.java
│       │   ├── dto/
│       │   │   ├── AuthDto.java
│       │   │   └── ActivityDto.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   └── Activity.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   └── ActivityRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtil.java
│       │   │   ├── JwtAuthFilter.java
│       │   │   └── CustomUserDetailsService.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       └── ActivityService.java
│       └── resources/
│           └── application.properties
│
├── frontend/                 ← React 18
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── index.js 
│       ├── context/AuthContext.js
│       ├── services/api.js
│       ├── components/
│       │   ├── Layout.js
│       │   └── PrivateRoute.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── LogActivity.js
│       │   └── History.js
│       └── styles/App.css
│
└── database/
    ├── schema.sql            ← Create tables + indexes
    └── seed.sql              ← Optional test data
```

---

## Setup

### 1. PostgreSQL

```bash
psql -U postgres
```
```sql
CREATE DATABASE fitness_tracker;
\q
```
```bash
psql -U postgres -d fitness_tracker -f database/schema.sql
# Optional seed:
psql -U postgres -d fitness_tracker -f database/seed.sql
```

### 2. Backend

Edit `backend/src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/fitness_tracker
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
app.jwt.secret=YourSuperSecretKeyThatIsAtLeast256BitsLong
```

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend starts on **http://localhost:8080**

### 3. Frontend

```bash
cd frontend
npm install
npm start
```
Frontend starts on **http://localhost:3000**

---

## Environment Variables

Create a `.env` file in the project root using `.env.example`.

Example:

```env
DB_URL=jdbc:postgresql://localhost:5432/fitness_tracker
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000
```

The `.env` file is ignored by Git and should never be committed.


## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Activities (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/activities` | Log new activity |
| GET | `/api/activities` | All user activities |
| GET | `/api/activities/today` | Today's activities |
| GET | `/api/activities/summary/daily?date=YYYY-MM-DD` | Daily summary |
| GET | `/api/activities/summary/weekly` | Last 7 days summary |
| DELETE | `/api/activities/{id}` | Delete an activity |

---

## Test User (after running seed.sql)
- Username: `testuser`
- Password: `password123`

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Auth | JWT (HMAC-SHA256), BCrypt |
| Database | PostgreSQL 15+ |
| Frontend | React 18, React Router v6, Axios, Chart.js |
