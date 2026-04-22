import { useState } from 'react';
import { useStore, useDispatch } from '../data/store';
import './CommentSection.css';

export default function CommentSection({ interviewId }) {
  const state = useStore();
  const dispatch = useDispatch();
  const comments = state.comments[interviewId] || [];
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const maxChars = 500;

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        interviewId,
        text: text.trim(),
        author: author.trim() || 'Anonymous',
      },
    });
    setText('');
  }

  function handleReply(e, parentId) {
    e.preventDefault();
    if (!replyText.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        interviewId,
        text: replyText.trim(),
        author: 'Anonymous',
        parentId,
      },
    });
    setReplyText('');
    setReplyTo(null);
  }

  const topLevel = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);

  function getReplies(parentId) {
    return replies.filter(r => r.parentId === parentId);
  }

  function getRelativeTime(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <section className="comment-section" id="comment-section">
      <h3 className="comment-section-title">
        Comments
        {comments.length > 0 && (
          <span className="comment-section-count">{comments.length}</span>
        )}
      </h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-row">
          <input
            type="text"
            className="comment-author-input"
            placeholder="Your name (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={30}
            id="comment-author"
          />
        </div>
        <div className="comment-textarea-wrap">
          <textarea
            className="comment-textarea"
            placeholder="Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            rows={3}
            id="comment-text"
          />
          <span className="comment-char-count">
            {text.length}/{maxChars}
          </span>
        </div>
        <button
          type="submit"
          className="comment-submit"
          disabled={!text.trim()}
          id="comment-submit"
        >
          Post Comment
        </button>
      </form>

      {comments.length === 0 && (
        <div className="comment-empty">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M4 28V10a2 2 0 012-2h20a2 2 0 012 2v12a2 2 0 01-2 2H10l-6 4z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p>No comments yet. Be the first to share your thoughts.</p>
        </div>
      )}

      <div className="comment-list">
        {topLevel.map(comment => (
          <div key={comment.id} className="comment-thread" id={`comment-${comment.id}`}>
            <div className="comment-item">
              <div className="comment-item-header">
                <span className="comment-item-author">{comment.author}</span>
                <span className="comment-item-time">{getRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="comment-item-text">{comment.text}</p>
              <button
                className="comment-reply-btn"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                Reply
              </button>
            </div>

            {getReplies(comment.id).map(reply => (
              <div key={reply.id} className="comment-item comment-reply">
                <div className="comment-item-header">
                  <span className="comment-item-author">{reply.author}</span>
                  <span className="comment-item-time">{getRelativeTime(reply.createdAt)}</span>
                </div>
                <p className="comment-item-text">{reply.text}</p>
              </div>
            ))}

            {replyTo === comment.id && (
              <form className="comment-reply-form" onSubmit={(e) => handleReply(e, comment.id)}>
                <textarea
                  className="comment-textarea comment-reply-textarea"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value.slice(0, maxChars))}
                  rows={2}
                  autoFocus
                />
                <div className="comment-reply-actions">
                  <button
                    type="button"
                    className="comment-reply-cancel"
                    onClick={() => { setReplyTo(null); setReplyText(''); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="comment-reply-submit"
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
