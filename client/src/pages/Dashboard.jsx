import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../api';
import { PenTool } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const headerRef = useRef(null);
    const feedRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, navigate]);

    useEffect(() => {
        if (!loading && headerRef.current && feedRef.current) {
            gsap.fromTo(headerRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
            gsap.fromTo(feedRef.current.children,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
            );
        }
    }, [loading]);

    return (
        <div style={{ padding: '4vw', maxWidth: '1200px', margin: '0 auto' }}>

            <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '6px solid var(--text-main)' }}>
                <div>
                    <h2 className="display-text text-hollow-accent" style={{ fontSize: '6rem', margin: 0, lineHeight: 0.9 }}>LEDGER.</h2>
                    <p style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.5rem', color: 'var(--text-main)' }}>PUBLIC EMOTIONAL RECORDS</p>
                </div>
                <Link to="/create-post" className="btn-brutalist" style={{ marginBottom: '1rem' }}>
                    <PenTool size={24} style={{ marginRight: '10px' }} /> DEPOSIT
                </Link>
            </div>

            <div className="grid-layout">
                <div style={{ gridColumn: 'span 12 / span 8' }} ref={feedRef}>
                    {loading ? (
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '2rem' }}>ACCESSING RECORDS...</div>
                    ) : posts.length === 0 ? (
                        <div style={{ background: 'white', border: '2px solid var(--text-main)', padding: '3rem', fontFamily: 'var(--font-accent)', fontSize: '1.5rem' }}>
                            VAULT IS EMPTY. NO EMOTIONAL CURRENCY LOGGED TODAY.
                        </div>
                    ) : (
                        posts.map((post, index) => {
                            const cardColors = ['var(--bg-color)', 'white', 'var(--secondary-bg)'];
                            const accentColors = ['var(--accent)', 'var(--danger)', 'var(--text-main)'];
                            return (
                                <div key={post._id} style={{ background: cardColors[index % cardColors.length], border: '6px solid var(--text-main)', padding: '3rem', marginBottom: '3rem', boxShadow: `12px 12px 0px ${accentColors[index % accentColors.length]}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid var(--text-main)', paddingBottom: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-accent)', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                                        <span style={{ fontWeight: 'bold' }}>{post.anonymous ? 'ASSET: ANONYMOUS' : `ASSET: ${post.userId?.name || 'UNKNOWN'}`}</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap', marginBottom: '2rem', lineHeight: '1.5' }}>{post.content}</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-accent)' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', padding: '0.5rem 1rem', background: 'var(--text-main)', color: 'white' }}>SUPPORTERS: {post.likes?.length || 0}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div style={{ gridColumn: 'span 12 / span 4' }}>
                    <div style={{ background: 'var(--secondary-bg)', border: '6px solid var(--text-main)', padding: '3rem', position: 'sticky', top: '120px', boxShadow: '12px 12px 0px var(--text-main)' }}>
                        <h3 className="heading-lg" style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '4px solid var(--text-main)', paddingBottom: '1rem' }}>
                            PROFILE: <br /><span style={{ color: 'var(--accent)', WebkitTextStroke: '1px var(--text-main)' }}>{user?.name}</span>
                        </h3>
                        {user?.concerns && user.concerns.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <p style={{ fontFamily: 'var(--font-accent)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>PRIMARY CONCERNS:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {user.concerns.map(c => (
                                        <span key={c} style={{ background: 'var(--text-main)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.9rem', fontFamily: 'var(--font-accent)' }}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                            <Link to="/chat" className="btn-brutalist" style={{ width: '100%', fontSize: '1.2rem', justifyContent: 'flex-start', background: 'white', color: 'var(--text-main)' }}>AI LISTENER</Link>
                            <Link to="/mood" className="btn-brutalist" style={{ width: '100%', fontSize: '1.2rem', justifyContent: 'flex-start', background: 'white', color: 'var(--text-main)' }}>MOOD TRACKER</Link>
                            <Link to="/resources" className="btn-brutalist" style={{ width: '100%', fontSize: '1.2rem', justifyContent: 'flex-start', background: 'white', color: 'var(--text-main)' }}>EDUCATION</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
