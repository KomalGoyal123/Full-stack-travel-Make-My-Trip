# MakeMyTrip - Full Stack Travel Booking Platform

A comprehensive travel booking application built with Spring Boot (backend) and Next.js (frontend).

## 🚀 Features

- ✈️ Flight booking with dynamic seat selection
- 🏨 Hotel booking with room type selection
- 💰 Dynamic pricing with real-time updates
- ❄️ Price freeze feature
- ⭐ Reviews and ratings system
- 🤖 Personalized recommendations (Collaborative + Content-based filtering)
- 👤 User authentication and profile management
- 💸 Refund and cancellation system
- 📊 Admin dashboard for moderation
- 🔴 Live flight status tracking (SSE)

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.5.11**
- **Java 17**
- **MongoDB Atlas** (Cloud Database)
- **Spring Security**
- **Docker**

### Frontend
- **Next.js 15**
- **React 19**
- **TypeScript**
- **Redux Toolkit**
- **Tailwind CSS**
- **shadcn/ui**

## 📁 Project Structure
makemytrip/
├── backend/ # Spring Boot REST API
│ ├── src/
│ ├── Dockerfile
│ └── pom.xml
├── frontend/ # Next.js Web App
│ ├── src/
│ ├── netlify.toml
│ └── package.json
└── .gitignore


## 🌐 Live Deployment

- **Frontend:** [Netlify URL]
- **Backend:** [Render URL]

## 📦 Setup Instructions

### Backend
```bash
cd backend
./mvnw spring-boot:run

Frontend:-
bash
cd frontend
npm install
npm run dev
