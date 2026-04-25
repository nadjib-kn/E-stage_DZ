// src/utils/storageHelper.js
import { mockDatabase } from '../data/mockData';

const DB_KEY = 'internship_platform_db';

export const readDB = () => {
  try {
    const existingData = localStorage.getItem(DB_KEY);
    
    // If it's missing, empty, or corrupted, force it to use mockDatabase
    if (!existingData || existingData === "undefined" || existingData === "null") {
      console.log("Initializing fresh database...");
      localStorage.setItem(DB_KEY, JSON.stringify(mockDatabase));
      return mockDatabase;
    }
    
    return JSON.parse(existingData);
  } catch (error) {
    console.error("Failed to parse Local Storage. Resetting to mock data.", error);
    return mockDatabase; // Safety fallback
  }
};

export const writeDB = (newData) => {
  if (newData && newData.users) { // Double check it's valid data before saving
    localStorage.setItem(DB_KEY, JSON.stringify(newData));
  }
};