# EaseAge Phase 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the EaseAge elderly care platform MVP with video chat, service marketplace, knowledge base, and health management features.

**Architecture:** React frontend + Express.js backend + PostgreSQL database, using pnpm monorepo structure. Phase 1 focuses on core CRUD operations and UI, with video chat using WebRTC signaling and AI features stubbed for later integration.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, Express.js, PostgreSQL, Prisma ORM, Socket.io

---

## File Structure

```
ease-age/
├── package.json                    # Workspace root
├── pnpm-workspace.yaml
├── turbo.json                      # Turborepo config
├── .env.example
├── .gitignore
│
├── apps/
│   ├── web/                        # React frontend
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── vite-env.d.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn components
│   │   │   │   ├── layout/
│   │   │   │   │   ├── AppLayout.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   └── NavigationMenu.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── StatusCard.tsx
│   │   │   │       └── LoadingSpinner.tsx
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── VideoChatPage.tsx
│   │   │   │   ├── ServicesPage.tsx
│   │   │   │   ├── KnowledgePage.tsx
│   │   │   │   ├── HealthPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   ├── useAuthStore.ts
│   │   │   │   ├── useHealthStore.ts
│   │   │   │   └── useServiceStore.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useApi.ts
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   └── utils.ts
│   │   │   │
│   │   │   └── types/
│   │   │       └── index.ts
│   │   │
│   │   └── public/
│   │
│   └── server/                     # Express backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── config/
│       │   │   └── database.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   └── errorHandler.ts
│       │   ├── routes/
│       │   │   ├── auth.routes.ts
│       │   │   ├── user.routes.ts
│       │   │   ├── health.routes.ts
│       │   │   ├── service.routes.ts
│       │   │   └── knowledge.routes.ts
│       │   ├── controllers/
│       │   │   ├── auth.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── health.controller.ts
│       │   │   ├── service.controller.ts
│       │   │   └── knowledge.controller.ts
│       │   └── services/
│       │       ├── auth.service.ts
│       │       ├── user.service.ts
│       │       ├── health.service.ts
│       │       ├── service.service.ts
│       │       └── knowledge.service.ts
│       └── prisma/
│           └── schema.prisma
│
├── packages/
│   └── shared-types/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
│
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

---

## Task 1: Initialize Monorepo Structure

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "ease-age",
  "private": true,
  "version": "0.1.0",
  "description": "EaseAge - Elderly Care Platform",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "db:migrate": "cd apps/server && pnpm prisma migrate dev",
    "db:seed": "cd apps/server && pnpm prisma db seed",
    "db:studio": "cd apps/server && pnpm prisma studio"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.2.0",
    "eslint": "^8.56.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18"
  }
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

- [ ] **Step 4: Create .env.example**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ease_age"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:4000/api/v1
VITE_WS_URL=http://localhost:4000

# MinIO (optional for Phase 1)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

- [ ] **Step 5: Create .gitignore**

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.turbo/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Prisma
apps/server/prisma/migrations/

# Misc
.superpowers/
```

- [ ] **Step 6: Initialize git and commit**

```bash
cd /home/zza/EaseAge
git init
git add .
git commit -m "chore: initialize monorepo structure"
```

---

## Task 2: Setup Shared Types Package

**Files:**
- Create: `packages/shared-types/package.json`
- Create: `packages/shared-types/tsconfig.json`
- Create: `packages/shared-types/src/index.ts`

- [ ] **Step 1: Create shared-types package.json**

```json
{
  "name": "@ease-age/shared-types",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create shared-types tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create shared types index.ts**

```typescript
// User types
export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'elderly' | 'family' | 'staff' | 'admin';

