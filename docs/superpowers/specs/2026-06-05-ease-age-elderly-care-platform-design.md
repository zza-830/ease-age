# EaseAge - Elderly Care Platform Design Specification

**Project Name:** EaseAge (颐智相伴)
**Date:** 2026-06-05
**Version:** 1.0.0
**Status:** Draft - Pending Review

---

## 1. Executive Summary

EaseAge is a comprehensive one-stop elderly care service platform that combines AI-powered emotional companionship, health management, value-added services, and family collaboration. The platform targets family members, caregivers, and elderly care institutions, with a simplified elderly interface planned for future phases.

### Key Features
- Bidirectional video communication with family members
- Value-added service marketplace (housekeeping, meal delivery, medical accompaniment)
- Elderly-focused knowledge base with family access
- Health management with medication reminders and checkup records
- Digital human companionship (Phase 2)
- Safety monitoring and alerts (Phase 3)

---

## 2. System Architecture

### 2.1 Architecture Overview

The system follows a microservices architecture with three main service tiers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                                     │
├──────────────────────┬──────────────────────┬───────────────────────────┤
│   Family Web Portal  │  Institution Portal  │   Elderly Simple Portal   │
│   (Primary Client)   │  (Management)        │   (Future - Mobile)       │
├──────────────────────┴──────────────────────┴───────────────────────────┤
│   React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui              │
│   State: Zustand | Router: React Router v6 | Animation: Framer Motion  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY TIER                                 │
│                         Nginx / Traefik                                 │
├─────────────────────────────────────────────────────────────────────────┤
│   • SSL Termination    • Rate Limiting    • Load Balancing              │
│   • Request Routing    • CORS Handling    • Static File Serving         │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  BUSINESS API   │   │    AI SERVICE   │   │  REALTIME SERVICE│
│   (Node.js)     │   │   (Python)      │   │   (Node.js)      │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ Express.js      │   │ FastAPI         │   │ Socket.io        │
│ TypeScript      │   │ Python 3.11+    │   │ TypeScript       │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ • Authentication│   │ • Digital Human │   │ • Video Calls    │
│ • User CRUD     │   │ • Emotion AI    │   │ • Voice Calls    │
│ • Health Data   │   │ • Knowledge RAG │   │ • Instant Message│
│ • Service Orders│   │ • Voice Process │   │ • Notifications  │
│ • Knowledge CRUD│   │ • Image Analysis│   │ • Presence Status│
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   DATA STORAGE TIER │
                    ├─────────────────────┤
                    │ PostgreSQL 15       │
                    │ Redis 7             │
                    │ MinIO               │
                    │ Milvus / Qdrant     │
                    └─────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18 + TypeScript | Component-based UI development |
| Build Tool | Vite | Fast development and build |
| CSS Framework | Tailwind CSS | Utility-first styling |
| UI Components | shadcn/ui | Accessible, customizable components |
| Icons | Lucide React | Consistent, lightweight icons |
| Animation | Framer Motion | Smooth UI transitions |
| State Management | Zustand | Lightweight state management |
| Routing | React Router v6 | Client-side routing |
| Business API | Express.js + TypeScript | RESTful API services |
| AI Service | Python FastAPI | High-performance async AI inference |
| Realtime Service | Socket.io + WebRTC | Video calls, instant messaging |
| Database | PostgreSQL 15 | Primary relational database |
| Cache | Redis 7 | Session management, caching |
| File Storage | MinIO | Object storage for media files |
| Vector Database | Milvus / Qdrant | Knowledge base RAG search |

---

## 3. Feature Modules

### Phase 1 - MVP (Minimum Viable Product)

#### 3.1 Video Communication Module
- **Contact List**: Display family members and caregivers
- **Video Call**: WebRTC-based peer-to-peer video calling
- **Voice Call**: Audio-only communication option
- **Instant Messaging**: Text, image, voice message support
- **Call History**: Record of past communications

#### 3.2 Service Marketplace Module
- **Service Categories**: Housekeeping, meal delivery, medical accompaniment, repairs
- **Service Listing**: Browse available services with details
- **Booking System**: Schedule service appointments
- **Order Management**: Track order status, view history
- **Review System**: Rate and review completed services

#### 3.3 Knowledge Base Module
- **Knowledge Categories**: Health maintenance, disease prevention, psychological care, daily tips
- **Article System**: Rich text articles with images
- **Family Information**: Store family photos, videos, memories
- **AI Q&A Assistant**: Chat-based knowledge retrieval
- **Bookmark System**: Save favorite articles

