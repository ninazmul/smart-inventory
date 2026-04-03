# Inventory & Sales Dashboard

A **fullstack SaaS software** built with **Next.js App Router**, **MERN stack**, and **Recharts**, providing real-time analytics, product management, and customer insights. Optimized for **multi-tenant environments** with **async activity logging** and a fully responsive UI.

This platform is designed as a **SaaS application**, allowing **payment, billing, and user management** through **Clerk**. Each user receives a **separate dashboard** gated by their unique `userId` generated via Clerk.

> **Note:** To run this application fully, you need to set up **Clerk**, **MongoDB**, **UploadThing**, and configure **Clerk webhooks** for proper SaaS functionality.

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

### Real-time Dashboard Metrics

- Total orders for today
- Revenue today
- Pending vs completed orders
- Low stock items alerts

### Product Management

- Product stock overview
- Low stock notifications

### Analytics & Insights

- Top-selling products
- Top customers by revenue
- Stock levels visualized with bar charts
- Order status distribution via pie charts

### Multi-tenant & SaaS Support

- Tenant-specific activity logging
- Async database logging for key actions
- User-specific dashboards via Clerk `userId`
- Payment and billing management through Clerk

### UI & Responsiveness

- Modular, reusable React components
- Fully responsive dashboard grid layout
- Tailwind CSS + ShadCN UI integration

---

## Tech Stack

- **Frontend:** Next.js 13+ App Router, React 18, TypeScript
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **UI Components:** Tailwind CSS, ShadCN UI
- **Charts & Visualization:** Recharts
- **State Management:** React Hooks
- **Other Features:** Async activity logging, multi-tenant SaaS support, Clerk integration for payments, billing, and user management

---

## Project Structure

```
/project-root
│
├─ /app
│  ├─ /(auth)
│  ├─ /(root)
│  │  ├─ page.tsx
│  │  ├─ categories/
│  │  ├─ components/
│  │  ├─ customers/
│  │  ├─ orders/
│  │  ├─ products/
│  │  └─ layout.tsx
│  ├─ /api
│  ├─ global.css
│  └─ layout.tsx
│
├─ /components
├─ /hooks
├─ /lib
│  ├─ /actions
│  │  └─ activity.actions.ts
│  └─ /database
│     ├─ models
│     │  ├─ order.model.ts
│     │  ├─ product.model.ts
│     │  ├─ customer.model.ts
│     │  └─ activity.model.ts
│     └─ connect.ts
│
├─ /public
├─ /types
├─ .editorconfig
├─ .env.local
├─ .eslintrc.json
├─ .gitignore
├─ components.json
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ README.md
├─ tailwind.config.ts
```

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd inventory-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
SIGNING_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
MONGODB_URI=
UPLOADTHING_TOKEN=
```

4. Run the development server:

```bash
npm run dev
```

---

## Usage

- Access the dashboard at `http://localhost:3000/`
- Sign in using the configured Clerk authentication flow
- Navigate through **Products**, **Orders**, and **Customers**
- View real-time metrics and analytics charts

---

## Components

- `DashboardClient` – main dashboard interface
- `ProductTable` – product listing with stock alerts
- `OrderChart` – pie chart for order status
- `StockBarChart` – bar chart for stock levels
- Modular UI elements powered by **ShadCN UI**

---

## Activity Logging

- All key actions (orders, product updates, user actions) are logged asynchronously per tenant
- Activity logs stored in MongoDB
- Supports audit trails and reporting

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is licensed under the **MIT License**.
