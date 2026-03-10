import React from 'react';
import { Phone, AlertCircle, ShieldCheck, Heart } from 'lucide-react';

const LINES = [
    { name: 'Vandrevala Foundation', desc: 'Free emotional support and counseling 24/7.', phone: '+91-9999-666-555', tel: '+919999666555', icon: <Heart size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
    { name: 'KIRAN Mental Health Helpline', desc: '24/7 toll-free helpline for psychological support and crisis management.', phone: '1800-599-0019', tel: '18005990019', icon: <ShieldCheck size={18} />, color: '#0891b2', bg: '#ecfeff' },
    { name: 'Childline India', desc: '24-hour emergency service for children and young people in need.', phone: '1098', tel: '1098', icon: <Phone size={18} />, color: '#be185d', bg: '#fdf2f8' },
];

const Emergency = () => {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <div style={{ padding: '1rem 1.25rem', marginBottom: '2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>
                        <p style={{ fontWeight: 700, color: '#ef4444', marginBottom: '0.2rem' }}>Are you in immediate danger?</p>
                        <p style={{ color: '#7f1d1d', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            If you're in a crisis, call your local emergency number immediately (112 in India). Help is always available.
                        </p>
                    </div>
                </div>

                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Emergency Support</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>Free, confidential helplines — available 24/7.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {LINES.map((line, idx) => (
                        <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: line.bg, color: line.color }}>
                                    {line.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{line.name}</h3>
                                    <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>{line.desc}</p>
                                    <a href={`tel:${line.tel}`} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.45rem 1rem', background: line.bg,
                                        border: `1.5px solid ${line.color}30`, borderRadius: '8px',
                                        color: line.color, textDecoration: 'none', fontWeight: 700,
                                        fontSize: '0.95rem', transition: 'all 0.15s ease',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${line.color}20`; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                        <Phone size={14} /> {line.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Emergency;
