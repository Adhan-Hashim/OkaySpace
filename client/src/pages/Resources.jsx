import React, { useState, useEffect } from 'react';
import api from '../api';
import { Archive, FileText, Play, Music, Box } from 'lucide-react';

const ICONS = { Article: <FileText size={18} />, Video: <Play size={18} />, Audio: <Music size={18} />, Tool: <Box size={18} /> };

const DEFAULT_RESOURCES = [
    { _id: '1', title: 'GROUNDING_TECH_54321', category: 'Tool', content: 'A simple grounding exercise for panic and anxiety. Focus on 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.', author: 'SYSTEM_CORE' },
    { _id: '2', title: 'COGNITIVE_REFRAMING_MOD', category: 'Article', content: 'Learn how to identify and challenge negative thought patterns that contribute to anxiety and depression.', author: 'WELLNESS_UNIT' },
    { _id: '3', title: 'BINAURAL_RELAX_FREQ', category: 'Audio', content: 'Auditory stimulation that helps calm the nervous system and promote deeper relaxation.', author: 'AUDIO_LAB' },
];

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL_MODULES');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources');
                setResources(res.data.length ? res.data : DEFAULT_RESOURCES);
            } catch { setResources(DEFAULT_RESOURCES); }
            finally { setLoading(false); }
        };
        fetchResources();
    }, []);

    const rawCategories = [...new Set(resources.map(r => r.category))];
    const categories = ['ALL_MODULES', ...rawCategories.map(c => c.toUpperCase())];

    const filtered = filter === 'ALL_MODULES' ? resources : resources.filter(r => r.category.toUpperCase() === filter);

    return (
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <p className="text-technical" style={{ marginBottom: '1rem' }}>DATA_ARCHIVE // INTEL</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>RESOURCE_LIBRARY</h1>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} style={{
                            padding: '0.75rem 1.5rem',
                            border: filter === cat ? '1px solid var(--accent-teal)' : '1px solid var(--border-line)',
                            background: filter === cat ? 'rgba(0, 255, 255, 0.05)' : 'transparent',
                            color: filter === cat ? 'var(--accent-teal)' : 'var(--text-muted)',
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}>
                            [ {cat} ]
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: '8rem 0', textAlign: 'center' }}>
                        <div className="text-technical" style={{ fontSize: '0.75rem', opacity: 0.5, animation: 'pulse 1.5s infinite' }}>SYNCING_ARCHIVE_DATA...</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2px', background: 'var(--border-line)', border: '1px solid var(--border-line)' }}>
                        {filtered.map(res => (
                            <div key={res._id} style={{
                                padding: '3rem',
                                background: 'var(--bg-deep)',
                                transition: 'background 0.3s ease',
                                cursor: 'help'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-deep)'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '36px', height: '36px', border: '1px solid var(--border-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
                                        {ICONS[res.category] || <Archive size={18} />}
                                    </div>
                                    <span className="text-technical" style={{ fontSize: '0.55rem', opacity: 0.5 }}>IDENT: {res.category.toUpperCase()}</span>
                                </div>

                                <h3 className="text-technical" style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{res.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: 'var(--font-mono)', minHeight: '4.5rem' }}>{res.content}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="text-technical" style={{ fontSize: '0.5rem', opacity: 0.4 }}>SOURCE // {res.author.toUpperCase()}</span>
                                    <span className="text-technical" style={{ fontSize: '0.6rem', color: 'var(--accent-teal)' }}>[ ACCESS_DATA ]</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
