export interface User {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'app_current_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getUsers(): User[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function registerUser(name: string, email: string, password: string): { success: boolean; message: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const newUser: User = { name, email, password, createdAt: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { success: true, message: 'Account created successfully!' };
}

export function loginUser(email: string, password: string): { success: boolean; message: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, message: 'No account found with this email.' };
  if (user.password !== password) return { success: false, message: 'Incorrect password.' };
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { success: true, message: 'Login successful!' };
}

export function logoutUser() {
  if (!isBrowser()) return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
}
