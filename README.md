# MIRA – Medical Intelligence Robotic Automation
### Health Prediction Application

A full-stack health prediction web application that collects patient blood test results and uses the **Groq AI API (Llama 3.3 70B)** to generate intelligent health risk assessments and predictions.

---

## Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | https://mira-health-app-olive.vercel.app |
| ⚙️ **Backend API** | https://mira-backend-6bl5.onrender.com/api/patients/ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · Django · Django REST Framework |
| Database | MySQL (Railway) |
| Frontend | React.js · Bootstrap 5 · Bootstrap Icons · Vite |
| AI/ML | Groq API – Llama 3.3 70B Versatile |
| Deployment | Vercel (frontend) · Render (backend) · Railway (database) |
| CI/CD | GitHub Actions |

---

## Features

- Full **CRUD** operations for patient records
- **AI-generated health remarks** via Groq API on every save/update — includes risk score, urgency level, disease risk breakdown, dietary recommendations, and a summary
- Blood value indicators (Normal / High / Low) with colour-coded badges
- Reference range cards for Glucose, Haemoglobin, and Cholesterol
- Search patients by name or email
- Full input validation (email format, future date prevention, numeric checks) on both frontend and backend
- Persistent MySQL storage
- Automated CI/CD pipeline with GitHub Actions

---

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions pipeline:

```
Push to main
    ↓
GitHub Actions
    ├── Job 1: Test Backend  (Django system check)
    ├── Job 2: Build Frontend (npm run build)
    └── Job 3: Deploy confirmation (only if both pass)
                ↓                        ↓
          Render auto-deploys     Vercel auto-deploys
            (Backend)               (Frontend)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients/` | List all patients |
| POST | `/api/patients/` | Create new patient (triggers AI) |
| GET | `/api/patients/{id}/` | Get single patient |
| PUT | `/api/patients/{id}/` | Update patient (regenerates AI) |
| DELETE | `/api/patients/{id}/` | Delete patient |

---

## AI Prediction Format

When a patient record is saved or updated, the Groq API returns structured health insights:

```
RISK_SCORE: 0–100
URGENCY: Normal / Monitor / Critical
DIABETES_RISK: Low/Moderate/High – reason
CARDIOVASCULAR_RISK: Low/Moderate/High – reason
ANAEMIA_RISK: Low/Moderate/High – reason
TREND: comparison to normal ranges
DIET: dietary recommendations
SUMMARY: overall health summary
```

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server
- Groq API key — free from https://console.groq.com

### Step 1 – MySQL Setup

```bash
sudo apt update && sudo apt install mysql-server -y
sudo mysql -u root -p
```

```sql
CREATE DATABASE health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'health_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON health_db.* TO 'health_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2 – Backend Setup

```bash
cd health_app/backend
python3 -m venv venv
source venv/bin/activate
sudo apt install libmysqlclient-dev python3-dev -y
pip install -r requirements.txt
cp .env.example .env   # Fill in your credentials
python manage.py migrate
python manage.py runserver
```

Your `.env` should look like this:
```
DB_NAME=health_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
GROQ_API_KEY=your_groq_api_key_here
```

Backend runs at: **http://localhost:8000**

### Step 3 – Frontend Setup

```bash
cd health_app/frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Project Structure

```
mira-health-app/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD pipeline
├── .gitignore                # Single root-level gitignore
├── health_app/
│   ├── backend/
│   │   ├── backend/
│   │   │   ├── settings.py   # Django configuration
│   │   │   └── urls.py       # Root URL config
│   │   ├── patients/
│   │   │   ├── models.py         # Patient DB model
│   │   │   ├── serializers.py    # DRF serializers + validation
│   │   │   ├── views.py          # Class-based API views
│   │   │   ├── urls.py           # API routes
│   │   │   └── groq_service.py   # Groq AI API integration
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   └── .env.example      # Template — no real secrets
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx           # Main app + state management
│       │   ├── index.css         # Global style overrides
│       │   └── components/
│       │       ├── PatientForm.jsx
│       │       ├── PatientTable.jsx
│       │       ├── EditModal.jsx
│       │       ├── ViewModal.jsx
│       │       ├── DeleteModal.jsx
│       │       └── Toast.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

---

## Security Notes

- `.env` is gitignored — never committed
- `.env.example` contains only placeholder values
- All secrets are stored as environment variables in Render and Vercel dashboards

---

## Author

Keerthana Banka
