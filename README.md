# Odoo-x-Adani-University-Hackathon-26


# ⚙️ GearGuard - Intelligent Maintenance Management System

> **Streamline operations, maximize uptime, and manage your industrial workforce with intelligence.**

![Project Banner](https://via.placeholder.com/1200x400?text=GearGuard+Dashboard+Preview)
*(Replace this link with a screenshot of your actual Dashboard)*

## 📖 Overview

**GearGuard** is a full-stack Industrial Maintenance Management System (CMMS) designed to replace chaotic spreadsheets with a centralized, reactive, and preventive workflow. 

Built for the **SWAVLAMBAN 2025 Hackathon**, this solution focuses on tracking critical equipment health, managing technician workloads, and ensuring zero downtime through intelligent scheduling.

## 🚀 Key Features

### 📊 Intelligent Dashboard
- **Real-time KPIs:** Monitor Critical Equipment health and Technician Load percentages instantly.
- **Request Breakdown:** Visual indicators for New, In Progress, Repaired, and Scrap tasks.
- **Searchable List:** Quick access to all active maintenance tickets.

### 📋 Interactive Kanban Board
- **Drag-and-Drop Workflow:** Powered by `@hello-pangea/dnd`, move tasks seamlessly between stages.
- **Smart Interception:** Moving a task to "Repaired" triggers a mandatory modal to log **repair duration**, ensuring accurate data tracking.
- **Visual Cues:** Auto-highlight overdue tasks and display priority ratings.

### 🛠️ Asset & Resource Management
- **Equipment Lifecycle:** detailed tracking of assets (Serial #, Location, Department) with a dedicated **Side Drawer** for history and stats.
- **Team Management:** Create specialized teams (e.g., "Robotics Unit") and assign technicians dynamically.
- **Work Centers:** Track cost-per-hour and capacity targets to optimize factory floor efficiency.

### 📅 Preventive Planning (Calendar)
- **Visual Schedule:** View all upcoming preventive maintenance.
- **Click-to-Create:** Click any empty date slot to instantly open a pre-filled request form.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **UI Library:** Mantine UI v7 (Components, Modals, Drawers)
- **State Management:** Zustand
- **Drag & Drop:** @hello-pangea/dnd
- **Calendar:** React Big Calendar
- **Icons:** Tabler Icons

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL
- **Validation:** Pydantic

---

## 📸 Screenshots

| **Dashboard** | **Kanban Board** |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x300?text=Dashboard+Screenshot) | ![Kanban](https://via.placeholder.com/600x300?text=Kanban+Screenshot) |

| **Equipment Drawer** | **Calendar View** |
|:---:|:---:|
| ![Drawer](https://via.placeholder.com/600x300?text=Drawer+Screenshot) | ![Calendar](https://via.placeholder.com/600x300?text=Calendar+Screenshot) |

*(Note: Please update the `src` links above with your actual screenshots located in a `/screenshots` folder)*

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js & npm
- Python 3.9+
- PostgreSQL (or SQLite for testing)

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Database
# Create a .env file and add your DATABASE_URL
# Example: DATABASE_URL=postgresql://user:password@localhost/gearguard

# Run the server
uvicorn main:app --reload
<!-- 
python -m backend.seed


uvicorn backend.main:app --reload

python -m venv odoo-adani-env

odoo-adani-env\Scripts\activate

pip install fastapi uvicorn sqlalchemy python-dotenv psycopg2-binary
pip install python-dotenv

npm install react-big-calendar date-fns -->