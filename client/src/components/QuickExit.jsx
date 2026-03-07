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
                zIndex: 999999, // Ensure it's ALWAYS on top
                background: 'var(--danger)',
                color: 'var(--bg-color)',
                border: '4px solid var(--bg-color)',
                borderRadius: '50px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-accent)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <ShieldAlert size={24} /> QUICK EXIT
        </button>
    );
};

export default QuickExit;
