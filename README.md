# Notebook.

A deeply personal, distraction-free digital journaling space for your thoughts, secrets, and ideas. 

This is a full-stack React and Express application built with a stunning, minimalist "cherry blossom" aesthetic. It allows you to create beautifully crafted notebooks {journels} with secure passwords, write entries in a distraction-free environment, and keep your thoughts organized locally.

## Features

- **Gorgeous Aesthetic:** Hand-drawn cherry blossom background, immersive typography, and subtle glassmorphism effects.
- **Distraction-Free Writing:** Focus entirely on your words with an auto-hiding navigation bar and minimalist interface.
- **Secret Passwords:** Lock away your private notebooks. If a password is forgotten, the notebook remains completely inaccessible to protect your privacy.
- **Customization:** Choose paper styles (dots, lines, grid), notebook colors, and adjust font sizes for your comfort.
- **Auto-Saving:** Your entries are quietly saved in the background while you write.
- **Mock Google Login:** A beautiful landing page with a placeholder authentication flow.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Routing:** React Router DOM

## Running Locally

1. Make sure you have Node.js and MongoDB installed on your system.
2. Ensure your local MongoDB instance is running.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start both the backend API and the frontend development server simultaneously:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Project Structure

- `/src`: Frontend React application.
- `/server`: Node.js Express backend and MongoDB schemas.
- `/public`: Static assets (like the beautiful background image).
