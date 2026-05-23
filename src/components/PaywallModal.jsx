import React from 'react';
import { useCalculation } from '../store/CalculationContext';
import { X, Check, Star } from 'lucide-react';
import { handleStripeCheckout } from '../utils/stripe';
import './PaywallModal.css';

const PaywallModal = () => {
  const { showPaywall, setShowPaywall, isPremium } = useCalculation();

  if (!showPaywall || isPremium) return null;

  return (
    <div className="paywall-overlay" onClick={() => setShowPaywall(false)}>
      <div className="paywall-content" onClick={e => e.stopPropagation()}>
        <button className="paywall-close" onClick={() => setShowPaywall(false)}>
          <X size={24} />
        </button>
        
        <div className="paywall-header">
          <div className="star-icon-container pulse-anim">
            <Star size={32} fill="currentColor" />
          </div>
          <h2>Desbloquea Sumly Premium</h2>
          <p>Has alcanzado el límite de 3 listas gratuitas.</p>
        </div>

        <div className="paywall-features">
          <div className="feature-item">
            <Check size={20} className="check-icon" />
            <span><strong>Listas infinitas</strong>, sin límites.</span>
          </div>
          <div className="feature-item">
            <Check size={20} className="check-icon" />
            <span>Exportación a <strong>PDF y CSV</strong> profesional.</span>
          </div>
          <div className="feature-item">
            <Check size={20} className="check-icon" />
            <span>Pago <strong>único</strong> de por vida. Sin suscripciones.</span>
          </div>
        </div>

        <div className="paywall-action">
          <button className="premium-btn" onClick={handleStripeCheckout}>
            Conseguir Premium por $5.00
          </button>
          <p className="secure-text">Pago seguro gestionado por Stripe.</p>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
