# EventSphere Management

A full-stack MERN web application designed to manage trade shows, exhibitions, and expos through dedicated workflows for Admins, Exhibitors, and Attendees.

EventSphere provides a centralized platform for expo management, booth allocation, exhibitor engagement, attendee ticketing, session management, feedback, analytics, and communication.

## 🚀 Live Demo

**Frontend:**  
https://eventsphere-frontend-dun.vercel.app

**Backend API:**  
https://eventsphere-backend-mocha.vercel.app

---

## 📸 Project Screenshots

### Home Page

![EventSphere Home](screenshots/home.jpeg)

### Login

![Login](screenshots/login.jpeg)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.jpeg)

### Manage Expo

![Manage Expo](screenshots/manage-expo.jpeg)

### Exhibitor Dashboard

![Exhibitor Dashboard](screenshots/exhibitor-dashboard.jpeg)

### Attendee Dashboard

![Attendee Dashboard](screenshots/attendee-dashboard.jpeg)

### Explore Expos

![Explore Expos](screenshots/explore-expos.jpeg)

### Chats

![Chats](screenshots/chats.jpeg)

---

## ✨ Key Features

### Admin Dashboard

- Create and manage exhibitions and expos
- Configure and manage exhibition booths
- Review and manage exhibitor booth requests
- Approve or reject booth booking requests
- Create and manage expo sessions
- Manage exhibitors and attendees
- Review attendee feedback and ratings
- Monitor expo statistics and analytics

### Exhibitor Dashboard

- Create and manage company profile
- Upload company logo and business documents
- Showcase products and services
- Upload product images
- Request exhibition booth allocations
- View assigned booths
- Manage exhibitor information
- Communicate with attendees through chat

### Attendee Dashboard

- Discover and explore available expos
- Search for exhibitions
- View detailed expo information
- Book expo tickets
- Generate QR-code based tickets
- Export tickets as PDF
- Bookmark sessions and expos
- Submit feedback and ratings
- Communicate with exhibitors and organizers

---

## 🛠️ Technology Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Context API
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

### Deployment

- Vercel

---

## 🏗️ Application Architecture

```text
                    EventSphere Management
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
        Admin           Exhibitor         Attendee
          │                 │                 │
          ▼                 ▼                 ▼
     Expo Management   Company Profile    Explore Expos
     Booth Management  Products           Ticket Booking
     Session Control   Booth Requests     QR Tickets
     Analytics         Communication      Bookmarks
     Feedback          Booth Management   Feedback
                            │                 │
                            └───────┬─────────┘
                                    │
                                    ▼
                             Node.js / Express
                                    │
                                    ▼
                                MongoDB