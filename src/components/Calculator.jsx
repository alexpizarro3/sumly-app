import React, { useState, useRef, useEffect } from 'react';
import { useCalculation } from '../store/CalculationContext';
import { Delete, ArrowLeft, Trash2, Check, X, Edit3, Share2, FileDown, FileSpreadsheet, Home } from 'lucide-react';
import { handleShare, handleDownload, handleExportToSheets } from '../utils/export';
import './Calculator.css';

const Calculator = () => {
  const { currentSession, addItem, finishSession, setIsSummaryView, updateItem, removeItem, updateSessionTitle, closeSession } = useCalculation();
  const [currentAmount, setCurrentAmount] = useState('0');
  const [currentLabel, setCurrentLabel] = useState('');
  const labelInputRef = useRef(null);
  const auditEndRef = useRef(null);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemLabel, setEditItemLabel] = useState('');
  const [editItemAmount, setEditItemAmount] = useState('');
  const [editingField, setEditingField] = useState('label');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const [pendingOperator, setPendingOperator] = useState('start');
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    setTempTitle(currentSession?.title || '');
    if (currentSession?.items?.length > 0) {
      setPendingOperator('+');
    } else {
      setPendingOperator('start');
    }
  }, [currentSession?.id, currentSession?.title]);

  useEffect(() => {
    if (auditEndRef.current) {
      auditEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.items]);

  const handleTitleSave = () => {
    if (tempTitle.trim() !== '') {
      updateSessionTitle(tempTitle);
    }
    setIsEditingTitle(false);
  };

  const startEditingItem = (item, field = 'label') => {
    setEditingItemId(item.id);
    setEditItemLabel(item.label);
    setEditItemAmount(item.amount.toString());
    setEditingField(field);
  };

  const saveEditingItem = (id) => {
    updateItem(id, editItemAmount, editItemLabel);
    setEditingItemId(null);
  };

  // Focus the label input sometimes if needed, or keep it optional
  const handleNumber = (num) => {
    setHasTyped(true);
    if (currentAmount.length >= 12 && !currentAmount.includes('.')) return; // Prevent huge integers
    if (currentAmount.length >= 15) return; // Hard limit

    if (currentAmount === '0' && num !== '.') {
      setCurrentAmount(num);
    } else {
      if (num === '.' && currentAmount.includes('.')) return;
      setCurrentAmount(prev => prev + num);
    }
  };

  const handleOperator = async (op) => {
    if (!hasTyped && op !== '=') {
      if (currentSession?.items?.length > 0) {
        setPendingOperator(op);
      }
      return;
    }

    if (op === '=') {
      if (hasTyped || currentSession?.items?.length === 0) {
         await addItem(currentAmount, currentLabel, pendingOperator);
      }
      finishSession();
      setHasTyped(false);
      return;
    }

    await addItem(currentAmount, currentLabel, pendingOperator);
    setPendingOperator(op);
    setCurrentAmount('0');
    setCurrentLabel('');
    setHasTyped(false);
  };

  const handleBackspace = () => {
    if (currentAmount.length <= 1) {
      setCurrentAmount('0');
      setHasTyped(false);
    } else {
      setCurrentAmount(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setCurrentAmount('0');
    setCurrentLabel('');
    setHasTyped(false);
  };

  return (
    <div className="calculator-container animate-in">
      <div className="mobile-top-bar">
        <button onClick={closeSession} className="back-btn" title="Volver al inicio">
           <Home size={22} />
        </button>
        {isEditingTitle ? (
          <div className="title-edit-mode" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--md-sys-color-surface-variant)', padding: '0.3rem 1rem', borderRadius: 'var(--radius-full)'}}>
            <input 
              autoFocus
              onFocus={(e) => e.target.select()}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              style={{background: 'transparent', border: 'none', color: 'var(--md-sys-color-on-surface)', outline: 'none', width: '130px', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center'}}
              placeholder="Nombre de lista"
            />
            <button onMouseDown={(e) => { e.preventDefault(); handleTitleSave(); }} style={{color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center'}}><Check size={16}/></button>
          </div>
        ) : (
          <div 
            className="session-title-pill" 
            onClick={() => setIsEditingTitle(true)}
            style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
            title="Editar nombre"
          >
            {currentSession?.title || 'Nueva Lista'}
            <Edit3 size={14} style={{color: 'var(--md-sys-color-outline)'}} />
          </div>
        )}
        <div style={{display: 'flex', gap: '0.2rem'}}>
          <button onClick={() => handleShare(currentSession)} style={{color: 'var(--md-sys-color-on-background)', padding: '0.5rem', borderRadius: '50%', background: 'rgba(128, 128, 128, 0.1)'}} title="Compartir"><Share2 size={18} /></button>
          <button onClick={() => handleDownload(currentSession)} style={{color: 'var(--md-sys-color-on-background)', padding: '0.5rem', borderRadius: '50%', background: 'rgba(128, 128, 128, 0.1)'}} title="Descargar TXT"><FileDown size={18} /></button>
          <button onClick={() => handleExportToSheets(currentSession)} style={{color: 'var(--md-sys-color-secondary)', padding: '0.5rem', borderRadius: '50%', background: 'rgba(128, 128, 128, 0.1)'}} title="Google Sheets (CSV)"><FileSpreadsheet size={18} /></button>
        </div>
      </div>

      {/* Audit List Area */}
      <div className="audit-list glass">
        <div className="audit-items">
          {currentSession?.items?.map((item, i) => (
            <div key={item.id} className="audit-item animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
              {editingItemId === item.id ? (
                <div className="item-edit-mode" style={{display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center'}}>
                   <input 
                     autoFocus={editingField === 'label'}
                     onFocus={(e) => e.target.select()}
                     value={editItemLabel} 
                     onChange={e => setEditItemLabel(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && saveEditingItem(item.id)}
                     placeholder="Etiqueta"
                     style={{flex: 1, background: 'var(--md-sys-color-surface-variant)', border: '1px solid var(--md-sys-color-outline)', color: 'var(--md-sys-color-on-surface)', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem'}}
                   />
                   <input 
                     autoFocus={editingField === 'amount'}
                     onFocus={(e) => e.target.select()}
                     type="number"
                     value={editItemAmount} 
                     onChange={e => setEditItemAmount(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && saveEditingItem(item.id)}
                     placeholder="Monto"
                     style={{width: '80px', background: 'var(--md-sys-color-surface-variant)', border: '1px solid var(--md-sys-color-outline)', color: 'var(--md-sys-color-on-surface)', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem'}}
                   />
                   <button onClick={() => saveEditingItem(item.id)} style={{color: 'var(--md-sys-color-secondary)', padding: '0.2rem'}}><Check size={18}/></button>
                   <button onClick={() => setEditingItemId(null)} style={{color: 'var(--md-sys-color-outline)', padding: '0.2rem'}}><X size={18}/></button>
                </div>
              ) : (
                <>
                  <span className="operator">{item.operator !== 'start' ? item.operator : ''}</span>
                  <span className="label" onClick={() => startEditingItem(item, 'label')} style={{cursor: 'pointer'}} title="Clic para editar">{item.label}</span>
                  <span className="amount" onClick={() => startEditingItem(item, 'amount')} style={{cursor: 'pointer'}} title="Clic para editar">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <button onClick={() => removeItem(item.id)} style={{color: 'var(--md-sys-color-error)', padding: '0.2rem', marginLeft: '0.5rem', flexShrink: 0}} title="Eliminar"><Trash2 size={16}/></button>
                </>
              )}
            </div>
          ))}
          {currentSession?.items?.length === 0 && (
            <div className="audit-empty">Añade tu primer monto...</div>
          )}
          <div ref={auditEndRef} />
        </div>
        <div className="running-total">
          Total: ${currentSession?.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
        </div>
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="amount-display">
          {pendingOperator !== 'start' && (
            <span className="pending-op" style={{color: 'var(--md-sys-color-primary)', marginRight: '0.75rem', fontWeight: 500}}>
              {pendingOperator}
            </span>
          )}
          <span className="currency">$</span>
          <span className="value">{currentAmount}</span>
        </div>
        <input 
          type="text" 
          className="label-input" 
          placeholder="Añade una etiqueta (opcional)..." 
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          ref={labelInputRef}
        />
      </div>

      {/* Keypad */}
      <div className="keypad">
        <button className="key secondary" onClick={handleClear}>C</button>
        <button className="key secondary" onClick={handleBackspace}><Delete size={24} /></button>
        <button className="key operator" onClick={() => handleOperator('/')}>/</button>
        <button className="key operator" onClick={() => handleOperator('*')}>×</button>

        <button className="key number" onClick={() => handleNumber('7')}>7</button>
        <button className="key number" onClick={() => handleNumber('8')}>8</button>
        <button className="key number" onClick={() => handleNumber('9')}>9</button>
        <button className="key operator" onClick={() => handleOperator('-')}>-</button>

        <button className="key number" onClick={() => handleNumber('4')}>4</button>
        <button className="key number" onClick={() => handleNumber('5')}>5</button>
        <button className="key number" onClick={() => handleNumber('6')}>6</button>
        <button className="key operator" onClick={() => handleOperator('+')}>+</button>

        <button className="key number" onClick={() => handleNumber('1')}>1</button>
        <button className="key number" onClick={() => handleNumber('2')}>2</button>
        <button className="key number" onClick={() => handleNumber('3')}>3</button>
        <button className="key operator equals" onClick={() => handleOperator('=')}>=</button>

        <button className="key number zero" onClick={() => handleNumber('0')}>0</button>
        <button className="key number" onClick={() => handleNumber('.')}>.</button>
      </div>
    </div>
  );
};

export default Calculator;
