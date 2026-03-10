import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { PenSquare, Heart, Calendar, User } from 'lucide-react';

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
        <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', padding: '10rem 10% 4rem' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-line)' }}>
                    <div>
                        <p className="text-technical" style={{ marginBottom: '1rem' }}>NEURAL_COLLECTIVE // FEED</p>
                        <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>COMMUNE</h1>
                    </div>
                    <Link to="/create-post" className="btn-mindjoin" style={{ background: 'var(--accent-teal)', color: '#000' }}>
                        [ BROADCAST_THOUGHT ]
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem', alignItems: 'start' }}>
                    {/* Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--border-line)', border: '1px solid var(--border-line)' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '8rem', background: 'var(--bg-deep)' }}>
                                <div className="text-technical">SYNCHRONIZING_FEED...</div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div style={{ padding: '6rem', textAlign: 'center', background: 'var(--bg-deep)' }}>
                                <p className="text-technical">NO_THOUGHTS_DETECTED</p>
                                <Link to="/create-post" className="text-technical" style={{ color: 'var(--accent-teal)', marginTop: '2rem', display: 'block' }}>[ INITIALIZE_BROADCAST ]</Link>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post._id} style={{
                                    padding: '3rem',
                                    background: 'var(--bg-deep)',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ width: '24px', height: '24px', border: '1px solid var(--border-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={12} color="var(--accent-teal)" />
                                        </div>
                                        <div>
                                            <p className="text-technical" style={{ fontSize: '0.7rem', color: 'var(--text-primary)' }}>
                                                {post.anonymous ? 'ANONYMOUS_ENTITY' : post.userId?.name?.toUpperCase() || 'UNKNOWN'}
                                            </p>
                                            <p className="text-technical" style={{ fontSize: '0.6rem', opacity: 0.4 }}>
                                                {new Date(post.createdAt).toISOString().split('T')[0]} // {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {post.category && (
                                            <span className="text-technical" style={{ marginLeft: 'auto', fontSize: '0.6rem', padding: '0.2rem 0.5rem', border: '1px solid var(--border-line)' }}>
                                                {post.category.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>{post.content}</p>
                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <button onClick={() => handleSupport(post._id)} className="text-technical" style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: post.likes?.includes(user?._id) ? 'var(--accent-magenta)' : 'var(--text-muted)',
                                            padding: 0
                                        }}>
                                            <Heart size={14} fill={post.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                                            [ SUPPORT: {post.likes?.length || 0} ]
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '10rem' }}>
                        <div style={{ border: '1px solid var(--border-line)', padding: '2rem', marginBottom: '2rem' }}>
                            <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1rem' }}>USER_PROFILE</p>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{user?.name?.toUpperCase()}</h3>
                            <div style={{ height: '1px', background: 'var(--border-line)', marginBottom: '1.5rem' }} />
                            {user?.concerns?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {user.concerns.slice(0, 3).map(c => (
                                        <span key={c} className="text-technical" style={{ fontSize: '0.6rem', color: 'var(--accent-teal)' }}>#{c.toUpperCase()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ border: '1px solid var(--border-line)', padding: '2rem' }}>
                            <p className="text-technical" style={{ fontSize: '0.6rem', marginBottom: '1.5rem' }}>QUICK_NAVIGATION</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { to: '/chat', label: 'NEURAL_LISTENER' },
                                    { to: '/mood', label: 'METRIC_TRACKER' },
                                    { to: '/letters', label: 'support_gateway' },
                                    { to: '/emergency', label: 'URGENT_RESPONSE' },
                                ].map(l => (
                                    <Link key={l.to} to={l.to} className="text-technical" style={{
                                        textDecoration: 'none',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        transition: 'color 0.3s ease'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
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
