import React from 'react';
import { CalculationProvider, useCalculation } from './store/CalculationContext';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import PaywallModal from './components/PaywallModal';
import './App.css';

const DesktopEmptyState = () => {
  return (
    <div className="desktop-empty-state animate-in">
      <div className="empty-state-content">
        <div className="hero-logo-container">
          <img src="/sumly_icon.png" alt="Sumly Logo" className="hero-logo pulse-anim" />
        </div>
        <h1 className="hero-title">Sumly</h1>
        <p className="hero-subtitle">Suma y etiqueta. Simple.</p>
        
        <div className="hero-mock-app">
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
          <div className="mock-row mock-total fade-in-3">
            <span className="mock-label">Total</span>
            <span className="mock-total-val">$16.50</span>
          </div>
        </div>
        <p className="hero-hint">
          Selecciona una lista en el panel o presiona <strong>+ Nueva</strong> para empezar.
        </p>
      </div>
    </div>
  );
};


const AppContent = () => {
  const { currentSession, isSummaryView } = useCalculation();

  return (
    <div className="app-container">
      {/* Mobile view switches between Dashboard and Calculator. Web view shows both. */}
      <main className="main-content">
        {!currentSession ? (
          <>
            <div className="mobile-only-dashboard">
               <Dashboard />
            </div>
            <DesktopEmptyState />
          </>
        ) : isSummaryView ? (
          <Summary />
        ) : (
          <Calculator />
        )}
      </main>

      {/* Desktop sidebar is always Dashboard unless we need more space */}
      <aside className="desktop-sidebar glass">
        <Dashboard />
      </aside>
      <PaywallModal />
    </div>
  );
};

function App() {
  return (
    <CalculationProvider>
      <AppContent />
    </CalculationProvider>
  );
}

export default App;
