# 📚 SmartLearn – Personalized Learning App

SmartLearn is a personalized learning platform that lets users create custom learning paths based on their goals, track progress, and manage courses efficiently.

---

### 🚀 Features

- 📌 User Authentication (Login/Signup)
- 🧠 Create tailored learning paths
- 📊 Track course progress and time spent
- 🎯 View recommended courses
- 🔄 Pull-to-refresh support
- 📱 Built with **React Native** (Expo)

---

### 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API**: Axios for API calls
- **Storage**: AsyncStorage for tokens and user data

---

### 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/DeepakKumar-1122/SmartLearn.git
cd SmartLearn
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Create a `.env` file in the root directory with the following variable:

```
API_BASE_URL=http://127.0.0.1:5000
```

> 🔁 Replace `127.0.0.1` with the **actual IP address of the host system** running the backend.

4. **Start the app**

```bash
npm start
```

---

### 📱 Screens

- **Home**: View welcome message, your courses, and recommended ones
- **Course Form**: Create a new course
- **Course Detail**: View course progress, learn and delete
- **FAQs**: General app-related questions
- **Auth Screens**: Login and Signup

---

### 🔐 Auth Flow

- Tokens are stored using `AsyncStorage`
- Logout button clears token and redirects to login screen
