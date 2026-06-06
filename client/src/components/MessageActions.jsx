import { useState } from 'react';

export const MessageActions = ({ content, onReload, isAssistant, onSpeak, speaking }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="message-actions">
      <button className="message-action" onClick={handleCopy}>
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )}
        <span className="message-action__tooltip">{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {onReload && (
        <button className="message-action" onClick={onReload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          <span className="message-action__tooltip">Regenerate</span>
        </button>
      )}

      {isAssistant && (
        <>
          <button
            className={`message-action ${speaking ? 'message-action--active' : ''}`}
            onClick={onSpeak}
          >
            {speaking ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
            <span className="message-action__tooltip">{speaking ? 'Stop' : 'Read aloud'}</span>
          </button>

          <button
            className={`message-action ${liked === 'up' ? 'message-action--active' : ''}`}
            onClick={() => setLiked(liked === 'up' ? null : 'up')}
          >
            <svg viewBox="0 0 24 24" fill={liked === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <span className="message-action__tooltip">Good response</span>
          </button>

          <button
            className={`message-action ${liked === 'down' ? 'message-action--active-red' : ''}`}
            onClick={() => setLiked(liked === 'down' ? null : 'down')}
          >
            <svg viewBox="0 0 24 24" fill={liked === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
            </svg>
            <span className="message-action__tooltip">Bad response</span>
          </button>
        </>
      )}
    </div>
  );
};