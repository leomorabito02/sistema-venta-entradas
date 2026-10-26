import React, { useState, useEffect } from 'react';

// --- WINE THEME STYLES & CONSTANTS ---
const WINE_CLASSES = {
  primary: 'bg-[#6b1d2f] hover:bg-[#521423] text-white shadow-md transition-all duration-200',
  primaryOutlined: 'border border-[#6b1d2f] text-[#6b1d2f] hover:bg-[#fcf5f7] transition-all',
  primaryText: 'text-[#6b1d2f]',
  bgLight: 'bg-[#fdf8f9]',
  cardBg: 'bg-white border border-[#f3dbe1] shadow-sm rounded-xl',
};

const INITIAL_PRODUCTS = [
  { id: 'p-1', name: 'Choripán', description: 'Choripán en pan de campo con chimichurri', unitPrice: 5000, active: true },
  { id: 'p-2', name: 'Coca-Cola 500ml', description: 'Gaseosa Coca-Cola helada', unitPrice: 3000, active: true },
  { id: 'p-3', name: 'Pepsi 500ml', description: 'Gaseosa Pepsi helada', unitPrice: 3000, active: true },
  { id: 'p-4', name: 'Pizza (porción)', description: 'Porción grande de pizza muzzerella', unitPrice: 8000, active: true },
  { id: 'p-5', name: 'Empanada Criolla', description: 'Empanada de carne cortada a cuchillo', unitPrice: 2500, active: true },
];

const INITIAL_SELLERS = [
  { id: 'sel-1', name: 'Juan Pérez', email: 'juan@email.com', active: true, salesCount: 14 },
  { id: 'sel-2', name: 'María Gómez', email: 'maria@email.com', active: true, salesCount: 22 },
  { id: 'sel-3', name: 'Pedro López', email: 'pedro@email.com', active: true, salesCount: 8 },
];

const INITIAL_SIMPLE_PRICE = 10000;

