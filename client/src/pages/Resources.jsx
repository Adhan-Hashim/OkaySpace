import React, { useState, useEffect } from 'react';
import api from '../api';
import { BookOpen, Video, Headphones, Heart } from 'lucide-react';

const ICONS = { Article: <BookOpen size={20} />, Video: <Video size={20} />, Audio: <Headphones size={20} />, Tool: <Heart size={20} /> };

const DEFAULT_RESOURCES = [
    { _id: '1', title: 'Grounding Technique (5-4-3-2-1)', category: 'Tool', content: 'A simple grounding exercise for panic and anxiety. Focus on 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.', author: 'OkaySpace Team' },
    { _id: '2', title: 'Cognitive Reframing', category: 'Article', content: 'Learn how to identify and challenge negative thought patterns that contribute to anxiety and depression.', author: 'Wellness Desk' },
    { _id: '3', title: 'Binaural Beats for Relaxation', category: 'Audio', content: 'Auditory stimulation that helps calm the nervous system and promote deeper relaxation.', author: 'Audio Lab' },
];

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

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

    const categories = ['All', ...new Set(resources.map(r => r.category))];
    const filtered = filter === 'All' ? resources : resources.filter(r => r.category === filter);

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Resources & Education</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>Curated mental health content to support your journey</p>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} style={{
                            padding: '0.35rem 1rem', borderRadius: '999px', border: '1.5px solid',
                            borderColor: filter === cat ? 'var(--green)' : 'var(--border)',
                            background: filter === cat ? 'var(--green-light)' : 'transparent',
                            color: filter === cat ? 'var(--green-hover)' : 'var(--text-sub)',
                            fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                            fontFamily: 'var(--font-body)', transition: 'all 0.15s ease',
                        }}>
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner-dark" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {filtered.map(res => (
                            <div key={res._id} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}>
                                <div style={{ display: 'inline-flex', width: '36px', height: '36px', background: 'var(--green-light)', borderRadius: '8px', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', marginBottom: '0.875rem' }}>
                                    {ICONS[res.category] || <BookOpen size={20} />}
                                </div>
                                <span className="badge badge-green" style={{ marginBottom: '0.6rem', display: 'inline-flex' }}>{res.category}</span>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>{res.title}</h3>
                                <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{res.content}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>by {res.author}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
