# 🔐 Two-Factor Authentication System  

A **secure authentication system** with **Multi-Factor Authentication (MFA)**, built using **Node.js, TypeScript, and Next.js (App Router)**.  
It provides **JWT-based authentication**, **email verification**, **MFA with OTP**, and **session management** for a production-ready security solution.  

---

## 🚀 Features  

- 🔑 **Authentication & Authorization**  
  - Secure login & signup with JWT  
  - Password hashing using **bcrypt**  
  - Session management with refresh tokens  

- 📧 **Email Verification**  
  - Account activation via email  
  - Reset password flow with OTP  

- 🔐 **Multi-Factor Authentication (MFA)**  
  - Enable/Disable MFA from dashboard  
  - OTP-based verification  
  - Revoke MFA option  

- 🛡 **Session Management**  
  - Track active sessions  
  - Terminate sessions remotely  

- 🎨 **Frontend (Next.js + Tailwind + ShadCN)**  
  - Modern responsive UI  
  - Authentication pages (Signup, Login, Reset Password, MFA)  
  - Dashboard with session management  

---

## 📂 Project Structure  

```
Two-Factor-Auth/
├── backend/              # Node.js + TypeScript API
│   ├── src/
│   │   ├── common/       # utils, enums, strategies, validators
│   │   ├── config/       # app & http configs
│   │   ├── database/     # models & db connection
│   │   ├── mailers/      # email templates & resend client
│   │   ├── middlewares/  # passport, error handling
│   │   └── modules/      # auth, mfa, session, user modules
│   └── tsconfig.json
│
├── frontend/             # Next.js 14 App Router
│   ├── app/              # pages (auth, main, sessions, home)
│   ├── components/       # reusable UI components (ShadCN UI)
│   ├── context/          # auth, query, theme providers
│   ├── hooks/            # custom React hooks
│   ├── lib/              # axios client, utils
│   └── tsconfig.json
```

---

## 🛠️ Tech Stack  

### **Backend**  
- Node.js + TypeScript  
- Express.js  
- Passport + JWT Strategy  
- Bcrypt (password hashing)  
- Resend (email service)  
- MongoDB (with models for user/session/verification)  

### **Frontend**  
- Next.js 14 (App Router)  
- React + TypeScript  
- Tailwind CSS + ShadCN UI  
- Axios + React Query  
- Sonner (toast notifications)  

---

## ⚡ Installation  

### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/itsmesaadali/two-factor-auth.git
cd two-factor-auth
```

### 2️⃣ Backend Setup  

```bash
cd backend
npm install   # or bun install
npm run dev   # start backend server
```

### 3️⃣ Frontend Setup  

```bash
cd frontend
npm install   # or bun install
npm run dev   # start frontend server
```

---

## 📸 Screenshots  

| Login Page | MFA Verification | Dashboard |
|------------|------------------|-----------|
| ![Login](https://github.com/itsmesaadali/Two-Factor-Auth/blob/main/frontend/public/Login.png) | ![MFA](https://github.com/itsmesaadali/Two-Factor-Auth/blob/main/frontend/public/Setup-MFA.png) | ![Dashboard](https://github.com/itsmesaadali/Two-Factor-Auth/blob/main/frontend/public/Dashboard.png) |

---

## 🤝 Contributing  

Pull requests are welcome! If you’d like to contribute, please fork the repo and submit a PR.  

---

## 📜 License  

This project is licensed under the **MIT License**.  
