# VISHNU BANK — Frontend

A responsive digital banking web application built with React and Vite, designed to provide customers and administrators with a clean interface for managing banking operations.

## Overview

VISHNU BANK is the frontend for a full-stack banking application. It communicates with a Spring Boot REST API to support authentication, account management, beneficiaries, transactions, and administrative operations.

## Features

- **Authentication** — Login, registration, and password-reset interfaces.
- **Customer dashboard** — Access banking features through a centralized interface.
- **Account management** — View and manage banking accounts.
- **Beneficiary management** — Manage beneficiary details.
- **Transactions** — Access transaction-related features.
- **Admin dashboard** — Interfaces for administrative operations.
- **Responsive UI** — Layouts designed for desktop and smaller screens.

*Feature availability depends on the corresponding backend APIs and completed integrations.*

## Technology Stack

- React
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- REST API integration

## Architecture

The frontend communicates with the Spring Boot backend over HTTP. The backend handles business logic, authentication, and database operations.

```text
User
  |
  v
React Frontend
  |
  v
Spring Boot REST API
  |
  v
MySQL Database
```

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/banking-frontend.git
cd banking-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local URL in the terminal.

### Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Environment Configuration

Configure the backend API base URL using the environment-variable name expected by the frontend code. For Vite, client-side environment variables generally use the `VITE_` prefix.

Example `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Use the actual variable name expected by your API configuration. Do not commit real credentials or private secrets to GitHub.

## Deployment

The planned deployment architecture is:

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** Aiven MySQL

The production frontend must use the deployed backend URL rather than `localhost`.

## Project Status

The frontend is being prepared for deployment. Backend deployment has been completed, and frontend deployment and end-to-end verification are pending.

## Author

Developed as a full-stack Java banking application portfolio project.