#### 3.4 Health Management Module
- **Health Profile**: Elderly person's basic health information
- **Medication Reminders**: Schedule and track medication intake
- **Checkup Records**: Store and view medical examination results
- **Health Reports**: Generated summaries of health data
- **Vital Signs Charts**: Visualize blood pressure, heart rate, etc.

#### 3.5 Dashboard Module
- **Status Overview**: Quick view of elderly person's status
- **Health Data Visualization**: Charts and graphs
- **Recent Activity**: Timeline of recent events
- **Quick Actions**: Common operation shortcuts

#### 3.6 System Settings Module
- **Profile Management**: Update personal information
- **Notification Preferences**: Configure alert settings
- **Privacy Settings**: Control data sharing permissions
- **Account Security**: Password change, two-factor auth

### Phase 2 - Enhanced Features

#### 3.7 Digital Human Companionship Module
- **Avatar Creation**: Generate digital human from photo
- **Voice Cloning**: Replicate family member's voice
- **Emotional Dialogue**: Context-aware conversations
- **Memory System**: Remember past interactions
- **Proactive Care**: Initiate conversations based on behavior

#### 3.8 Family Collaboration Module
- **Member Management**: Add/remove family members
- **Permission System**: Role-based access control
- **Alert Notifications**: Configurable alert rules
- **Task Assignment**: Coordinate caregiving responsibilities

### Phase 3 - Advanced Features

#### 3.9 Safety Monitoring Module
- **Real-time Monitoring**: Live video feed (with privacy controls)
- **Fall Detection**: AI-powered fall detection alerts
- **Geofencing**: Electronic boundary alerts
- **Inspection Reports**: Automated safety check reports

#### 3.10 Community Service Module
- **Community Announcements**: Local news and updates
- **Activity Calendar**: Community events scheduling
- **Neighbor Assistance**: Peer-to-peer help network
- **Service Provider Management**: Manage community caregivers

#### 3.11 Analytics Dashboard Module
- **Health Trend Analysis**: Long-term health data patterns
- **Service Usage Statistics**: Platform usage metrics
- **Operations Dashboard**: Management-level analytics

---

## 4. Database Design

### 4.1 Core Tables

#### Users and Permissions

```sql
-- User accounts table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('elderly', 'family', 'staff', 'admin')),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Elderly person profile
CREATE TABLE elderly_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    full_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    identity_card_number VARCHAR(18),
    residential_address TEXT,
    emergency_contact_phone VARCHAR(20),
    medical_history_json JSONB,
    allergy_description TEXT,
    blood_type VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family member relationships
CREATE TABLE family_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    relationship_type VARCHAR(20) NOT NULL,
    is_primary_contact BOOLEAN DEFAULT false,
    permissions_json JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, elderly_profile_id)
);
```

#### Health Management

```sql
-- Health measurement records
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    record_type VARCHAR(50) NOT NULL,
    measurement_value_json JSONB NOT NULL,
    measurement_unit VARCHAR(20),
    measured_at TIMESTAMP NOT NULL,
    source_device_identifier VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication tracking
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    medication_name VARCHAR(100) NOT NULL,
    dosage_description VARCHAR(50),
    frequency_description VARCHAR(50),
    start_date DATE,
    end_date DATE,
    reminder_schedule_json JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical checkup records
CREATE TABLE medical_checkups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    hospital_name VARCHAR(100),
    checkup_date DATE NOT NULL,
    report_file_url VARCHAR(500),
    summary_text TEXT,
    results_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Service Marketplace

```sql
-- Service categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(50) NOT NULL,
    icon_identifier VARCHAR(50),
    description_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Service offerings
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES service_categories(id),
    service_name VARCHAR(100) NOT NULL,
    description_text TEXT,
    base_price DECIMAL(10,2),
    price_unit VARCHAR(20),
    image_urls_json JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service orders
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    service_id UUID NOT NULL REFERENCES services(id),
    order_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    scheduled_service_time TIMESTAMP,
    service_address TEXT,
    special_instructions TEXT,
    customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Knowledge Base

