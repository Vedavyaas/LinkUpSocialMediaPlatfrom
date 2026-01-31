# LinkUp Social Media Platform

A comprehensive microservices-based social media platform featuring user profiles, authentication, real-time messaging, and more.

## Overview

LinkUp is built using a modern microservices architecture with **Spring Boot** for the backend and **React** (Vite) for the frontend. It utilizes **Spring Cloud** for service discovery and API gateway capabilities, ensuring scalability and maintainability.

## Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Microservices Support**: Spring Cloud 2025.1.0 (Eureka, API Gateway)
- **Database**: H2 (In-memory for dev), JPA/Hibernate
- **Security**: Spring Security, OAuth2 Resource Server
- **Messaging**: Apache Kafka (for real-time features)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Real-time**: WebSocket, StompJS, SockJS
- **Routing**: React Router DOM

## Architecture

The system consists of the following microservices:

| Service | Description |
| :--- | :--- | 
| **ApiGatewayService** | Entry point for all client requests. Routes traffic to appropriate services. |
| **DiscoveryService** | Service Registry using Netflix Eureka. |
| **AuthServcie** | Handles User Authentication and Authorization. |
| **ProfileService** | Manages User Profiles and related data. |
| **MessagingService** | Handles real-time chat and messages (Kafka consumer/producer). |

## Getting Started

### Prerequisites
- **Java 17** SDK installed.
- **Node.js** & **npm** installed.
- **Maven** installed.
- **Kafka** (Ensure a Kafka broker is running for MessagingService).

### Running the Backend

1.  **Start the Discovery Service** (Required first):
    ```bash
    cd DiscoveryService
    mvn spring-boot:run
    ```

2.  **Start other Microservices** (Order usually: Auth, Profile, Messaging, then Gateway):
    ```bash
    # Open new terminals for each
    cd AuthServcie
    mvn spring-boot:run

    cd ProfileService
    mvn spring-boot:run

    cd MessagingService
    mvn spring-boot:run

    cd ApiGatewayService
    mvn spring-boot:run
    ```

### Running the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will usually be available at `http://localhost:5173`.

## Project Structure

```text
LinkUpSocialMediaPlatform/
├── ApiGatewayService/  # API Gateway
├── AuthServcie/        # Authentication Service
├── DiscoveryService/   # Eureka Service Registry
├── MessagingService/   # Chat/Messaging Service
├── ProfileService/     # User Profile Service
├── frontend/           # React Application
└── pom.xml             # Root Maven configuration
```
