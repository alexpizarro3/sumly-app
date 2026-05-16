import React from 'react';
import { useCalculation } from '../store/CalculationContext';
import { Plus, ListTodo, ChevronRight, Search, Trash2, Share2, Download, FileSpreadsheet, Sun, Moon } from 'lucide-react';
import { handleShare, handleDownload, handleExportToSheets } from '../utils/export';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    sessions, startNewSession, loadSession, deleteSession,
    theme, toggleTheme
  } = useCalculation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [installPrompt, setInstallPrompt] = React.useState(null);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container animate-in">
      <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <div className="logo-icon"><ListTodo size={24} /></div>
          <h2>Sumly</h2>
        </div>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          {installPrompt && (
            <button onClick={handleInstallClick} className="icon-btn" title="Instalar App" style={{color: 'var(--md-sys-color-primary)', background: 'transparent', padding: '0.5rem', borderRadius: '50%'}}>
              <Download size={20} />
            </button>
          )}
          <button onClick={toggleTheme} className="icon-btn" title="Cambiar tema" style={{color: 'var(--md-sys-color-on-surface)', background: 'transparent', padding: '0.5rem', borderRadius: '50%'}}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="new-btn" onClick={() => startNewSession()}>
            <Plus size={20} />
            <span>Nueva</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-content-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 className="section-title" style={{margin: 0}}>Listas Guardadas</h3>
          <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'var(--md-sys-color-surface-variant)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)'}}>
            <Search size={18} style={{color: 'var(--md-sys-color-outline)', marginRight: '0.6rem'}} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{background: 'transparent', border: 'none', color: 'var(--md-sys-color-on-surface)', outline: 'none', width: '130px', fontSize: '0.95rem'}}
            />
          </div>
        </div>
        {filteredSessions.length === 0 ? (
          <div className="empty-state" style={{marginTop: '2rem'}}>
            <div className="hero-logo-container" style={{margin: '0 auto 1.5rem auto', width: '80px', height: '80px'}}>
              <img src="/sumly_icon.png" alt="Sumly Logo" className="hero-logo pulse-anim" />
            </div>
            <div className="hero-mock-app" style={{textAlign: 'left', marginBottom: '2rem'}}>
              <div className="mock-row fade-in-1">
                <span className="mock-op">+</span>
                <span className="mock-amount">$4.50</span>
                <span className="mock-tag">Café</span>
              </div>
              <div className="mock-row fade-in-2">
                <span className="mock-op">+</span>
                <span className="mock-amount">$12.00</span>
                <span className="mock-tag">Uber🚕</span>
              </div>
            </div>
            <p style={{color: 'var(--md-sys-color-on-surface-variant)'}}>Toca <strong>+ Nueva</strong> para empezar a sumar.</p>
          </div>
        ) : (
          <div className="sessions-list">
            {filteredSessions.map(session => (
              <div 
                key={session.id} 
                className="session-card"
                onClick={() => loadSession(session)}
              >
                <div className="session-info">
                  <h4>{session.title || 'Sin Título'}</h4>
                  <span className="date">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="session-total">
                  <span>${session.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <div style={{display: 'flex', gap: '0.2rem', marginLeft: '0.5rem', flexShrink: 0}}>
                    <button 
                      className="delete-session-btn"
                      onClick={(e) => { e.stopPropagation(); handleShare(session); }}
                      title="Compartir"
                      style={{color: 'var(--md-sys-color-outline)', background: 'transparent'}}
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      className="delete-session-btn"
                      onClick={(e) => { e.stopPropagation(); handleDownload(session); }}
                      title="Descargar CSV"
                      style={{color: 'var(--md-sys-color-outline)', background: 'transparent'}}
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      className="delete-session-btn"
                      onClick={(e) => { e.stopPropagation(); handleExportToSheets(session); }}
                      title="Google Sheets (CSV)"
                      style={{color: 'var(--md-sys-color-secondary)', background: 'transparent'}}
                    >
                      <FileSpreadsheet size={16} />
                    </button>
                    <button 
                      className="delete-session-btn"
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      title="Eliminar lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <ChevronRight size={18} className="chevron" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
