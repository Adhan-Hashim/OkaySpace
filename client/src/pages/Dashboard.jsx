import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { PenSquare, Heart, Calendar, User, Tag } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPosts();
    }, [user, navigate]);

    const handleSupport = async (postId) => {
        try {
            await api.post(`/posts/${postId}/like`);
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Community Board</h1>
                        <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>Anonymous stories from people like you</p>
                    </div>
                    <Link to="/create-post" className="btn-primary">
                        <PenSquare size={16} /> Share Something
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
                    {/* Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <div className="spinner-dark" style={{ margin: '0 auto 0.75rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-sub)' }}>No posts yet. Be the first to share.</p>
                                <Link to="/create-post" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.25rem' }}>Share Something</Link>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post._id} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={14} color="var(--green)" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                {post.anonymous ? 'Anonymous' : post.userId?.name || 'Someone'}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={11} />
                                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        {post.category && (
                                            <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>{post.category}</span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-sub)', lineHeight: 1.7, fontSize: '0.925rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                        <button onClick={() => handleSupport(post._id)} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            padding: '0.35rem 0.875rem', borderRadius: '999px',
                                            border: `1px solid ${post.likes?.includes(user?._id) ? '#fca5a5' : 'var(--border)'}`,
                                            background: post.likes?.includes(user?._id) ? '#fef2f2' : 'transparent',
                                            color: post.likes?.includes(user?._id) ? '#ef4444' : 'var(--text-muted)',
                                            cursor: 'pointer', fontSize: '0.82rem',
                                            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = post.likes?.includes(user?._id) ? '#fca5a5' : 'var(--border)'; e.currentTarget.style.color = post.likes?.includes(user?._id) ? '#ef4444' : 'var(--text-muted)'; }}>
                                            <Heart size={14} fill={post.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                                            {post.likes?.length || 0} supporting
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '80px' }}>
                        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Hi, {user?.name?.split(' ')[0]} 👋
                            </h3>
                            {user?.concerns?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                                    {user.concerns.slice(0, 3).map(c => (
                                        <span key={c} className="badge badge-green">{c}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Access</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {[
                                    { to: '/chat', label: '🤖 AI Listener' },
                                    { to: '/mood', label: '😊 Mood Tracker' },
                                    { to: '/letters', label: '✉️ Letters' },
                                    { to: '/therapists', label: '👩‍⚕️ Therapists' },
                                    { to: '/resources', label: '📚 Resources' },
                                    { to: '/emergency', label: '🚨 Emergency' },
                                ].map(l => (
                                    <Link key={l.to} to={l.to} style={{ padding: '0.5rem 0.6rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', color: 'var(--text-sub)', transition: 'all 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#1a1a1a'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}>
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
