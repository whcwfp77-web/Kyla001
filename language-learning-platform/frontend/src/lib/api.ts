import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SearchParams {
  query: string;
  type?: string;
  language?: string;
  theme?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: any[];
  total: number;
  page: number;
  limit: number;
}

export async function searchClips(params: SearchParams): Promise<SearchResponse> {
  const response = await apiClient.get('/search', { params });
  return response.data;
}

export async function getEntry(id: string) {
  const response = await apiClient.get(`/entries/${id}`);
  return response.data;
}

export async function getClip(id: string) {
  const response = await apiClient.get(`/clips/${id}`);
  return response.data;
}

export async function addToReview(clipId: string) {
  const response = await apiClient.post('/review/add', { clipId });
  return response.data;
}

export async function getNextReview() {
  const response = await apiClient.get('/review/next');
  return response.data;
}

export async function completeReview(cardId: string, quality: number) {
  const response = await apiClient.post('/review/complete', {
    cardId,
    quality,
  });
  return response.data;
}

export async function submitShadowRecord(clipId: string, metrics: any) {
  const response = await apiClient.post('/shadow/record', {
    clipId,
    metrics,
  });
  return response.data;
}

export async function submitSuggestion(data: any) {
  const response = await apiClient.post('/suggestions', data);
  return response.data;
}

export async function requestMagicLink(email: string) {
  const response = await apiClient.post('/auth/magic-link', { email });
  return response.data;
}

export async function verifyMagicLink(token: string) {
  const response = await apiClient.post('/auth/verify', { token });
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get('/user/me');
  return response.data;
}

export default apiClient;
