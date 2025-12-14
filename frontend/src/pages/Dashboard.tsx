import { useEffect, useMemo, useState } from 'react';
import type { Sweet } from '../api';
import { listSweets, searchSweets, purchaseSweet, deleteSweet, createSweet, updateSweet, restockSweet } from '../api';
import { useAuth } from '../AuthContext';
import './Dashboard.css';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockAmount, setRestockAmount] = useState('');
  const { user, logout, isAdmin } = useAuth();

  const stats = useMemo(() => {
    const totalItems = sweets.length;
    const totalQuantity = sweets.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
    const lowStock = sweets.filter((s) => Number(s.quantity) < 5).length;
    const categories = new Set(sweets.map((s) => s.category || 'Uncategorized')).size;
    return { totalItems, totalQuantity, lowStock, categories };
  }, [sweets]);

  const openAdd = () => {
    if (!isAdmin) return;
    setShowAddForm(true);
    setEditingSweet(null);
    setFormData({ name: '', category: '', price: '', quantity: '' });
  };

  async function loadSweets() {
    try {
      const data = await listSweets();
      setSweets(data);
    } catch (err) {
      console.error('Failed to load sweets', err);
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
    const data = await searchSweets(filters);
    setSweets(data);
  }

  async function handlePurchase(id: number) {
    try {
      await purchaseSweet(id);
      loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this sweet?')) return;
    try {
      await deleteSweet(id);
      loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  async function handleAddOrUpdate() {
    try {
      if (editingSweet) {
        await updateSweet(editingSweet.id, {
          name: formData.name || undefined,
          category: formData.category || undefined,
          price: formData.price ? Number(formData.price) : undefined,
          quantity: formData.quantity ? Number(formData.quantity) : undefined,
        });
      } else {
        await createSweet({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        });
      }
      setShowAddForm(false);
      setEditingSweet(null);
      setFormData({ name: '', category: '', price: '', quantity: '' });
      loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  }

  async function handleRestock() {
    if (!restockId || !restockAmount) return;
    try {
      await restockSweet(restockId, Number(restockAmount));
      setRestockId(null);
      setRestockAmount('');
      loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  }

  function startEdit(sweet: Sweet) {
    setEditingSweet(sweet);
    setFormData({ name: sweet.name, category: sweet.category, price: String(sweet.price), quantity: String(sweet.quantity) });
    setShowAddForm(true);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1 className="hero-title">Inventory & Pricing</h1>
          <p className="hero-subtitle">Add new sweets, update prices, restock fast. Buyers see a separate shop view.</p>
          <div className="hero-chips">
            <span className="chip">Add</span>
            <span className="chip">Update</span>
            <span className="chip">Restock</span>
          </div>
        </div>
        <div className="user-info">
          <span className="user-email">{user?.email} {isAdmin && <span className="badge">Admin</span>}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="cta-banner">
        <div>
          <p className="cta-kicker">Fresh arrivals</p>
          <h3>Keep the counter full of color.</h3>
          <p className="cta-sub">Add limited editions, update pricing, or restock bestsellers in seconds.</p>
        </div>
        <div className="cta-actions">
          {isAdmin && (
            <button className="btn-primary" onClick={openAdd}>+ Add a Sweet</button>
          )}
          <button className="btn-ghost" onClick={loadSweets}>Refresh List</button>
        </div>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-label">Unique Sweets</div>
          <div className="metric-value">{stats.totalItems}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total In Stock</div>
          <div className="metric-value">{stats.totalQuantity}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Categories</div>
          <div className="metric-value">{stats.categories}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Low Stock (&lt;5)</div>
          <div className="metric-value">{stats.lowStock}</div>
        </div>
      </div>

      <div className="search-bar">
        <input placeholder="Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input placeholder="Category" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
        <input placeholder="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button onClick={handleSearch} className="btn-search">Search</button>
        <button onClick={loadSweets} className="btn-reset">Reset</button>
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingSweet(null); setFormData({ name: '', category: '', price: '', quantity: '' }); }} className="btn-add">
            {showAddForm ? 'Cancel' : '+ Add Sweet'}
          </button>
        </div>
      )}

      {showAddForm && isAdmin && (
        <div className="form-card">
          <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
          <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          <input placeholder="Price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <input placeholder="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
          <button onClick={handleAddOrUpdate} className="btn-submit">{editingSweet ? 'Update' : 'Add'}</button>
        </div>
      )}

      <div className="sweets-grid">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="sweet-card">
            <h3>{sweet.name}</h3>
            <p className="category">{sweet.category}</p>
            <p className="price">${Number(sweet.price).toFixed(2)}</p>
            <p className="quantity">Stock: {sweet.quantity}</p>
            <div className="actions">
              <button onClick={() => handlePurchase(sweet.id)} disabled={sweet.quantity === 0} className="btn-purchase">
                Purchase
              </button>
              {isAdmin && (
                <>
                  <button onClick={() => startEdit(sweet)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(sweet.id)} className="btn-delete">Delete</button>
                  <button onClick={() => { setRestockId(sweet.id); setRestockAmount(''); }} className="btn-restock">Restock</button>
                </>
              )}
            </div>
            {restockId === sweet.id && isAdmin && (
              <div className="restock-form">
                <input type="number" placeholder="Amount" value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} />
                <button onClick={handleRestock} className="btn-submit-small">Add</button>
                <button onClick={() => setRestockId(null)} className="btn-cancel-small">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
