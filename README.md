# MERN Task Manager

A simple MERN stack task management application.

## Features

- Create tasks
- Update task completion
- Delete tasks
- MongoDB database integration

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Create a `.env` file inside backend using `.env.example`.



# MERN Task Manager Deployment on AWS EC2

## STEP 1 — Clone Repository on College Computer

Open terminal:

```bash
git clone YOUR_GITHUB_REPO_LINK
```

Example:

```bash
git clone https://github.com/yourusername/MERN-1.git
```

Go inside project:

```bash
cd MERN-1
```

Push latest changes if needed:

```bash
git add .
git commit -m "updated project"
git push
```

---

# STEP 2 — Launch and Connect to AWS EC2

Go to AWS EC2 Console:

[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)

Create:

* Ubuntu Server 24.04
* t2.micro instance

Allow inbound rules:

* SSH (22)
* HTTP (80)
* HTTPS (443)
* Custom TCP (5000)

Download `.pem` key file.

---

## Connect to EC2

On Linux college computers:

Move to folder containing `.pem` file.

Give permission:

```bash
chmod 400 your-key.pem
```

Connect:

```bash
ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
```

Example:

```bash
ssh -i mern-key.pem ubuntu@3.84.67.224
```

Type:

```bash
yes
```

---

# STEP 3 — Setup Project on EC2

## Install Node.js

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Check installation:

```bash
node -v
npm -v
```

---

## Install Git

```bash
sudo apt install git -y
```

---

## Clone GitHub Repository

```bash
git clone YOUR_GITHUB_REPO_LINK
```

Go inside repo:

```bash
cd MERN-1
```

---

## Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```bash
nano .env
```

Paste:

```env
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
PORT=5000
```

Save:

* CTRL + O
* Enter
* CTRL + X

---

## Setup Frontend

```bash
cd ../frontend
npm install
```

Open App.js:

```bash
nano src/App.js
```

Make sure this line exists:

```javascript
const API = "/api/tasks";
```

Save file.

---

## Build React Frontend

```bash
npm run build
```

You should see:

```bash
Compiled successfully
```

---

## Configure Backend to Serve Frontend

Go backend:

```bash
cd ../backend
```

Open:

```bash
nano server.js
```

Replace everything with:

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// API Routes
app.use("/api/tasks", require("./routes/taskRoutes"));


// Serve React Frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Save:

* CTRL + O
* Enter
* CTRL + X

---

# STEP 4 — Run Project Using PM2

Install PM2:

```bash
sudo npm install -g pm2
```

Start app:

```bash
pm2 start server.js --name mern-app
```

Save PM2:

```bash
pm2 save
```

Check logs:

```bash
pm2 logs
```

You should see:

```bash
MongoDB Connected
Server running on port 5000
```

---

# Open Website

Open browser:

```bash
http://YOUR_PUBLIC_IP:5000
```

Example:

```bash
http://3.84.67.224:5000
```

---

# Useful PM2 Commands

Restart app:

```bash
pm2 restart mern-app
```

Stop app:

```bash
pm2 stop mern-app
```

View logs:

```bash
pm2 logs
```

Clear logs:

```bash
pm2 flush
```

Check running processes:

```bash
pm2 status
```