```sql
-- Knowledge categories (supports hierarchical structure)
CREATE TABLE knowledge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(50) NOT NULL,
    parent_category_id UUID REFERENCES knowledge_categories(id),
    icon_identifier VARCHAR(50),
    display_order INTEGER DEFAULT 0
);

-- Knowledge articles
CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES knowledge_categories(id),
    title VARCHAR(200) NOT NULL,
    content_markdown TEXT NOT NULL,
    summary_text TEXT,
    cover_image_url VARCHAR(500),
    author_name VARCHAR(50),
    tags_json JSONB DEFAULT '[]',
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family memories and information
CREATE TABLE family_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_profile_id UUID NOT NULL REFERENCES elderly_profiles(id),
    family_user_id UUID NOT NULL REFERENCES users(id),
    memory_type VARCHAR(20) CHECK (memory_type IN ('photo', 'video', 'text', 'voice')),
    content_text TEXT,
    file_url VARCHAR(500),
    description_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Communication

```sql
-- Conversation threads
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_type VARCHAR(20) CHECK (conversation_type IN ('private', 'group')),
    conversation_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation participants
CREATE TABLE conversation_members (
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    message_type VARCHAR(20) CHECK (message_type IN ('text', 'image', 'video', 'voice', 'system')),
    content_text TEXT,
    file_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video call history
CREATE TABLE video_call_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caller_user_id UUID NOT NULL REFERENCES users(id),
    callee_user_id UUID NOT NULL REFERENCES users(id),
    call_status VARCHAR(20) CHECK (call_status IN ('ringing', 'connected', 'ended', 'missed')),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER
);
```

---

## 5. API Design

### 5.1 RESTful API Endpoints

#### Authentication
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - User login
POST   /api/v1/auth/refresh-token     - Refresh JWT token
POST   /api/v1/auth/logout            - User logout
POST   /api/v1/auth/forgot-password   - Password reset request
POST   /api/v1/auth/reset-password    - Reset password with token
```

#### User Management
```
GET    /api/v1/users/me                - Get current user profile
PUT    /api/v1/users/me/profile        - Update current user profile
GET    /api/v1/users/{userId}          - Get user details (admin)
GET    /api/v1/users/{userId}/elderly-profile  - Get elderly profile
POST   /api/v1/users/{userId}/elderly-profile  - Create elderly profile
PUT    /api/v1/users/{userId}/elderly-profile  - Update elderly profile
GET    /api/v1/users/{userId}/family-relations  - Get family relations
POST   /api/v1/users/{userId}/family-relations  - Add family relation
DELETE /api/v1/users/{userId}/family-relations/{relationId}  - Remove relation
```

#### Health Management
```
GET    /api/v1/elderly/{elderlyId}/health-records      - List health records
POST   /api/v1/elderly/{elderlyId}/health-records      - Add health record
GET    /api/v1/elderly/{elderlyId}/health-records/{id}  - Get specific record
DELETE /api/v1/elderly/{elderlyId}/health-records/{id}  - Delete record

GET    /api/v1/elderly/{elderlyId}/medications          - List medications
POST   /api/v1/elderly/{elderlyId}/medications          - Add medication
PUT    /api/v1/elderly/{elderlyId}/medications/{id}     - Update medication
DELETE /api/v1/elderly/{elderlyId}/medications/{id}     - Delete medication

GET    /api/v1/elderly/{elderlyId}/medical-checkups     - List checkups
POST   /api/v1/elderly/{elderlyId}/medical-checkups     - Add checkup record
GET    /api/v1/elderly/{elderlyId}/medical-checkups/{id} - Get checkup detail
```

#### Service Marketplace
```
GET    /api/v1/service-categories                - List all categories
GET    /api/v1/services?categoryId={id}          - List services by category
GET    /api/v1/services/{serviceId}              - Get service details
POST   /api/v1/orders                            - Create new order
GET    /api/v1/orders                            - List user's orders
GET    /api/v1/orders/{orderId}                  - Get order details
PUT    /api/v1/orders/{orderId}/status           - Update order status
POST   /api/v1/orders/{orderId}/review           - Submit review
```

#### Knowledge Base
```
GET    /api/v1/knowledge/categories              - List categories
GET    /api/v1/knowledge/articles                - List articles (paginated)
GET    /api/v1/knowledge/articles/{articleId}    - Get article detail
POST   /api/v1/knowledge/articles/{articleId}/bookmark  - Bookmark article
DELETE /api/v1/knowledge/articles/{articleId}/bookmark  - Remove bookmark
GET    /api/v1/knowledge/bookmarks               - List bookmarked articles

GET    /api/v1/family-memories                   - List family memories
POST   /api/v1/family-memories                   - Add family memory
DELETE /api/v1/family-memories/{memoryId}        - Delete memory
```

