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