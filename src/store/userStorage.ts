import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProgress, AppUser, DEFAULT_PROGRESS } from './appStore';

const CURRENT_USER_KEY = 'soundr_current_user';
const REDEEMED_CODES_KEY = 'soundr_redeemed_codes';
const USERNAME_LIST_KEY = 'soundr_usernames';

const DEMO_VALID_CODES = ['184203', '582114', '761905', '330821', '924617'];

function getUserStorageKey(username: string) {
  return `soundr_user_${username.trim().toLowerCase()}`;
}

function getProgressStorageKey(username: string) {
  return `soundr_progress_${username.trim().toLowerCase()}`;
}

export async function saveUser(user: AppUser) {
  await registerUsername(user.username);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(getUserStorageKey(user.username), JSON.stringify(user));
}

export async function getUser(): Promise<AppUser | null> {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function getStoredUserByUsername(username: string): Promise<AppUser | null> {
  const raw = await AsyncStorage.getItem(getUserStorageKey(username));
  return raw ? JSON.parse(raw) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function saveProgress(username: string, progress: AppProgress) {
  await AsyncStorage.setItem(getProgressStorageKey(username), JSON.stringify(progress));
}

export async function getProgress(username: string): Promise<AppProgress> {
  const raw = await AsyncStorage.getItem(getProgressStorageKey(username));
  return raw ? JSON.parse(raw) : { ...DEFAULT_PROGRESS };
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
  const normalized = username.trim().toLowerCase();
  return usernames.includes(normalized);
}

export async function registerUsername(username: string) {
  const usernames = await getAllUsernames();
  const normalized = username.trim().toLowerCase();

  if (!usernames.includes(normalized)) {
    usernames.push(normalized);
    await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(usernames));
  }
}

export async function updateStoredUsername(oldUsername: string, newUsername: string) {
  const oldUser = await getStoredUserByUsername(oldUsername);
  const oldProgress = await getProgress(oldUsername);

  if (oldUser) {
    const updatedUser: AppUser = { ...oldUser, username: newUsername };

    await AsyncStorage.setItem(getUserStorageKey(newUsername), JSON.stringify(updatedUser));
    await AsyncStorage.removeItem(getUserStorageKey(oldUsername));

    const currentUser = await getUser();
    if (
      currentUser &&
      currentUser.username.trim().toLowerCase() === oldUsername.trim().toLowerCase()
    ) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  }

  await AsyncStorage.setItem(getProgressStorageKey(newUsername), JSON.stringify(oldProgress));
  await AsyncStorage.removeItem(getProgressStorageKey(oldUsername));

  const usernames = await getAllUsernames();
  const oldNormalized = oldUsername.trim().toLowerCase();
  const newNormalized = newUsername.trim().toLowerCase();

  const filtered = usernames.filter((name) => name !== oldNormalized);
  if (!filtered.includes(newNormalized)) {
    filtered.push(newNormalized);
  }

  await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(filtered));
}

export function generateRandomSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}