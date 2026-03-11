import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser } from './appStore';

const USER_KEY = 'soundr_user';
const REDEEMED_CODES_KEY = 'soundr_redeemed_codes';
const USERNAME_LIST_KEY = 'soundr_usernames';

/*
  Demo-only prototype codes.
  For real production use, do not store valid codes in the app.
  Put them in a backend database and verify server-side.
*/
const DEMO_VALID_CODES = ['184203', '582114', '761905', '330821', '924617'];

export async function saveUser(user: AppUser) {
  await registerUsername(user.username);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<AppUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function clearAllLocalTestData() {
  await AsyncStorage.multiRemove([
    USER_KEY,
    REDEEMED_CODES_KEY,
    USERNAME_LIST_KEY,
  ]);
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

export async function updateStoredUsername(
  oldUsername: string,
  newUsername: string
) {
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