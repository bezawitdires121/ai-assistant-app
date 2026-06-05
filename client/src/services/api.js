// Production: Use environment variable or hardcode production URL
const PRODUCTION_URL = 'https://nova-ai-backend-sene.onrender.com/api';
const BASE_URL = (() => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'nova-ai-chatbot-2026.vercel.app') {
    return PRODUCTION_URL;
  }
  return PRODUCTION_URL;
})();

console.log('[API] Using BASE_URL:', BASE_URL);

const getToken = () => {
  const user = localStorage.getItem('nova_user');
  return user ? JSON.parse(user).token : null;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const sendMessage = async (message, chatId) => {
  const url = `${BASE_URL}/chat`;
  console.log('[CHAT] Send message to:', url);
  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message, chatId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Server error');
  }
  return response.json();
};

export const fetchChats = async () => {
  const url = `${BASE_URL}/chat`;
  console.log('[CHAT] Fetch chats from:', url);
  const response = await fetch(url, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch chats');
  return response.json();
};

export const fetchChatById = async (id) => {
  const url = `${BASE_URL}/chat/${id}`;
  console.log('[CHAT] Fetch chat by id from:', url);
  const response = await fetch(url, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch chat');
  return response.json();
};

export const deleteChatApi = async (id) => {
  const url = `${BASE_URL}/chat/${id}`;
  console.log('[CHAT] Delete chat from:', url);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete chat');
  return response.json();
};