const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => {
  const user = localStorage.getItem('nova_user');
  return user ? JSON.parse(user).token : null;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const sendMessage = async (message, chatId) => {
  const response = await fetch(`${BASE_URL}/api/chat`, {
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
  const response = await fetch(`${BASE_URL}/api/chat`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch chats');
  return response.json();
};

export const fetchChatById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/chat/${id}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch chat');
  return response.json();
};

export const deleteChatApi = async (id) => {
  const response = await fetch(`${BASE_URL}/api/chat/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete chat');
  return response.json();
};