// src/context/DatabaseContext.jsx
// ============================================================
// SINGLE SOURCE OF TRUTH for the entire LocalStorage "database".
// All other contexts (Student, Company, Admin) consume from here
// instead of independently calling readDB(), which caused desync.
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readDB, writeDB } from '../utils/storageHelper';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(() => readDB());

  // Auto-save to localStorage whenever db changes
  useEffect(() => {
    if (db && db.users) {
      writeDB(db);
    }
  }, [db]);

  // Expose a stable updater so child contexts can mutate the shared DB
  const updateDb = useCallback((updater) => {
    setDb(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  // Force re-read from localStorage (useful after login/register writes directly)
  const refreshDb = useCallback(() => {
    setDb(readDB());
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, updateDb, refreshDb }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
