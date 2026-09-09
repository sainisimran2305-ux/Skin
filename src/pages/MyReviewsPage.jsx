import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, Plus } from 'lucide-react';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Elena Rostova",
      location: "San Francisco, CA",
      rating: 5,
      date: "August 12, 2026",
      product: "Radiant Glow Face Serum",
      title: "Transformation in 3 Weeks!",
      content: "The Kashmiri Saffron and Rosehip combination in this serum is unreal. My skin barrier feels restored, soft, and luminous. Will definitely repurchase the 50ml size!",
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      author: "Marcus Vance",
      location: "Austin, TX",
      rating: 5,
      date: "August 08, 2026",
      product: "Purifying Sage & Neem Cleanser",
      title: "No more breakouts or redness",
      content: "This cleanser smells divine like a mountain herbal garden. It cleared my hormonal chin breakouts without drying out my cheeks.",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      author: "Sophia Lin",
      location: "Seattle, WA",
      rating: 5,
      date: "July 28, 2026",
      product: "Cellular Renewal Night Cream",
      title: "Velvet perfection overnight",
      content: "Rich, buttery texture that absorbs smoothly. Woke up with plump, hydrated skin even in dry air-conditioned rooms.",
      helpful: 31,
      verified: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    product: 'Radiant Glow Face Serum',
    rating: 5,
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.author && newReview.title) {
      setReviews([
        {
          id: Date.now(),
          ...newReview,
          date: 'Just now',
          location: 'Verified Customer',
          helpful: 0,
          verified: true
        },
        ...reviews
      ]);
      setShowModal(false);
      setNewReview({ author: '', product: 'Radiant Glow Face Serum', rating: 5, title: '', content: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Community Feedback
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Verified Customer Reviews
        </h1>
        <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-lg">
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <span className="text-on-surface">4.9 out of 5 based on 1,240+ reviews</span>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-on-primary hover:bg-tertiary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow"
          >
            <Plus size={16} />
            <span>Write a Botanical Review</span>
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-semibold text-lg text-on-surface">{rev.author}</h4>
                  {rev.verified && (
                    <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Buyer
                    </span>
                  )}
                </div>
                <p className="text-xs text-outline">{rev.location} • Product: <strong className="text-secondary">{rev.product}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-600">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-xs text-outline">{rev.date}</span>
              </div>
            </div>

            <div>
              <h5 className="font-serif font-semibold text-base text-primary mb-1">{rev.title}</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed">{rev.content}</p>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-outline">
              <button
                onClick={() => {
                  setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, helpful: r.helpful + 1 } : r));
                }}
                className="flex items-center gap-1.5 hover:text-primary transition"
              >
                <ThumbsUp size={14} /> Helpful ({rev.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface-container-lowest p-8 rounded-3xl max-w-lg w-full border border-outline-variant/30 shadow-2xl space-y-6">
            <h3 className="font-serif text-2xl font-semibold text-primary">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best face serum I've used!"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Detailed Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience with the texture, scent, and skin results..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-outline border border-outline-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-primary text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
