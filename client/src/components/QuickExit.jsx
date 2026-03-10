import React from 'react';
import { ShieldAlert } from 'lucide-react';

const QuickExit = () => {

    const handlePanicExit = () => {
        // Clear local storage / session data if needed to protect the user
        localStorage.removeItem('token');

        // Use history.replaceState to replace the current URL so the back button doesn't work easily
        window.history.replaceState(null, '', 'https://www.google.com');

        // Immediately redirect to a safe/generic website
        window.location.replace('https://www.google.com');
    };

    return (
        <button
            onClick={handlePanicExit}
            title="Quick Exit - Redirection to Google"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 999999,
                background: '#ef4444',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '50px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0px 6px 20px rgba(239,68,68,0.35)',
                transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <ShieldAlert size={18} /> Quick Exit
        </button>
    );
};

export default QuickExit;
