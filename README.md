# ReVibe MVP

A backend system for an apparel surplus marketplace.

## Features
- User authentication (JWT)
- Seller onboarding
- Inventory management
- Pricing engine
- Order system with transaction safety
- Concurrency control (row-level locking)

## Tech Stack
- NestJS
- PostgreSQL
- Prisma
- Docker

## Setup

```bash
npm install
docker compose up -d
npx prisma migrate dev
npm run start:dev
