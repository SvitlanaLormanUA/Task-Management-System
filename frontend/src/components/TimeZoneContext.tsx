// src/context/TimezoneContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type TimezoneContextType = { timezone: string };

const TimezoneContext = createContext<TimezoneContextType>({ timezone: 'UTC' });

export const useTimezone = () => useContext(TimezoneContext);

export const TimezoneProvider = ({ children }: { children: React.ReactNode }) => {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz || 'UTC');
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

