# Facebook Ad Campaign Manager

A full-stack web application for managing Facebook ad campaigns with AI-powered assistance and hierarchical navigation through campaigns, ad sets, and ads.

## Features

### Core Functionality
- **User Authentication**: JWT-based login and registration system
- **Campaign Dashboard**: View all campaigns with status, objectives, and creation dates
- **Ad Sets Management**: Navigate to and manage ad sets within campaigns
- **Ads Management**: Create and manage individual ads within ad sets
- **Hierarchical Navigation**: Campaign → Ad Sets → Ads workflow

### AI-Powered Assistant
- **Context-Aware AI**: Chat interface that adapts based on current page (campaigns/adsets/ads)
- **Smart CRUD Operations**: AI can create, read, update, and delete entities based on context
- **Auto-Refresh**: Pages automatically refresh when AI tools make changes
- **Interactive Creation**: Guide users through creating campaigns, ad sets, and ads

### Technical Features
- **Real-time Updates**: Live chat interface with automatic page refresh
- **PostgreSQL Storage**: Persistent data storage with proper foreign key relationships
- **Shared Type System**: Unified TypeScript types between frontend and backend
- **RESTful API**: Comprehensive API with nested routes for hierarchical data

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **PostgreSQL** for database with foreign key relationships
- **Anthropic Claude API** with function calling for AI assistance
- **JWT** for authentication
- **bcrypt** for password hashing
- **pg** for database connectivity

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Query** for state management and API calls
- **React Router** for hierarchical navigation
- **React Context** for authentication state
- **Lucide React** for icons

### Shared
- **TypeScript types** shared between frontend and backend
- **Common interfaces** for API requests/responses

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

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

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

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Campaigns
- `GET /api/campaigns` - Get all campaigns for authenticated user
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Ad Sets
- `GET /api/campaigns/:campaignId/adsets` - Get all ad sets for a campaign
- `GET /api/adsets/:id` - Get ad set by ID
- `POST /api/adsets` - Create new ad set
- `PUT /api/adsets/:id` - Update ad set
- `DELETE /api/adsets/:id` - Delete ad set

### Ads
- `GET /api/adsets/:adsetId/ads` - Get all ads for an ad set
- `GET /api/ads/:id` - Get ad by ID
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad

### Chat
- `POST /api/chat` - Send message to AI assistant with context
- `DELETE /api/chat/context` - Clear chat context

## Data Models

All types are shared between frontend and backend via the `/shared/types` directory.

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}
```

### Campaign
```typescript
interface Campaign {
  id: string;
  name: string;
  objective: "OUTCOME_TRAFFIC" | "OUTCOME_AWARENESS" | "OUTCOME_ENGAGEMENT" | "OUTCOME_LEADS";
  status: "PAUSED" | "ACTIVE";
  stop_time: number; // timestamp
  user_id: string;
  created_at?: string;
}
```

### AdSet
```typescript
interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  daily_budget: number; // budget in cents
  created_at?: string;
}
```

### Ad
```typescript
interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative_id: string;
  status: "PAUSED" | "ACTIVE";
  created_at?: string;
}
```

### Chat
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  shouldRefresh?: boolean;
  actionResult?: any;
}

interface ChatRequest {
  message: string;
  action?: string;
  campaignData?: any;
  context?: 'campaigns' | 'adsets' | 'ads';
  contextData?: any;
}
```

## Usage

### Authentication
1. **Register**: Create a new account with email, password, and name
2. **Login**: Sign in with your credentials to access the dashboard

### Navigation
1. **Dashboard**: View all campaigns, click any campaign to navigate to its ad sets
2. **Ad Sets Page**: View ad sets for a campaign, click any ad set to see its ads
3. **Ads Page**: View and manage individual ads within an ad set
4. **Breadcrumb Navigation**: Use back buttons to navigate between levels

### AI Assistant Features
The AI assistant adapts to your current page context:

#### On Campaigns Page:
- Create new campaigns: "Create a new traffic campaign"
- View campaigns: "Show me all my campaigns"
- Update campaigns: "Change the objective of campaign X to awareness"
- Delete campaigns: "Delete the campaign named X"

#### On Ad Sets Page:
- Create ad sets: "Create a new ad set with $50 daily budget"
- View ad sets: "Show me all ad sets for this campaign"
- Update ad sets: "Change the budget to $75 for ad set X"
- Delete ad sets: "Delete ad set X"

#### On Ads Page:
- Create ads: "Create a new ad with creative ID 12345"
- View ads: "Show me all ads in this ad set"
- Update ads: "Pause the ad named X"
- Delete ads: "Delete ad X"

### Key Features:
- **Auto-refresh**: Pages automatically refresh when AI makes changes
- **Context-aware**: AI knows which page you're on and provides relevant assistance
- **Smart conversations**: AI remembers context within conversations
- **Real-time feedback**: Immediate confirmation when actions are completed

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

The application automatically initializes the database with the required tables on first run:

### Tables
- **`users`** - User accounts with authentication
- **`campaigns`** - Campaign data linked to users
- **`adsets`** - Ad sets linked to campaigns
- **`ads`** - Individual ads linked to ad sets

### Relationships
- `campaigns.user_id` → `users.id` (user owns campaigns)
- `adsets.campaign_id` → `campaigns.id` (campaign contains ad sets)
- `ads.adset_id` → `adsets.id` (ad set contains ads)
- Foreign key constraints with CASCADE delete for data integrity

### Key Features
- PostgreSQL with proper indexing
- UUID primary keys for all entities
- Timestamp tracking for created_at fields
- User isolation (users only see their own data)

## Project Structure

```
ad_campaign_manager/
├── shared/                    # Shared TypeScript types
│   └── types/
│       └── index.ts          # Common interfaces
├── backend/
│   ├── src/
│   │   ├── controllers/      # API route handlers
│   │   ├── middleware/       # Auth, validation middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic, AI service
│   │   │   └── ai-agent-service/  # AI tools and prompts
│   │   └── types/           # Re-exports shared types
│   └── dist/                # Compiled JavaScript
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── contexts/        # React contexts (auth)
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   ├── services/       # API calls
    │   └── types/          # Re-exports shared types
    └── dist/               # Build output
```

## AI System Architecture

### Context-Based Tools
The AI system uses different tool sets based on the current page:
- **Campaigns context**: Campaign CRUD operations
- **AdSets context**: Ad set CRUD operations  
- **Ads context**: Ad CRUD operations

### Tool Execution Flow
1. User sends message with context information
2. AI selects appropriate tools based on context
3. AI executes tools via function calling
4. Database operations performed
5. Frontend automatically refreshes via React Query invalidation

### Prompt System
- Context-specific system prompts
- Conversation history tracking per user
- Error handling with context-aware messages
- Structured response generation

## Future Enhancements

- Real Facebook Ads API integration
- WebSocket support for real-time collaborative editing
- Campaign performance metrics and analytics
- Advanced targeting options and audience management
- Bulk operations for campaigns, ad sets, and ads
- Campaign templates and duplication
- A/B testing framework
- Automated bidding strategies
- Reporting dashboard with charts and insights