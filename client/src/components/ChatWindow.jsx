import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Logo } from './Logo';
import { MessageActions } from './MessageActions';

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS = [
  'What can you help me with?',
  'Write me a short poem',
  'Explain quantum computing',
  'Help me debug my code',
];

export const ChatWindow = ({ messages, loading, onSuggestion, onReload, onSpeak, speaking }) => {
  const bottomRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__logo">
            <Logo size={56} />
          </div>
          <h2>Hello, I'm Nova AI</h2>
          <p>Your intelligent assistant, built by Bezawit. Ask me anything.</p>
          <div className="empty-state__suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => onSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        return (
          <div
            key={msg.id}
            className={`message message--${msg.role}`}
            onMouseEnter={() => setHoveredId(msg.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="message__bubble">
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            <div className={`message__footer ${msg.role === 'assistant' ? 'message__footer--visible' : hoveredId === msg.id ? 'message__footer--visible' : ''}`}>
              <span className="message__time">{formatTime(msg.timestamp)}</span>
              <MessageActions
                content={msg.content}
                onReload={msg.role === 'assistant' && isLast ? onReload : null}
                isAssistant={msg.role === 'assistant'}
                onSpeak={() => onSpeak(msg.content, msg.id)}
                speaking={speaking === msg.id}
              />
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="message message--assistant">
          <div className="message__bubble message__bubble--loading">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};