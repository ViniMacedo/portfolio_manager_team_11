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

```bash
cd frontend
npm install
# Copy the environment file and add your OpenRouter API key
cp .env.example .env
# Edit .env and add your OpenRouter API key for AI features
npm run dev
```

### Getting Your OpenRouter API Key

To use the AI Assistant features, you'll need an OpenRouter API key:

1. **Sign up for OpenRouter**:
   - Visit [OpenRouter](https://openrouter.ai/)
   - Click "Sign In" and create an account (free tier available)
   - You can sign up with GitHub, Google, or email

2. **Get Your API Key**:
   - After logging in, go to [API Keys](https://openrouter.ai/keys)
   - Click "Create Key" 
   - Give your key a name (e.g., "Portfolio Manager")
   - Copy the generated key (starts with `sk-or-v1-...`)

3. **Add to Environment**:
   - Open `frontend/.env` in your text editor
   - Replace the empty value: `VITE_OPENROUTER_API_KEY=your_actual_key_here`
   - Save the file and restart the development server

**Note**: OpenRouter provides access to multiple AI models including Claude, GPT-4, and others. The free tier includes credits to get started.

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
  - Tailwind CSS (Styling)
  - Lucide React (Icons)

## Features

### Core Portfolio Management
- Real-time portfolio tracking and performance analytics
- Interactive stock browsing with comprehensive search
- Holdings management with detailed position tracking
- Performance visualization with historical data
- Watchlist functionality for monitoring stocks

### AI-Powered Insights
The application includes an advanced AI Assistant powered by OpenRouter that provides:

1. **Portfolio Storyteller**: Generates compelling narrative summaries of portfolio performance
   - Quarter/period performance analysis
   - Sector allocation insights
   - Dividend income tracking
   - Benchmark comparisons

2. **Rebalance Advisor**: Provides personalized portfolio rebalancing recommendations
   - Optimal sector allocation analysis
   - Overweight/underweight position identification
   - Risk management suggestions
   - Specific buy/sell recommendations

3. **Tax-Loss Harvesting Assistant**: Identifies tax optimization opportunities
   - Unrealized loss harvesting opportunities
   - Wash sale rule considerations
   - Alternative investment suggestions
   - Tax savings estimations

4. **Interactive Follow-up**: Ask detailed questions about any analysis
   - Drill down into specific sectors or holdings
   - Get explanations for recommendations
   - Personalized investment insights

### Using the AI Assistant

1. **Access**: Click the brain icon (🧠) in the top-right corner of the header
2. **Services Available**:
   - **Portfolio Storyteller**: Get a narrative summary of your performance
   - **Rebalance Advisor**: Receive personalized rebalancing recommendations
   - **Tax-Loss Harvesting**: Identify tax optimization opportunities
3. **Follow-up Questions**: After receiving an analysis, ask specific questions about your portfolio
4. **API Requirements**: Requires OpenRouter API key (see setup instructions above)

### AI Model Configuration

You can customize the AI Assistant's behavior by editing `frontend/src/config/aiConfig.js`:

- **Model Selection**: Choose from Claude 3.5 Sonnet, GPT-4, Llama, etc.
- **Response Length**: Adjust `maxTokens` (200-800 recommended)
- **Creativity Level**: Modify `temperature` (0.0 = factual, 1.0 = creative)
- **System Prompts**: Customize the AI's expertise and tone
- **Cost Management**: Set daily spending limits and warnings

The AI Assistant uses **real portfolio data** from your actual holdings to provide accurate, personalized analysis.

## Database Setup

### Prerequisites

- MySQL Server installed and running
- MySQL root password set to `"123456"` (or update your `.env` accordingly)

### Setup Instructions

1. Install MySQL Server:

   - Windows: Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
   - macOS: `brew install mysql && brew services start mysql`
   - Ubuntu/Debian: `sudo apt install mysql-server && sudo systemctl start mysql`

2. Initialize Database and Mock Data:

   ```bash
   cd backend
   python init_db.py
   ```

## DB Diagram

![DB Diagram](assets/db_diagram_team11.png)

## Presentation link
[Slides](https://www.canva.com/design/DAGvfqILxII/kpHVmkCWh0tH1WhwBNyDbQ/edit)
