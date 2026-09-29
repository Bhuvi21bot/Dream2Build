# Dream2Build

## 📚 Project Overview
Dream2Build is a **full‑stack web application** that enables users to design, visualize, and generate construction blueprints directly from natural‑language descriptions. It combines a modern **React** frontend with a **Node.js/Express** backend, and integrates AI language models to interpret design intents.

---

## 🛠️ Technology Stack
- **Frontend**: Vite + React, vanilla CSS (gradient & glass‑morphism), Google Fonts (Inter)
- **Backend**: Node.js (v20), Express, JWT authentication, dotenv
- **Database**: PostgreSQL (local or Docker) accessed via `pg`
- **AI Integration**: OpenAI / Anthropic API wrapper (optional) for design generation
- **DevOps**: Docker & Docker‑Compose, ESLint, Prettier, Jest

---

## 🚀 Getting Started
### Prerequisites
- Node.js (>=20) and npm (>=10)
- PostgreSQL (or Docker for containerised DB)
- Docker & docker‑compose (optional, for containerised dev)
- Git
- An OpenAI API key (if you plan to use AI features)

### Clone the repository
```bash
git clone https://github.com/your‑org/Dream2Build.git
cd Dream2Build
```

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
   Fill in your DB URL, JWT secret, and optional AI keys.
4. Start the database (Docker example):
   ```bash
   docker compose up -d db
   ```
5. Run migrations (Prisma):
   ```bash
   npx prisma migrate dev --name init
   ```
6. Launch the API server:
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`.

### Frontend Setup
1. Open a new terminal and `cd ../frontend`
2. `npm install`
3. Copy the env file:
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   UI available at `http://localhost:5173` (proxying to the backend).

---

## 📁 Project Structure
```
Dream2Build/
├─ backend/               # Express API, services, tests
│   ├─ src/
│   ├─ prisma/            # Prisma schema & migrations
│   └─ tests/
├─ frontend/              # React UI, assets, tests
│   ├─ src/
│   └─ public/
├─ docker-compose.yml     # Docker services (db, backend, frontend)
├─ .gitignore
├─ README.md              # ← You are reading this file
└─ LICENSE
```

---

## 🧪 Testing
- **Backend**: `npm test` inside `backend`
- **Frontend**: `npm test` inside `frontend`

---

## 🐳 Docker
A `docker-compose.yml` is provided for quick containerised development.
```bash
# Build and start all services
docker compose up --build
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432` (credentials from `.env`)

---

## 🤝 Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Write tests for your changes.
4. Ensure all tests pass and linting succeeds (`npm run lint`).
5. Open a Pull Request with a clear description.

---

## 📄 License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 📞 Support
For questions, open an issue on GitHub or contact the maintainers at `support@dream2build.dev`.
