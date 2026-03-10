import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, X, CheckCircle } from 'lucide-react';

const Therapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        (async () => {
            try { const res = await api.get('/therapists'); setTherapists(res.data); }
            catch { console.error('Failed to load therapists'); }
            finally { setLoading(false); }
        })();
    }, []);

    const handleBook = async (e, therapistId) => {
        e.preventDefault();
        if (!selectedTime) return alert('Please select a time slot.');
        try {
            await api.post('/therapists/book', { therapistId, timeSlot: selectedTime });
            setSuccessMsg('Appointment booked! The counselor will reach out shortly.');
            setBooking(null); setSelectedTime('');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch { alert('Failed to book appointment.'); }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Find a Counselor</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                    Connect with verified professionals who specialize in emotional support.
                </p>

                {successMsg && (
                    <div style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <CheckCircle size={16} color="#10b981" />
                        <span style={{ color: '#059669', fontSize: '0.875rem' }}>{successMsg}</span>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner-dark" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading professionals...</p>
                    </div>
                ) : therapists.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No therapists available right now. Check back soon.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {therapists.map(t => (
                            <div key={t._id} className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--green)', flexShrink: 0 }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{t.name}</h3>
                                        <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{t.specialization}</span>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.1rem' }}>{t.bio}</p>

                                {booking === t._id ? (
                                    <form onSubmit={e => handleBook(e, t._id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                        <label className="input-label">Select a time slot</label>
                                        <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} required className="input-field" style={{ appearance: 'none' }}>
                                            <option value="">— Choose time —</option>
                                            {t.availability?.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Confirm</button>
                                            <button type="button" className="btn-secondary" style={{ padding: '0.6rem 0.875rem' }} onClick={() => { setBooking(null); setSelectedTime(''); }}>
                                                <X size={15} />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setBooking(t._id)} className="btn-primary" style={{ width: '100%', padding: '0.65rem' }}>
                                        <Calendar size={15} /> Book Session
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Therapists;
