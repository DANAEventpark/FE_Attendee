# DANAEventpark - Attendee Frontend

This repository contains the Frontend application specifically designed for **Attendees** of DANAEventpark. It provides a seamless interface for users to browse events, purchase tickets, and manage their profiles.

## 🚀 Tech Stack
- **Library:** React (v19)
- **Build Tool:** Vite
- **Styling:** TailwindCSS (v4)
- **State Management:** Zustand
- **Routing:** React Router DOM

## 📁 Key Directories
- `src/components`: Reusable UI components.
- `src/pages`: Main view components for different routes.
- `src/assets`: Static assets like images and global styles.

## 🛠️ Local Development Setup

1. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
   *Update the `.env` file to include the correct Backend API URL (e.g., `VITE_API_BASE_URL=http://127.0.0.1:8000`).*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173` (or another port specified by Vite in the terminal).

## 📦 Build for Production
To build the app for production deployment, run:
```bash
npm run build
```
The optimized production files will be generated in the `dist` directory. You can preview the production build locally using:
```bash
npm run preview
```
