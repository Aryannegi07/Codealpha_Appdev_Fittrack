# FitTrack – Fitness Tracker Application

FitTrack is a full-stack fitness tracking application that helps users log workouts, monitor daily activity, set personalized fitness goals, and visualize progress through interactive dashboards and charts.

---

## Live Deployment

### Frontend
https://codealpha-appdev-fittrack.vercel.app

### Backend API
https://codealpha-appdev-fittrack.onrender.com

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints

### Activity Tracking

Users can log:

- Running
- Walking
- Cycling
- Swimming
- Gym Workouts
- Yoga
- HIIT
- Other Activities

Each activity can include:

- Duration
- Calories Burned
- Distance
- Steps
- Intensity Level
- Notes
- Activity Date

---

## Dashboard Analytics

### Daily Summary

Track:

- Total Steps
- Calories Burned
- Active Minutes
- Total Workouts

### Weekly Activity Graph

Interactive Chart.js dashboard:

- Displays the last 7 days of activity
- Click any day to view detailed statistics
- Highlights the selected day
- Updates dashboard metrics dynamically

### Progress Tracking

Visual progress bars for:

- Steps Goal
- Calories Goal
- Active Minutes Goal

---

## Personalized Daily Goals

Each user can configure custom goals:

- Daily Step Goal
- Daily Calorie Goal
- Daily Active Minutes Goal

Goals are:

- Stored in PostgreSQL
- User-specific
- Persisted across sessions
- Used in dashboard progress calculations

---

## Tech Stack

### Frontend

- React 18
- React Router v6
- Axios
- Chart.js
- React ChartJS 2

### Backend

- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

### Database

- PostgreSQL (Neon)

### Deployment

- Frontend: Vercel
- Backend: Render

---

## Project Structure

```text
fitness_tracker/
│
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── repository/
│       ├── security/
│       ├── service/
│       └── resources/
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── styles/
│
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

---

### Activities

| Method | Endpoint |
|----------|----------|
| POST | `/api/activities` |
| GET | `/api/activities` |
| GET | `/api/activities/today` |
| GET | `/api/activities/summary/daily?date=YYYY-MM-DD` |
| GET | `/api/activities/summary/weekly` |
| DELETE | `/api/activities/{id}` |

---

### User Goals

| Method | Endpoint |
|----------|----------|
| GET | `/api/users/goals` |
| PUT | `/api/users/goals` |

---

## Local Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd fitness_tracker
```

---

### 2. Backend Setup

Configure:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

app.jwt.secret=
```

Run:

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Environment Variables

Example backend configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fitness_tracker
spring.datasource.username=postgres
spring.datasource.password=your_password

app.jwt.secret=your_secret_key
```

---

## Future Enhancements

- Monthly Analytics
- Fitness Streak Tracking
- Achievement Badges
- Exercise Recommendations
- Dark Mode
- Export Reports (PDF/CSV)

---

## Author

**Aryan Negi**

CodeAlpha App Development Internship Project