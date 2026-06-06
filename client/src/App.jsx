import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import './styles/index.css';

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    chats, activeChatId, messages,
    loading, error,
    loadChats, selectChat, send, newChat, deleteChat, reload,
  } = useChat();
  const { recording, speaking, startRecording, stopRecording, speak } = useSpeech();

  const [theme, setTheme] = useState(() => localStorage.getItem('nova_theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authPage, setAuthPage] = useState('login');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nova_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) loadChats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading) return (
    <div className="auth-loading">
      <div className="auth-loading__spinner" />
    </div>
  );

  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />;
  }

  return (
    <div className={`layout ${sidebarOpen ? 'layout--sidebar-open' : ''}`}>
      <Sidebar
        sessions={(chats || []).map((c) => ({
  id: c._id,
  name: c.name,
  createdAt: c.updatedAt || c.createdAt,
}))}
        activeId={activeChatId}
        onSelect={selectChat}
        onNew={newChat}
        onDelete={deleteChat}
        theme={theme}
        onToggleTheme={() => setTheme((p) => p === 'dark' ? 'light' : 'dark')}
        user={user}
        onLogout={logout}
      />

      <div className="chat-area">
        <header className="header">
          <button className="header__toggle" onClick={() => setSidebarOpen((p) => !p)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="header__title">
            {chats.find((c) => c._id === activeChatId)?.name || 'New Chat'}
          </span>
          {loading && (
            <div className="header__status header__status--thinking">
              <span className="header__status-dot" />
              Thinking...
            </div>
          )}
        </header>

        <main className="main">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSuggestion={send}
            onReload={reload}
            onSpeak={speak}
            speaking={speaking}
          />
          {error && <div className="error-banner">⚠ {error}</div>}
          <ChatInput
            onSend={send}
            disabled={loading}
            onVoiceStart={startRecording}
            onVoiceStop={stopRecording}
            recording={recording}
          />
        </main>
      </div>
    </div>
  );
}