import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FEATURES = [
    { emoji: '🤝', title: 'Anonymous Sharing', desc: 'Share your thoughts without fear of judgment.' },
    { emoji: '🤖', title: 'AI Companion', desc: 'Talk to an AI listener anytime, day or night.' },
    { emoji: '📊', title: 'Mood Tracker', desc: 'Log how you feel and see patterns over time.' },
    { emoji: '💌', title: 'Kindness Letters', desc: 'Send and receive messages of support.' },
    { emoji: '👩‍⚕️', title: 'Find Therapists', desc: 'Connect with verified mental health professionals.' },
    { emoji: '📚', title: 'Resources', desc: 'Curated guides and tools to support your journey.' },
];

const CONCERNS = [
    'Anxiety', 'Depression', 'Loneliness', 'Grief', 'Burnout',
    'Trauma', 'Relationships', 'Sleep', 'Self-esteem', 'Anger',
];

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ background: 'var(--bg)' }}>
            {/* Hero */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '6rem 1.5rem 4rem',
            }}>
                <div style={{ maxWidth: '620px' }}>
                    <span className="badge badge-green" style={{ marginBottom: '1.5rem' }}>
                        Safe · Anonymous · Free
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.25rem',
                        color: '#1a1a1a',
                    }}>
                        OkaySpace
                    </h1>
                    <p style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-sub)',
                        lineHeight: 1.7,
                        marginBottom: '2.5rem',
                        maxWidth: '480px',
                        margin: '0 auto 2.5rem',
                    }}>
                        A safe, anonymous space to share your feelings, connect with others, and find support — whenever you need it.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                                Go to Community →
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn-secondary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                        Everything you need to heal
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '3rem' }}>
                        Tools and community built for mental wellness
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {FEATURES.map(f => (
                            <div key={f.title} className="card" style={{ padding: '1.75rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.emoji}</div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#1a1a1a' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Concerns */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>We're here for these concerns</h2>
                    <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Whatever you're going through, OkaySpace has a place for you.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                        {CONCERNS.map(c => (
                            <span key={c} className="badge badge-green" style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>{c}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!user && (
                <section style={{ padding: '5rem 1.5rem', background: 'white', textAlign: 'center' }}>
                    <div className="container" style={{ maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to start?</h2>
                        <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
                            Join thousands finding peace and connection.
                        </p>
                        <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 3rem' }}>
                            Create Your Free Account
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