#### AI Service (via Business API proxy)
```
POST   /api/v1/ai/knowledge/search               - Semantic search
POST   /api/v1/ai/knowledge/rag-query             - RAG-based Q&A
POST   /api/v1/ai/emotion/analyze                 - Analyze text emotion
POST   /api/v1/ai/voice/synthesize                - Text-to-speech
POST   /api/v1/ai/voice/recognize                 - Speech-to-text
```

### 5.2 WebSocket Events (Realtime Service)

```typescript
// Client → Server Events
'call:initiate'     - Start a video/voice call
'call:accept'       - Accept incoming call
'call:reject'       - Reject incoming call
'call:end'          - End active call
'message:send'      - Send a message
'typing:start'      - User started typing
'typing:stop'       - User stopped typing
'presence:update'   - Update online status

// Server → Client Events
'call:incoming'     - Incoming call notification
'call:connected'    - Call established
'call:ended'        - Call terminated
'message:receive'   - New message received
'message:read'      - Message read receipt
'typing:indicator'  - Someone is typing
'presence:changed'  - User status changed
'notification:new'  - System notification
```

---

## 6. UI/UX Design Guidelines

### 6.1 Design Principles

1. **Clarity and Readability**
   - Minimum font size: 16px for body text
   - Title font size: 24px or larger
   - High contrast color combinations (WCAG AA compliant)
   - Line height: 1.6 or greater
   - Adequate spacing between paragraphs

2. **Simple Interactions**
   - Large touch targets (minimum 48x48px)
   - Clear action feedback (visual + haptic)
   - Minimize navigation depth (one-click access preferred)
   - Consistent interaction patterns

3. **Warm and Caring Aesthetic**
   - Warm color palette (orange, yellow, light brown)
   - Rounded corners on all UI elements
   - Soft shadows for depth
   - Friendly illustrations and icons

4. **Progressive Disclosure**
   - Card-based layout for information grouping
   - Highlight important information
   - Show details on demand
   - Avoid information overload

