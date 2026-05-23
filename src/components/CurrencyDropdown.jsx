import React, { useState, useRef, useEffect } from 'react';
import { useCalculation } from '../store/CalculationContext';
import { CURRENCIES, getCurrencySymbol } from '../utils/currency';
import { ChevronDown } from 'lucide-react';
import './CurrencyDropdown.css';

const CurrencyDropdown = () => {
  const { currency, setCurrency } = useCalculation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const currentSymbol = getCurrencySymbol(currency);

  return (
    <div className="currency-dropdown-container" ref={dropdownRef}>
      <button 
        className="currency-dropdown-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Cambiar moneda"
      >
        <span className="currency-btn-symbol">{currentSymbol}</span>
        <span className="currency-btn-code">{currency}</span>
        <ChevronDown size={14} className="currency-btn-icon" />
      </button>
      
      {isOpen && (
        <div className="currency-dropdown-menu animate-in">
          {CURRENCIES.map(c => (
            <button 
              key={c.code}
              className={`currency-dropdown-item ${currency === c.code ? 'active' : ''}`}
              onClick={() => handleSelect(c.code)}
            >
              <div className="currency-item-left">
                <span className="currency-item-symbol">{c.symbol}</span>
                <span className="currency-item-code">{c.code}</span>
              </div>
              <span className="currency-item-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
