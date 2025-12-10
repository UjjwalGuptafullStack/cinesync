import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check localStorage for saved theme, default to 'dark' (McLaren standard)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cinesync-theme') || 'dark';
  });

  // Whenever theme changes, update the HTML tag and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the old class and add the new one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Save preference
    localStorage.setItem('cinesync-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);
