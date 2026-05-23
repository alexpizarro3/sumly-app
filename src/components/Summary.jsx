import React, { useState } from 'react';
import { useCalculation } from '../store/CalculationContext';
import { ArrowLeft, Edit3, Check, Share2, FileDown, Trash2, X, FileSpreadsheet, FileText } from 'lucide-react';
import { handleShare, handleDownload, handleExportToSheets, handleExportToPDF } from '../utils/export';
import { getCurrencySymbol } from '../utils/currency';
import './Summary.css';

const Summary = () => {
  const { currentSession, setIsSummaryView, updateSessionTitle, updateItem, removeItem, currency } = useCalculation();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentSession?.title || '');
  
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemLabel, setEditItemLabel] = useState('');
  const [editItemAmount, setEditItemAmount] = useState('');
  const [editingField, setEditingField] = useState('label');

  const handleTitleSave = () => {
    updateSessionTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const startEditingItem = (item, field = 'label') => {
    setEditingItemId(item.id);
    setEditItemLabel(item.label);
    setEditItemAmount(item.amount.toString());
    setEditingField(field);
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
  };

  const saveEditingItem = (id) => {
    updateItem(id, editItemAmount, editItemLabel);
    setEditingItemId(null);
  };

  // Items are kept in chronological order to maintain mathematical logic

  return (
    <div className="summary-container animate-in">
      <div className="summary-header">
        <button className="icon-btn" onClick={() => setIsSummaryView(false)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-actions">
          <button className="icon-btn" title="Compartir texto" onClick={() => handleShare(currentSession, currency)}><Share2 size={20} /></button>
          <button className="icon-btn" title="Descargar TXT" onClick={() => handleDownload(currentSession, currency)}><FileDown size={20} /></button>
          <button className="icon-btn" title="Descargar PDF" onClick={() => handleExportToPDF(currentSession, currency)} style={{color: 'var(--md-sys-color-error)'}}><FileText size={20} /></button>
          <button className="icon-btn" title="Google Sheets (CSV)" onClick={() => handleExportToSheets(currentSession, currency)} style={{color: 'var(--md-sys-color-secondary)'}}><FileSpreadsheet size={20} /></button>
        </div>
      </div>

      <div className="summary-title-section">
        {isEditingTitle ? (
          <div className="title-edit">
            <input 
              autoFocus
              onFocus={(e) => e.target.select()}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            />
            <button onClick={handleTitleSave} className="save-title-btn"><Check size={18} /></button>
          </div>
        ) : (
          <div className="title-display" onClick={() => setIsEditingTitle(true)}>
            <h1>{currentSession?.title || 'Lista sin título'}</h1>
            <Edit3 size={18} className="edit-icon" />
          </div>
        )}
        <div className="date-display">
          {new Date(currentSession?.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="summary-total-card glass">
        <h2>Total</h2>
        <div className="total-amount">
          {getCurrencySymbol(currency)}{currentSession?.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="summary-list">
        <h3>Historial de Operaciones</h3>
        <div className="items-container">
          {currentSession?.items?.map(item => (
            <div key={item.id} className="summary-item">
              {editingItemId === item.id ? (
                <div className="item-edit-mode" style={{display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center'}}>
                   <input 
                     autoFocus={editingField === 'label'}
                     onFocus={(e) => e.target.select()}
                     value={editItemLabel} 
                     onChange={e => setEditItemLabel(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && saveEditingItem(item.id)}
                     placeholder="Etiqueta"
                     style={{flex: 1, background: 'var(--md-sys-color-surface-variant)', border: '1px solid var(--md-sys-color-outline)', color: 'var(--md-sys-color-on-surface)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.95rem'}}
                   />
                   <input 
                     autoFocus={editingField === 'amount'}
                     onFocus={(e) => e.target.select()}
                     type="number"
                     value={editItemAmount} 
                     onChange={e => setEditItemAmount(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && saveEditingItem(item.id)}
                     placeholder="Monto"
                     style={{width: '90px', background: 'var(--md-sys-color-surface-variant)', border: '1px solid var(--md-sys-color-outline)', color: 'var(--md-sys-color-on-surface)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.95rem'}}
                   />
                   <button onClick={() => saveEditingItem(item.id)} style={{color: 'var(--md-sys-color-secondary)', padding: '0.3rem'}}><Check size={20}/></button>
                   <button onClick={cancelEditingItem} style={{color: 'var(--md-sys-color-outline)', padding: '0.3rem'}}><X size={20}/></button>
                </div>
              ) : (
                <>
                  <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
                    <span className="item-label" onClick={() => startEditingItem(item, 'label')} style={{cursor: 'pointer'}} title="Editar">{item.label}</span>
                    {item.operator !== '+' && item.operator !== 'start' && (
                      <span className="item-operator-badge">{item.operator}</span>
                    )}
                  </div>
                  <div className="item-amount" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0}}>
                    <span onClick={() => startEditingItem(item, 'amount')} style={{cursor: 'pointer'}} title="Editar">
                      {getCurrencySymbol(currency)}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div style={{display: 'flex', gap: '0.2rem', marginLeft: '0.5rem'}}>
                      <button onClick={() => startEditingItem(item, 'label')} style={{color: 'var(--md-sys-color-outline)', padding: '0.2rem'}}><Edit3 size={16}/></button>
                      <button onClick={() => removeItem(item.id)} style={{color: 'var(--md-sys-color-error)', padding: '0.2rem'}}><Trash2 size={16}/></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
