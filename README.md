# 🎓 Course Management System – Frontend Project

This project is a **React + TypeScript frontend application** developed as part of a **Frontend Development course**.  
The system allows managing academic courses with full CRUD functionality, responsive UI, theming, and cloud persistence.

---

## 🚀 Live Demo
🔗 https://<your-firebase-project>.web.app

---

## 🛠️ Tech Stack
- **React 18**
- **TypeScript**
- **Vite**
- **Material UI (MUI)**
- **Firebase Firestore**
- **Firebase Hosting**

---

## ✨ Features

### 📚 Course Management (CRUD)
- Add new courses
- Edit existing courses
- Delete courses
- Search courses by code or name
- Data persisted in **Firestore**

### 📱 Responsive Design
- **Desktop**: Table-based layout
- **Mobile**: Card-based layout
- Implemented using MUI responsive utilities

### 🌙 Dark / Light Mode
- Toggle between Light and Dark themes
- Implemented using MUI theming
- User preference is saved in `localStorage`

### 🎨 Theming
- Global MUI theme
- RTL support
- Consistent typography and spacing
- CssBaseline for consistent styling

---

## 🗂️ Project Structure


---

## 🔐 Firebase & Environment Variables

Firebase configuration is managed using **environment variables**.

Example (`.env` – not committed):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
## Code Review
Please leave inline comments on this PR.

