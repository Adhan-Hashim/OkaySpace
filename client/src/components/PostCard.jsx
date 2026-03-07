import React, { useState, useContext } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const hasLiked = post.likes.includes(user?._id);

    const handleLike = async () => {
        try {
            const res = await api.post(`/posts/${post._id}/like`);
            onUpdate(post._id, { likes: res.data });
        } catch (error) {
            console.error(error);
        }
    };

    const loadComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await api.get(`/posts/${post._id}/comments`);
                setComments(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const res = await api.post(`/posts/${post._id}/comments`, { comment: commentText });
            setComments([...comments, res.data]);
            setCommentText('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                alert('FAILED TO POST COMMENT.');
            }
        }
    };

    const authorName = post.anonymous ? 'Anonymous User' : post.userId?.name || 'Unknown User';

    return (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: post.anonymous ? 'var(--surface-hover)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {authorName.charAt(0)}
                </div>
                <div>
                    <h4 style={{ margin: 0 }}>{authorName}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <button onClick={handleLike} className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', color: hasLiked ? 'var(--secondary)' : 'var(--text-muted)' }}>
                    <Heart size={20} fill={hasLiked ? "currentColor" : "none"} /> {post.likes.length} Support
                </button>
                <button onClick={loadComments} className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-muted)' }}>
                    <MessageCircle size={20} /> Reply
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    {loadingComments ? <p>Loading comments...</p> : (
                        <>
                            {comments.map((c) => (
                                <div key={c._id} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                                    <strong>{c.userId?.name || 'User'}</strong>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{c.comment}</p>
                                </div>
                            ))}
                            <form onSubmit={submitComment} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="input-field"
                                    style={{ marginBottom: 0 }}
                                    placeholder="Share a supportive word..."
                                />
                                <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
