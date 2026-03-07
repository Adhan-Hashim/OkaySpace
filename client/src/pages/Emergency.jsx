import React from 'react';
import { Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import QuickExit from '../components/QuickExit';

const Emergency = () => {
    return (
        <div style={{
            minHeight: '100vh',
            padding: '12vh 4vw',
            background: 'var(--bg-color)',
            color: 'var(--text-main)',
            position: 'relative'
        }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '4px solid var(--text-main)', paddingBottom: '1rem' }}>
                    <AlertCircle size={48} color="var(--danger)" />
                    <h1 className="display-text" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', margin: 0 }}>EMERGENCY <span style={{ color: 'var(--danger)' }}>HELP</span></h1>
                </div>

                <p style={{ fontSize: '1.5rem', marginBottom: '3rem', fontWeight: 'bold' }}>
                    If you are in immediate danger or experiencing a medical emergency, please call your local emergency services instantly. You are not alone.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* India Childline */}
                    <div style={{
                        background: 'var(--secondary-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '4px solid var(--text-main)',
                        boxShadow: '8px 8px 0px var(--accent)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <ShieldCheck size={32} />
                            <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem', margin: 0 }}>CHILDLINE INDIA</h2>
                        </div>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>A 24-hour emergency phone service for children in need of aid and assistance.</p>
                        <a href="tel:1098" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)', textDecoration: 'none' }}>
                            <Phone size={28} /> 1098
                        </a>
                    </div>

                    {/* Kiran Mental Health Line */}
                    <div style={{
                        background: 'var(--secondary-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '4px solid var(--text-main)',
                        boxShadow: '8px 8px 0px var(--accent)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Phone size={32} />
                            <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem', margin: 0 }}>KIRAN MENTAL HEALTH HELPLINE</h2>
                        </div>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>24/7 toll-free helpline providing psychological support and crisis management.</p>
                        <a href="tel:18005990019" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)', textDecoration: 'none' }}>
                            <Phone size={28} /> 1800-599-0019
                        </a>
                    </div>

                    {/* Vandrevala Foundation */}
                    <div style={{
                        background: 'var(--secondary-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '4px solid var(--text-main)',
                        boxShadow: '8px 8px 0px var(--accent)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Phone size={32} />
                            <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem', margin: 0 }}>VANDREVALA FOUNDATION</h2>
                        </div>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Free emotional support and counseling for anyone in distress.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <a href="tel:+919999666555" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)', textDecoration: 'none' }}>
                                <Phone size={24} /> +91-9999-666-555
                            </a>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Emergency;
