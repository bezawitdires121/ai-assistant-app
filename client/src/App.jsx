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
import './styles/guest-mode.css';

export default function App() {
  const { user, loading: authLoading, logout, guestLogin } = useAuth();
  const {
    chats, activeChatId, messages,
    loading, error,
    loadChats, selectChat, send, newChat, deleteChat, reload,
  } = useChat();
  const { recording, speaking, startRecording, stopRecording, speak } = useSpeech();

  const [theme, setTheme] = useState(() => localStorage.getItem('nova_theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authPage, setAuthPage] = useState('login');
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    return (
      <div className="auth-container">
        {authPage === 'login' ? (
          <Login onSwitch={() => setAuthPage('signup')} />
        ) : (
          <Signup onSwitch={() => setAuthPage('login')} />
        )}
        
        <div className="guest-option">
          <button className="guest-btn" onClick={guestLogin}>
            Continue as Guest →
          </button>
          <p className="guest-text">Chat instantly without account</p>
        </div>
      </div>
    );
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
            {user?.isGuest && <span className="guest-badge">Guest</span>}
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
          
          {user?.isGuest && (
            <div className="guest-promo">
              <p>💡 <strong>Create an account</strong> to save your chats and access them anytime!</p>
              <button onClick={() => setShowAuthModal(true)} className="promo-btn">Sign In for Better Performance</button>
            </div>
          )}
          
          <ChatInput
            onSend={send}
            disabled={loading}
            onVoiceStart={startRecording}
            onVoiceStop={stopRecording}
            recording={recording}
          />
        </main>
      </div>

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
            <h2>Create Account for Better Experience</h2>
            <p>Save your chat history, access from anywhere, and get personalized features.</p>
            {authPage === 'login' ? (
              <Login onSwitch={() => setAuthPage('signup')} />
            ) : (
              <Signup onSwitch={() => setAuthPage('login')} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
