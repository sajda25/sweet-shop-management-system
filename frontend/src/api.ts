import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

let token: string | null = null;

export function setToken(newToken: string | null) {
  token = newToken;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function getToken() {
  return token;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// Auth
export async function register(email: string, password: string, role?: string) {
  const res = await api.post<{ token: string; user: User }>('/auth/register', { email, password, role });
  setToken(res.data.token);
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
  setToken(res.data.token);
  return res.data;
}

// Sweets
export async function listSweets() {
  const res = await api.get<Sweet[]>('/sweets');
  return res.data;
}

export async function searchSweets(filters: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  const res = await api.get<Sweet[]>('/sweets/search', { params: filters });
  return res.data;
}

export async function createSweet(data: { name: string; category: string; price: number; quantity: number }) {
  const res = await api.post<Sweet>('/sweets', data);
  return res.data;
}

export async function updateSweet(id: number, data: Partial<{ name: string; category: string; price: number; quantity: number }>) {
  const res = await api.put<Sweet>(`/sweets/${id}`, data);
  return res.data;
}

export async function deleteSweet(id: number) {
  const res = await api.delete<Sweet>(`/sweets/${id}`);
  return res.data;
}

export async function purchaseSweet(id: number) {
  const res = await api.post<Sweet>(`/sweets/${id}/purchase`);
  return res.data;
}

export async function restockSweet(id: number, amount: number) {
  const res = await api.post<Sweet>(`/sweets/${id}/restock`, { amount });
  return res.data;
}

export default api;