export interface ElderlyProfile {
  id: string;
  userId: string;
  fullName: string;
  gender: 'male' | 'female' | null;
  birthDate: string | null;
  identityCardNumber: string | null;
  residentialAddress: string | null;
  emergencyContactPhone: string | null;
  medicalHistoryJson: Record<string, unknown> | null;
  allergyDescription: string | null;
  bloodType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyRelation {
  id: string;
  userId: string;
  elderlyProfileId: string;
  relationshipType: string;
  isPrimaryContact: boolean;
  permissionsJson: Record<string, unknown>;
  createdAt: string;
}

// Health types
export interface HealthRecord {
  id: string;
  elderlyProfileId: string;
  recordType: HealthRecordType;
  measurementValueJson: Record<string, number>;
  measurementUnit: string;
  measuredAt: string;
  sourceDeviceIdentifier: string | null;
  notes: string | null;
  createdAt: string;
}

export type HealthRecordType = 
  | 'blood_pressure'
  | 'heart_rate'
  | 'blood_sugar'
  | 'body_temperature'
  | 'weight'
  | 'blood_oxygen';

export interface Medication {
  id: string;
  elderlyProfileId: string;
  medicationName: string;
  dosageDescription: string;
  frequencyDescription: string;
  startDate: string | null;
  endDate: string | null;
  reminderScheduleJson: string[];
  isActive: boolean;
  createdAt: string;
}

export interface MedicalCheckup {
  id: string;
  elderlyProfileId: string;
  hospitalName: string;
  checkupDate: string;
  reportFileUrl: string | null;
  summaryText: string | null;
  resultsJson: Record<string, unknown> | null;
  createdAt: string;
}

// Service types
export interface ServiceCategory {
  id: string;
  categoryName: string;
  iconIdentifier: string;
  descriptionText: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  categoryId: string;
  serviceName: string;
  descriptionText: string;
  basePrice: number;
  priceUnit: string;
  imageUrlsJson: string[];
  isActive: boolean;
  category?: ServiceCategory;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  userId: string;
  elderlyProfileId: string;
  serviceId: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  scheduledServiceTime: string;
  serviceAddress: string;
  specialInstructions: string | null;
  customerRating: number | null;
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  elderlyProfile?: ElderlyProfile;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled';

// Knowledge types
export interface KnowledgeCategory {
  id: string;
  categoryName: string;
  parentCategoryId: string | null;
  iconIdentifier: string;
  displayOrder: number;
  children?: KnowledgeCategory[];
}

export interface KnowledgeArticle {
  id: string;
  categoryId: string;
  title: string;
  contentMarkdown: string;
  summaryText: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  tagsJson: string[];
  viewCount: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: KnowledgeCategory;
}

export interface FamilyMemory {
  id: string;
  elderlyProfileId: string;
  familyUserId: string;
  memoryType: 'photo' | 'video' | 'text' | 'voice';
  contentText: string | null;
  fileUrl: string | null;
  descriptionText: string | null;
  createdAt: string;
}

// Communication types
export interface Conversation {
  id: string;
  conversationType: 'private' | 'group';
  conversationName: string | null;
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  messageType: 'text' | 'image' | 'video' | 'voice' | 'system';
  contentText: string | null;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface VideoCallRecord {
  id: string;
  callerUserId: string;
  calleeUserId: string;
  callStatus: 'ringing' | 'connected' | 'ended' | 'missed';
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/shared-types
git commit -m "feat: add shared types package"
```

---

## Task 3: Setup Express Backend

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/src/index.ts`
- Create: `apps/server/src/config/database.ts`
- Create: `apps/server/src/middleware/errorHandler.ts`

- [ ] **Step 1: Create server package.json**

```json
{
  "name": "@ease-age/server",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "tsc --noEmit",
    "prisma": "prisma",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@ease-age/shared-types": "workspace:*",
    "@prisma/client": "^5.8.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.0",
    "prisma": "^5.8.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create server tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create database config**

```typescript
// apps/server/src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

- [ ] **Step 4: Create error handler middleware**

```typescript
// apps/server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
```

- [ ] **Step 5: Create main server entry point**

```typescript
// apps/server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://easeage.com' 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be added here
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/health', healthRoutes);
// app.use('/api/v1/services', serviceRoutes);
// app.use('/api/v1/knowledge', knowledgeRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EaseAge API server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
```

- [ ] **Step 6: Create Prisma schema**

```prisma
// apps/server/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  phoneNumber   String    @unique @map("phone_number")
  passwordHash  String    @map("password_hash")
  fullName      String    @map("full_name")
  role          String    // elderly, family, staff, admin
  avatarUrl     String?   @map("avatar_url")
  isActive      Boolean   @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  elderlyProfile    ElderlyProfile?
  familyRelations   FamilyRelation[]
  orders            ServiceOrder[]
  sentMessages      Message[]         @relation("MessageSender")
  conversations     ConversationMember[]
  callerCalls       VideoCallRecord[] @relation("CallerUser")
  calleeCalls       VideoCallRecord[] @relation("CalleeUser")

  @@map("users")
}

model ElderlyProfile {
  id                    String    @id @default(uuid())
  userId                String    @unique @map("user_id")
  fullName              String    @map("full_name")
  gender                String?   // male, female
  birthDate             DateTime? @map("birth_date")
  identityCardNumber    String?   @map("identity_card_number")
  residentialAddress    String?   @map("residential_address")
  emergencyContactPhone String?   @map("emergency_contact_phone")
  medicalHistoryJson    Json?     @map("medical_history_json")
  allergyDescription    String?   @map("allergy_description")
  bloodType             String?   @map("blood_type")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  // Relations
  user              User              @relation(fields: [userId], references: [id])
  familyRelations   FamilyRelation[]
  healthRecords     HealthRecord[]
  medications       Medication[]
  medicalCheckups   MedicalCheckup[]
  orders            ServiceOrder[]
  memories          FamilyMemory[]

  @@map("elderly_profiles")
}

model FamilyRelation {
  id                String    @id @default(uuid())
  userId            String    @map("user_id")
  elderlyProfileId  String    @map("elderly_profile_id")
  relationshipType  String    @map("relationship_type")
  isPrimaryContact  Boolean   @default(false) @map("is_primary_contact")
  permissionsJson   Json      @default("{}") @map("permissions_json")
  createdAt         DateTime  @default(now()) @map("created_at")

  // Relations
  user            User           @relation(fields: [userId], references: [id])
  elderlyProfile  ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])

  @@unique([userId, elderlyProfileId])
  @@map("family_relations")
}

model HealthRecord {
  id                      String    @id @default(uuid())
  elderlyProfileId        String    @map("elderly_profile_id")
  recordType              String    @map("record_type")
  measurementValueJson    Json      @map("measurement_value_json")
  measurementUnit         String    @map("measurement_unit")
  measuredAt              DateTime  @map("measured_at")
  sourceDeviceIdentifier  String?   @map("source_device_identifier")
  notes                   String?
  createdAt               DateTime  @default(now()) @map("created_at")

  // Relations
  elderlyProfile ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])

  @@map("health_records")
}

model Medication {
  id                    String    @id @default(uuid())
  elderlyProfileId      String    @map("elderly_profile_id")
  medicationName        String    @map("medication_name")
  dosageDescription     String    @map("dosage_description")
  frequencyDescription  String    @map("frequency_description")
  startDate             DateTime? @map("start_date")
  endDate               DateTime? @map("end_date")
  reminderScheduleJson  Json      @default("[]") @map("reminder_schedule_json")
  isActive              Boolean   @default(true) @map("is_active")
  createdAt             DateTime  @default(now()) @map("created_at")

  // Relations
  elderlyProfile ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])

  @@map("medications")
}

model MedicalCheckup {
  id                String    @id @default(uuid())
  elderlyProfileId  String    @map("elderly_profile_id")
  hospitalName      String    @map("hospital_name")
  checkupDate       DateTime  @map("checkup_date")
  reportFileUrl     String?   @map("report_file_url")
  summaryText       String?   @map("summary_text")
  resultsJson       Json?     @map("results_json")
  createdAt         DateTime  @default(now()) @map("created_at")

  // Relations
  elderlyProfile ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])

  @@map("medical_checkups")
}

model ServiceCategory {
  id              String    @id @default(uuid())
  categoryName    String    @map("category_name")
  iconIdentifier  String    @map("icon_identifier")
  descriptionText String?   @map("description_text")
  displayOrder    Int       @default(0) @map("display_order")
  isActive        Boolean   @default(true) @map("is_active")

  // Relations
  services Service[]

  @@map("service_categories")
}

model Service {
  id              String    @id @default(uuid())
  categoryId      String    @map("category_id")
  serviceName     String    @map("service_name")
  descriptionText String    @map("description_text")
  basePrice       Decimal   @map("base_price")
  priceUnit       String    @map("price_unit")
  imageUrlsJson   Json      @default("[]") @map("image_urls_json")
  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")

  // Relations
  category ServiceCategory @relation(fields: [categoryId], references: [id])
  orders   ServiceOrder[]

  @@map("services")
}

model ServiceOrder {
  id                    String    @id @default(uuid())
  orderNumber           String    @unique @map("order_number")
  userId                String    @map("user_id")
  elderlyProfileId      String    @map("elderly_profile_id")
  serviceId             String    @map("service_id")
  orderStatus           String    @default("pending") @map("order_status")
  totalAmount           Decimal   @map("total_amount")
  scheduledServiceTime  DateTime  @map("scheduled_service_time")
  serviceAddress        String    @map("service_address")
  specialInstructions   String?   @map("special_instructions")
  customerRating        Int?      @map("customer_rating")
  reviewText            String?   @map("review_text")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  // Relations
  user            User           @relation(fields: [userId], references: [id])
  elderlyProfile  ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])
  service         Service        @relation(fields: [serviceId], references: [id])

  @@map("service_orders")
}

model KnowledgeCategory {
  id                String    @id @default(uuid())
  categoryName      String    @map("category_name")
  parentCategoryId  String?   @map("parent_category_id")
  iconIdentifier    String    @map("icon_identifier")
  displayOrder      Int       @default(0) @map("display_order")

  // Relations
  parent   KnowledgeCategory?  @relation("CategoryTree", fields: [parentCategoryId], references: [id])
  children KnowledgeCategory[] @relation("CategoryTree")
  articles KnowledgeArticle[]

  @@map("knowledge_categories")
}

model KnowledgeArticle {
  id              String    @id @default(uuid())
  categoryId      String    @map("category_id")
  title           String
  contentMarkdown String    @map("content_markdown")
  summaryText     String?   @map("summary_text")
  coverImageUrl   String?   @map("cover_image_url")
  authorName      String?   @map("author_name")
  tagsJson        Json      @default("[]") @map("tags_json")
  viewCount       Int       @default(0) @map("view_count")
  isPublished     Boolean   @default(false) @map("is_published")
  publishedAt     DateTime? @map("published_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  category KnowledgeCategory @relation(fields: [categoryId], references: [id])

  @@map("knowledge_articles")
}

model FamilyMemory {
  id                String    @id @default(uuid())
  elderlyProfileId  String    @map("elderly_profile_id")
  familyUserId      String    @map("family_user_id")
  memoryType        String    @map("memory_type")
  contentText       String?   @map("content_text")
  fileUrl           String?   @map("file_url")
  descriptionText   String?   @map("description_text")
  createdAt         DateTime  @default(now()) @map("created_at")

  // Relations
  elderlyProfile ElderlyProfile @relation(fields: [elderlyProfileId], references: [id])

  @@map("family_memories")
}

model Conversation {
  id                String    @id @default(uuid())
  conversationType  String    @map("conversation_type")
  conversationName  String?   @map("conversation_name")
  createdAt         DateTime  @default(now()) @map("created_at")

  // Relations
  members  ConversationMember[]
  messages Message[]

  @@map("conversations")
}

model ConversationMember {
  conversationId  String    @map("conversation_id")
  userId          String    @map("user_id")
  joinedAt        DateTime  @default(now()) @map("joined_at")

  // Relations
  conversation Conversation @relation(fields: [conversationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])

  @@id([conversationId, userId])
  @@map("conversation_members")
}

model Message {
  id              String    @id @default(uuid())
  conversationId  String    @map("conversation_id")
  senderId        String    @map("sender_id")
  messageType     String    @map("message_type")
  contentText     String?   @map("content_text")
  fileUrl         String?   @map("file_url")
  isRead          Boolean   @default(false) @map("is_read")
  createdAt       DateTime  @default(now()) @map("created_at")

  // Relations
  conversation Conversation @relation(fields: [conversationId], references: [id])
  sender       User         @relation("MessageSender", fields: [senderId], references: [id])

  @@map("messages")
}

model VideoCallRecord {
  id              String    @id @default(uuid())
  callerUserId    String    @map("caller_user_id")
  calleeUserId    String    @map("callee_user_id")
  callStatus      String    @map("call_status")
  startedAt       DateTime? @map("started_at")
  endedAt         DateTime? @map("ended_at")
  durationSeconds Int?      @map("duration_seconds")

  // Relations
  caller User @relation("CallerUser", fields: [callerUserId], references: [id])
  callee User @relation("CalleeUser", fields: [calleeUserId], references: [id])

  @@map("video_call_records")
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/server
git commit -m "feat: add Express backend with Prisma schema"
```

---

## Task 4: Setup React Frontend

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/index.css`

- [ ] **Step 1: Create web package.json**

```json
{
  "name": "@ease-age/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@ease-age/shared-types": "workspace:*",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.312.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "recharts": "^2.10.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.0",
    "vite": "^5.0.12"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EaseAge - 颐智相伴</title>
    <meta name="description" content="EaseAge - 智慧养老一站式服务平台" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create main.tsx**

```tsx
// apps/web/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 6: Create App.tsx with routing**

```tsx
// apps/web/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import VideoChatPage from './pages/VideoChatPage';
import ServicesPage from './pages/ServicesPage';
import KnowledgePage from './pages/KnowledgePage';
import HealthPage from './pages/HealthPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="video-chat" element={<VideoChatPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 7: Create index.css with Tailwind**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 40 33% 98%;
    --foreground: 24 10% 10%;
    --card: 0 0% 100%;
    --card-foreground: 24 10% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 24 10% 10%;
    --primary: 24.6 95% 53.1%;
    --primary-foreground: 60 9.1% 97.8%;
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 24.6 95% 53.1%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/web
git commit -m "feat: add React frontend with Vite and Tailwind"
```

---

## Task 5: Create Layout Components

**Files:**
- Create: `apps/web/src/components/layout/AppLayout.tsx`
- Create: `apps/web/src/components/layout/Sidebar.tsx`
- Create: `apps/web/src/components/layout/Header.tsx`

- [ ] **Step 1: Create AppLayout.tsx**

```tsx
// apps/web/src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Sidebar.tsx**

```tsx
// apps/web/src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  ShoppingBag, 
  BookOpen, 
  Heart, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/', icon: LayoutDashboard },
  { name: '视频通讯', href: '/video-chat', icon: Video },
  { name: '增值服务', href: '/services', icon: ShoppingBag },
  { name: '知识库', href: '/knowledge', icon: BookOpen },
  { name: '健康管理', href: '/health', icon: Heart },
  { name: '设置', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-orange-500">
          EaseAge
        </h1>
        <span className="ml-2 text-sm text-stone-500">颐智相伴</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-medium">张</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-stone-900">张三</p>
            <p className="text-xs text-stone-500">家属</p>
          </div>
          <button className="ml-auto rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create Header.tsx**

```tsx
// apps/web/src/components/layout/Header.tsx
import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="h-10 w-64 rounded-lg border border-stone-200 pl-10 pr-4 text-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="relative rounded-lg p-2 text-stone-500 hover:bg-stone-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components
git commit -m "feat: add layout components (sidebar, header)"
```

---

## Task 6: Create Dashboard Page

**Files:**
- Create: `apps/web/src/pages/DashboardPage.tsx`
- Create: `apps/web/src/components/shared/StatusCard.tsx`

- [ ] **Step 1: Create StatusCard component**

```tsx
// apps/web/src/components/shared/StatusCard.tsx
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatusCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatusCardProps) {
  return (
    <div className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-lg bg-orange-50 p-3">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DashboardPage**

```tsx
// apps/web/src/pages/DashboardPage.tsx
import { 
  Heart, 
  Calendar, 
  ShoppingBag, 
  Video,
  Activity,
  Clock
} from 'lucide-react';
import StatusCard from '@/components/shared/StatusCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">首页</h2>
        <p className="text-stone-500">欢迎回来，查看老人最新状态</p>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="健康状态"
          value="良好"
          description="今日血压正常"
          icon={Heart}
        />
        <StatusCard
          title="今日用药"
          value="2/3"
          description="还剩1次未服用"
          icon={Calendar}
        />
        <StatusCard
          title="待处理服务"
          value={2}
          description="家政服务预约中"
          icon={ShoppingBag}
        />
        <StatusCard
          title="未读消息"
          value={5}
          description="来自3位家属"
          icon={Video}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent health data */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            近期健康数据
          </h3>
          <div className="space-y-4">
            {[
              { time: '08:30', type: '血压', value: '128/82 mmHg', status: 'normal' },
              { time: '09:00', type: '血糖', value: '6.2 mmol/L', status: 'normal' },
              { time: '10:15', type: '心率', value: '72 bpm', status: 'normal' },
            ].map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-stone-50 p-3"
              >
                <div className="flex items-center">
                  <Activity className="mr-3 h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {record.type}
                    </p>
                    <p className="text-xs text-stone-500">{record.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-stone-700">
                  {record.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            最近活动
          </h3>
          <div className="space-y-4">
            {[
              { time: '14:30', text: '与女儿视频通话 15分钟', icon: Video },
              { time: '11:00', text: '完成家政服务预约', icon: ShoppingBag },
              { time: '09:00', text: '服用降压药', icon: Heart },
              { time: '08:00', text: '查看健康养生文章', icon: Activity },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-1 rounded-full bg-orange-50 p-1.5">
                  <activity.icon className="h-3 w-3 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-stone-900">{activity.text}</p>
                  <p className="flex items-center text-xs text-stone-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-stone-900">
          快捷操作
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { name: '发起视频', icon: Video, color: 'bg-blue-50 text-blue-600' },
            { name: '预约服务', icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
            { name: '记录健康', icon: Heart, color: 'bg-red-50 text-red-600' },
            { name: '查看知识', icon: Activity, color: 'bg-purple-50 text-purple-600' },
          ].map((action) => (
            <button
              key={action.name}
              className="flex flex-col items-center rounded-xl border p-4 transition-colors hover:bg-stone-50"
            >
              <div className={`rounded-lg p-3 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-stone-700">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/pages/DashboardPage.tsx apps/web/src/components/shared/StatusCard.tsx
git commit -m "feat: add dashboard page with status cards"
```

---

## Task 7: Create Utility Functions

**Files:**
- Create: `apps/web/src/lib/utils.ts`
- Create: `apps/web/src/lib/api.ts`

- [ ] **Step 1: Create utils.ts**

```typescript
// apps/web/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `EA${timestamp}${random}`.toUpperCase();
}
```

- [ ] **Step 2: Create api.ts**

```typescript
// apps/web/src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token });
  }

  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', token });
  }
}

export const api = new ApiClient(API_BASE_URL);
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib
git commit -m "feat: add utility functions and API client"
```

---

## Task 8: Install Dependencies and Verify Build

- [ ] **Step 1: Install all dependencies**

```bash
cd /home/zza/EaseAge
pnpm install
```

- [ ] **Step 2: Generate Prisma client**

```bash
cd apps/server
pnpm prisma generate
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
cd /home/zza/EaseAge
pnpm turbo lint
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: install dependencies and verify build"
```

---

## Next Steps

After completing Phase 1 MVP setup:

1. **Database Setup**: Run PostgreSQL and execute migrations
2. **Auth System**: Implement JWT authentication
3. **API Routes**: Implement CRUD endpoints for each module
4. **Frontend Pages**: Complete all page components
5. **Testing**: Add unit and integration tests
6. **Deployment**: Docker setup for production

---

*Plan created on 2026-06-05*
