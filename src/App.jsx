import React from 'react';
import { CalculationProvider, useCalculation } from './store/CalculationContext';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import './App.css';

const AppContent = () => {
  const { currentSession, isSummaryView } = useCalculation();

  return (
    <div className="app-container">
      {/* Mobile view switches between Dashboard and Calculator. Web view shows both. */}
      <main className="main-content">
        {!currentSession ? (
          <div className="mobile-only-dashboard">
             <Dashboard />
          </div>
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
