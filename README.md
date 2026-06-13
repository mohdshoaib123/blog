# Blog App - Microservices Architecture

A full-stack **Blog Application** built using a **Microservices Architecture**, designed for scalability, maintainability, and fault tolerance. The platform consists of three independent backend services: **Author Service**, **User Service**, and **Blog Service**, each handling a specific business domain.

## 🚀 Features

* Microservices-based architecture
* User authentication and authorization
* Author profile management
* Blog creation, publishing, and management
* Event-driven communication with RabbitMQ
* API Gateway and reverse proxy using Nginx
* Dockerized backend services
* Scalable and independently deployable services
* Modern frontend deployed on Vercel

## 🏗️ Architecture

### Backend Services

* **User Service** – Handles user registration, authentication, and account management.
* **Author Service** – Manages author profiles and author-related operations.
* **Blog Service** – Responsible for creating, updating, publishing, and retrieving blog posts.

### Infrastructure Components

* **Nginx** – Acts as a reverse proxy and API gateway, routing requests to the appropriate microservices while improving performance and security.
* **RabbitMQ** – Enables asynchronous, event-driven communication between services.
* **Redis** – Provides caching to reduce database load and improve response times.

### Databases

* **PostgreSQL** – Stores relational and transactional data.
* **MongoDB** – Stores blog content and document-based data.

## 🐳 Containerization

All backend services and infrastructure components are containerized using **Docker**, ensuring consistent environments across development and production.

## ☁️ Deployment

* **Backend:** Deployed on **Render** using Docker containers.
* **Frontend:** Deployed on **Vercel**.
* **Nginx:** Configured as a reverse proxy and API gateway for routing requests to backend microservices.

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Microservices Architecture

### Databases

* PostgreSQL
* MongoDB
* Redis

### Messaging

* RabbitMQ

### Infrastructure & DevOps

* Docker
* Nginx
* Render
* Vercel

## 📈 Key Highlights

* Domain-driven microservices architecture
* Event-driven communication using RabbitMQ
* API Gateway implementation with Nginx
* Polyglot persistence with PostgreSQL and MongoDB
* High-performance caching with Redis
* Containerized deployment using Docker
* Cloud deployment on Render and Vercel
* Loosely coupled and scalable service design
