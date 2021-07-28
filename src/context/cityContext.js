import React, { createContext, useState } from 'react';

const Context = createContext();

export const CityProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');
  const [email, setMail] = useState('');
  const value = {
    search,
    city,
    cityId,
    email,
    changeCity: (id, name) => {
      setCityId(id);
      setCity(name);
      setSearch('');
    },
    changeEmail: (name) => {
      setMail(name);
    },
    changeSearch: (value) => {
      setSearch(value);
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
export default Context;
