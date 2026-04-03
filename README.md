# Inventory & Sales Dashboard

A full-featured **Inventory & Sales Dashboard** built with **Next.js**, **MERN stack**, and **Recharts** for real-time analytics, product management, and customer insights. Designed for multi-tenant environments with activity logging.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Components](#components)  
- [Activity Logging](#activity-logging)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **Real-time Dashboard Metrics**
  - Total orders today
  - Revenue today
  - Pending vs Completed orders
  - Low stock items

- **Product Management**
  - Product stock summary
  - Low stock alerts

- **Analytics**
  - Top selling products
  - Top customers based on revenue
  - Stock levels visualized in bar chart
  - Order status distribution in pie chart

- **Multi-tenant Activity Logging**
  - Track recent activities per tenant
  - Async database logging for all key actions

- **Responsive UI**
  - Fully responsive grid layout for dashboards
  - Modular components for easy reuse

---

## Tech Stack

- **Frontend:** Next.js 13+, React 18, TypeScript  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **UI Components:** Tailwind CSS, ShadCN UI  
- **Charts & Visualization:** Recharts  
- **State Management:** React Hooks  
- **Other:** Async activity logging, multi-tenant support  

---

## Project Structure
/project-root
│
├─ /app
│ ├─ /dashboard
│ │ ├─ page.tsx # Dashboard page
│ │ └─ DashboardClient.tsx
│ └─ /components
│ ├─ Card.tsx
│ ├─ Badge.tsx
│ └─ RecentActivity.tsx
│
├─ /lib
│ ├─ /actions
│ │ └─ activity.actions.ts
│ └─ /database
│ ├─ models
│ │ ├─ order.model.ts
│ │ ├─ product.model.ts
│ │ ├─ customer.model.ts
│ │ └─ activity.model.ts
│ └─ connect.ts
│
├─ /styles
│ └─ globals.css
│
├─ next.config.js
└─ package.json