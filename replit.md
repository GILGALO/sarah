# GILGALO-TRADER AI

## Overview

This is an AI-powered forex trading signal generator application. The system analyzes currency pairs and generates buy/sell signals with confidence ratings using OpenAI's GPT models. It features a dark cyber-tech themed dashboard that displays real-time trading signals, market charts, session indicators, and signal history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling
- **Charts**: Recharts for market data visualization
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful endpoints defined in `shared/routes.ts`
- **Build Process**: Custom build script using esbuild for server bundling and Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for database schema management (`npm run db:push`)
- **Tables**:
  - `signals`: Stores trading signals with pair, action, confidence, timing, and analysis
  - `market_data`: Stores price data for currency pairs
  - `conversations` and `messages`: Chat functionality tables (from AI integrations)

### API Structure
Routes are defined in `shared/routes.ts` with Zod validation:
- `GET /api/signals` - List all signals
- `GET /api/signals/latest` - Get the most recent signal
- `POST /api/signals` - Generate a new AI-powered signal
- `GET /api/market/:pair` - Get market data for a currency pair

### AI Integration
- Uses OpenAI API through Replit AI Integrations
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
- GPT-4o model for signal analysis and generation
- Includes pre-built integrations for chat, image generation, and batch processing in `server/replit_integrations/`

## External Dependencies

### Third-Party Services
- **OpenAI API**: Powers the AI signal generation via Replit AI Integrations
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)

### Key NPM Packages
- **drizzle-orm** + **drizzle-zod**: Database ORM and schema validation
- **@tanstack/react-query**: Server state management
- **recharts**: Chart visualization
- **framer-motion**: Animations
- **date-fns**: Date/time formatting
- **zod**: Runtime type validation
- **shadcn/ui components**: Full set of Radix-based UI primitives

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key from Replit integrations
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI base URL from Replit integrations