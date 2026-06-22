# MIRA – Medical Intelligence Robotic Automation
### Health Prediction Application | Junior AI/ML Developer Task 1

A full-stack health prediction web application that collects patient blood test results and uses the **Groq AI API (Llama 3.3 70B)** to generate intelligent health risk assessments and predictions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · Django · Django REST Framework |
| Database | MySQL |
| Frontend | React.js · Bootstrap 5 · Bootstrap Icons · Vite |
| AI/ML | Groq API – Llama 3.3 70B Versatile |

---

## Features

- Full **CRUD** operations for patient records
- **AI-generated health remarks** via Groq API on every save/update — includes risk score, urgency level, disease risk breakdown, dietary recommendations, and a summary
- Blood value indicators (Normal / High / Low) with colour-coded badges
- Reference range cards for Glucose, Haemoglobin, and Cholesterol
- Search patients by name or email
- Full input validation (email format, future date prevention, numeric checks) on both frontend and backend
- Persistent MySQL storage

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server
- Groq API key — free from https://console.groq.com

---

### Step 1 – MySQL Setup

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

sudo mysql -u root -p
```

Inside the MySQL shell:
```sql
CREATE DATABASE health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'health_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON health_db.* TO 'health_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 2 – Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install system dependency for mysqlclient
sudo apt install libmysqlclient-dev python3-dev -y

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
nano .env   # Fill in your MySQL credentials and Groq API key
```

Your `.env` should look like:
```
DB_NAME=health_db
DB_USER=health_user
DB_PASSWORD=your_password_here
DB_HOST=127.0.0.1
DB_PORT=3306
GROQ_API_KEY=your_groq_api_key_here
```

Run migrations and start the server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

### Step 3 – Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients/` | List all patients |
| POST | `/api/patients/` | Create patient (triggers AI prediction) |
| GET | `/api/patients/{id}/` | Get patient by ID |
| PUT | `/api/patients/{id}/` | Update patient (regenerates AI prediction) |
| DELETE | `/api/patients/{id}/` | Delete patient |
| POST | `/api/patients/{id}/regenerate_remarks/` | Manually refresh AI remarks |

---

## AI Prediction Format

When a patient record is saved or updated, the Groq API returns structured health insights in this format:

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

## Project Structure

```
health_app/
├── backend/
│   ├── backend/
│   │   ├── settings.py       # Django configuration
│   │   └── urls.py           # Root URL config
│   ├── patients/
│   │   ├── models.py         # Patient DB model
│   │   ├── serializers.py    # DRF serializers + validation
│   │   ├── views.py          # CRUD ViewSet
│   │   ├── urls.py           # API routes
│   │   └── groq_service.py   # Groq AI API integration
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example          # Template for environment variables
│   └── .env                  # Local secrets — never committed
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app + state management
│   │   ├── index.css         # Global style overrides
│   │   └── components/
│   │       ├── PatientForm.jsx   # Add patient form
│   │       ├── PatientTable.jsx  # Patient list table
│   │       ├── EditModal.jsx     # Edit patient modal
│   │       ├── ViewModal.jsx     # Full AI report modal
│   │       ├── DeleteModal.jsx   # Delete confirmation modal
│   │       └── Toast.jsx         # Notification toasts
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Security Notes

- The `.env` file is listed in `.gitignore` and must never be committed
- Use `.env.example` as a template — it contains no real credentials
- Never share your Groq API key publicly

---

## Author

Developed as part of the Gokul Infocare Junior AI/ML Developer assessment (Task 1).
