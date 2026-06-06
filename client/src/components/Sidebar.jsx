import { useState } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export const Sidebar = ({ sessions, activeId, onSelect, onNew, onDelete, theme, onToggleTheme }) => {
  const [search, setSearch] = useState('');

  const filtered = sessions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {
    Today: filtered.filter((s) => isToday(s.createdAt)),
    Yesterday: filtered.filter((s) => isYesterday(s.createdAt)),
    Older: filtered.filter((s) => !isToday(s.createdAt) && !isYesterday(s.createdAt)),
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <Logo size={26} />
          <span className="sidebar__brand-name">Nova AI</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <button className="sidebar__new-chat" onClick={onNew} title="New Chat">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
  New Chat
</button>


      <div className="sidebar__search-wrap">
        <svg className="sidebar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="sidebar__search"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sidebar__list">
        {Object.entries(grouped).map(([label, items]) =>
          items.length > 0 ? (
            <div key={label} className="sidebar__group">
              <span className="sidebar__group-label">{label}</span>
              {items.map((s) => (
                <div
                  key={s.id}
                  className={`sidebar__item ${s.id === activeId ? 'sidebar__item--active' : ''}`}
                  onClick={() => onSelect(s.id)}
                >
                  <span className="sidebar__item-name">{s.name}</span>
                  <button
                    className="sidebar__item-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : null
        )}
        {filtered.length === 0 && (
          <p className="sidebar__empty">No chats found</p>
        )}
      </div>

      <div className="sidebar__footer">
        <span className="sidebar__footer-text">Built by Bezawit</span>
      </div>
    </aside>
  );
};

const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

const isYesterday = (date) => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};