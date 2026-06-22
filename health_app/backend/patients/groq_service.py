import requests
from django.conf import settings


def get_health_prediction(full_name, date_of_birth, glucose, haemoglobin, cholesterol):
    try:
        prompt = f"""You are a medical AI assistant. Analyze the following patient blood test results and provide a structured health assessment.

Patient: {full_name}
Date of Birth: {date_of_birth}
Blood Test Results:
- Glucose: {glucose} mg/dL (Normal: 70-100)
- Haemoglobin: {haemoglobin} g/dL (Normal: 12-17)
- Cholesterol: {cholesterol} mg/dL (Normal: below 200)

Respond in EXACTLY this format, no extra text:

RISK_SCORE: [number 0-100]
URGENCY: [one of: Normal, Monitor, Critical]
DIABETES_RISK: [Low/Moderate/High] - [one sentence reason]
CARDIOVASCULAR_RISK: [Low/Moderate/High] - [one sentence reason]
ANAEMIA_RISK: [Low/Moderate/High] - [one sentence reason]
TREND: [one sentence comparing values to normal ranges]
DIET: [2-3 specific food recommendations]
SUMMARY: [2-3 sentence overall health summary]"""

        response = requests.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
            }
        )

        data = response.json()
        if "choices" in data:
            return data["choices"][0]["message"]["content"].strip()
        else:
            return f"AI prediction unavailable: {str(data)}"

    except Exception as e:
        return f"AI prediction unavailable: {str(e)}"