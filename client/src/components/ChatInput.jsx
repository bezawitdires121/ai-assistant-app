import { useState, useRef, useEffect } from 'react';

export const ChatInput = ({ onSend, disabled, onVoiceStart, onVoiceStop, recording }) => {
  const [value, setValue] = useState('');
  const [attachment, setAttachment] = useState(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if ((!value.trim() && !attachment) || disabled) return;
    const text = attachment
      ? `${value.trim()}\n\n[Attached file: ${attachment.name}]`
      : value.trim();
    onSend(text);
    setValue('');
    setAttachment(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
    e.target.value = '';
  };

  const handleVoice = () => {
    if (recording) {
      onVoiceStop();
    } else {
      onVoiceStart((transcript) => {
        setValue((prev) => prev ? prev + ' ' + transcript : transcript);
      });
    }
  };

  return (
    <div className="chat-input-wrapper">
      {attachment && (
        <div className="attachment-preview">
          <div className="attachment-chip">
            {attachment.type.startsWith('image/') ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            )}
            <span>{attachment.name}</span>
            <button onClick={() => setAttachment(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="chat-input">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.txt,.doc,.docx,.csv"
          style={{ display: 'none' }}
          onChange={handleFile}
        />

        <button
          className="chat-input__attach"
          onClick={() => fileRef.current.click()}
          disabled={disabled}
          title="Attach file"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 16.41a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={recording ? 'Listening...' : 'Send a message...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          className={`chat-input__voice ${recording ? 'chat-input__voice--active' : ''}`}
          onClick={handleVoice}
          disabled={disabled}
          title={recording ? 'Stop recording' : 'Voice input'}
        >
          {recording ? (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>

        <button
          className="chat-input__send"
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && !attachment)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <p className="chat-input__hint">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
};