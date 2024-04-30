import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [email, setEmail] = useState(null);
  
    return (
      <DataContext.Provider value={{ data, setData, email, setEmail }}>
        {children}
      </DataContext.Provider>
    );
  };