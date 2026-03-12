import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProgress, AppUser, DEFAULT_PROGRESS } from './appStore';

const USER_KEY = 'soundr_user';
const REDEEMED_CODES_KEY = 'soundr_redeemed_codes';
const USERNAME_LIST_KEY = 'soundr_usernames';
const PROGRESS_KEY = 'soundr_progress';

const DEMO_VALID_CODES = ['184203', '582114', '761905', '330821', '924617'];

export async function saveUser(user: AppUser): Promise<void> {
  await registerUsername(user.username);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<AppUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AppUser) : null;
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(REDEEMED_CODES_KEY);
  await AsyncStorage.removeItem(USERNAME_LIST_KEY);
  await AsyncStorage.removeItem(PROGRESS_KEY);
}

export async function getRedeemedCodes(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(REDEEMED_CODES_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function redeemKitCode(
  code: string
): Promise<{ success: boolean; reason?: string }> {
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
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const usernames = await getAllUsernames();
  const normalized = username.trim().toLowerCase();
  return usernames.includes(normalized);
}

export async function registerUsername(username: string): Promise<void> {
  const usernames = await getAllUsernames();
  const normalized = username.trim().toLowerCase();

  if (!usernames.includes(normalized)) {
    usernames.push(normalized);
    await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(usernames));
  }
}

export async function updateStoredUsername(
  oldUsername: string,
  newUsername: string
): Promise<void> {
  const usernames = await getAllUsernames();
  const oldNormalized = oldUsername.trim().toLowerCase();
  const newNormalized = newUsername.trim().toLowerCase();

  const filtered = usernames.filter((name) => name !== oldNormalized);

  if (!filtered.includes(newNormalized)) {
    filtered.push(newNormalized);
  }

  await AsyncStorage.setItem(USERNAME_LIST_KEY, JSON.stringify(filtered));
}

export async function getProgress(): Promise<AppProgress> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  return raw ? (JSON.parse(raw) as AppProgress) : DEFAULT_PROGRESS;
}

export async function saveProgress(progress: AppProgress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function generateRandomSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}