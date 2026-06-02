'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlagiarismResult } from '@/lib/plagiarism';

export interface CheckHistoryItem {
  id: string;
  timestamp: number;
  text: string;
  result: PlagiarismResult;
  preview: string;
}

interface HistoryContextType {
  history: CheckHistoryItem[];
  addToHistory: (text: string, result: PlagiarismResult) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  getHistoryItem: (id: string) => CheckHistoryItem | undefined;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_HISTORY_ITEMS = 50;
const STORAGE_KEY = 'plagiarism-check-history';

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<CheckHistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const saveHistory = (newHistory: CheckHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const addToHistory = (text: string, result: PlagiarismResult) => {
    const newItem: CheckHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      text,
      result,
      preview: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
    };

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    saveHistory(newHistory);
  };

  const getHistoryItem = (id: string) => {
    return history.find(item => item.id === id);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        deleteHistoryItem,
        getHistoryItem,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
