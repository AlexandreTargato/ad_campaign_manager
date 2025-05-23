# Facebook Ad Campaign Manager

A full-stack web application for managing Facebook ad campaigns with AI-powered campaign creation assistance.

## Features

- **Campaign Dashboard**: View all campaigns with status, objectives, and creation dates
- **AI Assistant**: Chat with Claude AI to create new campaigns interactively
- **Campaign Management**: Toggle campaign status (Active/Paused)
- **Real-time Updates**: Live chat interface with campaign creation feedback
- **PostgreSQL Storage**: Persistent data storage with proper relationships

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **PostgreSQL** for database
- **Anthropic Claude API** for AI assistance
- **pg** for database connectivity

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Query** for state management and API calls
- **Lucide React** for icons

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Anthropic API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ad_campaigns;
```

2. Update database configuration in `backend/.env` (see step 3)

### 3. Environment Configuration

Create `backend/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ad_campaigns
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
PORT=3001
```

### 4. Start the Application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, in another terminal)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Chat
- `POST /api/chat` - Send message to AI assistant
- `DELETE /api/chat/context` - Clear chat context

## Data Models

### Campaign
```typescript
interface Campaign {
  id: string;
  name: string;
  objective: "OUTCOME_TRAFFIC" | "OUTCOME_AWARENESS" | "OUTCOME_ENGAGEMENT" | "OUTCOME_LEADS";
  status: "PAUSED" | "ACTIVE";
  stop_time: number; // timestamp
  created_at?: Date;
}
```

### AdSet
```typescript
interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  daily_budget: number; // budget in cents
}
```

### Ad
```typescript
interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative: {
    creative_id: string;
  };
  status: "PAUSED" | "ACTIVE";
}
```

## Usage

1. **View Campaigns**: The dashboard shows all existing campaigns with their status and details
2. **Create Campaign via AI**: Use the chat interface to create new campaigns:
   - Start by saying "I want to create a new campaign"
   - Follow the AI's prompts for campaign name, objective, and budget
   - Confirm creation when prompted
3. **Manage Campaigns**: Toggle campaign status between Active and Paused

## AI Assistant Features

The AI assistant helps users create campaigns by:
- Asking for campaign name
- Guiding through objective selection
- Requesting budget information
- Confirming campaign details before creation
- Providing feedback on successful creation

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for hot reloading
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite dev server
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Database Schema

The application automatically initializes the database with the required tables and sample data on first run. The schema includes:

- `campaigns` table with campaign data
- `adsets` table linked to campaigns
- `ads` table linked to adsets
- Foreign key relationships for data integrity

## Future Enhancements

- Real Facebook Ads API integration
- WebSocket support for real-time chat
- User authentication and authorization
- Campaign performance metrics
- Advanced targeting options
- Bulk campaign operations