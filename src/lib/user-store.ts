import bcrypt from 'bcryptjs';
import { DEMO_USERS } from './mock-data';
import { UserRole, ActiveRole } from '@/types';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  activeRole: ActiveRole;
  avatar?: string;
  title?: string | null;
  companyName?: string | null;
  totalEarnings?: number;
  totalSpent?: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

// Global registry shared across requests in the Node process
const globalUserStore = globalThis as unknown as {
  __GIGLY_REGISTERED_USERS__?: StoredUser[];
};

if (!globalUserStore.__GIGLY_REGISTERED_USERS__) {
  // Pre-populate with default demo users and password 'password123'
  const defaultHash = bcrypt.hashSync('password123', 10);
  globalUserStore.__GIGLY_REGISTERED_USERS__ = DEMO_USERS.map((u) => ({
    id: u.id,
    email: u.email.toLowerCase().trim(),
    name: u.name,
    passwordHash: defaultHash,
    role: u.role,
    activeRole: u.activeRole,
    avatar: u.avatar,
    title: u.title,
    companyName: u.companyName,
    totalEarnings: u.totalEarnings,
    totalSpent: u.totalSpent,
    rating: u.rating,
    reviewCount: u.reviewCount,
    createdAt: u.createdAt,
  }));
}

export const registeredUsers = globalUserStore.__GIGLY_REGISTERED_USERS__;

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.toLowerCase().trim();
  return registeredUsers.find((u) => u.email.toLowerCase().trim() === normalized);
}

export function addUser(user: StoredUser): StoredUser {
  const normalized = user.email.toLowerCase().trim();
  const index = registeredUsers.findIndex((u) => u.email.toLowerCase().trim() === normalized);
  if (index !== -1) {
    registeredUsers[index] = { ...registeredUsers[index], ...user };
    return registeredUsers[index];
  }
  registeredUsers.unshift(user);
  return user;
}
