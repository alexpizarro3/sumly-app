import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../db';

const CalculationContext = createContext();

export const useCalculation = () => useContext(CalculationContext);

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const CalculationProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load all sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await dbService.getAllLists();
    setSessions(data);
  };

  const startNewSession = (title = "Nueva Lista") => {
    const newSession = {
      id: generateId(),
      title,
      createdAt: Date.now(),
      items: [],
      total: 0
    };
    setCurrentSession(newSession);
    setIsSummaryView(false);
  };

  const addItem = async (amount, label, operator) => {
    if (!currentSession) {
      // If no session exists, start one implicitly
      const newSession = {
        id: generateId(),
        title: "Lista sin título",
        createdAt: Date.now(),
        items: [],
        total: 0
      };
      await processItemAddition(newSession, amount, label, operator);
    } else {
      await processItemAddition(currentSession, amount, label, operator);
    }
  };

  const processItemAddition = async (session, amount, label, operator) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    let newTotal = session.total;
    if (operator === '+') newTotal += numAmount;
    else if (operator === '-') newTotal -= numAmount;
    else if (operator === '*') newTotal *= numAmount;
    else if (operator === '/') newTotal /= numAmount;
    // Initial entry (first item) often doesn't have an operator if it's the base
    else if (operator === 'start') newTotal = numAmount;

    const newItem = {
      id: generateId(),
      amount: numAmount,
      label: label || 'Sin etiqueta',
      operator: operator === 'start' ? '+' : operator,
      timestamp: Date.now()
    };

    const updatedSession = {
      ...session,
      items: [...session.items, newItem],
      total: newTotal
    };

    setCurrentSession(updatedSession);
    await dbService.saveList(updatedSession);
    loadSessions(); // Refresh list in dashboard
  };

  const loadSession = (session) => {
    setCurrentSession(session);
    setIsSummaryView(false);
  };

  const finishSession = () => {
    setIsSummaryView(true);
  };

  const updateSessionTitle = async (newTitle) => {
    if (!currentSession) return;
    const updated = { ...currentSession, title: newTitle };
    setCurrentSession(updated);
    await dbService.saveList(updated);
    loadSessions();
  };

  const recalculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    let total = items[0].amount;
    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      if (item.operator === '+') total += item.amount;
      else if (item.operator === '-') total -= item.amount;
      else if (item.operator === '*') total *= item.amount;
      else if (item.operator === '/') total /= item.amount;
    }
    return total;
  };

  const removeItem = async (itemId) => {
    if (!currentSession) return;
    const updatedItems = currentSession.items.filter(item => item.id !== itemId);
    const newTotal = recalculateTotal(updatedItems);
    const updatedSession = { ...currentSession, items: updatedItems, total: newTotal };
    setCurrentSession(updatedSession);
    await dbService.saveList(updatedSession);
    loadSessions();
  };

  const updateItem = async (itemId, newAmount, newLabel) => {
    if (!currentSession) return;
    const numAmount = parseFloat(newAmount);
    if (isNaN(numAmount)) return;
    const updatedItems = currentSession.items.map(item => 
      item.id === itemId ? { ...item, amount: numAmount, label: newLabel.trim() || 'Sin etiqueta' } : item
    );
    const newTotal = recalculateTotal(updatedItems);
    const updatedSession = { ...currentSession, items: updatedItems, total: newTotal };
    setCurrentSession(updatedSession);
    await dbService.saveList(updatedSession);
    loadSessions();
  };

  const deleteSession = async (id) => {
    await dbService.deleteList(id);
    if (currentSession && currentSession.id === id) {
      setCurrentSession(null);
      setIsSummaryView(false);
    }
    loadSessions();
  };

  return (
    <CalculationContext.Provider value={{
      sessions,
      currentSession,
      isSummaryView,
      startNewSession,
      addItem,
      loadSession,
      finishSession,
      updateSessionTitle,
      setIsSummaryView,
      removeItem,
      updateItem,
      deleteSession,
      theme,
      toggleTheme
    }}>
      {children}
    </CalculationContext.Provider>
  );
};
