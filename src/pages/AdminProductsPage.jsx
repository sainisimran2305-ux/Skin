import React, { useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  TrendingUp,
  Tag,
  Sparkles,
  AlertCircle,
  Eye,
  X,
  Filter,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  Percent,
  Layers,
  Truck,
  Clock,
  Calendar,
  CreditCard,
  ShoppingBag,
  MapPin,
  FileText,
  User,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Key,
  LogOut,
  Upload,
  FolderUp,
  Camera,
  FileImage
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

// Preset sample botanical skincare image suggestions for quick selection
const PRESET_IMAGES = [
  { label: 'Serum Bottle (Amber Glass)', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80' },
  { label: 'Face Wash & Gel Cleanser', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hydration Cream Jar', url: 'https://images.unsplash.com/photo-1608248597263-00079e95a329?auto=format&fit=crop&w=800&q=80' },
  { label: 'Botanical Mist / Toner', url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80' },
  { label: 'De-Tan / Clay Mask', url: 'https://images.unsplash.com/photo-1567928815117-ac372134c441?auto=format&fit=crop&w=800&q=80' },
  { label: 'Body Wash & Shower Elixir', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
];

const CATEGORY_MAP = {
  facewash: 'Face Wash',
  toners: 'Toner',
  serums: 'Serum',
  moisturizers: 'Moisturiser',
  sunscreens: 'Sunscreen',
  masks: 'De-Tan & Hydration Masks',
  bodywash: 'Body Wash',
};

const SKIN_TYPE_OPTIONS = ['all', 'dry', 'oily', 'combination', 'sensitive', 'mature', 'dull', 'acne-prone'];

const ORDER_STEPS = [
  { step: 1, label: 'Order Placed', desc: 'Payment / COD confirmed' },
  { step: 2, label: 'Formulating Botanicals', desc: 'Compounding in lab' },
  { step: 3, label: 'In Transit', desc: 'Handed over to carrier' },
  { step: 4, label: 'Delivered', desc: 'Arrived at destination' }
];

const CARRIER_OPTIONS = [
  'EcoCourier Express',
  'Delhivery Surface',
  'Blue Dart Express',
  'DTDC Prime',
  'India Post SpeedPost'
];

// Helper to compress and optimize device-uploaded photos before storing
const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, JPEG, WEBP, AVIF)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          name: file.name,
          size: `${Math.round((dataUrl.length * 0.75) / 1024)} KB`,
        });
      };
      img.onerror = () => reject(new Error('Unable to decode image file'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image from device'));
    reader.readAsDataURL(file);
  });
};

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(activeTabParam === 'orders' ? 'orders' : 'products');

  // Auth Context for Owner Access
  const { isOwner, user, logout } = useAuth();

  // Product Context
  const {
    products,
    updateProduct,
    updatePrice,
    addProduct,
    deleteProduct,
    bulkAdjustPrices,
    resetToDefaults,
    backendActive,
  } = useProducts();

  // Order Context
  const {
    orders,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    placeOrder,
    resetOrders
  } = useOrder();

  // --- Search & Filters for Products ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Inline Quick Price Editing State
  const [inlinePriceState, setInlinePriceState] = useState({});
  const [savedRowId, setSavedRowId] = useState(null);

  // Modals for Products
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBulkPriceOpen, setIsBulkPriceOpen] = useState(false);
  const [bulkPercent, setBulkPercent] = useState('-10');
  const [bulkCategory, setBulkCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Device Image Upload State & Refs
  const primaryFileInputRef = useRef(null);
  const secondaryFileInputRef = useRef(null);
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('device'); // 'device' | 'url' | 'presets'
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleDeviceImageUpload = async (file, field = 'image') => {
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const res = await compressImageFile(file);
      setEditingProduct((prev) => ({
        ...prev,
        [field]: res.dataUrl,
      }));
      showToast(`Uploaded "${file.name}" (${res.size}) successfully!`);
    } catch (err) {
      showToast(err.message || 'Error processing image', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- Orders State & Controls ---
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Helper notification toast
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Change tab and sync URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'orders' ? { tab: 'orders' } : {});
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryLabel?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return a.name.localeCompare(b.name);
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const term = orderSearchTerm.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(term) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(term) ||
        o.trackingNumber?.toLowerCase().includes(term) ||
        o.shippingAddress?.city?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearchTerm, orderStatusFilter]);

  // Aggregate Product Stats
  const productStats = useMemo(() => {
    const total = products.length;
    const avgPrice = total > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / total) : 0;
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price).length;
    const categoriesCount = new Set(products.map((p) => p.category)).size;
    return { total, avgPrice, discounted, categoriesCount };
  }, [products]);

  // Aggregate Order Stats
  const orderStats = useMemo(() => {
    const totalCount = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const formulating = orders.filter((o) => o.currentStep === 1 || o.currentStep === 2).length;
    const inTransit = orders.filter((o) => o.currentStep === 3).length;
    const delivered = orders.filter((o) => o.currentStep === 4 || o.status === 'Delivered').length;
    return { totalCount, totalRevenue, formulating, inTransit, delivered };
  }, [orders]);

  // --- Inline Price Handlers ---
  const getInlinePrice = (product) => {
    return (
      inlinePriceState[product.id] || {
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      }
    );
  };

  const handleInlinePriceChange = (productId, field, value) => {
    setInlinePriceState((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          price: products.find((p) => p.id === productId)?.price.toString() || '',
          originalPrice: products.find((p) => p.id === productId)?.originalPrice?.toString() || '',
        }),
        [field]: value,
      },
    }));
  };

  const handleSaveInlinePrice = async (product) => {
    const state = inlinePriceState[product.id];
    if (!state) return;

    const newPrice = parseFloat(state.price);
    const newOriginalPrice = state.originalPrice.trim() === '' ? null : parseFloat(state.originalPrice);

    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Please enter a valid price greater than 0', 'error');
      return;
    }

    await updatePrice(product.id, newPrice, newOriginalPrice);
    setSavedRowId(product.id);
    showToast(`Updated price for "${product.name}" to ₹${newPrice.toLocaleString()}`);

    setTimeout(() => {
      setSavedRowId(null);
    }, 2000);
  };

  const handleQuickAdjust = async (product, adjustmentType) => {
    let newPrice = product.price;
    let newOriginalPrice = product.originalPrice;

    if (adjustmentType === '+10%') {
      newPrice = Math.round(product.price * 1.1);
    } else if (adjustmentType === '-10%') {
      newOriginalPrice = product.originalPrice || product.price;
      newPrice = Math.round(product.price * 0.9);
    } else if (adjustmentType === '+100') {
      newPrice = product.price + 100;
    } else if (adjustmentType === '-100') {
      newPrice = Math.max(99, product.price - 100);
    }

    await updatePrice(product.id, newPrice, newOriginalPrice);
    handleInlinePriceChange(product.id, 'price', newPrice.toString());
    if (newOriginalPrice) {
      handleInlinePriceChange(product.id, 'originalPrice', newOriginalPrice.toString());
    }
    showToast(`Adjusted "${product.name}" price to ₹${newPrice.toLocaleString()}`);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setImageInputMode('device');
    setIsEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct({
      id: '',
      name: '',
      subtitle: '',
      category: 'facewash',
      categoryLabel: 'Face Wash',
      price: 899,
      originalPrice: '',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Botanical',
      skinType: ['all'],
      volumeOptions: ['150ml', '250ml'],
      selectedVolume: '150ml',
      image: '',
      secondaryImage: '',
      description: 'Artisanal cold-pressed botanical formula infused with pure organic raw materials.',
      keyIngredients: ['Wild Botanical Extract', 'Cold-Pressed Seed Oil'],
      benefits: ['Promotes deep dermal hydration', 'Strengthens moisture barrier'],
      usage: 'Smooth onto damp skin in circular motions. Rinse thoroughly.',
      ritualTime: 'AM & PM Routine',
    });
    setImageInputMode('device');
    setIsEditModalOpen(true);
  };

  const handleDuplicate = async (product) => {
    const clone = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copy)`,
    };
    await addProduct(clone);
    showToast(`Duplicated "${product.name}" as "${clone.name}"`);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      await deleteProduct(product.id);
      showToast(`Deleted "${product.name}" from catalog`, 'error');
    }
  };

  const handleApplyBulkPrice = async (e) => {
    e.preventDefault();
    const percent = parseFloat(bulkPercent);
    if (isNaN(percent) || percent === 0) {
      showToast('Please enter a valid percentage adjustment (e.g. -15 or +10)', 'error');
      return;
    }

    await bulkAdjustPrices(percent, bulkCategory);
    setIsBulkPriceOpen(false);
    showToast(`Applied ${percent > 0 ? `+${percent}% markup` : `${percent}% discount`} to ${bulkCategory === 'all' ? 'all products' : bulkCategory}`);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset catalog back to initial factory default products? Any custom products or pricing modifications will be restored.')) {
      await resetToDefaults();
      showToast('Catalog successfully reset to factory defaults!');
    }
  };

  // --- Orders Status & Dispatch Control Handlers ---
  const handleQuickStatusChange = async (orderId, newStatus) => {
    let newStep = 2;
    if (newStatus === 'Order Placed') newStep = 1;
    else if (newStatus === 'Formulating Botanicals') newStep = 2;
    else if (newStatus === 'In Transit') newStep = 3;
    else if (newStatus === 'Delivered') newStep = 4;
    else if (newStatus === 'Cancelled') newStep = 0;

    await updateOrderStatus(orderId, newStatus, newStep);
    showToast(`Order #${orderId} status updated to "${newStatus}" (Step ${newStep})`);
  };

  const handleOpenOrderModal = (order) => {
    setSelectedOrderForEdit(JSON.parse(JSON.stringify(order)));
    setIsOrderModalOpen(true);
  };

  const handleSaveOrderDispatch = async (e) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;

    await updateOrder(selectedOrderForEdit.id, selectedOrderForEdit);
    setIsOrderModalOpen(false);
    showToast(`Updated dispatch information for order #${selectedOrderForEdit.id}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      await deleteOrder(orderId);
      showToast(`Order #${orderId} deleted`, 'error');
    }
  };

  // RESTRICTED ACCESS: Non-owner / Customer Guard
  if (!isOwner) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-3xl border border-outline-variant/40 shadow-2xl max-w-lg w-full text-center space-y-6 animate-fadeIn">
          <div className="p-4 bg-error-container/40 text-error rounded-2xl inline-block border border-error/20">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Owner Privileges Required
            </span>
            <h2 className="font-serif text-3xl font-semibold text-on-surface">
              Store Owner Portal
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
              This portal is restricted to authorized store owners and administrators. Regular customer accounts cannot access product pricing controls or order dispatch systems.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-lift"
            >
              <Key size={16} />
              <span>Sign In to Owner's Account</span>
            </Link>
            <Link
              to="/"
              className="block text-xs font-semibold text-secondary hover:text-primary transition py-1"
            >
              Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 animate-slide-up border ${notification.type === 'error'
              ? 'bg-error-container text-on-error-container border-error/30'
              : 'bg-primary text-on-primary border-primary-container shadow-lift'
            }`}
        >
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <SlidersHorizontal size={26} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
                  Prakriti Operations Admin
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <span className={`w-2 h-2 rounded-full ${backendActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {backendActive ? 'FastAPI API Connected' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-sans">
                Comprehensive store administration: product catalog, price setting, and live order tracking control.
              </p>
            </div>
          </div>
        </div>

        {/* Owner Session Info & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/50 text-xs">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="font-semibold text-on-surface">Admin: {user?.name || 'Simran Saini'}</span>
            <span className="text-[11px] text-outline font-mono">({user?.email || 'sainisimran2304@gmail.com'})</span>
            <button
              onClick={() => {
                logout();
                showToast('Signed out of Administrator session');
              }}
              className="ml-2 text-error hover:underline font-bold flex items-center gap-1"
              title="Sign out of Administrator account"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>

          <Link
            to="/shop"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <ExternalLink size={15} />
            <span>Storefront View</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-4">
        <button
          onClick={() => handleTabChange('products')}
          className={`px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition ${activeTab === 'products'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
        >
          <Package size={18} />
          <span>Product Handling & Pricing</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'products' ? 'bg-primary-container text-white' : 'bg-surface-container-high text-secondary'
            }`}>
            {products.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('orders')}
          className={`px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition ${activeTab === 'orders'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
        >
          <Truck size={18} />
          <span>Order Tracking & Dispatch Control</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'orders' ? 'bg-primary-container text-white' : 'bg-surface-container-high text-secondary'
            }`}>
            {orders.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCT HANDLING & PRICING                                          */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Aggregate Product Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <Package size={22} />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Total Products</p>
                <h3 className="text-2xl font-serif font-bold text-on-surface">{productStats.total} items</h3>
              </div>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                <DollarSign size={22} />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Average Price</p>
                <h3 className="text-2xl font-serif font-bold text-on-surface">₹{productStats.avgPrice.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl shrink-0">
                <Tag size={22} />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Discounted / On Sale</p>
                <h3 className="text-2xl font-serif font-bold text-on-surface">{productStats.discounted} formulas</h3>
              </div>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
              <div className="p-3 bg-tertiary/10 text-tertiary rounded-xl shrink-0">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Categories</p>
                <h3 className="text-2xl font-serif font-bold text-on-surface">{productStats.categoriesCount} lines</h3>
              </div>
            </div>
          </div>

          {/* Product Control Bar */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                type="text"
                placeholder="Search products by title, category, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                <option value="all">All Categories ({products.length})</option>
                <option value="facewash">Face Wash</option>
                <option value="toners">Toner</option>
                <option value="serums">Serum</option>
                <option value="moisturizers">Moisturiser</option>
                <option value="sunscreens">Sunscreen</option>
                <option value="masks">De-Tan & Hydration Masks</option>
                <option value="bodywash">Body Wash</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                <option value="name-asc">A - Z</option>
                <option value="name-desc">Z - A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button
                onClick={() => setIsBulkPriceOpen(true)}
                className="px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <TrendingUp size={15} className="text-secondary" />
                <span>Bulk Pricing</span>
              </button>

              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-semibold flex items-center gap-1.5 shadow-md transition-lift"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Table View */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-high border-b border-outline-variant/40 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <tr>
                    <th className="py-4 px-6">Botanical Product</th>
                    <th className="py-4 px-4">Category & Badge</th>
                    <th className="py-4 px-4 min-w-[200px]">Selling Price (₹)</th>
                    <th className="py-4 px-4 min-w-[170px]">Original MRP (₹)</th>
                    <th className="py-4 px-4 min-w-[140px]">Quick Price Tweak</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredProducts.map((product) => {
                    const inline = getInlinePrice(product);
                    const isCurrentSaved = savedRowId === product.id;
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                    const discountPct = hasDiscount
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-surface-container-low/40 transition-colors ${isCurrentSaved ? 'bg-primary/5' : ''
                          }`}
                      >
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 rounded-xl object-cover bg-surface-container border border-outline-variant/40 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/product/${product.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-serif font-bold text-on-surface hover:text-primary transition flex items-center gap-1.5 group"
                              >
                                <span>{product.name}</span>
                                <ExternalLink size={13} className="opacity-0 group-hover:opacity-100 transition text-outline" />
                              </Link>
                              <p className="text-xs text-on-surface-variant line-clamp-1">{product.subtitle}</p>
                              <span className="text-[11px] font-mono text-outline">{product.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Badge */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="inline-block bg-surface-container px-2.5 py-0.5 rounded-md text-xs font-semibold text-secondary">
                              {product.categoryLabel || product.category}
                            </span>
                            {product.badge && (
                              <div>
                                <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  {product.badge}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Editable Selling Price */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-xs">₹</span>
                              <input
                                type="number"
                                min="1"
                                value={inline.price}
                                onChange={(e) => handleInlinePriceChange(product.id, 'price', e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlinePrice(product);
                                }}
                                className="w-full pl-6 pr-2 py-1.5 text-sm font-semibold rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                              />
                            </div>
                            <button
                              onClick={() => handleSaveInlinePrice(product)}
                              className="p-1.5 rounded-lg bg-primary text-on-primary hover:bg-tertiary transition shrink-0"
                              title="Save new price"
                            >
                              <Save size={15} />
                            </button>
                          </div>
                          {hasDiscount && (
                            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {discountPct}% OFF
                            </span>
                          )}
                        </td>

                        {/* Original MRP */}
                        <td className="py-4 px-4">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-xs">₹</span>
                            <input
                              type="number"
                              placeholder="Optional MRP"
                              value={inline.originalPrice}
                              onChange={(e) => handleInlinePriceChange(product.id, 'originalPrice', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlinePrice(product);
                              }}
                              className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
                            />
                          </div>
                        </td>

                        {/* Quick Presets */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickAdjust(product, '+10%')}
                              className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold rounded border border-outline-variant/40"
                              title="Increase price by 10%"
                            >
                              +10%
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(product, '-10%')}
                              className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold rounded border border-outline-variant/40"
                              title="Decrease price by 10%"
                            >
                              -10%
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(product, '+100')}
                              className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold rounded border border-outline-variant/40"
                              title="Add ₹100"
                            >
                              +100
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(product, '-100')}
                              className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold rounded border border-outline-variant/40"
                              title="Subtract ₹100"
                            >
                              -100
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition"
                              title="Edit full product details"
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition"
                              title="Duplicate product"
                            >
                              <Copy size={17} />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition"
                              title="Delete product"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDER TRACKING & DISPATCH CONTROL                                  */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Order Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30">
              <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-serif font-bold text-on-surface mt-1">{orderStats.totalCount}</h3>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30">
              <p className="text-xs uppercase font-semibold text-secondary tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-serif font-bold text-primary mt-1">₹{orderStats.totalRevenue.toLocaleString('en-IN')}</h3>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30">
              <p className="text-xs uppercase font-semibold text-amber-700 tracking-wider">Compounding / Lab</p>
              <h3 className="text-2xl font-serif font-bold text-amber-800 mt-1">{orderStats.formulating} active</h3>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30">
              <p className="text-xs uppercase font-semibold text-blue-700 tracking-wider">In Transit / Courier</p>
              <h3 className="text-2xl font-serif font-bold text-blue-800 mt-1">{orderStats.inTransit}</h3>
            </div>

            <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30">
              <p className="text-xs uppercase font-semibold text-emerald-700 tracking-wider">Delivered</p>
              <h3 className="text-2xl font-serif font-bold text-emerald-800 mt-1">{orderStats.delivered} completed</h3>
            </div>
          </div>

          {/* Order Search & Filter Controls */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                type="text"
                placeholder="Search orders by ID (PRK-...), Customer Name, City..."
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
              />
              {orderSearchTerm && (
                <button
                  onClick={() => setOrderSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter by Status */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-medium"
              >
                <option value="all">All Order Statuses ({orders.length})</option>
                <option value="Order Placed">Step 1: Order Placed</option>
                <option value="Formulating Botanicals">Step 2: Formulating Botanicals</option>
                <option value="In Transit">Step 3: In Transit</option>
                <option value="Delivered">Step 4: Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="bg-surface-container-low p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
              <Truck className="mx-auto text-outline" size={48} />
              <h3 className="font-serif text-xl font-semibold text-on-surface">No orders found</h3>
              <p className="text-sm text-on-surface-variant">Try clearing the status filter or search query.</p>
              <button
                onClick={() => {
                  setOrderSearchTerm('');
                  setOrderStatusFilter('all');
                }}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-tertiary transition"
              >
                Clear Order Filters
              </button>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-high border-b border-outline-variant/40 text-xs font-semibold uppercase tracking-wider text-secondary">
                    <tr>
                      <th className="py-4 px-6">Order ID & Date</th>
                      <th className="py-4 px-4">Customer & City</th>
                      <th className="py-4 px-4">Items Ordered</th>
                      <th className="py-4 px-4">Total Amount</th>
                      <th className="py-4 px-4 min-w-[220px]">Live Status Control</th>
                      <th className="py-4 px-4">Tracking & Carrier</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {filteredOrders.map((order) => {
                      const itemCount = order.items ? order.items.reduce((acc, i) => acc + (i.quantity || 1), 0) : 1;

                      // Status Badge color
                      let statusBadgeBg = 'bg-surface-container text-on-surface-variant';
                      if (order.status === 'Order Placed') statusBadgeBg = 'bg-slate-100 text-slate-800 border-slate-300';
                      else if (order.status === 'Formulating Botanicals') statusBadgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
                      else if (order.status === 'In Transit') statusBadgeBg = 'bg-blue-100 text-blue-900 border-blue-300';
                      else if (order.status === 'Delivered') statusBadgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                      else if (order.status === 'Cancelled') statusBadgeBg = 'bg-rose-100 text-rose-900 border-rose-300';

                      return (
                        <tr key={order.id} className="hover:bg-surface-container-low/40 transition">
                          {/* Order ID & Date */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <span className="font-serif font-bold text-primary text-base block">{order.id}</span>
                              <div className="flex items-center gap-1.5 text-xs text-outline">
                                <Calendar size={13} />
                                <span>{order.date}</span>
                              </div>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-on-surface block">
                                {order.shippingAddress?.fullName || 'Guest Customer'}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                                <MapPin size={12} className="text-secondary" />
                                <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                              </div>
                            </div>
                          </td>

                          {/* Items Ordered */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-3 overflow-hidden">
                                {order.items?.slice(0, 3).map((item, idx) => (
                                  <img
                                    key={idx}
                                    src={item.image}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-full object-cover border-2 border-surface-container-lowest shrink-0"
                                    title={`${item.name} (${item.selectedVolume || '50ml'})`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-on-surface-variant font-medium">
                                {itemCount} item{itemCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          </td>

                          {/* Total & Payment */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="font-serif font-bold text-base text-on-surface block">
                                ₹{Number(order.total || 0).toLocaleString('en-IN')}
                              </span>
                              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-secondary">
                                {order.paymentMethodLabel || (order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid')}
                              </span>
                            </div>
                          </td>

                          {/* Live Status Control Selector */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5">
                              <select
                                value={order.status}
                                onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${statusBadgeBg}`}
                              >
                                <option value="Order Placed">Step 1: Order Placed</option>
                                <option value="Formulating Botanicals">Step 2: Formulating Botanicals</option>
                                <option value="In Transit">Step 3: In Transit</option>
                                <option value="Delivered">Step 4: Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              {/* Progress Dots */}
                              <div className="flex items-center gap-1.5 px-1">
                                {[1, 2, 3, 4].map((stepNum) => (
                                  <div
                                    key={stepNum}
                                    className={`h-1.5 flex-1 rounded-full ${(order.currentStep || 1) >= stepNum
                                        ? 'bg-primary'
                                        : 'bg-surface-container-high'
                                      }`}
                                    title={`Step ${stepNum}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Tracking & Carrier */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5 text-xs">
                              <p className="font-semibold text-secondary">{order.carrier || 'EcoCourier Express'}</p>
                              <p className="font-mono text-[11px] text-outline">{order.trackingNumber || 'Pending AWB'}</p>
                              <p className="text-[11px] text-on-surface-variant">Est: {order.estimatedDelivery}</p>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenOrderModal(order)}
                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition"
                                title="Manage Dispatch, Address & Notes"
                              >
                                <Edit3 size={17} />
                              </button>

                              <Link
                                to="/orders"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition"
                                title="View Customer Live Tracker"
                              >
                                <Eye size={17} />
                              </Link>

                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition"
                                title="Delete order"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL ORDER DISPATCH & DETAILS MODAL                                      */}
      {/* ========================================================================= */}
      {isOrderModalOpen && selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Order Dispatch Control
                </span>
                <h2 className="font-serif text-2xl font-semibold text-primary">
                  Order #{selectedOrderForEdit.id}
                </h2>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-2 text-outline hover:text-on-surface rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveOrderDispatch} className="p-6 space-y-6 overflow-y-auto flex-1">

              {/* Stepper Status Progression */}
              <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-primary block">
                  Select Order Lifecycle Step:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ORDER_STEPS.map((s) => {
                    const isSelected = selectedOrderForEdit.currentStep === s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          setSelectedOrderForEdit({
                            ...selectedOrderForEdit,
                            currentStep: s.step,
                            status: s.label,
                          });
                        }}
                        className={`p-3 rounded-xl border text-left transition ${isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-md'
                            : 'bg-surface-container-lowest text-on-surface border-outline-variant/50 hover:bg-surface-container-high'
                          }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isSelected ? 'text-on-primary/80' : 'text-secondary'
                          }`}>
                          Step {s.step}
                        </span>
                        <h5 className="font-semibold text-xs leading-tight">{s.label}</h5>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Carrier, Tracking Number, and Estimated Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Logistics Carrier
                  </label>
                  <select
                    value={selectedOrderForEdit.carrier || CARRIER_OPTIONS[0]}
                    onChange={(e) => setSelectedOrderForEdit({ ...selectedOrderForEdit, carrier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    {CARRIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Tracking Number (AWB)
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedOrderForEdit.trackingNumber || ''}
                    onChange={(e) => setSelectedOrderForEdit({ ...selectedOrderForEdit, trackingNumber: e.target.value })}
                    placeholder="TRK-BOT-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs sm:text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={selectedOrderForEdit.estimatedDelivery || ''}
                    onChange={(e) => setSelectedOrderForEdit({ ...selectedOrderForEdit, estimatedDelivery: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Customer Shipping Address Preview */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <MapPin size={14} /> Shipping Destination
                </span>
                <p className="text-sm font-semibold text-on-surface">
                  {selectedOrderForEdit.shippingAddress?.fullName}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {selectedOrderForEdit.shippingAddress?.address}, {selectedOrderForEdit.shippingAddress?.city}, {selectedOrderForEdit.shippingAddress?.state} - {selectedOrderForEdit.shippingAddress?.zip}
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <ShoppingBag size={14} /> Ordered Botanical Formulas
                </span>
                <div className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
                  {selectedOrderForEdit.items?.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-surface-container border border-outline-variant/30"
                        />
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{item.name}</p>
                          <span className="text-xs text-outline font-medium">
                            Vol: {item.selectedVolume || '50ml'} × Qty: {item.quantity || 1}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm text-on-surface">
                        ₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="p-3.5 bg-surface-container flex items-center justify-between font-bold text-sm">
                    <span>Order Total:</span>
                    <span className="text-primary font-serif text-lg">
                      ₹{Number(selectedOrderForEdit.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Internal Lab / Dispatch Notes
                </label>
                <textarea
                  rows={2}
                  value={selectedOrderForEdit.notes || ''}
                  onChange={(e) => setSelectedOrderForEdit({ ...selectedOrderForEdit, notes: e.target.value })}
                  placeholder="e.g. Verified cold-pressed purity seal, added complimentary toner mini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-sm font-medium hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center gap-2 shadow-md transition-lift"
                >
                  <Save size={16} />
                  <span>Save Dispatch Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT EDIT / CREATE MODAL                                               */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">

            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-on-surface">
                  {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Botanical Product'}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Update product formulations, selling price, imagery, and specifications.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-outline hover:text-on-surface rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingProduct.name.trim()) {
                  showToast('Product name is required', 'error');
                  return;
                }
                if (!editingProduct.price || editingProduct.price <= 0) {
                  showToast('Please provide a valid price', 'error');
                  return;
                }
                if (!editingProduct.image) {
                  showToast('Please upload a product photo from your device', 'error');
                  return;
                }

                if (editingProduct.id && products.some((p) => p.id === editingProduct.id)) {
                  await updateProduct(editingProduct.id, editingProduct);
                  showToast(`Updated "${editingProduct.name}" successfully!`);
                } else {
                  await addProduct(editingProduct);
                  showToast(`Created new product "${editingProduct.name}" successfully!`);
                }

                setIsEditModalOpen(false);
              }}
              className="p-6 space-y-6 overflow-y-auto flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Saffron & Kumkumadi Radiant Oil"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={editingProduct.subtitle}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                    placeholder="e.g. Wild-Harvested Cold-Pressed Facial Elixir"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryLabel: CATEGORY_MAP[cat] || 'Botanical Care',
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="facewash">Face Wash</option>
                    <option value="toners">Toner</option>
                    <option value="serums">Serum</option>
                    <option value="moisturizers">Moisturiser</option>
                    <option value="sunscreens">Sunscreen</option>
                    <option value="masks">De-Tan & Hydration Masks</option>
                    <option value="bodywash">Body Wash</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="e.g. Best Seller, Award Winner, 100% Organic"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <DollarSign size={15} /> Pricing & Discount Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm font-bold text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface">
                      Original MRP (₹) <span className="text-outline font-normal">(Optional Strikethrough)</span>
                    </label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: e.target.value === '' ? null : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 2999"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price && (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                    ✓ Customers will see a {Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)}% discount badge
                  </p>
                )}
              </div>

              {/* Product Imagery Management (Upload from Device Priority) */}
              <div className="space-y-4 p-5 rounded-2xl bg-surface-container border border-outline-variant/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <ImageIcon size={16} /> Product Imagery (Upload from Device) *
                    </label>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Upload high-resolution photos directly from your computer or phone.
                    </p>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('device')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        imageInputMode === 'device'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <Upload size={13} />
                      <span>Upload from Device</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        imageInputMode === 'url'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <ExternalLink size={13} />
                      <span>Paste URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('presets')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        imageInputMode === 'presets'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <Sparkles size={13} />
                      <span>Presets</span>
                    </button>
                  </div>
                </div>

                {/* 1. PRIMARY PRODUCT PHOTO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface">
                      Primary Product Photo <span className="text-red-500">*</span>
                    </span>
                    {editingProduct.image && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {editingProduct.image.startsWith('data:image') ? 'Uploaded from Device' : 'Photo Attached'}
                      </span>
                    )}
                  </div>

                  {/* Hidden File Input for Primary Image */}
                  <input
                    type="file"
                    ref={primaryFileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDeviceImageUpload(file, 'image');
                      e.target.value = '';
                    }}
                  />

                  {imageInputMode === 'device' && (
                    <div>
                      {editingProduct.image ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/50">
                          <div className="relative group shrink-0">
                            <img
                              src={editingProduct.image}
                              alt="Primary Preview"
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-outline-variant/60 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => primaryFileInputRef.current?.click()}
                                className="p-2 bg-white/95 text-on-surface rounded-lg hover:bg-white transition shadow"
                                title="Change photo from device"
                              >
                                <Upload size={15} />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div>
                              <p className="text-xs font-bold text-on-surface">Primary Product Photo Ready</p>
                              <p className="text-[11px] text-on-surface-variant mt-0.5">
                                High-clarity optimized image ready for the customer catalog, product card, and checkout.
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => primaryFileInputRef.current?.click()}
                                className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                              >
                                <FolderUp size={14} />
                                <span>Choose Different Image from Device</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                                className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingPrimary(true);
                          }}
                          onDragLeave={() => setIsDraggingPrimary(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingPrimary(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleDeviceImageUpload(file, 'image');
                          }}
                          onClick={() => primaryFileInputRef.current?.click()}
                          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition text-center space-y-3 ${
                            isDraggingPrimary
                              ? 'border-primary bg-primary/10 scale-[1.01]'
                              : 'border-outline-variant hover:border-primary/80 bg-surface-container-lowest hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-sm">
                            <Upload size={22} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-on-surface">
                              Click to browse photo from your device
                            </p>
                            <p className="text-xs text-outline">
                              or drag and drop your product photo file here
                            </p>
                          </div>
                          <p className="text-[11px] text-outline font-medium">
                            Supports PNG, JPG, JPEG, WEBP, AVIF (Auto-optimized for instant store loading)
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {imageInputMode === 'url' && (
                    <div className="flex gap-3 items-center">
                      {editingProduct.image && (
                        <img
                          src={editingProduct.image}
                          alt="Preview"
                          className="w-14 h-14 rounded-xl object-cover border border-outline-variant/40 shrink-0 bg-surface-container"
                        />
                      )}
                      <input
                        type="text"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="Paste image web link (https://...)"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                  )}

                  {imageInputMode === 'presets' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: preset.url })}
                            className={`text-[11px] px-3 py-1.5 rounded-xl border transition ${
                              editingProduct.image === preset.url
                                ? 'bg-primary text-on-primary border-primary shadow-sm font-bold'
                                : 'bg-surface-container-lowest text-on-surface border-outline-variant/50 hover:bg-surface-container-high'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      {editingProduct.image && (
                        <div className="flex items-center gap-3 pt-2">
                          <img
                            src={editingProduct.image}
                            alt="Preset Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-outline-variant/40"
                          />
                          <span className="text-xs text-on-surface-variant font-medium">
                            Preset image selected
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. SECONDARY / GALLERY PHOTO (DEVICE UPLOAD) */}
                <div className="space-y-2 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface">
                      Secondary / Texture Photo <span className="text-outline font-normal">(Optional alternate view)</span>
                    </span>
                    {editingProduct.secondaryImage && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {editingProduct.secondaryImage.startsWith('data:image') ? 'Uploaded from Device' : 'Alternate Attached'}
                      </span>
                    )}
                  </div>

                  {/* Hidden File Input for Secondary Image */}
                  <input
                    type="file"
                    ref={secondaryFileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDeviceImageUpload(file, 'secondaryImage');
                      e.target.value = '';
                    }}
                  />

                  {editingProduct.secondaryImage ? (
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/50">
                      <img
                        src={editingProduct.secondaryImage}
                        alt="Secondary Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-outline-variant/60 shadow-sm shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-semibold text-on-surface">Alternate / Texture Image Ready</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => secondaryFileInputRef.current?.click()}
                            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                          >
                            <Upload size={12} />
                            <span>Replace from Device</span>
                          </button>
                          <span className="text-outline text-xs">•</span>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, secondaryImage: '' })}
                            className="text-xs text-red-600 font-semibold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => secondaryFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant hover:border-primary text-xs font-semibold text-on-surface flex items-center gap-2 transition shadow-sm"
                      >
                        <FolderUp size={14} className="text-primary" />
                        <span>Upload Secondary Photo from Device</span>
                      </button>
                      <span className="text-[11px] text-outline">or leave blank to use primary photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Volume & Ritual Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Volume Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.volumeOptions ? editingProduct.volumeOptions.join(', ') : ''}
                    onChange={(e) => {
                      const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setEditingProduct({
                        ...editingProduct,
                        volumeOptions: arr,
                        selectedVolume: arr[0] || '50ml',
                      });
                    }}
                    placeholder="30ml, 50ml, 100ml"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Ritual Time
                  </label>
                  <input
                    type="text"
                    value={editingProduct.ritualTime || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ritualTime: e.target.value })}
                    placeholder="e.g. AM & PM Routine, PM Step 3"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Full Botanical Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-sm font-medium hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center gap-2 shadow-md transition-lift"
                >
                  <Save size={16} />
                  <span>{editingProduct.id ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK PRICING TOOL MODAL */}
      {isBulkPriceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl border border-outline-variant/40 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-on-surface">Bulk Pricing Tool</h3>
                  <p className="text-xs text-on-surface-variant">Apply percentage adjustments across items</p>
                </div>
              </div>
              <button onClick={() => setIsBulkPriceOpen(false)} className="text-outline hover:text-on-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyBulkPrice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Target Product Line
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="all">Entire Catalog (All Categories)</option>
                  <option value="facewash">Face Wash only</option>
                  <option value="toners">Toner only</option>
                  <option value="serums">Serum only</option>
                  <option value="moisturizers">Moisturiser only</option>
                  <option value="sunscreens">Sunscreen only</option>
                  <option value="masks">De-Tan & Hydration Masks only</option>
                  <option value="bodywash">Body Wash only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Percentage Adjustment (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(e.target.value)}
                    placeholder="e.g. -15 for 15% discount, +10 for markup"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                  <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline" size={16} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-outline">Presets:</span>
                {['-20', '-15', '-10', '+5', '+10'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBulkPercent(val)}
                    className="px-2 py-1 rounded-lg text-xs bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 font-semibold"
                  >
                    {val}%
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBulkPriceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-medium hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-semibold shadow-md transition-lift"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
