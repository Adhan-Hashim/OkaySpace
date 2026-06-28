import React, { createContext, useState, useEffect } from 'react';

export const SafeModeContext = createContext(null);

export const SafeModeProvider = ({ children }) => {
    // Check localStorage for saved preference
    const [isSafeMode, setIsSafeMode] = useState(() => {
        const saved = localStorage.getItem('okaySpaceSafeMode');
        return saved === 'true';
    });

    // Toggle function
    const toggleSafeMode = () => {
        setIsSafeMode(prev => {
            const newValue = !prev;
            localStorage.setItem('okaySpaceSafeMode', String(newValue));
            return newValue;
        });
    };

    // Effect to apply the specific CSS class to the document body
    useEffect(() => {
        if (isSafeMode) {
            document.body.classList.add('safe-mode');
        } else {
            document.body.classList.remove('safe-mode');
        }
    }, [isSafeMode]);

    return (
        <SafeModeContext.Provider value={{ isSafeMode, toggleSafeMode }}>
            {children}
        </SafeModeContext.Provider>
    );
};
