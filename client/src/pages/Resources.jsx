import React, { useState, useEffect } from 'react';
import api from '../api';
import { BookOpen, Video, Headphones, Heart } from 'lucide-react';

const ICONS = {
    'Article': <BookOpen size={40} />,
    'Video': <Video size={40} />,
    'Audio': <Headphones size={40} />,
    'Tool': <Heart size={40} />
};

const DEFAULT_RESOURCES = [
    { _id: '1', title: 'Grounding Protocol Alpha', category: 'Tool', content: '5-4-3-2-1 semantic reset for panic events.', author: 'Sys.Admin' },
    { _id: '2', title: 'Cognitive Reframing', category: 'Article', content: 'A logical approach to dismantling irrational anxiety thought loops.', author: 'Dr. V. Cortex' },
    { _id: '3', title: 'Binaural Delta Frequencies', category: 'Audio', content: 'Auditory stimulation for parasympathetic nervous system engagement.', author: 'Audio.Lab' },
];

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources');
                setResources(res.data.length ? res.data : DEFAULT_RESOURCES);
            } catch (err) {
                setResources(DEFAULT_RESOURCES);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    return (
        <div style={{ padding: '8vw 4vw', maxWidth: '1400px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid var(--text-main)', paddingBottom: '2rem', marginBottom: '4rem' }}>
                <div>
                    <h2 className="heading-lg" style={{ fontSize: '4.5rem', margin: 0, lineHeight: 1 }}>ARCHIVES</h2>
                    <p style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.25rem', marginTop: '1rem' }}>STANDARDIZED WELLNESS PROTOCOLS</p>
                </div>
            </div>

            {loading ? (
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem' }}>ACCESSING ARCHIVES...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {resources.map(res => (
                        <div key={res._id} style={{
                            background: 'white',
                            border: '4px solid var(--text-main)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '12px 12px 0px var(--accent)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ marginBottom: '2rem', color: 'var(--accent)' }}>
                                {ICONS[res.category] || <BookOpen size={40} />}
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '1rem' }}>
                                {res.title}
                            </h3>
                            <div style={{
                                fontFamily: 'var(--font-accent)',
                                background: 'var(--secondary-bg)',
                                alignSelf: 'flex-start',
                                padding: '0.25rem 0.75rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem'
                            }}>
                                TYPE: {res.category.toUpperCase()}
                            </div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', flex: 1, marginBottom: '2rem' }}>
                                {res.content}
                            </p>
                            <div style={{ borderTop: '2px solid var(--text-main)', paddingTop: '1rem', fontFamily: 'var(--font-accent)', fontSize: '0.9rem' }}>
                                LOGGED BY: {res.author.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;