const INITIAL_BONDS = [
  {
    id: 'bond-101',
    number: 101,
    type: 'SIMPLE',
    price: 10000,
    sellerId: 'sel-1',
    sellerName: 'Juan Pérez',
    buyer: { name: 'Lucas', lastName: 'Fernández', phone: '3519876543', email: 'lucas@test.com' },
    items: [],
    status: 'VENDIDO',
    publicToken: 'tok-101-abc',
    code: '1001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bond-125',
    number: 125,
    type: 'CON_COMIDA',
    price: 13000,
    sellerId: 'sel-3',
    sellerName: 'Pedro López',
    buyer: { name: 'Juan', lastName: 'Pérez', phone: '3512345678', email: 'juanp@gmail.com' },
    items: [
      { productId: 'p-1', productName: 'Choripán', quantity: 2, unitPrice: 5000, subtotal: 10000 },
      { productId: 'p-2', productName: 'Coca-Cola 500ml', quantity: 1, unitPrice: 3000, subtotal: 3000 },
    ],
    status: 'VENDIDO',
    publicToken: 'tok-125-xyz',
    code: '4821',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'bond-126',
    number: 126,
    type: 'CON_COMIDA',
    price: 16000,
    sellerId: 'sel-2',
    sellerName: 'María Gómez',
    buyer: { name: 'Carla', lastName: 'Mendoza', phone: '3515554433', email: 'carla@test.com' },
    items: [
      { productId: 'p-1', productName: 'Choripán', quantity: 2, unitPrice: 5000, subtotal: 10000 },
      { productId: 'p-2', productName: 'Coca-Cola 500ml', quantity: 1, unitPrice: 3000, subtotal: 3000 },
      { productId: 'p-3', productName: 'Pepsi 500ml', quantity: 1, unitPrice: 3000, subtotal: 3000 },
    ],
    status: 'USADO_ENTRADA',
    publicToken: 'tok-126-def',
    code: '5832',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    entryUsedAt: new Date(Date.now() - 1800000).toISOString(),
    entryValidatedBy: 'Pedro López',
  },
  {
    id: 'bond-127',
    number: 127,
    type: 'SIMPLE',
    price: 10000,
    sellerId: 'sel-1',
    sellerName: 'Juan Pérez',
    buyer: { name: 'Diego', lastName: 'Rossi', phone: '3511122334' },
    items: [],
    status: 'ANULADO',
    publicToken: 'tok-127-ghi',
    code: '3310',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>,
  Ticket: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 001 1.712V14a2 2 0 00-1 1.712V17a2 2 0 002 2h14a2 2 0 002-2v-2.288A2 2 0 0021 14v-2.288A2 2 0 0022 10V7a2 2 0 00-2-2H5z"/></svg>,
  PlusCircle: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  CheckScan: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Utensils: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  Products: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  QrCode: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  ExternalLink: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>,
  Copy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  EyeOff: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.02 10.02 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.165-3.693a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18"/></svg>,
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bono_app_user_v2');
    return saved ? JSON.parse(saved) : { email: 'admin@test.com', role: 'ADMIN', name: 'Admin Principal', sellerId: null };
  });

  const [bonds, setBonds] = useState(() => {
    const saved = localStorage.getItem('bono_app_bonds_v2');
    return saved ? JSON.parse(saved) : INITIAL_BONDS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bono_app_products_v2');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sellers, setSellers] = useState(() => {
    const saved = localStorage.getItem('bono_app_sellers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  const [simplePrice, setSimplePrice] = useState(() => {
    const saved = localStorage.getItem('bono_app_simple_price_v2');
    return saved ? JSON.parse(saved) : INITIAL_SIMPLE_PRICE;
  });

  const [currentRoute, setCurrentRoute] = useState('dashboard'); 
  const [selectedBondId, setSelectedBondId] = useState('bond-125');
  const [publicToken, setPublicToken] = useState('tok-125-xyz');
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom non-blocking alert modal state
  const [modalState, setModalState] = useState({ open: false, title: '', message: '', type: 'info', onConfirm: null });

  useEffect(() => { localStorage.setItem('bono_app_user_v2', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('bono_app_bonds_v2', JSON.stringify(bonds)); }, [bonds]);
  useEffect(() => { localStorage.setItem('bono_app_products_v2', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('bono_app_sellers_v2', JSON.stringify(sellers)); }, [sellers]);
  useEffect(() => { localStorage.setItem('bono_app_simple_price_v2', JSON.stringify(simplePrice)); }, [simplePrice]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showModal = (title, message, type = 'info', onConfirm = null) => {
    setModalState({ open: true, title, message, type, onConfirm });
  };

  const closeModal = () => {
    setModalState({ ...modalState, open: false });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentRoute('login');
  };

  const handleLogin = (email, role) => {
    const newUser = {
      email,
      role,
      name: role === 'ADMIN' ? 'Administrador Sistema' : 'Vendedor Registrado',
      sellerId: role === 'VENDEDOR' ? 'sel-1' : null
    };
    setUser(newUser);
    setCurrentRoute('dashboard');
    showToast(`Bienvenido/a ${newUser.name}`);
  };

  const navigateTo = (route, param = null) => {
    if (route === 'bonos/detail') setSelectedBondId(param);
    if (route === 'public') setPublicToken(param || 'tok-125-xyz');
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f9] text-gray-800 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#6b1d2f] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Custom Modal Popup */}
      {modalState.open && (
        <CustomModal
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
          onClose={closeModal}
          onConfirm={() => {
            if (modalState.onConfirm) modalState.onConfirm();
            closeModal();
          }}
        />
      )}

      {/* Prototype Demo Switcher Bar */}
      <div className="bg-[#4a0e1c] text-white px-4 py-2 text-xs flex flex-wrap justify-between items-center border-b border-[#360914] gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#8b263e] px-2 py-0.5 rounded text-[11px] font-semibold uppercase">Prototipo Interactivo</span>
          <span className="text-rose-200 hidden sm:inline">Sistema de Bonos, Productos y Validaciones</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-rose-200">Simular Rol:</span>
          <button
            onClick={() => handleLogin('admin@test.com', 'ADMIN')}
            className={`px-2 py-0.5 rounded text-xs ${user?.role === 'ADMIN' ? 'bg-white text-[#4a0e1c] font-bold' : 'bg-[#6b1d2f] hover:bg-[#8b263e]'}`}
          >
            Admin
          </button>
          <button
            onClick={() => handleLogin('vendedor@test.com', 'VENDEDOR')}
            className={`px-2 py-0.5 rounded text-xs ${user?.role === 'VENDEDOR' ? 'bg-white text-[#4a0e1c] font-bold' : 'bg-[#6b1d2f] hover:bg-[#8b263e]'}`}
          >
            Vendedor
          </button>
          <button
            onClick={() => navigateTo('public', 'tok-125-xyz')}
            className="px-2 py-0.5 rounded text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1 ml-2"
          >
            <Icons.ExternalLink /> Ver Página Pública (#125)
          </button>
        </div>
      </div>

      {/* Main App Layout */}
      {currentRoute === 'login' ? (
        <LoginView onLogin={handleLogin} />
      ) : currentRoute === 'public' ? (
        <PublicBondView
          token={publicToken}
          bonds={bonds}
          onNavigateBack={() => navigateTo('dashboard')}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <aside className={`md:w-64 bg-white border-r border-[#f1d3dc] flex flex-col justify-between ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
            <div>
              {/* Brand Header */}
              <div className="p-5 border-b border-[#f3dbe1] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6b1d2f] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  🍷
                </div>
                <div>
                  <h1 className="font-bold text-[#6b1d2f] text-lg leading-tight">Bono Pass</h1>
                  <p className="text-xs text-gray-500">Gestión de Eventos</p>
                </div>
              </div>

              {/* User Profile Card */}
              <div className="p-4 mx-3 my-3 bg-[#fdf2f5] rounded-xl border border-[#f5d0da]">
                <p className="text-xs font-bold text-[#6b1d2f] uppercase tracking-wider">{user?.role}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* Navigation Options */}
              <nav className="px-3 space-y-1">
                <NavItem
                  icon={<Icons.Dashboard />}
                  label="Dashboard"
                  active={currentRoute === 'dashboard'}
                  onClick={() => navigateTo('dashboard')}
                />
                <NavItem
                  icon={<Icons.Ticket />}
                  label={user?.role === 'ADMIN' ? 'Todos los Bonos' : 'Mis Bonos'}
                  active={currentRoute === 'bonos' || currentRoute === 'bonos/detail'}
                  onClick={() => navigateTo('bonos')}
                />
                <NavItem
                  icon={<Icons.PlusCircle />}
                  label="Nuevo Bono"
                  active={currentRoute === 'bonos/nuevo'}
                  onClick={() => navigateTo('bonos/nuevo')}
                />
                
                <div className="pt-3 pb-1 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Validación Evento
                </div>
                <NavItem
                  icon={<Icons.CheckScan />}
                  label="Validar Entrada"
                  active={currentRoute === 'validar/entrada'}
                  onClick={() => navigateTo('validar/entrada')}
                />
                <NavItem
                  icon={<Icons.Utensils />}
                  label="Validar Comida"
                  active={currentRoute === 'validar/comida'}
                  onClick={() => navigateTo('validar/comida')}
                />

                {user?.role === 'ADMIN' && (
                  <>
                    <div className="pt-4 pb-1 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Administración
                    </div>
                    <NavItem
                      icon={<Icons.Products />}
                      label="Catálogo Productos"
                      active={currentRoute === 'productos'}
                      onClick={() => navigateTo('productos')}
                    />
                    <NavItem
                      icon={<Icons.Users />}
                      label="Vendedores"
                      active={currentRoute === 'vendedores'}
                      onClick={() => navigateTo('vendedores')}
                    />
                  </>
                )}
              </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-[#f3dbe1]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-800 hover:bg-rose-50 transition-colors text-sm font-medium"
              >
                <Icons.Logout />
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Mobile Top Bar */}
          <div className="md:hidden bg-[#6b1d2f] text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#6b1d2f] font-bold flex items-center justify-center">🍷</div>
              <span className="font-bold tracking-wide">Bono Pass</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-[#8b263e]"
            >
              <Icons.Menu />
            </button>
          </div>

          {/* Main Content View Switcher */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {currentRoute === 'dashboard' && (
              <DashboardView
                bonds={bonds}
                sellers={sellers}
                user={user}
                navigateTo={navigateTo}
              />
            )}
            {currentRoute === 'bonos' && (
              <BondListView
                bonds={bonds}
                sellers={sellers}
                user={user}
                navigateTo={navigateTo}
                setBonds={setBonds}
                showToast={showToast}
                showModal={showModal}
              />
            )}
            {currentRoute === 'bonos/nuevo' && (
              <BondCreateView
                products={products}
                simplePrice={simplePrice}
                user={user}
                onBondCreated={(newBond) => {
                  setBonds([newBond, ...bonds]);
                  showToast(`Bono #${newBond.number} generado con éxito`);
                  navigateTo('bonos/detail', newBond.id);
                }}
                navigateTo={navigateTo}
                showModal={showModal}
              />
            )}
            {currentRoute === 'bonos/detail' && (
              <BondDetailView
                bondId={selectedBondId}
                bonds={bonds}
                user={user}
                setBonds={setBonds}
                navigateTo={navigateTo}
                showToast={showToast}
                showModal={showModal}
              />
            )}
            {currentRoute === 'productos' && user?.role === 'ADMIN' && (
              <ProductListView
                products={products}
                setProducts={setProducts}
                simplePrice={simplePrice}
                setSimplePrice={setSimplePrice}
                showToast={showToast}
              />
            )}
            {currentRoute === 'vendedores' && user?.role === 'ADMIN' && (
              <SellerListView
                sellers={sellers}
                setSellers={setSellers}
                bonds={bonds}
                showToast={showToast}
              />
            )}
            {currentRoute === 'validar/entrada' && (
              <ValidationEntryView
                bonds={bonds}
                setBonds={setBonds}
                user={user}
                showToast={showToast}
                showModal={showModal}
              />
            )}
            {currentRoute === 'validar/comida' && (
              <ValidationFoodView
                bonds={bonds}
                setBonds={setBonds}
                user={user}
                showToast={showToast}
                showModal={showModal}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-[#6b1d2f] text-white shadow-sm font-semibold'
          : 'text-gray-700 hover:bg-[#fdf2f5] hover:text-[#6b1d2f]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[#8b263e]'}>{icon}</span>
      {label}
    </button>
  );
}

function CustomModal({ title, message, type, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#f3dbe1]">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className={`p-2.5 rounded-xl text-lg ${type === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-900'}`}>
            {type === 'danger' ? '⚠️' : 'ℹ️'}
          </div>
          <h3 className="font-bold text-[#6b1d2f] text-lg">{title}</h3>
        </div>

        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {message}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          {onConfirm ? (
            <>
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={onConfirm} className="px-5 py-2 bg-[#6b1d2f] hover:bg-[#521423] text-white rounded-xl text-sm font-bold shadow-md">
                Confirmar
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-6 py-2 bg-[#6b1d2f] text-white rounded-xl text-sm font-bold shadow-md">
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = email.includes('admin') ? 'ADMIN' : 'VENDEDOR';
    onLogin(email, role);
  };

  return (
    <div className="min-h-screen bg-[#faf0f3] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#f3dbe1] overflow-hidden">
        {/* Banner */}
        <div className="bg-[#6b1d2f] text-white p-8 text-center relative">
          <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner mb-3">
            🍷
          </div>
          <h2 className="text-2xl font-bold">Sistema de Bonos</h2>
          <p className="text-rose-200 text-sm mt-1">Acceso para Administradores y Vendedores</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Correo Electrónico / Usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f] text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f] text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#6b1d2f] hover:bg-[#521423] text-white rounded-xl font-bold text-sm shadow-md transition-all duration-200"
          >
            Iniciar Sesión
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-3 text-xs text-gray-400 uppercase font-medium">O accede con</span>
          </div>

          <button
            type="button"
            onClick={() => onLogin(email, email.includes('admin') ? 'ADMIN' : 'VENDEDOR')}
            className="w-full py-3 border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Iniciar Sesión con Google
          </button>

          {/* Demo shortcuts */}
          <div className="pt-4 mt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">Accesos rápidos de demostración:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@test.com'); setPassword('123456'); }}
                className="px-3 py-1 bg-rose-50 text-[#6b1d2f] text-xs rounded-lg font-medium hover:bg-rose-100"
              >
                Cargar Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('vendedor@test.com'); setPassword('123456'); }}
                className="px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-lg font-medium hover:bg-amber-100"
              >
                Cargar Vendedor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardView({ bonds, sellers, user, navigateTo }) {
  // Filter for seller view if not admin
  const visibleBonds = user?.role === 'VENDEDOR'
    ? bonds.filter(b => b.sellerId === user.sellerId || b.sellerName.toLowerCase().includes('juan'))
    : bonds;

  const totalSold = visibleBonds.length;
  const simpleCount = visibleBonds.filter(b => b.type === 'SIMPLE').length;
  const foodCount = visibleBonds.filter(b => b.type === 'CON_COMIDA').length;
  const annulledCount = visibleBonds.filter(b => b.status === 'ANULADO').length;

  const entryUsed = visibleBonds.filter(b => b.status === 'USADO_ENTRADA' || b.status === 'USADO_COMIDA').length;
  const entryPending = visibleBonds.filter(b => b.status === 'VENDIDO').length;

  const foodUsed = visibleBonds.filter(b => b.status === 'USADO_COMIDA').length;
  const foodPending = visibleBonds.filter(b => b.type === 'CON_COMIDA' && b.status === 'USADO_ENTRADA').length;

  const totalRevenue = visibleBonds
    .filter(b => b.status !== 'ANULADO')
    .reduce((acc, b) => acc + (b.price || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#6b1d2f]">Dashboard de Estadísticas</h1>
          <p className="text-sm text-gray-500">Métricas en tiempo real de emisión y estado de bonos</p>
        </div>
        <button
          onClick={() => navigateTo('bonos/nuevo')}
          className="px-4 py-2.5 bg-[#6b1d2f] hover:bg-[#521423] text-white font-semibold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2"
        >
          <Icons.PlusCircle /> Emitir Nuevo Bono
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recaudación Total"
          value={`$${totalRevenue.toLocaleString()}`}
          subText="Sin contar bonos anulados"
          icon={<span className="text-xl">💰</span>}
          highlight
        />
        <StatCard
          title="Bonos Emitidos"
          value={totalSold}
          subText={`${simpleCount} simples / ${foodCount} con comida`}
          icon={<Icons.Ticket />}
        />
        <StatCard
          title="Entradas Utilizadas"
          value={entryUsed}
          subText={`${entryPending} pendientes de ingreso`}
          icon={<Icons.CheckScan />}
        />
        <StatCard
          title="Comidas Entregadas"
          value={foodUsed}
          subText={`${foodPending} comidas pendientes`}
          icon={<Icons.Utensils />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#f3dbe1] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Bonos Simples</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{simpleCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#f3dbe1] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Bonos Con Comida</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{foodCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#f3dbe1] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Comidas Pendientes</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{foodPending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#f3dbe1] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Bonos Anulados</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{annulledCount}</p>
        </div>
      </div>

      {/* Breakdown by Seller (Admin view requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#f3dbe1] shadow-sm">
          <h3 className="font-bold text-[#6b1d2f] text-lg mb-4">Ventas por Vendedor</h3>
          <div className="space-y-3">
            {sellers.map((s) => {
              const sellerBonds = bonds.filter(b => b.sellerId === s.id && b.status !== 'ANULADO');
              const count = sellerBonds.length;
              const revenue = sellerBonds.reduce((a, b) => a + (b.price || 0), 0);
              const percentage = totalSold ? Math.round((count / totalSold) * 100) : 0;

              return (
                <div key={s.id} className="p-3 bg-[#fdf8f9] rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-gray-800">{s.name}</span>
                    <span className="text-[#6b1d2f] font-bold">${revenue.toLocaleString()} ({count} bonos)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#6b1d2f] h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white p-6 rounded-xl border border-[#f3dbe1] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#6b1d2f] text-lg mb-4">Últimos Bonos Emitidos</h3>
            <div className="space-y-2">
              {visibleBonds.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigateTo('bonos/detail', b.id)}
                  className="p-2.5 bg-[#fdf8f9] hover:bg-[#f8e7eb] rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-800">#{b.number}</span>
                    <span className="text-gray-500 ml-2">{b.buyer?.name} {b.buyer?.lastName}</span>
                  </div>
                  <BadgeStatus status={b.status} />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigateTo('bonos')}
            className="w-full mt-4 py-2.5 border border-[#6b1d2f] text-[#6b1d2f] hover:bg-[#fdf2f5] font-semibold rounded-xl text-xs transition-all"
          >
            Ver todos los bonos →
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subText, icon, highlight }) {
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${highlight ? 'bg-[#6b1d2f] text-white border-[#521423]' : 'bg-white text-gray-800 border-[#f3dbe1]'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-rose-200' : 'text-gray-500'}`}>{title}</p>
        <div className={`p-2.5 rounded-xl ${highlight ? 'bg-[#8b263e] text-white' : 'bg-rose-50 text-[#6b1d2f]'}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-1 ${highlight ? 'text-rose-200' : 'text-gray-400'}`}>{subText}</p>
    </div>
  );
}

function ProductListView({ products, setProducts, simplePrice, setSimplePrice, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', unitPrice: 3000 });
  const [tempSimplePrice, setTempSimplePrice] = useState(simplePrice);

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? { ...p, ...formData, unitPrice: Number(formData.unitPrice) } : p));
      showToast('Producto actualizado correctamente');
    } else {
      const newProduct = {
        id: `p-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        unitPrice: Number(formData.unitPrice),
        active: true,
      };
      setProducts([...products, newProduct]);
      showToast('Nuevo producto registrado en el catálogo');
    }
    setShowModal(false);
    setEditingProductId(null);
  };

  const handleEdit = (p) => {
    setEditingProductId(p.id);
    setFormData({ name: p.name, description: p.description || '', unitPrice: p.unitPrice });
    setShowModal(true);
  };

  const toggleActive = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleSaveSimplePrice = () => {
    setSimplePrice(Number(tempSimplePrice));
    showToast('Precio estándar de Bono Simple actualizado');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#6b1d2f]">Administración de Productos</h1>
          <p className="text-sm text-gray-500">Catálogo de consumiciones para bonos personalizados</p>
        </div>
        <button
          onClick={() => {
            setEditingProductId(null);
            setFormData({ name: '', description: '', unitPrice: 3000 });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-[#6b1d2f] hover:bg-[#521423] text-white font-semibold rounded-xl text-sm shadow-sm flex items-center gap-2"
        >
          <Icons.PlusCircle /> Nuevo Producto
        </button>
      </div>

      {/* Configurable Standard Simple Price Box (Requirement 6) */}
      <div className="bg-white p-5 rounded-2xl border border-[#f3dbe1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#6b1d2f] text-base">Precio Estándar del Bono Simple</h3>
          <p className="text-xs text-gray-500">Este valor se asigna automáticamente a los nuevos bonos simples emitidos.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-700">$</span>
          <input
            type="number"
            value={tempSimplePrice}
            onChange={(e) => setTempSimplePrice(e.target.value)}
            className="w-32 px-3 py-2 rounded-xl border border-gray-300 font-bold text-gray-800 text-sm focus:ring-2 focus:ring-[#6b1d2f]"
          />
          <button
            onClick={handleSaveSimplePrice}
            className="px-4 py-2 bg-[#6b1d2f] hover:bg-[#521423] text-white font-bold rounded-xl text-xs shadow-sm"
          >
            Guardar Precio
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#f3dbe1] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-xl font-extrabold text-[#6b1d2f]">${p.unitPrice?.toLocaleString()}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{p.description || 'Sin descripción'}</p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleEdit(p)}
                className="flex-1 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Editar
              </button>
              <button
                onClick={() => toggleActive(p.id)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${p.active ? 'bg-rose-50 text-rose-800 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
              >
                {p.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-[#6b1d2f] text-xl">
              {editingProductId ? 'Editar Producto' : 'Crear Producto'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="Ej: Choripán"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="Ej: Choripán en pan de campo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio Unitario ($) *</label>
                <input
                  type="number"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl text-sm">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#6b1d2f] text-white rounded-xl text-sm font-bold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SellerListView({ sellers, setSellers, bonds, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const newSeller = {
      id: `sel-${Date.now()}`,
      name,
      email,
      active: true,
      salesCount: 0,
    };
    setSellers([...sellers, newSeller]);
    setShowModal(false);
    setName('');
    setEmail('');
    showToast('Vendedor registrado correctamente');
  };

  const toggleStatus = (id) => {
    setSellers(sellers.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#6b1d2f]">Administración de Vendedores</h1>
          <p className="text-sm text-gray-500">Gestión de equipo de ventas y credenciales</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#6b1d2f] hover:bg-[#521423] text-white font-semibold rounded-xl text-sm shadow-sm flex items-center gap-2"
        >
          <Icons.PlusCircle /> Nuevo Vendedor
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#f3dbe1] overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#fdf2f5] border-b border-[#f3dbe1] text-[#6b1d2f] font-bold text-xs uppercase">
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Bonos Emitidos</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((s) => {
              const count = bonds.filter(b => b.sellerId === s.id).length;
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.email}</td>
                  <td className="p-4 font-semibold text-[#6b1d2f]">{count} bonos</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      {s.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100"
                    >
                      {s.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => showToast('Contraseña restablecida a 123456')}
                      className="px-3 py-1 text-xs bg-rose-50 text-[#6b1d2f] rounded-lg font-medium hover:bg-rose-100"
                    >
                      Restablecer Clave
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-[#6b1d2f] text-xl">Registrar Vendedor</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="Ej: Roberto Gómez"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="roberto@email.com"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl text-sm">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#6b1d2f] text-white rounded-xl text-sm font-bold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BondCreateView({ products, simplePrice, user, onBondCreated, navigateTo, showModal }) {
  const [step, setStep] = useState(1);
  const [bondType, setBondType] = useState('SIMPLE'); // 'SIMPLE' or 'CON_COMIDA'
  const [itemQuantities, setItemQuantities] = useState({});
  const [buyer, setBuyer] = useState({ name: '', lastName: '', phone: '', email: '' });

  // Initialize product quantities map
  useEffect(() => {
    const initial = {};
    products.forEach((p) => { initial[p.id] = 0; });
    setItemQuantities(initial);
  }, [products]);

  const activeProducts = products.filter(p => p.active);

  // Calculate food total price dynamically
  const calculateFoodTotal = () => {
    return activeProducts.reduce((sum, p) => {
      const qty = itemQuantities[p.id] || 0;
      return sum + (qty * p.unitPrice);
    }, 0);
  };

  const handleNextFromProducts = () => {
    const totalQty = Object.values(itemQuantities).reduce((a, b) => a + b, 0);
    if (totalQty <= 0) {
      showModal(
        'Sin productos seleccionados',
        'Para un bono con comida debe seleccionar al menos 1 producto con cantidad mayor a cero.',
        'warning'
      );
      return;
    }
    setStep(3);
  };

  const handleGenerateBond = () => {
    if (!buyer.name || !buyer.lastName || !buyer.phone) {
      showModal(
        'Datos Incompletos',
        'Por favor complete los campos obligatorios del comprador (Nombre, Apellido, Teléfono).',
        'warning'
      );
      return;
    }

    const items = bondType === 'CON_COMIDA'
      ? activeProducts
          .filter(p => (itemQuantities[p.id] || 0) > 0)
          .map(p => {
            const qty = itemQuantities[p.id];
            return {
              productId: p.id,
              productName: p.name,
              quantity: qty,
              unitPrice: p.unitPrice,
              subtotal: qty * p.unitPrice
            };
          })
      : [];

    const finalPrice = bondType === 'SIMPLE' ? simplePrice : calculateFoodTotal();
    const newNumber = Math.floor(100 + Math.random() * 900);
    const newCode = Math.floor(1000 + Math.random() * 9000).toString(); // SINGLE 4-DIGIT CODE REQUIREMENT

    const newBond = {
      id: `bond-${Date.now()}`,
      number: newNumber,
      type: bondType,
      price: finalPrice,
      sellerId: user?.sellerId || 'sel-1',
      sellerName: user?.name || 'Juan Pérez',
      buyer: { ...buyer },
      items,
      status: 'VENDIDO',
      publicToken: `tok-${newNumber}-${Math.random().toString(36).substring(2, 7)}`,
      code: newCode, // Single code requirement
      createdAt: new Date().toISOString(),
    };

    onBondCreated(newBond);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigateTo('bonos')} className="p-2 hover:bg-rose-100 text-[#6b1d2f] rounded-xl">
          <Icons.ArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#6b1d2f]">Emitir Nuevo Bono</h1>
          <p className="text-sm text-gray-500">Paso {step} de {bondType === 'CON_COMIDA' ? '4' : '3'}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#f3dbe1]">
        {['1. Tipo', bondType === 'CON_COMIDA' ? '2. Productos' : '2. Comprador', bondType === 'CON_COMIDA' ? '3. Comprador' : '3. Resumen', '4. Resumen'].slice(0, bondType === 'CON_COMIDA' ? 4 : 3).map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isActive
                    ? 'bg-[#6b1d2f] text-white shadow-md'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${isActive ? 'text-[#6b1d2f]' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Select Simple vs Food */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-bold text-[#6b1d2f] text-lg">¿Qué bono desea emitir?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setBondType('SIMPLE')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                bondType === 'SIMPLE'
                  ? 'border-[#6b1d2f] bg-[#fcf5f7] ring-2 ring-[#6b1d2f]/30 shadow-md'
                  : 'border-gray-200 bg-white hover:border-rose-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full font-bold">
                  BONO SIMPLE
                </span>
                <span className="text-2xl font-extrabold text-[#6b1d2f]">${simplePrice.toLocaleString()}</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mt-2">Entrada General</h4>
              <p className="text-xs text-gray-500 mt-1">Acceso al evento. Sin consumición de comida incluida.</p>
            </div>

            <div
              onClick={() => setBondType('CON_COMIDA')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                bondType === 'CON_COMIDA'
                  ? 'border-[#6b1d2f] bg-[#fcf5f7] ring-2 ring-[#6b1d2f]/30 shadow-md'
                  : 'border-gray-200 bg-white hover:border-rose-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold">
                  BONO CON COMIDA
                </span>
                <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded">Precio variable</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mt-2">Personalizado con Consumición</h4>
              <p className="text-xs text-gray-500 mt-1">Permite armar el menú seleccionando productos y cantidades.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(bondType === 'CON_COMIDA' ? 2 : 2)}
              className="px-6 py-3 bg-[#6b1d2f] text-white font-bold rounded-xl text-sm shadow-md"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Product Picker (For CON_COMIDA) */}
      {step === 2 && bondType === 'CON_COMIDA' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#6b1d2f] text-lg">Seleccionar productos y cantidades</h3>
              <p className="text-xs text-gray-500">Seleccione el menú para este bono individual</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-bold uppercase block">Total Pedido</span>
              <span className="text-xl font-extrabold text-[#6b1d2f]">${calculateFoodTotal().toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#f3dbe1] space-y-4">
            {activeProducts.map((p) => {
              const qty = itemQuantities[p.id] || 0;
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-[#fdf8f9] rounded-xl border border-rose-100/60">
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">{p.name}</span>
                    <span className="text-xs text-[#6b1d2f] font-semibold">${p.unitPrice?.toLocaleString()} c/u</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setItemQuantities({ ...itemQuantities, [p.id]: Math.max(0, qty - 1) })}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-extrabold text-[#6b1d2f] text-lg">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setItemQuantities({ ...itemQuantities, [p.id]: qty + 1 })}
                      className="w-8 h-8 rounded-lg bg-[#6b1d2f] text-white font-bold hover:bg-[#521423] flex items-center justify-center text-lg shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm">
              Volver
            </button>
            <button onClick={handleNextFromProducts} className="px-6 py-2.5 bg-[#6b1d2f] text-white font-bold rounded-xl text-sm shadow-md">
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* STEP: Buyer Info */}
      {((step === 2 && bondType === 'SIMPLE') || (step === 3 && bondType === 'CON_COMIDA')) && (
        <div className="space-y-4">
          <h3 className="font-bold text-[#6b1d2f] text-lg">Datos del Comprador</h3>
          <div className="bg-white p-6 rounded-2xl border border-[#f3dbe1] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre *</label>
              <input
                type="text"
                value={buyer.name}
                onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#6b1d2f]"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apellido *</label>
              <input
                type="text"
                value={buyer.lastName}
                onChange={(e) => setBuyer({ ...buyer, lastName: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#6b1d2f]"
                placeholder="Pérez"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono *</label>
              <input
                type="text"
                value={buyer.phone}
                onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#6b1d2f]"
                placeholder="3512345678"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Opcional)</label>
              <input
                type="email"
                value={buyer.email}
                onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#6b1d2f]"
                placeholder="juan.perez@email.com"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(bondType === 'CON_COMIDA' ? 2 : 1)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm"
            >
              Volver
            </button>
            <button
              disabled={!buyer.name || !buyer.lastName || !buyer.phone}
              onClick={() => setStep(bondType === 'CON_COMIDA' ? 4 : 3)}
              className="px-6 py-2.5 bg-[#6b1d2f] disabled:bg-gray-300 text-white font-bold rounded-xl text-sm shadow-md"
            >
              Ver Resumen →
            </button>
          </div>
        </div>
      )}

      {/* FINAL STEP: Summary Confirmation */}
      {((step === 3 && bondType === 'SIMPLE') || (step === 4 && bondType === 'CON_COMIDA')) && (
        <div className="space-y-4">
          <h3 className="font-bold text-[#6b1d2f] text-lg">Resumen de Emisión</h3>
          <div className="bg-white p-6 rounded-2xl border border-[#f3dbe1] space-y-4 shadow-sm">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs text-gray-400 font-bold uppercase">Comprador</span>
              <p className="font-bold text-gray-800 text-base">{buyer.name} {buyer.lastName}</p>
              <p className="text-xs text-gray-500">📞 {buyer.phone} {buyer.email && `| ✉️ ${buyer.email}`}</p>
            </div>

            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Tipo de Bono</span>
                <p className="font-bold text-gray-800">{bondType === 'SIMPLE' ? 'Bono Simple (Entrada General)' : 'Bono Personalizado con Comida'}</p>
              </div>
              <span className="text-2xl font-extrabold text-[#6b1d2f]">
                ${(bondType === 'SIMPLE' ? simplePrice : calculateFoodTotal()).toLocaleString()}
              </span>
            </div>

            {bondType === 'CON_COMIDA' && (
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase block mb-2">Contenido del Pedido:</span>
                <div className="bg-[#fdf8f9] p-4 rounded-xl space-y-2 border border-rose-100">
                  {activeProducts.filter(p => itemQuantities[p.id] > 0).map((p) => {
                    const qty = itemQuantities[p.id];
                    const subtotal = qty * p.unitPrice;
                    return (
                      <div key={p.id} className="flex justify-between text-sm">
                        <span className="font-medium text-gray-800">{qty} × {p.name}</span>
                        <span className="font-bold text-[#6b1d2f]">${subtotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(bondType === 'CON_COMIDA' ? 3 : 2)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm"
            >
              Volver
            </button>
            <button
              onClick={handleGenerateBond}
              className="px-8 py-3 bg-[#6b1d2f] hover:bg-[#521423] text-white font-extrabold rounded-xl text-sm shadow-lg transform active:scale-95 transition-all"
            >
              🎉 Generar Bono
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BondListView({ bonds, sellers, user, navigateTo, setBonds, showToast, showModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSeller, setFilterSeller] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const visibleBonds = bonds.filter((bond) => {
    // Role restriction
    if (user?.role === 'VENDEDOR' && bond.sellerId !== user.sellerId && !bond.sellerName.toLowerCase().includes('juan')) {
      return false;
    }

    const query = searchTerm.toLowerCase();
    const searchMatch =
      bond.number.toString().includes(query) ||
      `${bond.buyer?.name} ${bond.buyer?.lastName}`.toLowerCase().includes(query) ||
      bond.code?.includes(query);

    const statusMatch = filterStatus === 'ALL' || bond.status === filterStatus;
    const sellerMatch = filterSeller === 'ALL' || bond.sellerId === filterSeller;
    const typeMatch = filterType === 'ALL' || bond.type === filterType;

    return searchMatch && statusMatch && sellerMatch && typeMatch;
  });

  const handleAnnull = (e, bondId) => {
    e.stopPropagation();
    showModal(
      '¿Anular Bono?',
      'Esta acción cambiará el estado a ANULADO y deshabilitará permanentemente este bono.',
      'danger',
      () => {
        setBonds(bonds.map(b => b.id === bondId ? { ...b, status: 'ANULADO' } : b));
        showToast('Bono anulado correctamente');
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#6b1d2f]">Listado de Bonos</h1>
          <p className="text-sm text-gray-500">
            {user?.role === 'ADMIN' ? 'Todos los bonos registrados' : 'Tus bonos emitidos'}
          </p>
        </div>
        <button
          onClick={() => navigateTo('bonos/nuevo')}
          className="px-4 py-2.5 bg-[#6b1d2f] hover:bg-[#521423] text-white font-semibold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2"
        >
          <Icons.PlusCircle /> Nuevo Bono
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#f3dbe1] shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por Nº, comprador o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400"><Icons.Search /></span>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f]"
          >
            <option value="ALL">Todos los estados</option>
            <option value="VENDIDO">VENDIDO</option>
            <option value="USADO_ENTRADA">USADO_ENTRADA</option>
            <option value="USADO_COMIDA">USADO_COMIDA</option>
            <option value="ANULADO">ANULADO</option>
          </select>
        </div>

        {user?.role === 'ADMIN' && (
          <div>
            <select
              value={filterSeller}
              onChange={(e) => setFilterSeller(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f]"
            >
              <option value="ALL">Todos los vendedores</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d2f]"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="SIMPLE">Bono Simple</option>
            <option value="CON_COMIDA">Con Comida</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#f3dbe1] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#fdf2f5] border-b border-[#f3dbe1] text-[#6b1d2f] font-bold text-xs uppercase tracking-wider">
                <th className="p-4">Nº</th>
                <th className="p-4">Comprador</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Código</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleBonds.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">
                    No se encontraron bonos coincidentes.
                  </td>
                </tr>
              ) : (
                visibleBonds.map((bond) => (
                  <tr
                    key={bond.id}
                    onClick={() => navigateTo('bonos/detail', bond.id)}
                    className="hover:bg-[#fcf5f7] cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-[#6b1d2f]">#{bond.number}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {bond.buyer?.name} {bond.buyer?.lastName}
                      <span className="block text-xs text-gray-400">{bond.buyer?.phone}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {bond.type === 'SIMPLE' ? 'Simple' : 'Con Comida 🍔'}
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-800">{bond.code}</td>
                    <td className="p-4 text-gray-600">{bond.sellerName}</td>
                    <td className="p-4 font-semibold text-gray-800">${bond.price?.toLocaleString()}</td>
                    <td className="p-4">
                      <BadgeStatus status={bond.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('public', bond.publicToken);
                        }}
                        className="px-2.5 py-1 text-xs bg-rose-50 text-[#6b1d2f] hover:bg-rose-100 rounded-lg font-medium inline-flex items-center gap-1"
                      >
                        <Icons.ExternalLink /> Enlace
                      </button>
                      {user?.role === 'ADMIN' && bond.status !== 'ANULADO' && (
                        <button
                          onClick={(e) => handleAnnull(e, bond.id)}
                          className="px-2.5 py-1 text-xs bg-gray-100 text-rose-700 hover:bg-rose-100 rounded-lg font-medium"
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BadgeStatus({ status }) {
  let style = 'bg-gray-100 text-gray-700';
  let label = status;

  if (status === 'VENDIDO') {
    style = 'bg-blue-100 text-blue-800 border border-blue-200';
    label = 'VENDIDO';
  } else if (status === 'USADO_ENTRADA') {
    style = 'bg-amber-100 text-amber-900 border border-amber-300';
    label = 'ENTRADA USADA';
  } else if (status === 'USADO_COMIDA') {
    style = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    label = 'COMIDA ENTREGADA';
  } else if (status === 'ANULADO') {
    style = 'bg-rose-100 text-rose-800 border border-rose-200';
    label = 'ANULADO';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${style}`}>
      {label}
    </span>
  );
}

function BondDetailView({ bondId, bonds, user, setBonds, navigateTo, showToast, showModal }) {
  const bond = bonds.find((b) => b.id === bondId) || bonds[0];

  if (!bond) return <div className="p-8 text-center text-gray-500">Bono no encontrado.</div>;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/b/${bond.publicToken}`;
    navigator.clipboard?.writeText ? navigator.clipboard.writeText(url) : document.execCommand('copy');
    showToast('Enlace copiado al portapapeles');
  };

  const handleAnnull = () => {
    showModal(
      '¿Confirma la anulación?',
      `El bono #${bond.number} será marcado como ANULADO y ya no podrá utilizarse en ninguna terminal.`,
      'danger',
      () => {
        setBonds(bonds.map((b) => (b.id === bond.id ? { ...b, status: 'ANULADO' } : b)));
        showToast('Bono anulado');
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('bonos')} className="p-2 hover:bg-rose-100 text-[#6b1d2f] rounded-xl">
            <Icons.ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#6b1d2f]">Detalle Interno del Bono #{bond.number}</h1>
            <p className="text-xs text-gray-400">ID: {bond.id} | Fecha: {new Date(bond.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <BadgeStatus status={bond.status} />
      </div>

      <div className="bg-white rounded-2xl border border-[#f3dbe1] shadow-sm p-6 space-y-6">
        {/* Buyer & Seller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Datos del Comprador</span>
            <p className="font-bold text-gray-800 text-lg">{bond.buyer?.name} {bond.buyer?.lastName}</p>
            <p className="text-sm text-gray-600">📞 {bond.buyer?.phone}</p>
            {bond.buyer?.email && <p className="text-sm text-gray-600">✉️ {bond.buyer?.email}</p>}
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Datos de Venta</span>
            <p className="text-sm font-semibold text-gray-800">Vendedor: {bond.sellerName}</p>
            <p className="text-sm text-gray-600">Tipo: {bond.type === 'SIMPLE' ? 'Bono Simple' : 'Bono con Comida'}</p>
            <p className="text-sm font-bold text-[#6b1d2f] mt-1">Precio Total: ${bond.price?.toLocaleString()}</p>
          </div>
        </div>

        {/* Single Code Requirement Display */}
        <div className="bg-[#fdf8f9] p-5 rounded-xl border border-[#f3dbe1] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#6b1d2f]">Código Único de 4 Cifras (Y QR)</span>
            <p className="text-4xl font-mono font-extrabold text-gray-800 mt-1 tracking-widest">{bond.code}</p>
            <p className="text-xs text-gray-500 mt-1">
              Este mismo código identifica el bono en la entrada y en el sector de comida.
            </p>
          </div>
          <div className="p-3 bg-white border rounded-xl shadow-sm text-center">
            <span className="text-[10px] font-mono text-gray-400 block mb-1">[ QR ÚNICO ]</span>
            <Icons.QrCode />
          </div>
        </div>

        {/* Validation Audits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-6 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="font-bold text-gray-700 block uppercase mb-1">Estado de Entrada</span>
            {bond.entryUsedAt ? (
              <p className="text-emerald-800 font-semibold">
                ✓ Utilizada el {new Date(bond.entryUsedAt).toLocaleString()}
                <br />Por: {bond.entryValidatedBy || 'Vendedor'}
              </p>
            ) : (
              <p className="text-gray-500 font-medium">⏳ Pendiente de uso</p>
            )}
          </div>

          {bond.type === 'CON_COMIDA' && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-700 block uppercase mb-1">Estado de Comida</span>
              {bond.foodUsedAt ? (
                <p className="text-emerald-800 font-semibold">
                  ✓ Entregada el {new Date(bond.foodUsedAt).toLocaleString()}
                  <br />Por: {bond.foodValidatedBy || 'Vendedor'}
                </p>
              ) : (
                <p className="text-amber-900 font-medium">⏳ Pendiente de entrega</p>
              )}
            </div>
          )}
        </div>

        {/* Itemized Food items if any */}
        {bond.type === 'CON_COMIDA' && bond.items && bond.items.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-800 text-sm mb-2">Pedido de Comida Incluido:</h4>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 space-y-2">
              {bond.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="font-semibold text-amber-900">{item.quantity} × {item.productName}</span>
                  <span className="font-bold text-amber-900">${item.subtotal?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('public', bond.publicToken)}
              className="px-4 py-2 bg-[#6b1d2f] text-white font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-[#521423]"
            >
              <Icons.ExternalLink /> Ver Vista Pública
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-gray-50"
            >
              <Icons.Copy /> Copiar Enlace
            </button>
          </div>

          {user?.role === 'ADMIN' && bond.status !== 'ANULADO' && (
            <button
              onClick={handleAnnull}
              className="px-4 py-2 bg-rose-100 text-rose-800 font-semibold rounded-xl text-xs hover:bg-rose-200"
            >
              Anular Bono
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ValidationEntryView({ bonds, setBonds, user, showToast, showModal }) {
  const [manualCode, setManualCode] = useState('');
  const [scannedBond, setScannedBond] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchCode = (codeToSearch = manualCode) => {
    setErrorMsg('');
    setScannedBond(null);

    if (codeToSearch.length !== 4) {
      setErrorMsg('El código debe tener exactamente 4 dígitos.');
      return;
    }

    const found = bonds.find((b) => b.code === codeToSearch);
    if (!found) {
      setErrorMsg('Código no encontrado o inválido.');
      return;
    }

    // Business validations check (Requirement 28)
    if (found.status === 'ANULADO') {
      showModal(
        'BONO ANULADO',
        `El bono #${found.number} fue ANULADO y no permite el ingreso al evento.`,
        'danger'
      );
      return;
    }

    if (found.status === 'USADO_ENTRADA' || found.status === 'USADO_COMIDA') {
      showModal(
        'ENTRADA YA UTILIZADA',
        `El bono #${found.number} de ${found.buyer?.name} ${found.buyer?.lastName} ya fue utilizado previamente.\n\nFecha: ${new Date(found.entryUsedAt || Date.now()).toLocaleString()}\nValidado por: ${found.entryValidatedBy || 'Vendedor'}`,
        'warning'
      );
      return;
    }

    setScannedBond(found);
  };

  const handleConfirmEntry = () => {
    if (!scannedBond) return;

    setBonds(
      bonds.map((b) =>
        b.id === scannedBond.id
          ? {
              ...b,
              status: 'USADO_ENTRADA',
              entryUsedAt: new Date().toISOString(),
              entryValidatedBy: user?.name || 'Vendedor',
            }
          : b
      )
    );

    showToast(`✅ ENTRADA VALIDADA para Bono #${scannedBond.number}`);
    setScannedBond(null);
    setManualCode('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#6b1d2f]">Terminal — Validar Entrada</h1>
        <p className="text-sm text-gray-500">Escané el QR o ingresá el código numérico de 4 cifras</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#f3dbe1] shadow-sm text-center space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Ingresar Código de 4 dígitos
          </label>
          <input
            type="text"
            maxLength="4"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
            placeholder="0000"
            className="w-48 text-center text-4xl font-mono font-extrabold py-3 border-2 border-[#6b1d2f] rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 tracking-widest text-[#6b1d2f]"
          />
        </div>

        <button
          onClick={() => handleSearchCode()}
          disabled={manualCode.length !== 4}
          className="w-full max-w-xs py-3.5 bg-[#6b1d2f] disabled:bg-gray-300 hover:bg-[#521423] text-white font-bold rounded-xl text-sm shadow-md transition-all"
        >
          Buscar Bono
        </button>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Demo Quick Simulators */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Simulador rápido con códigos de demostración:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setManualCode('4821'); handleSearchCode('4821'); }}
              className="px-2.5 py-1 bg-[#fdf2f5] text-[#6b1d2f] text-xs font-semibold rounded-lg hover:bg-[#f8e1e7]"
            >
              #125 Vendido [4821]
            </button>
            <button
              onClick={() => { setManualCode('5832'); handleSearchCode('5832'); }}
              className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100"
            >
              #126 Ya Usado [5832]
            </button>
            <button
              onClick={() => { setManualCode('3310'); handleSearchCode('3310'); }}
              className="px-2.5 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg hover:bg-rose-100"
            >
              #127 Anulado [3310]
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {scannedBond && (
        <div className="bg-white rounded-2xl border-2 border-[#6b1d2f] p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-[#6b1d2f] text-lg">Confirmar Entrada</h3>
            <span className="font-mono font-bold text-gray-500 text-sm">Bono #{scannedBond.number}</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Comprador:</span>
              <span className="font-bold text-gray-800">{scannedBond.buyer?.name} {scannedBond.buyer?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo de Bono:</span>
              <span className="font-medium text-gray-800">{scannedBond.type === 'SIMPLE' ? 'Bono Simple' : 'Bono con Comida'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado Actual:</span>
              <BadgeStatus status={scannedBond.status} />
            </div>

            {scannedBond.type === 'CON_COMIDA' && (
              <div className="mt-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-900 font-semibold border border-amber-200">
                🍔 Posee consumición de comida pendiente para retirar después.
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setScannedBond(null)}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmEntry}
              className="flex-1 py-2.5 bg-[#6b1d2f] text-white font-bold rounded-xl text-sm shadow-md"
            >
              Confirmar Entrada ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationFoodView({ bonds, setBonds, user, showToast, showModal }) {
  const [manualCode, setManualCode] = useState('');
  const [scannedBond, setScannedBond] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchCode = (codeToSearch = manualCode) => {
    setErrorMsg('');
    setScannedBond(null);

    if (codeToSearch.length !== 4) {
      setErrorMsg('El código debe tener exactamente 4 dígitos.');
      return;
    }

    const found = bonds.find((b) => b.code === codeToSearch);
    if (!found) {
      setErrorMsg('Código no encontrado o inválido.');
      return;
    }

    // Business validations (Requirement 28)
    if (found.status === 'ANULADO') {
      showModal(
        'BONO ANULADO',
        `El bono #${found.number} está ANULADO y no permite retiro de comida.`,
        'danger'
      );
      return;
    }

    if (found.type === 'SIMPLE') {
      showModal(
        'BONO SIMPLE SIN COMIDA',
        `El bono #${found.number} es una Entrada General Simple y no incluye productos de comida.`,
        'warning'
      );
      return;
    }

    if (found.status === 'VENDIDO') {
      showModal(
        'ENTRADA NO VALIDADA AÚN',
        `La comida no se puede entregar antes de haber ingresado al evento con la entrada.\n\nPor favor, valide primero la entrada en el acceso.`,
        'warning'
      );
      return;
    }

    if (found.status === 'USADO_COMIDA') {
      showModal(
        'COMIDA YA ENTREGADA',
        `La comida correspondiente al bono #${found.number} ya fue entregada anteriormente.\n\nEntregado el: ${new Date(found.foodUsedAt || Date.now()).toLocaleString()}\nPor: ${found.foodValidatedBy || 'Vendedor'}`,
        'warning'
      );
      return;
    }

    setScannedBond(found);
  };

  const handleConfirmFood = () => {
    if (!scannedBond) return;

    setBonds(
      bonds.map((b) =>
        b.id === scannedBond.id
          ? {
              ...b,
              status: 'USADO_COMIDA',
              foodUsedAt: new Date().toISOString(),
              foodValidatedBy: user?.name || 'Vendedor',
            }
          : b
      )
    );

    showToast(`🍔 COMIDA ENTREGADA para Bono #${scannedBond.number}`);
    setScannedBond(null);
    setManualCode('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#6b1d2f]">Terminal — Sector Comida</h1>
        <p className="text-sm text-gray-500">Ingresá el mismo código de 4 cifras o escaneá el QR del bono</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#f3dbe1] shadow-sm text-center space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Ingresar Código Único (4 dígitos)
          </label>
          <input
            type="text"
            maxLength="4"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
            placeholder="0000"
            className="w-48 text-center text-4xl font-mono font-extrabold py-3 border-2 border-amber-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 tracking-widest text-amber-900"
          />
        </div>

        <button
          onClick={() => handleSearchCode()}
          disabled={manualCode.length !== 4}
          className="w-full max-w-xs py-3.5 bg-amber-800 disabled:bg-gray-300 hover:bg-amber-900 text-white font-bold rounded-xl text-sm shadow-md transition-all"
        >
          Buscar Pedido
        </button>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Demo Buttons */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Prueba rápida con bonos de prueba:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setManualCode('5832'); handleSearchCode('5832'); }}
              className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-200"
            >
              #126 Pendiente [5832]
            </button>
            <button
              onClick={() => { setManualCode('4821'); handleSearchCode('4821'); }}
              className="px-2.5 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg hover:bg-rose-100"
            >
              #125 Sin Entrada Aún [4821]
            </button>
            <button
              onClick={() => { setManualCode('1001'); handleSearchCode('1001'); }}
              className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
            >
              #101 Simple [1001]
            </button>
          </div>
        </div>
      </div>

      {/* Food Delivery Order Dialog (Requirement 25) */}
      {scannedBond && (
        <div className="bg-white rounded-2xl border-2 border-amber-800 p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-amber-900 text-lg">Validar Entrega de Comida</h3>
            <span className="font-mono font-bold text-gray-500 text-sm">Bono #{scannedBond.number}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Comprador:</span>
              <span className="font-bold text-gray-800">{scannedBond.buyer?.name} {scannedBond.buyer?.lastName}</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-bold uppercase text-amber-900 block mb-2">DEBE ENTREGAR ESTE PEDIDO:</span>
              <ul className="space-y-1.5">
                {scannedBond.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm font-bold text-amber-900">
                    <span>• {item.productName}</span>
                    <span className="text-base font-extrabold">{item.quantity} unidades</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setScannedBond(null)}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmFood}
              className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm shadow-md"
            >
              Confirmar Entrega 🍔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PublicBondView({ token, bonds, onNavigateBack }) {
  const bond = bonds.find((b) => b.publicToken === token) || bonds[1] || bonds[0];

  if (!bond) return <div className="p-8 text-center text-gray-500">Bono público no encontrado.</div>;

  return (
    <div className="min-h-screen bg-[#f3e6e9] flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-sm mb-4 flex justify-between items-center">
        <button
          onClick={onNavigateBack}
          className="text-xs bg-white text-[#6b1d2f] px-3 py-1.5 rounded-lg shadow-sm font-bold flex items-center gap-1"
        >
          ← Volver al Sistema
        </button>
        <span className="text-xs font-mono bg-white/60 text-gray-600 px-2 py-1 rounded">
          /b/{bond.publicToken}
        </span>
      </div>

      {/* MOBILE TICKET PASS CARD */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8cbd3] relative">
        {/* Ticket Header */}
        <div className="bg-[#6b1d2f] text-white p-6 text-center relative">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-200">
            Pase Oficial de Evento
          </span>
          <h2 className="text-2xl font-extrabold mt-1">Bono #{bond.number}</h2>
          <p className="text-sm font-medium text-rose-100">{bond.buyer?.name} {bond.buyer?.lastName}</p>
        </div>

        {/* Dynamic Pass Content */}
        <div className="p-6 space-y-6">
          {bond.status === 'ANULADO' ? (
            /* ANULADO STATE */
            <div className="bg-rose-50 border-2 border-rose-300 p-6 rounded-2xl text-center space-y-2">
              <span className="text-3xl">⚠️</span>
              <h3 className="font-extrabold text-rose-800 text-xl">BONO ANULADO</h3>
              <p className="text-xs text-rose-700">Este bono no es válido para ingreso ni consumición.</p>
            </div>
          ) : bond.status === 'VENDIDO' ? (
            /* VENDIDO STATE */
            <div className="text-center space-y-4">
              <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                ENTRADA PENDIENTE
              </div>

              {/* Single QR Representation */}
              <div className="w-48 h-48 mx-auto bg-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-md">
                <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center">
                  <div className="w-full h-full bg-[#6b1d2f] rounded flex items-center justify-center text-white font-mono text-[10px] p-2 text-center font-bold">
                    [ QR ÚNICO #{bond.number} ]
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Código de 4 Cifras</span>
                <p className="text-4xl font-mono font-extrabold text-[#6b1d2f] tracking-widest mt-0.5">
                  {bond.code}
                </p>
              </div>

              {bond.type === 'CON_COMIDA' && bond.items && (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-left">
                  <span className="text-xs font-bold text-amber-900 uppercase block mb-1">Menú Incluido:</span>
                  {bond.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold text-amber-900">
                      <span>• {item.productName}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 font-medium">
                Presentá este QR o código al ingresar al evento.
              </p>
            </div>
          ) : bond.status === 'USADO_ENTRADA' ? (
            /* USADO_ENTRADA STATE */
            <div className="space-y-5">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-center border border-emerald-200">
                <p className="font-extrabold text-base">Entrada utilizada ✓</p>
                <p className="text-xs text-emerald-600">¡Bienvenido al evento!</p>
              </div>

              {bond.type === 'CON_COMIDA' ? (
                /* Shows same single code/QR for food section */
                <div className="text-center space-y-4 pt-2 border-t border-dashed border-gray-200">
                  <div className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                    VALE DE COMIDA PENDIENTE
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl text-left border border-amber-200 space-y-1">
                    <span className="text-xs font-bold text-amber-900 uppercase block mb-1">Pedido a retirar:</span>
                    {bond.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm font-bold text-amber-900">
                        <span>• {item.productName}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* MISMO QR */}
                  <div className="w-40 h-40 mx-auto bg-amber-900 rounded-2xl p-3 flex items-center justify-center text-white">
                    <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center text-amber-900 font-mono text-[10px] text-center font-bold">
                      [ MISMO QR #{bond.number} ]
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Mismo Código Único</span>
                    <p className="text-3xl font-mono font-extrabold text-amber-900 tracking-widest mt-0.5">
                      {bond.code}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    Presentá este mismo código en el sector de comidas.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-center text-gray-500">Gracias por su colaboración.</p>
              )}
            </div>
          ) : bond.status === 'USADO_COMIDA' ? (
            /* USADO_COMIDA STATE */
            <div className="space-y-4 text-center">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <p className="font-extrabold text-base">Entrada utilizada ✓</p>
                <p className="font-extrabold text-base">Comida entregada ✓</p>
              </div>

              {bond.items && (
                <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-200 space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Incluía:</span>
                  {bond.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700 font-semibold">
                      <span>• {item.productName}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 pt-2">Gracias por su colaboración.</p>
            </div>
          ) : null}

          {/* Ticket Footer Meta */}
          <div className="border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400 space-y-0.5">
            <p>Vendedor: {bond.sellerName}</p>
            <p>Tipo: {bond.type === 'SIMPLE' ? 'Bono Simple' : 'Bono con Comida'}</p>
          </div>
        </div>

        {/* Decorative Notches */}
        <div className="absolute left-0 top-32 w-4 h-8 bg-[#f3e6e9] rounded-r-full -ml-2"></div>
        <div className="absolute right-0 top-32 w-4 h-8 bg-[#f3e6e9] rounded-l-full -mr-2"></div>
      </div>
    </div>
  );
}