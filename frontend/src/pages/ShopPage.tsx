import { useEffect, useMemo, useState } from 'react';
import type { Sweet } from '../api';
import { listSweets, searchSweets, purchaseSweet } from '../api';
import { useAuth } from '../AuthContext';
import './ShopPage.css';
import Footer from '../components/Footer';

export default function ShopPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const stats = useMemo(() => {
    const totalItems = sweets.length;
    const totalQuantity = sweets.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
    const lowStock = sweets.filter((s) => Number(s.quantity) < 5).length;
    return { totalItems, totalQuantity, lowStock };
  }, [sweets]);

  async function loadSweets() {
    try {
      setLoading(true);
      const data = await listSweets();
      setSweets(data);
    } catch (err) {
      console.error('Failed to load sweets', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSweets();
  }, []);

  async function handleSearch() {
    const filters: any = {};
    if (searchName) filters.name = searchName;
    if (searchCategory) filters.category = searchCategory;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    setLoading(true);
    const data = await searchSweets(filters);
    setSweets(data);
    setLoading(false);
  }

  async function handlePurchase(id: number) {
    try {
      await purchaseSweet(id);
      loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  }

  return (
    <div className="shop">
      <header className="shop-hero">
        <div>
          <p className="eyebrow">Curated sweets</p>
          <h1 className="hero-title">Shop the Counter</h1>
          <p className="hero-subtitle">Browse fresh arrivals, filter by flavor, and grab your favorites before they sell out.</p>
          <div className="hero-chips">
            <span className="chip">Fresh Daily</span>
            <span className="chip">Small Batch</span>
            <span className="chip">No Preservatives</span>
          </div>
        </div>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          {isAdmin && <span className="badge">Admin</span>}
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="shop-metrics">
        <div className="metric-card">
          <div className="metric-label">Sweets</div>
          <div className="metric-value">{stats.totalItems}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total In Stock</div>
          <div className="metric-value">{stats.totalQuantity}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Low Stock (&lt;5)</div>
          <div className="metric-value">{stats.lowStock}</div>
        </div>
      </div>

      <div className="shop-search">
        <input placeholder="Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input placeholder="Category" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
        <input placeholder="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button onClick={handleSearch} className="btn-search">Search</button>
        <button onClick={loadSweets} className="btn-reset">Reset</button>
      </div>

      <div className="shop-grid">
        {loading && <div className="empty">Loading sweets...</div>}
        {!loading && sweets.length === 0 && (
          <div className="empty">No sweets yet. Check back soon!</div>
        )}
        {!loading && sweets.map((sweet) => (
          <div key={sweet.id} className="card">
            <div className="card-top">
              <div>
                <p className="pill">{sweet.category || 'Classic'}</p>
                <h3>{sweet.name}</h3>
                <p className="desc">Handcrafted treat, limited run.</p>
              </div>
              <div className="price-tag">${Number(sweet.price).toFixed(2)}</div>
            </div>
            <p className="stock">Stock: {sweet.quantity}</p>
            <div className="card-actions">
              <button
                className="btn-primary"
                onClick={() => handlePurchase(sweet.id)}
                disabled={sweet.quantity === 0}
              >
                {sweet.quantity === 0 ? 'Sold Out' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
