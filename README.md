# Truck Route & ELD Planner (FMCSA Compliant)

A full-stack web application designed to calculate truck routes and generate FMCSA-compliant Hours of Service (HOS) ELD logbooks.

## 🚀 Features
- **Route Calculation**: Uses OpenStreetMap and OSRM API to calculate realistic driving distances and times.
- **Robust Fallback Mechanism**: Built-in timeout handling ensures the app falls back to mathematical estimations if map servers are down, preventing app crashes.
- **HOS Engine (Business Logic)**: A custom Python algorithm that accurately applies FMCSA rules (11-hour driving limit, 14-hour shift, 30-min break, 10-hour sleeper berth).
- **Interactive Map**: Visualizes the route using `react-leaflet`.
- **Dynamic SVG Logbook**: Generates pixel-perfect ELD grids dynamically based on the backend HOS events using pure math and SVG (no heavy charting libraries).
- **PDF Export**: Generates a clean, print-ready "Drivers Daily Log" PDF.

## 🛠️ Tech Stack
- **Backend**: Django, Python, OSRM API, Nominatim API.
- **Frontend**: React (Vite), Tailwind CSS, React-Leaflet.

## ⚙️ How to Run Locally

### 1. Using VS Code / Cursor (Recommended)
You can launch both the frontend and backend simultaneously using the provided VS Code configuration:
- Go to `Run and Debug` (Ctrl+Shift+D).
- Select `🚀 Run Full Stack (Both)` and press the Play button.

### 2. Manual Setup
**Backend:**
\`\`\`bash
cd backend
python -m venv venv
source venv/Scripts/activate  # (Windows)
pip install -r requirements.txt
python manage.py runserver
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`