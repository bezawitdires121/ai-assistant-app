import { useState, useCallback } from 'react';
import { sendMessage, fetchChats, fetchChatById, deleteChatApi } from '../services/api';

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChats = useCallback(async () => {
    try {
      const data = await fetchChats();
      setChats(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setChats([]);
      setError(null);
    }
  }, []);

  const selectChat = useCallback(async (id) => {
    setActiveChatId(id);
    setError(null);
    try {
      const chat = await fetchChatById(id);
      setMessages((chat.messages || []).map((m) => ({
        id: m._id || Date.now(),
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const send = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const data = await sendMessage(text, activeChatId);

      if (!data || !data.chatId) throw new Error('Invalid server response');

      const newChatEntry = {
        _id: data.chatId,
        name: data.chatName || 'New Conversation',
        updatedAt: new Date().toISOString(),
      };

      if (!activeChatId) {
        setActiveChatId(data.chatId);
        setChats((prev) => [newChatEntry, ...prev]);
      } else {
        setChats((prev) =>
          prev.map((c) =>
            c._id === activeChatId
              ? { ...c, name: data.chatName || c.name, updatedAt: new Date().toISOString() }
              : c
          )
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply,
          timestamp: data.timestamp,
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeChatId]);

  const newChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  }, []);

  const deleteChat = useCallback(async (id) => {
    try {
      await deleteChatApi(id);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (id === activeChatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [activeChatId]);

  const reload = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    setMessages((prev) => {
      const msgs = [...prev];
      if (msgs[msgs.length - 1]?.role === 'assistant') msgs.pop();
      return msgs;
    });
    await send(lastUser.content);
  }, [messages, send]);

  return {
    chats,
    activeChatId,
    messages,
    loading,
    error,
    loadChats,
    selectChat,
    send,
    newChat,
    deleteChat,
    reload,
  };
};