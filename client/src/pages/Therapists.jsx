import React, { useState, useEffect } from 'react';
import api from '../api';

const Therapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null); // id of therapist being booked
    const [selectedTime, setSelectedTime] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                const res = await api.get('/therapists');
                setTherapists(res.data);
            } catch (err) {
                console.error("Failed to load therapists", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTherapists();
    }, []);

    const handleBook = async (e, therapistId) => {
        e.preventDefault();
        if (!selectedTime) return alert("Please select a time slot.");

        try {
            await api.post('/therapists/book', { therapistId, timeSlot: selectedTime });
            setSuccessMsg("Appointment successfully booked! The counselor will reach out shortly.");
            setBooking(null);
            setSelectedTime('');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            console.error(err);
            alert("Failed to book appointment.");
        }
    };

    return (
        <div style={{ padding: '8vw 4vw', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '800px', width: '100%', marginBottom: '4rem', textAlign: 'center' }}>
                <h1 className="heading-lg" style={{ color: 'var(--text-main)' }}>Counseling.</h1>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)', marginTop: '1rem' }}>
                    Connect with real, verified professionals who specialize in processing trauma and emotional recovery.
                </p>
                {successMsg && <div style={{ background: 'var(--mint-green)', color: 'var(--text-main)', padding: '1rem', borderRadius: '4px', marginTop: '2rem', fontWeight: 'bold' }}>{successMsg}</div>}
            </div>

            {loading ? (
                <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem' }}>Loading professionals...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
                    {therapists.map(t => (
                        <div key={t._id} style={{ background: 'var(--secondary-bg)', border: '1px solid var(--text-main)', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--text-main)', color: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', margin: 0 }}>{t.name}</h3>
                                    <span style={{ color: 'var(--accent)', fontWeight: '500', fontSize: '0.9rem' }}>{t.specialization}</span>
                                </div>
                            </div>

                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '2rem', flex: 1 }}>
                                {t.bio}
                            </p>

                            {booking === t._id ? (
                                <form onSubmit={(e) => handleBook(e, t._id)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--text-main)' }}>
                                    <label style={{ fontFamily: 'var(--font-accent)', fontWeight: 'bold' }}>Select a time slot:</label>
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="input-durable"
                                        style={{ background: 'white' }}
                                        required
                                    >
                                        <option value="">-- Choose time --</option>
                                        {t.availability.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                    </select>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn-durable" style={{ flex: 1, padding: '0.5rem' }}>Confirm</button>
                                        <button type="button" onClick={() => { setBooking(null); setSelectedTime(''); }} className="btn-durable" style={{ flex: 1, padding: '0.5rem', background: 'transparent', color: 'var(--text-main)' }}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <button onClick={() => setBooking(t._id)} className="btn-durable" style={{ width: '100%' }}>
                                    Book Session
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Therapists;
