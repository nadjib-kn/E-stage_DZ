// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { readDB, writeDB } from '../utils/storageHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('eStageUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // SIGN IN LOGIC
  const login = (email, password) => {
    const db = readDB(); 
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // BLOCK 1: Check if the company is pending validation
      if (user.role === 'company' && user.verificationStatus === 'pending') {
        return { success: false, message: "Your company account is pending admin approval. Please check back later." };
      }
      
      // BLOCK 2: Check if the company was rejected
      if (user.role === 'company' && user.verificationStatus === 'rejected') {
        return { success: false, message: "Your company registration was rejected. Please contact support." };
      }

      // BLOCK 3: Check if user is suspended (Applies to all users)
      if (user.status === 'suspended') {
        return { success: false, message: "Your account has been suspended. Please contact support." };
      }

      const { password: _, ...safeUser } = user; 
      setCurrentUser(safeUser);
      localStorage.setItem('eStageUser', JSON.stringify(safeUser));
      return { success: true, role: user.role };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  };

  // SIGN UP LOGIC (NEW)
  const register = (role, name, email, password) => {
    const db = readDB();

    // Check if email already exists
    if (db.users.find(u => u.email === email)) {
      return { success: false, message: "Email is already registered." };
    }

    const newUser = {
      id: `u${Date.now()}`,
      role: role,
      email: email,
      password: password,
      status: 'active',
      // Assign the name to the correct field based on role
      ...(role === 'student' ? { name: name } : { companyName: name, company: name }),
      // Assign default avatars
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}&backgroundColor=ffffff`
    };

    // If it's a company, lock them out until Admin approves them
    if (role === 'company') {
      newUser.verificationStatus = 'pending';
    }

    db.users.push(newUser);
    writeDB(db);

    if (role === 'company') {
      return { success: true, message: "Account created! You must wait for Admin approval before logging in." };
    } else {
      return { success: true, message: "Account created successfully! You can now sign in." };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eStageUser');
  };

  // FIX: updateUser now also persists changes to the main database,
  // not just to eStageUser in localStorage. This ensures Admin sees 
  // updated profiles and data doesn't vanish on context re-read.
  const updateUser = (updatedInfo) => {
    const updatedUser = { ...currentUser, ...updatedInfo };
    setCurrentUser(updatedUser);
    localStorage.setItem('eStageUser', JSON.stringify(updatedUser));

    // Also update the user record in the main database
    const db = readDB();
    db.users = db.users.map(u =>
      u.id === updatedUser.id ? { ...u, ...updatedInfo } : u
    );
    writeDB(db);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);