### 6.2 Color Palette

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary (Warm Orange) | ![#f97316](https://via.placeholder.com/15/f97316/f97316) | #f97316 |
| Secondary (Trust Blue) | ![#3b82f6](https://via.placeholder.com/15/3b82f6/3b82f6) | #3b82f6 |
| Success (Health Green) | ![#22c55e](https://via.placeholder.com/15/22c55e/22c55e) | #22c55e |
| Warning (Alert Red) | ![#ef4444](https://via.placeholder.com/15/ef4444/ef4444) | #ef4444 |
| Background (Warm Gray) | ![#f5f5f4](https://via.placeholder.com/15/f5f5f4/f5f5f4) | #f5f5f4 |
| Text Primary | ![#1c1917](https://via.placeholder.com/15/1c1917/1c1917) | #1c1917 |
| Text Secondary | ![#78716c](https://via.placeholder.com/15/78716c/78716c) | #78716c |

### 6.3 Typography

- **Font Family**: Inter (primary), system-ui (fallback)
- **Body Text**: 16px / 1.6 line-height
- **Headings**: 24px-32px / 1.3 line-height
- **Small Text**: 14px (minimum for secondary info)

### 6.4 Component Library

- **Icons**: Lucide React (consistent, lightweight, customizable)
- **Animations**: Framer Motion (page transitions, card animations, loading states)
- **Charts**: Recharts (health data visualization)
- **Illustrations**: unDraw / Storyset (free, consistent style)

---

## 7. Project Structure

```
ease-age/
├── README.md
├── package.json                    # Workspace configuration
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── apps/
│   ├── web/                        # Frontend application
│   │   ├── src/
│   │   │   ├── app/                # Page routes
│   │   │   │   ├── layout.tsx      # Root layout
│   │   │   │   ├── page.tsx        # Dashboard homepage
│   │   │   │   ├── video-chat/     # Video communication
│   │   │   │   ├── services/       # Service marketplace
│   │   │   │   ├── knowledge/      # Knowledge base
│   │   │   │   ├── health/         # Health management
│   │   │   │   └── settings/       # System settings
│   │   │   ├── components/         # Shared components
│   │   │   │   ├── ui/             # shadcn/ui components
│   │   │   │   ├── layout/         # Layout components
│   │   │   │   └── shared/         # Business components
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── lib/                # Utility functions
│   │   │   ├── stores/             # Zustand state stores
│   │   │   ├── types/              # TypeScript type definitions
│   │   │   └── styles/             # Global styles
│   │   ├── public/                 # Static assets
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   ├── server/                     # Node.js Business API
│   │   ├── src/
│   │   │   ├── routes/             # API route handlers
│   │   │   ├── controllers/        # Request controllers
│   │   │   ├── services/           # Business logic services
│   │   │   ├── models/             # Database models
│   │   │   ├── middleware/         # Express middleware
│   │   │   ├── utils/              # Utility functions
│   │   │   └── index.ts            # Application entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ai-service/                 # Python AI Service
│       ├── app/
│       │   ├── api/                # FastAPI route handlers
│       │   ├── core/               # Core configuration
│       │   ├── models/             # Pydantic models
│       │   ├── services/           # AI service implementations
│       │   │   ├── digital_human/  # Digital human generation
│       │   │   ├── emotion/        # Emotion analysis
│       │   │   ├── knowledge/      # Knowledge RAG
│       │   │   └── voice/          # Voice processing
│       │   └── main.py             # FastAPI entry point
│       ├── requirements.txt
│       └── pyproject.toml
│
├── packages/                       # Shared packages
│   ├── shared-types/               # Shared TypeScript types
│   ├── ui-components/              # Shared UI components
│   └── utils/                      # Shared utility functions
│
├── database/                       # Database resources
│   ├── migrations/                 # Schema migrations
│   ├── seeds/                      # Seed data
│   └── schema.sql                  # Complete schema
│
├── docs/                           # Documentation
│   ├── api/                        # API documentation
│   ├── design/                     # Design specifications
│   └── deployment/                 # Deployment guides
│
└── scripts/                        # Development scripts
    ├── setup.sh                    # Environment setup
    ├── dev.sh                      # Start development
    └── deploy.sh                   # Deployment script
```

---

## 8. Development Workflow

### 8.1 Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd ease-age

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
pnpm run db:migrate
pnpm run db:seed

# Start development servers
pnpm dev
```

### 8.2 Development Commands

```bash
# Start all services
pnpm dev

# Start frontend only
pnpm --filter web dev

# Start business API only
pnpm --filter server dev

# Start AI service only
cd apps/ai-service
python -m uvicorn app.main:app --reload --port 8000

# Run tests
pnpm test

# Build for production
pnpm build
```

### 8.3 Code Quality

- **Linting**: ESLint + Prettier for TypeScript/JavaScript
- **Type Checking**: Strict TypeScript configuration
- **Testing**: Jest + React Testing Library for frontend, pytest for Python
- **Git Hooks**: Husky + lint-staged for pre-commit checks

---

## 9. Deployment

### 9.1 Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: yizhi_xiangban
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - server

  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
      - minio

  ai-service:
    build:
      context: .
      dockerfile: apps/ai-service/Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      - postgres

volumes:
  postgres_data:
  minio_data:
```

### 9.2 Production Deployment

- **Frontend**: Vercel / Netlify / Cloudflare Pages
- **Backend Services**: Docker containers on cloud VMs
- **Database**: Managed PostgreSQL (AWS RDS, Supabase, etc.)
- **File Storage**: S3-compatible object storage
- **CDN**: Cloudflare / AWS CloudFront

---

## 10. Security Considerations

### 10.1 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on authentication endpoints
- Password hashing with bcrypt

### 10.2 Data Protection
- All API endpoints require authentication (except login/register)
- Sensitive data encrypted at rest
- HTTPS enforced in production
- CORS properly configured

### 10.3 Privacy
- Video call data not stored by default
- Health data access logged for audit
- User consent for data collection
- GDPR-compliant data deletion

---

## 11. Future Considerations

### 11.1 Scalability
- Horizontal scaling of stateless services
- Database read replicas for heavy read workloads
- Message queue for async processing (RabbitMQ/Kafka)
- CDN for static assets and media files

### 11.2 Mobile Applications
- React Native for iOS/Android
- Shared business logic with web platform
- Push notifications for alerts
- Offline capability for critical features

### 11.3 IoT Integration
- Smart device API for health monitors
- Wearable device data synchronization
- Home automation integration
- Emergency button hardware support

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| RAG | Retrieval-Augmented Generation - AI technique combining search with generation |
| WebRTC | Web Real-Time Communication - Browser-based peer-to-peer video/audio |
| JWT | JSON Web Token - Stateless authentication mechanism |
| RBAC | Role-Based Access Control - Permission system based on user roles |
| CRUD | Create, Read, Update, Delete - Basic data operations |

---

## Appendix B: Reference Projects

1. **GDUT DaChuang Guide System** - React + Express full-stack reference
2. **English Writing Learning System** - React + TypeScript + Tailwind CSS reference
3. **颐智相伴 Business Plan** - Feature requirements and market analysis

---

*Document generated on 2026-06-05. Subject to review and approval.*
