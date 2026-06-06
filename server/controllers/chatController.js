import { getAIResponse } from '../services/aiService.js';
import { db } from '../services/db.js';
import { v4 as uuid } from 'uuid';

const generateChatName = (text) => {
  const t = text.toLowerCase().trim();
  if (/^(hey|hi|hello|good morning|good evening|howdy|sup|greetings)/.test(t)) return 'Greeting';
  if (/(write|draft|create|compose).*(poem|story|essay|letter|email)/.test(t)) return 'Creative Writing';
  if (/(fix|debug|error|bug|code|function|script)/.test(t)) return 'Coding Help';
  if (/(explain|what is|what are|how does|define)/.test(t)) return 'Explanation';
  if (/(translate|language)/.test(t)) return 'Translation';
  if (/(summarize|summary|tldr)/.test(t)) return 'Summarization';
  if (/(recommend|suggest|best|should i)/.test(t)) return 'Recommendation';
  if (/(plan|schedule|steps to|how to|guide)/.test(t)) return 'Planning';
  if (/(math|calculate|solve|equation)/.test(t)) return 'Math';
  if (/(compare|difference|vs|versus)/.test(t)) return 'Comparison';
  if (/(recipe|cook|food|meal)/.test(t)) return 'Food & Cooking';
  if (/(health|medical|fitness|diet)/.test(t)) return 'Health';
  if (/(travel|trip|country|city)/.test(t)) return 'Travel';
  if (/(money|finance|invest|budget)/.test(t)) return 'Finance';
  return 'New Conversation';
};

export const handleChat = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    if (!message?.trim())
      return res.status(400).json({ error: { message: 'Message required' } });

    await db.read();

    let chat = chatId
      ? db.data.chats.find((c) => c._id === chatId && c.userId === userId)
      : null;

    if (!chat) {
      chat = {
        _id: uuid(),
        userId,
        name: generateChatName(message),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.data.chats.push(chat);
    }

    const history = chat.messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await getAIResponse(message, history);

    chat.messages.push({ _id: uuid(), role: 'user', content: message, timestamp: new Date().toISOString() });
    chat.messages.push({ _id: uuid(), role: 'assistant', content: reply, timestamp: new Date().toISOString() });
    chat.updatedAt = new Date().toISOString();

    await db.write();

    res.status(200).json({
      reply,
      chatId: chat._id,
      chatName: chat.name,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { next(err); }
};

export const getChats = async (req, res, next) => {
  try {
    await db.read();
    const chats = db.data.chats
      .filter((c) => c.userId === req.user._id)
      .map(({ _id, name, createdAt, updatedAt }) => ({ _id, name, createdAt, updatedAt }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json(chats);
  } catch (err) { next(err); }
};

export const getChatById = async (req, res, next) => {
  try {
    await db.read();
    const chat = db.data.chats.find(
      (c) => c._id === req.params.id && c.userId === req.user._id
    );
    if (!chat)
      return res.status(404).json({ error: { message: 'Chat not found' } });
    res.json(chat);
  } catch (err) { next(err); }
};

export const deleteChat = async (req, res, next) => {
  try {
    await db.read();
    db.data.chats = db.data.chats.filter(
      (c) => !(c._id === req.params.id && c.userId === req.user._id)
    );
    await db.write();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};