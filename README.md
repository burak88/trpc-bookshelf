# Bookshelf Project 📚

A full-stack application that allows users to organize, list, and manage their personal bookshelves digitally. This project is built using the following technologies:

- **Next.js**: Framework for both frontend and backend.
- **tRPC**: Type-safe API development.
- **Prisma**: ORM for database management.
- **NextAuth**: Authentication and user management.
- **TanStack Query**: Data fetching and caching.

## Features

- User registration and authentication (NextAuth).
- Add, update, and delete books.
- View a list of books.
- User-specific book management.
- Type-safe APIs and data handling (tRPC, Prisma).
- Client-side data caching (TanStackt Query).

# Project Structure
├── /src
│   ├── /pages        # Next.js pages
│   ├── /server       # tRPC routers and backend logic
│   ├── /components   # Reusable React components
│   ├── /utils        # Utility functions and hooks
│   ├── /styles       # Global and component-specific styles
├── /prisma
│   └── schema.prisma # Prisma schema
├── .env              # Environment variables
└── README.md         # Project documentation

## Installation

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/burak88/bookshelf.git
cd bookshelf
