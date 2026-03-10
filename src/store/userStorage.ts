// src/store/userStorage.ts
// Local storage management - NO Firebase needed!
// All data stored locally on device

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface UserAccount {
  userId: string;           // Unique random identifier
  username: string;         // Username entered by user
  isPro: boolean;          // Pro status from kit PIN
  createdAt: number;
  streak: number;
  totalCleanings: number;
  hearingTests: number;
  lastLogin: number;
}

// ============================================
// USER ACCOUNT FUNCTIONS
// ============================================

/**
 * Create a new user account
 */
export const createUserAccount = async (username: string, isPro: boolean = false): Promise<UserAccount> => {
  const newUser: UserAccount = {
    userId: uuidv4(),
    username: username.trim(),
    isPro: isPro,
    createdAt: Date.now(),
    streak: 0,
    totalCleanings: 0,
    hearingTests: 0,
    lastLogin: Date.now(),
  };

  const usersJson = await AsyncStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : {};
  
  users[newUser.userId] = newUser;
  await AsyncStorage.setItem('users', JSON.stringify(users));
  
  return newUser;
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<UserAccount | null> => {
  const usersJson = await AsyncStorage.getItem('users');
  if (!usersJson) return null;
  
  const users = JSON.parse(usersJson);
  for (const userId in users) {
    if (users[userId].username.toLowerCase() === username.toLowerCase()) {
      return users[userId];
    }
  }
  return null;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<UserAccount | null> => {
  const usersJson = await AsyncStorage.getItem('users');
  if (!usersJson) return null;
  
  const users = JSON.parse(usersJson);
  return users[userId] || null;
};

/**
 * Login user (set as current user)
 */
export const loginUser = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  user.lastLogin = Date.now();
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
  await AsyncStorage.setItem('currentUserId', userId);
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem('currentUserId');
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async (): Promise<UserAccount | null> => {
  const userId = await AsyncStorage.getItem('currentUserId');
  if (!userId) return null;
  return getUserById(userId);
};

// ============================================
// ACCOUNT UPDATES
// ============================================

/**
 * Update user username
 */
export const updateUsername = async (userId: string, newUsername: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  const existingUser = await getUserByUsername(newUsername);
  if (existingUser && existingUser.userId !== userId) {
    throw new Error('Username already taken');
  }
  
  user.username = newUsername.trim();
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

/**
 * Activate Pro mode
 */
export const activateProMode = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  user.isPro = true;
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

/**
 * Update hearing tests count
 */
export const updateHearingTests = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  user.hearingTests += 1;
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

/**
 * Update cleanings count
 */
export const updateCleanings = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  user.totalCleanings += 1;
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

/**
 * Update streak
 */
export const updateStreak = async (userId: string, newStreak: number): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  user.streak = newStreak;
  
  const usersJson = await AsyncStorage.getItem('users');
  const users = JSON.parse(usersJson || '{}');
  users[userId] = user;
  
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

// ============================================
// APP STATE
// ============================================

/**
 * Check if first launch
 */
export const isFirstLaunch = async (): Promise<boolean> => {
  const hasLaunched = await AsyncStorage.getItem('hasLaunchedBefore');
  return !hasLaunched;
};

/**
 * Mark app as launched
 */
export const markAsLaunched = async (): Promise<void> => {
  await AsyncStorage.setItem('hasLaunchedBefore', 'true');
};