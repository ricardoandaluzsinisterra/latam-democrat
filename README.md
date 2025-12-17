# 🌎 LATAM Democrat Platform

> A full-stack web application showcasing democratic movements and achievements across Latin America

[![Live Demo](https://img.shields.io/badge/demo-live-success)](http://34.247.122.224)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MERN Stack](https://img.shields.io/badge/stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)

![LATAM Democrat Banner](https://via.placeholder.com/800x200?text=LATAM+Democrat+Platform)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 Overview

LATAM Democrat is a comprehensive web platform dedicated to tracking and showcasing democratic movements, achievements, and progress across Latin American countries. Built with the MERN stack, the application provides an interactive, visually engaging interface for exploring country-specific information and democratic milestones.

### Key Highlights

- 🗺️ Interactive country explorer with detailed profiles
- 🏆 Achievement tracking system for democratic progress
- 📱 Fully responsive design optimized for all devices
- ⚡ Smooth animations and transitions using GSAP
- 🔒 Secure API with MongoDB Atlas integration
- 📧 Contact form with email notifications
- ☁️ Cloud-based file storage with Cloudinary

## ✨ Features

### User-Facing Features

- **Country Explorer**: Browse detailed information about Latin American countries
- **Achievement Showcase**: View democratic achievements and milestones
- **Interactive UI**: Smooth animations and transitions for enhanced user experience
- **Contact System**: Submit inquiries through integrated contact form
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### Technical Features

- RESTful API architecture
- Cloud database with MongoDB Atlas
- Automated deployment pipeline
- Nginx reverse proxy configuration
- PM2 process management
- Environment-based configuration

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.1.18 | Styling |
| GSAP | 3.14.2 | Animations |
| Axios | 1.13.2 | HTTP client |
| Lucide React | 0.561.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | - | Database |
| Mongoose | 7.0.0 | ODM |
| Jest | 29.5.0 | Testing |
| Nodemailer | 7.0.11 | Email |

### Infrastructure

- **Hosting**: AWS EC2 (Amazon Linux 2)
- **Web Server**: Nginx
- **Process Manager**: PM2
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Email Service**: SendGrid & Gmail SMTP

## 🏗️ Architecture
┌─────────────┐
│ Client │
│ (Browser) │
└──────┬──────┘
│
↓
┌──────────────────┐
│ Nginx (Port 80) │
│ Reverse Proxy │
└────┬──────┬──────┘
│ │
│ │ /api/* → Backend
│ │
│ ↓
│ ┌──────────────────┐
│ │ Express.js │
│ │ Node.js Server │
│ │ (Port 5000) │
│ └────────┬─────────┘
│ │
│ ↓
│ ┌──────────────────┐
│ │ MongoDB Atlas │
│ │ (Cloud DB) │
│ └──────────────────┘
│
↓ /* → Frontend
┌──────────────────┐
│ React SPA │
│ Static Files │
│ (/dist) │
└──────────────────┘

text

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

git clone https://github.com/ricardoandaluzsinisterra/latam-democrat.git
cd latam-democrat

text

2. **Install backend dependencies**

cd backend
npm install

text

3. **Install frontend dependencies**

cd ../frontend
npm install

text

### Environment Variables

Create a `.env` file in the `backend` directory:

MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

Email Services
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=your-email@example.com
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-app-password

AWS (if using AWS services)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-west-1

Application
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com

text

### Running Locally

1. **Start the backend server**

cd backend
npm run dev

text

The backend will run on `http://localhost:5000`

2. **Start the frontend development server**

cd frontend
npm run dev

text

The frontend will run on `http://localhost:5173`

3. **Access the application**

Open your browser and navigate to `http://localhost:5173`

## 📚 API Documentation

### Endpoints

#### Countries

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/countries` | GET | Get all countries | `200 OK` |
| `/api/countries/:id` | GET | Get country by ID | `200 OK` |
| `/api/countries` | POST | Create new country | `201 Created` |
| `/api/countries/:id` | PUT | Update country | `200 OK` |

#### Achievements

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/achievements` | GET | Get all achievements | `200 OK` |
| `/api/achievements/:id` | GET | Get achievement by ID | `200 OK` |
| `/api/achievements` | POST | Create achievement | `201 Created` |

#### Contact

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/contact` | POST | Submit contact form | `200 OK` |

### Example Request

Get all countries
curl -X GET http://localhost:5000/api/countries

Create a new country
curl -X POST http://localhost:5000/api/countries
-H "Content-Type: application/json"
-d '{
"name": "Panama",
"description": "Democratic movements in Panama",
"flag": "https://..."
}'

text

## 🚢 Deployment

### Automated Deployment

Run the deployment script on your EC2 instance:

bash ~/deploy-latam-democrat.sh

text

### Manual Deployment Steps

1. **Pull latest code**

cd /var/www/latam-democrat
git pull origin main

text

2. **Build frontend**

cd frontend
npm install
npm run build

text

3. **Restart backend**

cd backend
npm install --production
pm2 restart latam-democrat-backend

text

4. **Reload Nginx**

sudo systemctl reload nginx

text

### Health Checks

Check backend
curl http://localhost:5000/api/health

Check PM2 status
pm2 status

Check Nginx status
sudo systemctl status nginx

text

## 🧪 Testing

### Run Backend Tests

cd backend
npm test

text

### Generate Coverage Report

npm test -- --coverage

text

### Test Structure

backend/
├── tests/
│ ├── models/
│ ├── routes/
│ └── integration/

text

## 📁 Project Structure

latam-democrat/
├── backend/
│ ├── models/ # Mongoose models
│ │ ├── Country.js
│ │ ├── Achievement.js
│ │ └── Contact.js
│ ├── routes/ # Express routes
│ │ ├── countries.js
│ │ ├── achievements.js
│ │ └── contact.js
│ ├── scripts/ # Utility scripts
│ ├── server.js # Entry point
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── api/ # API client
│ │ ├── hooks/ # Custom hooks
│ │ └── utils/ # Utilities
│ ├── public/ # Static assets
│ ├── dist/ # Build output
│ ├── package.json
│ └── vite.config.ts
│
├── collections/ # MongoDB seed data
├── terraform/ # Infrastructure as Code
├── deploy-latam-democrat.sh # Deployment script
└── README.md

text

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Ricardo Andaluz Sinisterra**

- Email: ricardoaa503@gmail.com
- GitHub: [@ricardoandaluzsinisterra](https://github.com/ricardoandaluzsinisterra)
- LinkedIn: [Ricardo Andaluz](https://linkedin.com/in/ricardoandaluz)

## 🙏 Acknowledgments

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/)

---
