# 🔗 Mini URL — URL Shortener (MERN)

A simple and fast URL Shortener built with **MongoDB + Express + React + Node.js**.  
It generates short links, redirects to original URLs, and tracks click counts.

✅ Single deploy setup: **Express serves React build** (one URL / one port).

---

## ✨ Features

- 🔗 Shorten long URLs instantly
- 🚀 Redirect short URL → original URL
- 📊 Click tracking (increments on every redirect)
- 🧠 Per-user history (using browser `clientId` stored in localStorage)
- 🎨 Clean UI with Tailwind + radial glow background
- ☁️ Deployed on Railway (single deploy)

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas + Mongoose
- **Deploy:** Railway

---

## 📸 Demo

- Live URL: **<YOUR_DEPLOYED_LINK_HERE>**

---

## ⚙️ Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
Production
In Railway Variables:

MONGO_URI

BASE_URL=https://your-app.up.railway.app

▶️ Run Locally
1) Clone repo
bash
Copy code
git clone https://github.com/venkat-2006/mini-url.git
cd mini-url
2) Install backend deps
bash
Copy code
cd backend
npm install
npm run dev
3) Install frontend deps
bash
Copy code
cd ../frontend
npm install
npm run dev
Frontend runs at:

http://localhost:5173

Backend runs at:

http://localhost:5000

✅ Single Deploy (Frontend + Backend together)
1) Build frontend
bash
Copy code
cd frontend
npm run build
2) Run backend (serves frontend build)
bash
Copy code
cd ..
node backend/server.js
App will be available at:

http://localhost:5000

📌 API Endpoints
✅ Shorten URL
POST /api/shorten

Body:

json
Copy code
{
  "longUrl": "https://example.com",
  "clientId": "uuid-from-localstorage"
}
Response:

json
Copy code
{
  "code": "Ab12Xy",
  "shortUrl": "https://yourdomain.com/Ab12Xy"
}
✅ Get user URLs
GET /api/my-urls/:clientId

Returns last 20 URLs created by that browser.

✅ Redirect
GET /:code

Redirects to the original URL and increments clicks.

🚀 Future Improvements
🔐 User authentication + dashboard

✍️ Custom alias support (/venkat)

📈 Analytics (clicks per day)

⏳ Expiration for URLs

🧰 Rate limiting + spam protection

👨‍💻 Author
Built by Venkat ✨
GitHub: https://github.com/venkat-2006

yaml
Copy code

---
