import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProgress, AppUser, DEFAULT_PROGRESS } from './appStore';

const CURRENT_USER_KEY = 'soundr_current_user';
const USERS_KEY = 'soundr_users';
const REDEEMED_CODES_KEY = 'soundr_redeemed_codes';
const USERNAME_LIST_KEY = 'soundr_usernames';
const PROGRESS_MAP_KEY = 'soundr_progress_map';

const DEMO_VALID_CODES = ['184203', '582114', '761905', '330821', '924617'];

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

type UserMap = Record<string, AppUser>;
type ProgressMap = Record<string, AppProgress>;

async function getUserMap(): Promise<UserMap> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveUserMap(userMap: UserMap) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(userMap));
}

async function getProgressMap(): Promise<ProgressMap> {
  const raw = await AsyncStorage.getItem(PROGRESS_MAP_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveProgressMap(progressMap: ProgressMap) {
  await AsyncStorage.setItem(PROGRESS_MAP_KEY, JSON.stringify(progressMap));
}

export async function saveUser(user: AppUser) {
  const normalized = normalizeUsername(user.username);
  const userMap = await getUserMap();

  userMap[normalized] = user;

  await registerUsername(user.username);
  await saveUserMap(userMap);
  await AsyncStorage.setItem(CURRENT_USER_KEY, normalized);
}

export async function getUser(): Promise<AppUser | null> {
  const currentUserId = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) return null;

  const userMap = await getUserMap();
  return userMap[currentUserId] || null;
}

export async function getUserByUsername(username: string): Promise<AppUser | null> {
  const normalized = normalizeUsername(username);
  const userMap = await getUserMap();
  return userMap[normalized] || null;
}

export async function loginExistingUser(username: string): Promise<{
  success: boolean;
  user?: AppUser;
  reason?: string;
}> {
  const normalized = normalizeUsername(username);

  if (!normalized) {
    return { success: false, reason: 'Please enter a username.' };
  }

  const userMap = await getUserMap();
  const existingUser = userMap[normalized];

  if (!existingUser) {
    return { success: false, reason: 'No account found with that username.' };
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, normalized);
  return { success: true, user: existingUser };
}

export async function clearUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function getAllUsers(): Promise<AppUser[]> {
  const userMap = await getUserMap();
  return Object.values(userMap);
}

export async function getRedeemedCodes(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(REDEEMED_CODES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function redeemKitCode(code: string): Promise<{
  success: boolean;
  reason?: string;
}> {
  const normalized = code.trim();

  if (!/^\d{6}$/.test(normalized)) {
    return { success: false, reason: 'Code must be 6 digits.' };
  }

  if (!DEMO_VALID_CODES.includes(normalized)) {
    return { success: false, reason: 'Invalid code.' };
  }

  const redeemed = await getRedeemedCodes();

  if (redeemed.includes(normalized)) {
    return { success: false, reason: 'This code has already been used.' };
  }

  redeemed.push(normalized);
  await AsyncStorage.setItem(REDEEMED_CODES_KEY, JSON.stringify(redeemed));

  return { success: true };
}

export async function getAllUsernames(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(USERNAME_LIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const usernames = await getAllUsernames();
  const normalized = normalizeUsername(username);
  return usernames.includes(normalized);
}

export async function registerUsername(username: string) {
  const usernames = await getAllUsernames();
  const normalized = normalizeUsername(username);

  if (!usernames.includes(normalized)) {
    usernames.push(normalized);
    await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(usernames));
  }
}

export async function updateStoredUsername(oldUsername: string, newUsername: string) {
  const oldNormalized = normalizeUsername(oldUsername);
  const newNormalized = normalizeUsername(newUsername);

  const usernames = await getAllUsernames();
  const updatedUsernames = usernames.filter((name) => name !== oldNormalized);

  if (!updatedUsernames.includes(newNormalized)) {
    updatedUsernames.push(newNormalized);
  }

  await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(updatedUsernames));

  const userMap = await getUserMap();
  const existingUser = userMap[oldNormalized];

  if (existingUser) {
    delete userMap[oldNormalized];
    userMap[newNormalized] = {
      ...existingUser,
      username: newUsername.trim(),
    };
    await saveUserMap(userMap);
  }

  const progressMap = await getProgressMap();
  const existingProgress = progressMap[oldNormalized];

  if (existingProgress) {
    delete progressMap[oldNormalized];
    progressMap[newNormalized] = existingProgress;
    await saveProgressMap(progressMap);
  }

  const currentUserId = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (currentUserId === oldNormalized) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, newNormalized);
  }
}

export async function saveProgress(username: string, progress: AppProgress): Promise<void> {
  const normalized = normalizeUsername(username);
  const progressMap = await getProgressMap();
  progressMap[normalized] = progress;
  await saveProgressMap(progressMap);
}

export async function getProgress(username: string): Promise<AppProgress> {
  const normalized = normalizeUsername(username);
  const progressMap = await getProgressMap();
  return progressMap[normalized] || DEFAULT_PROGRESS;
}

export async function clearAllLocalTestData() {
  await AsyncStorage.multiRemove([
    CURRENT_USER_KEY,
    USERS_KEY,
    REDEEMED_CODES_KEY,
    USERNAME_LIST_KEY,
    PROGRESS_MAP_KEY,
  ]);
}

export function generateRandomSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}