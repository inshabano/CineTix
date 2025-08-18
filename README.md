#  Cinetix – Online Movie Ticket Booking Platform  

CineTix is a modern full-stack movie booking application built with the MERN stack. Users can browse movies, view theatres and shows, book tickets with real-time seat availability, and manage their bookings. The platform also features role-based dashboards for Users, Theatre Partners, and Admins.

The project is containerized with Docker and deployed on AWS ECS with CI/CD via Jenkins, showcasing end-to-end DevOps practices. 

---

##  Live Demo  
🔗 [https://cinetix.inshabano.live](https://cinetix.inshabano.live)  

---
## Tech Stack

### Frontend

- React (with Hooks & Router)

- Axios (API calls)

- AntDesign

### Backend

- Node.js + Express.js

- JWT Authentication

- Nodemailer (Email confirmations)

### DevOps & Deployment

- Docker (Frontend + Backend images)

- AWS ECS + ECR (Container deployment)

- AWS S3 (Posters)

- AWS Route 53 (Domain management)

- Jenkins (CI/CD pipeline)

## ✨ Features
### Role-Based Access Control (RBAC)

- User: Browse movies, book tickets, manage profile & watchlist

- Partner: Manage theatre shows, view bookings via Partner Dashboard
  
- Admin: Manage platform-level configurations and monitor activities

### Movie & Showtime Management

- Dynamic movie listings

- Theatres and shows with seat availability

### Booking Flow

- Real-time seat selection

- Email confirmation after successful booking
  
### Responsive UI

- Built with React + Ant Design

- Optimized for desktop and mobile

### DevOps & Deployment

- Dockerized frontend and backend
  
- CI/CD Pipeline with Jenkins → AWS ECS, ECR, S3, Route 53
  
- Domain: cinetix.inshabano.live


## User Roles & Test Credentials  

### 🎟 User 
```plaintext
Email: <your-email>  
Password: <your-password>

```

### 🎭 Partner (Theatre Owner)
```plaintext
Email: testpartner@gmail.com  
Password: partner
```

## How It Works

User Flow – Browse movies → Select theatre & showtime → Pick seats → Confirm booking → Get email confirmation.

Partner Flow – Login to dashboard → Add shows → Monitor bookings.

Admin Flow – Manage users, partners, and theatres.

##  API Endpoints
### Authentication

- POST /register → Register new user

- POST /login → User login

## Movies & Shows

- GET /movies → Get all movies

- GET /movies/:id → Movie details

- GET /shows/movies/:movieId → Showtimes for a movie

### Bookings

- POST /bookings → Create booking

- GET /mybookings → User’s booking history

### Partner Dashboard

- GET /partner-dashboard → Partner’s shows & bookings

### CI/CD Pipeline
### Continuous Integration (CI)

- Triggered on every push to main

- Build React frontend → Docker image

- Build Node.js backend → Docker image

- Push both images to AWS ECR

### Continuous Deployment (CD)

- ECS pulls latest images

- Updates ECS tasks & services

- Route 53 manages domain → cinetix.inshabano.live

- CloudFront caches static assets for faster delivery

## Contributing

Pull requests are welcome! Feel free to fork and enhance the platform.

## Contact

Author: Insha Bano
🔗 [LinkedIn](https://www.linkedin.com/in/insha-bano-971866247/) | [GitHub](https://github.com/inshabano) 
