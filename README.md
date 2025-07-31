# Portfolio Manager Team 11

This is the final project of CS Foundation provided by Neueda and sponsored by Morgan Stanley.
Based on: https://bitbucket.org/neuedamats/portfoliomanager/src/master/

Requirements: Python 3.8+, Node.js

Backend (Windows):

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend (Linux/Mac):

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

Frontend:

```
cd frontend
npm install
npm run dev
```

http://localhost:5173

You should see a welcome message that confirms the connection with the backend.

## Technology Stack

- Backend:

  - Flask (Web framework)
  - Flask-CORS (Cross-origin resource sharing)
  - MySQL (Database)
  - SQLAlchemy (ORM)

- Frontend:
  - React (UI library)
  - Vite (Build tool)
  - Axios (HTTP client)

## Database Setup

### Prerequisites

- MySQL Server installed and running
- MySQL root password set to "root" (or update config.py with your credentials)

### Setup Instructions

1. Install MySQL Server:

   - Windows: Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
   - macOS: `brew install mysql && brew services start mysql`
   - Ubuntu/Debian: `sudo apt install mysql-server && sudo systemctl start mysql`

2. Create Database:

   ```sql
   mysql -u root -p
   CREATE DATABASE portfolio_manager;
   ```

3. Initialize Database:
   ```bash
   cd backend
   python init_db.py
   ```

This will create the database schema and populate it with initial mock data including:

## DB Diagram

![DB Diagram](assets/db_diagram_team11.png)
