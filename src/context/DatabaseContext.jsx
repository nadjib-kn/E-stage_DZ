// src/context/DatabaseContext.jsx — STUB (localStorage replaced by real API)
import React, { createContext, useContext } from 'react';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => (
  <DatabaseContext.Provider value={{ db: {}, updateDb: () => {}, refreshDb: () => {} }}>
    {children}
  </DatabaseContext.Provider>
);

export const useDatabase = () => useContext(DatabaseContext);
