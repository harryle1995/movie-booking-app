# 🎬 Movie Ticket Booking App

---

## 🔗 Live Demo

You can try the app here: [Live Demo](https://movie-booking-app-iota-murex.vercel.app/)

{username: abc, password: 123}
{username: def, password: 456} 
{username: admin, password: admin} 

## 📝 Project Description

This is a movie ticket booking simulation built to help me learn how full-stack web applications work from top to bottom. It includes both customer-facing and admin-facing features, covering everything from frontend logic to backend routing and deployment. I built and deployed it using React, Node.js, Express, PostgreSQL, and Stripe.

### 🔸 Customer Features:

- Browse movies and view showtimes
- Select seats for a showtime
- Book tickets using Stripe test checkout

### 🔸 Admin Features:

- Log in to admin dashboard (/admin/editing)
- Add, edit, or delete movie listings
- Manage and view all bookings

---

## 🚀 How to Install the Project

Clone the repo:

```bash
git clone https://github.com/yourusername/movie-booking-app.git
cd movie-booking-app
```

Install backend:

```bash
cd backend
npm install
```

Install frontend:

```bash
cd ../frontend
npm install
```

Set up environment variables:

- In `backend/.env`:

```env
DATABASE_URL=your_postgres_url
STRIPE_SECRET_KEY=your_stripe_key
SESSION_SECRET=your_secret
```

- In `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

---

## 💡 Usage

Once it’s running locally:

- Go to `http://localhost:5173`
- Click on any movie to see showtimes
- Pick a time and seats, then “book” them
- Use Stripe test card to simulate payment

If you log in as an admin (you'll have to set one manually in the DB), you can:

- Access `/admin/editing`
- Add new movies, update details, or remove them
- View and manage all bookings

---

## ⚙️ Configuration

This app uses PostgreSQL as the database. Stripe is in test mode, so no real money is involved.

Admin users are just flagged with `is_admin` in the users table.

---

## 📦 Dependencies

**Frontend:**

- React
- Vite
- Tailwind CSS
- Material UI (MUI)
- React Toastify (Toast Notifications)
- Axios
- Stripe React SDK

**Backend:**

- Node.js
- Express
- PostgreSQL
- Stripe SDK
- Bcrypt
- JWT

---

## 🛠 Troubleshooting

**App not connecting to database?**

- Double check your `DATABASE_URL`

**Stripe not working?**

- Make sure you're using test keys

**Frontend can’t talk to backend?**

- Check if `VITE_API_URL` matches your backend port

If all else fails, restart both servers and re-check your `.env` files.

---

## 🤝 Contributing

This is a personal learning project, but feel free to fork it, play with it, or improve it however you’d like.

---

## 📚 Lessons Learned

- How the frontend and backend actually talk to each other
- How routes, APIs, and databases work in real life
- That building something small but complete is better than getting stuck in tutorials
- How to deploy a project using Vercel and Render

---

## 📬 Contact Information

If you want to ask about the project or just say hi:

- **Email:** [dungle090895@gmail.com](mailto\:dungle090895@gmail.com)
- **GitHub:** [github.com/harryle1995](https://github.com/harryle1995)

