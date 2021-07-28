import React, { createContext, useState } from 'react';

const Context = createContext();

export const CiudadProvider = ({ children }) => {
  const [ciudad, setCity] = useState('');
  const [ciudadId, setCityId] = useState('');
  const value = {
    ciudad,
    ciudadId,
    changeCity: (id, name) => {
      setCityId(id);
      setCity(name);
    }
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
export default Context;