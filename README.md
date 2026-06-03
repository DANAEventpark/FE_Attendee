# DANAEventpark - Attendee Frontend

Welcome to the **Attendee Frontend** of DANAEventpark! This is the web application dedicated specifically to **Customers (Event Attendees)**. Here, users can browse, view details, and register/purchase tickets for events effortlessly.

## 🌟 Overview
The project is built using the modern React ecosystem:
- **Framework/Library:** React (v19)
- **Build Tool (Bundler):** Vite (Blazing fast)
- **CSS Framework:** TailwindCSS (v4)
- **State Management:** Zustand
- **API Client:** Axios

---

## 🏗 Folder Structure
You should mainly focus on the `src/` directory:
- `src/pages/`: Contains the main view screens.
  - *Examples:* `HomePage.jsx`, `EventDetailPage.jsx`, `LoginPage.jsx`, `ProfilePage.jsx`.
- `src/components/`: Contains reusable UI building blocks (e.g., Buttons, Event Cards, Navbar).
- `src/assets/`: Contains images, logos, and global CSS files.
- *(If applicable)* `src/store/`: Contains Zustand configuration files for managing global state (like user authentication status).

---

## 🔄 Basic Data Flow
1. The application starts and renders components from `src/pages`.
2. When a user interacts (e.g., clicking on an event), React calls the Backend (Laravel) API via **Axios**.
3. The Backend returns JSON data.
4. The Frontend receives the data, updates the State (Zustand or local useState), and dynamically re-renders the UI for the user.

---

## 🛠 Setup & Installation Guide

1. **Install Dependencies:**
   Make sure you have Node.js installed (v18 or newer).
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory (next to `package.json`) based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Important:* Ensure your `.env` file points to the correct Backend API URL. For example:
   `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the link shown in the terminal (usually `http://localhost:5173`). The code supports Hot Module Replacement (HMR) and will auto-reload when you save files.

---

## 📦 Build for Production (Deploy)
When you are ready to deploy to a live server, run:
```bash
npm run build
```
Vite will compress and optimize the code into a `dist` directory. This folder contains static HTML, CSS, and JS files ready to be hosted on Vercel, Netlify, or Nginx.
