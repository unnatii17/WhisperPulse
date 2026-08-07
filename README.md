<div align="center">

# 🎉 WhisperPulse

### *Say it. Don't sign it.*

Anonymous college confessions — post, react, comment, and vanish into the crowd.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-see%20LICENSE-lightgrey)

</div>

---

## 💭 What is this?

Every college has secrets — crushes never confessed, professors never roasted out loud, 3 a.m. thoughts nobody says at breakfast. **WhisperPulse** gives them a place to exist, without a name attached.

Post a confession. The campus reacts. Nobody knows it was you — unless you want them to.

---

## 🧩 The Stack, at a Glance

<table>
<tr>
<td valign="top" width="50%">

**🎨 Frontend**
- React 18 · React Router
- Redux Toolkit
- Tailwind CSS + Flowbite
- Material UI
- Firebase (Cloud Messaging)

</td>
<td valign="top" width="50%">

**⚙️ Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Redis (caching)
- Firebase Admin SDK
- Cloudinary (media)
- Nodemailer (OTP/mail)

</td>
</tr>
</table>

---

## ⚡ Features

| | |
|---|---|
| 🕵️ | Post confessions with zero name attached |
| ❤️ | Like, comment, and react in real time |
| 🔔 | Push notifications via Firebase Cloud Messaging |
| 📧 | OTP-based signup & email verification |
| 🖼️ | Image uploads, hosted on Cloudinary |
| ⚡ | Redis-backed caching for snappy responses |
| 🔐 | JWT auth — sessions that actually respect privacy |

---

## 🗂️ Project Anatomy

```
whisperpulse/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── Dockerfile.dev
│   └── package.json
├── server/                 # Express backend
│   ├── configs/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── mail/
│   ├── utils/
│   ├── Dockerfile.dev
│   ├── index.js
│   └── package.json
├── docker-compose.yml       # 🔥 dev mode, hot-reload
├── docker-compose.prod.yml  # 🚀 production, one container
├── Dockerfile.prod
└── README.md
```

---

## 🚀 Spin It Up

### 🐳 The Docker way *(recommended)*

> Needs [Docker Desktop](https://www.docker.com/products/docker-desktop/) up and running.

```bash
# 1. Drop your .env files into client/ and server/
# 2. From the project root:
docker compose up --build
```

| Service | URL |
|---|---|
| 🎨 Frontend | http://localhost:1001 |
| ⚙️ Backend | http://localhost:9001 |

Edit code → it hot-reloads. No rebuild, no restart, no drama.

```bash
docker compose down          # stop everything
docker compose -f docker-compose.prod.yml up --build   # production, single container
```

<details>
<summary>🧵 Prefer running it bare-metal, no Docker?</summary>

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm start
```

Needs Node.js ≥ 18.

</details>

---

## 🔑 Environment Variables

<details>
<summary><strong>server/.env</strong></summary>

| Variable | What it's for |
|---|---|
| `PORT` | Server port (default `9001`) |
| `JWT_SECRET` | Signs auth tokens |
| `MONGODB_URL` | MongoDB connection string |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` | SMTP for OTP/verification mail |
| `FIREBASE_APP_TYPE`, `FIREBASE_APP_PROJECT_ID`, `FIREBASE_APP_PRIVATE_KEY_ID`, `FIREBASE_APP_PRIVATE_KEY`, `FIREBASE_APP_CLIENT_EMAIL`, `FIREBASE_APP_CLIENT_ID`, `FIREBASE_APP_AUTH_URI`, `FIREBASE_APP_TOKEN_URI`, `FIREBASE_APP_UNIVERSE_DOMAIN` | Firebase Admin service account |

</details>

<details>
<summary><strong>client/.env</strong></summary>

| Variable | What it's for |
|---|---|
| `PORT` | Dev server port (default `1001`) |
| `WDS_SOCKET_PORT` | Webpack dev server socket |
| `REACT_APP_BACKEND_BASE_URL` | Backend API URL |
| `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID` | Firebase client config |

</details>

> ⚠️ `.env` files hold real secrets. Never commit them — and rotate anything that's ever been shared or exposed.

---

## 🛣️ Roadmap

- [ ] 🚀 Deploy backend to Render
- [ ] 🚀 Deploy frontend to Vercel
- [ ] 🔒 Rotate & finalize production secrets
- [ ] 🌐 Point `REACT_APP_BACKEND_BASE_URL` at the live backend
- [ ] 🛡️ Update `allowedOrigins` in `server/index.js` with the production domain

*Status: 🚧 running locally via Docker — not deployed yet.*

---

## 📄 License

See [LICENSE](./LICENSE).

<div align="center">

*Made for the confessions nobody says out loud.*

</div>
