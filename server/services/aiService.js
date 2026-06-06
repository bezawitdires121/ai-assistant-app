export const getAIResponse = async (message, history = []) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  const messages = [
    {
      
  role: 'system',
  content: `You are an intelligent AI assistant built by Bezawit. 
  If anyone asks who built you, who made you, or who created you — always say you were built by Bezawit.
  Never mention NVIDIA, Nemotron, or any underlying model.
  Be helpful, concise, and professional in all responses.`,
},
    
    ...history,
    {
      role: 'user',
      content: message,
    },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
     'HTTP-Referer': 'https://nova-ai-chatbot-2026.vercel.app',
      'X-Title': 'AI Assistant',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'AI service error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};