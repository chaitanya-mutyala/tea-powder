import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImageFiles } from '../lib/appwrite';
import { formatPrice, getReviewTimestamp } from '../lib/format';
import PageLoader from '../components/ui/PageLoader';
import { Star, Truck, Shield, Heart, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useAdminStore(state => state.products);
  const addToCart = useCartStore(state => state.addToCart);
  const { isAuthenticated, user } = useAuthStore();
  const wishlistItems = useWishlistStore(state => state.items);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  
  const product = products.find(p => p.id === id);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewImages, setReviewImages] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [reviewError, setReviewError] = useState('');

  const isWished = wishlistItems.includes(id);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      const q = query(collection(db, 'reviews'), where('productId', '==', id));
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(fetchedReviews.sort((a, b) => getReviewTimestamp(b) - getReviewTimestamp(a)));
    };
    fetchReviews();
  }, [id]);

  if (!product) {
    return products.length === 0
      ? <PageLoader message="Loading product..." />
      : (
        <div className="page-container py-20 text-center">
          <p className="text-emerald-900/60 mb-6">Product not found.</p>
          <button type="button" onClick={() => navigate('/')} className="btn-primary rounded-full px-6">Back to Shop</button>
        </div>
      );
  }

  const isOutOfStock = product.stock <= 0;

  const handleReviewImagesChange = (e) => {
    if (e.target.files) {
      setReviewImages(Array.from(e.target.files).slice(0, 5));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    
    try {
      let uploadedImageUrls = [];
      if (reviewImages.length > 0) {
        const uploads = await uploadImageFiles(reviewImages, (current, total) => {
          setUploadProgress(`Uploading image ${current} of ${total}...`);
        });
        uploadedImageUrls = uploads.map(u => u.url);
      }

      const newReview = {
        productId: id,
        userId: user.uid,
        userEmail: user.email,
        rating,
        text: reviewText.trim(),
        images: uploadedImageUrls,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      
      setReviews([{ ...newReview, id: docRef.id, createdAt: new Date() }, ...reviews]);
      setReviewText('');
      setRating(5);
      setReviewImages([]);
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
      setUploadProgress('');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-cream-50 min-h-screen pb-24 sm:pb-12">
      <div className="page-container py-6 sm:py-8">
        
        <button type="button" onClick={() => navigate(-1)} className="flex items-center text-emerald-900/60 hover:text-emerald-950 mb-6 sm:mb-8 transition-colors font-medium text-sm min-h-11">
          <ArrowLeft className="w-5 h-5 mr-2 shrink-0" /> Back
        </button>

        <div className="card-elevated p-4 sm:p-6 md:p-10 lg:p-12 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-cream-100 rounded-xl sm:rounded-2xl overflow-hidden border border-cream-200">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="mb-5 sm:mb-6">
                {product.category && (
                  <span className="text-gold-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs">{product.category}</span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-emerald-950 mt-2 mb-3 sm:mb-4 leading-tight">{product.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                   <span className="text-2xl sm:text-3xl font-bold text-emerald-900 tabular-nums">{formatPrice(product.price)}</span>
                   {product.weight && (
                     <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 text-sm">{product.weight}</span>
                   )}
                   {avgRating && (
                     <span className="flex items-center gap-1 text-sm text-emerald-900/70">
                       <Star className="w-4 h-4 fill-gold-400 text-gold-400" /> {avgRating} ({reviews.length})
                     </span>
                   )}
                </div>
              </div>

              <div className="text-emerald-900/80 mb-5 sm:mb-6 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {product.description}
              </div>

              {product.keyFeatures && (
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-emerald-950 mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {product.keyFeatures.split('\n').map((feature, idx) => feature.trim() ? (
                      <li key={idx} className="flex items-start text-emerald-900/80 text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 mr-3 shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ) : null)}
                  </ul>
                </div>
              )}

              {product.storageInfo && (
                <div className="mb-6 sm:mb-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-950 mb-2 uppercase tracking-wider">Storage & Ingredients</h3>
                  <p className="text-sm text-emerald-900/70">{product.storageInfo}</p>
                </div>
              )}

              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 mb-8 sm:mb-10">
                <div className="flex items-center text-sm text-emerald-900/70 bg-cream-50 p-3 rounded-xl border border-cream-100">
                  <Shield className="w-5 h-5 mr-3 text-gold-500 shrink-0" /> Authentic Quality
                </div>
                <div className="flex items-center text-sm text-emerald-900/70 bg-cream-50 p-3 rounded-xl border border-cream-100">
                  <Truck className="w-5 h-5 mr-3 text-gold-500 shrink-0" /> Fast Delivery
                </div>
              </div>

              <div className="mt-auto flex gap-3 sm:gap-4">
                <button 
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock}
                  className={`flex-1 flex justify-center items-center py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm transition-all min-h-12 ${isOutOfStock ? 'bg-cream-200 text-cream-500 cursor-not-allowed' : 'bg-emerald-950 text-gold-400 hover:bg-emerald-900 shadow-lg active:scale-[0.98]'}`}
                >
                  <ShoppingBag className="w-5 h-5 mr-2 shrink-0" /> {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else toggleWishlist(product.id);
                  }}
                  aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`btn-icon min-w-12 min-h-12 rounded-full border-2 ${isWished ? 'border-gold-500 bg-gold-50 text-gold-500' : 'border-emerald-200 text-emerald-950 hover:border-emerald-950'}`}
                >
                  <Heart className={`w-6 h-6 ${isWished ? 'fill-gold-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card-elevated p-4 sm:p-6 md:p-10 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 mb-8 sm:mb-10">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            <div className="lg:col-span-1">
               <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-4">Write a Review</h3>
               {isAuthenticated ? (
                 <form onSubmit={submitReview} className="space-y-4 bg-cream-50 p-4 sm:p-6 rounded-2xl border border-cream-200">
                    {reviewError && <p className="text-red-600 text-sm">{reviewError}</p>}
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Rating</label>
                      <select value={rating} onChange={e => setRating(Number(e.target.value))} className="input-field">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Review</label>
                      <textarea required rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} className="input-field resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-950 mb-2">Images (optional, max 5)</label>
                      <input type="file" multiple accept="image/*" onChange={handleReviewImagesChange} className="w-full text-sm text-emerald-900 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700" />
                      {reviewImages.length > 0 && (
                        <p className="text-xs text-emerald-900/50 mt-2">{reviewImages.length} file(s) selected</p>
                      )}
                    </div>
                    <button type="submit" disabled={submittingReview} className="w-full btn-accent rounded-xl py-3 uppercase tracking-wider text-sm disabled:opacity-50">
                      {submittingReview ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {uploadProgress || 'Submitting...'}</span>
                      ) : 'Submit Review'}
                    </button>
                 </form>
               ) : (
                 <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 text-center">
                    <p className="text-emerald-900/70 mb-4 text-sm">Sign in to write a review.</p>
                    <button type="button" onClick={() => navigate('/login')} className="btn-primary rounded-full px-6 py-2.5 text-sm">Sign In</button>
                 </div>
               )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-cream-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex text-gold-400">
                         {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-gold-400' : 'text-cream-300'}`} />)}
                      </div>
                      <span className="font-bold text-emerald-950 text-sm">{review.userEmail?.split('@')[0] || 'Customer'}</span>
                    </div>
                    <p className="text-emerald-900/80 mb-4 text-sm sm:text-base leading-relaxed">{review.text}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         {review.images.map((img, i) => (
                           <img key={i} src={img} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-cream-200 shrink-0" />
                         ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-emerald-900/50 italic text-sm sm:text-base">No reviews yet. Be the first to review this product.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
