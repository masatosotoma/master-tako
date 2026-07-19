import React, { useState, useEffect } from 'react';
import { translations, menuData } from './menuData';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [theme, setTheme] = useState('dark');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // Customization Modal States
  const [customizingItem, setCustomizingItem] = useState(null);
  const [customPortion, setCustomPortion] = useState('portion6');
  const [customSauce, setCustomSauce] = useState('sauceClassic');
  const [customToppings, setCustomToppings] = useState({
    toppingBonito: false,
    toppingGreenOnion: false,
    toppingSeaweed: false,
  });

  // Monitor scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const t = translations[language];

  // Helper to format price based on language currency
  const formatPrice = (usd, jpy) => {
    if (language === 'ja') {
      const jpyVal = jpy || Math.round(usd * 100);
      return `${jpyVal}円`;
    }
    return `$${usd.toFixed(2)}`;
  };

  // Helper to toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Helper to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Filter categories
  const filteredMenu = menuData.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  // Calculate single item price with customizations
  const calculateItemPrice = (item, portion, toppings) => {
    let usd = item.basePrice;
    let jpy = item.basePriceJa || Math.round(item.basePrice * 100);

    if (item.customType === 'takoyaki') {
      if (portion === 'portion10') {
        usd += 3.50;
        jpy += 350;
      } else if (portion === 'portion15') {
        usd += 7.00;
        jpy += 700;
      }

      if (toppings.toppingBonito) {
        usd += 0.50;
        jpy += 50;
      }
      if (toppings.toppingGreenOnion) {
        usd += 0.70;
        jpy += 70;
      }
      if (toppings.toppingSeaweed) {
        usd += 0.30;
        jpy += 30;
      }
    }

    return { usd, jpy };
  };

  // Open customization modal
  const handleItemClick = (item) => {
    setCustomizingItem(item);
    setCustomPortion('portion6');
    setCustomSauce('sauceClassic');
    setCustomToppings({
      toppingBonito: false,
      toppingGreenOnion: false,
      toppingSeaweed: false,
    });
  };

  // Preview pricing in customization modal
  const currentModalPrice = customizingItem 
    ? calculateItemPrice(customizingItem, customPortion, customToppings) 
    : { usd: 0, jpy: 0 };

  return (
    <div className="App">
      {/* Header Bar */}
      <header className={headerScrolled ? 'scrolled' : ''}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <span className="logo-icon">🐙</span> Master <span>Tako</span>
          </a>
          
          <div className="nav-actions">
            {/* Language Selector */}
            <div className="lang-select-wrapper">
              <button 
                className={`lang-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >EN</button>
              <button 
                className={`lang-option ${language === 'zh' ? 'active' : ''}`}
                onClick={() => changeLanguage('zh')}
              >中文</button>
              <button 
                className={`lang-option ${language === 'ja' ? 'active' : ''}`}
                onClick={() => changeLanguage('ja')}
              >日本語</button>
            </div>

            {/* Dark Mode toggle */}
            <button className="icon-btn" onClick={toggleTheme} title={t.themeDark}>
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>


          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">{t.heroBadge}</span>
            <h1 dangerouslySetInnerHTML={{ __html: t.heroTitle }}></h1>
            <p>{t.heroSubtitle}</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#menu-section" className="btn btn-primary">
                <i className="fas fa-hamburger"></i>
                <span>{t.exploreMenu}</span>
              </a>
              <a href="#info-section" className="btn btn-secondary">
                <i className="fas fa-map-marker-alt"></i>
                <span>{t.locationTitle.split(' ')[0]}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="kanji-decoration">大阪たこ焼き</div>
      </section>

      {/* Mobile Language Bar */}
      <div className="mobile-lang-bar container" style={{ display: 'none', margin: '20px auto 0 auto', justifyContent: 'center', gap: '8px' }}>
        <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>EN</button>
        <button className={`lang-option ${language === 'zh' ? 'active' : ''}`} onClick={() => changeLanguage('zh')}>中文</button>
        <button className={`lang-option ${language === 'ja' ? 'active' : ''}`} onClick={() => changeLanguage('ja')}>日本語</button>
      </div>

      {/* Menu Catalog Area */}
      <main className="container section-padding" id="menu-section">
        <h2 className="section-title">{t.categoriesTitle}</h2>
        <p className="section-subtitle">{t.categoriesSubtitle}</p>

        {/* Categories Tab Selector */}
        <div className="menu-categories">
          <button 
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >{t.catAll}</button>
          <button 
            className={`category-tab ${activeCategory === 'takoyaki' ? 'active' : ''}`}
            onClick={() => setActiveCategory('takoyaki')}
          >{t.catTakoyaki}</button>
          <button 
            className={`category-tab ${activeCategory === 'sides' ? 'active' : ''}`}
            onClick={() => setActiveCategory('sides')}
          >{t.catSides}</button>
          <button 
            className={`category-tab ${activeCategory === 'drinks' ? 'active' : ''}`}
            onClick={() => setActiveCategory('drinks')}
          >{t.catDrinks}</button>
        </div>

        {/* Products Grid */}
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <div className="menu-card" key={item.id}>
              <div className="menu-card-img-container">
                <img src={item.imagePath} alt={item.names[language]} className="menu-card-img" />
                {item.badge && <span className="menu-card-badge">{item.badge[language]}</span>}
              </div>
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-title">{item.names[language]}</h3>
                  <span className="menu-card-price">
                    {formatPrice(item.basePrice, item.basePriceJa)}
                  </span>
                </div>
                <div className="menu-card-meta">
                  <span><i className="fas fa-fire"></i> {item.cal}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
                <p className="menu-card-description">{item.descriptions[language]}</p>
                {item.customType === 'takoyaki' && (
                  <div className="menu-card-footer">
                    <button className="menu-card-btn" onClick={() => handleItemClick(item)}>
                      <i className="fas fa-sliders-h" style={{ marginRight: '6px' }}></i>
                      {t.viewOptions}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Info Details Section */}
      <section className="info-section section-padding" id="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-map-marked-alt"></i></div>
              <h3>{t.locationTitle}</h3>
              <p>{t.locDesc}</p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(t.locDesc)}`} 
                target="_blank" 
                rel="noreferrer" 
                style={{ fontSize: '0.8rem', textDecoration: 'underline', fontWeight: 600 }}
              >
                Open Google Maps
              </a>
            </div>

            <div className="info-item">
              <div className="info-icon"><i className="fas fa-clock"></i></div>
              <h3>{t.hoursTitle}</h3>
              <p>{t.hoursDesc}</p>
            </div>

            <div className="info-item">
              <div className="info-icon"><i className="fas fa-phone-alt"></i></div>
              <h3>{t.contactTitle}</h3>
              <p>{t.contactDesc}</p>
              <a 
                href={`tel:${t.contactDesc.replace(/[^0-9+]/g, '')}`}
                style={{ fontSize: '0.8rem', textDecoration: 'underline', fontWeight: 600 }}
              >
                Call Store
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-logo">🐙 Master Tako</div>
          <div className="footer-text">{t.footerText}</div>
        </div>
      </footer>

      {/* Takoyaki Customization Modal */}
      {customizingItem && (
        <div className="modal-overlay open" onClick={() => setCustomizingItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{customizingItem.names[language]}</h2>
              <button className="close-btn" onClick={() => setCustomizingItem(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="item-preview">
                <img src={customizingItem.imagePath} alt={customizingItem.names[language]} className="item-preview-img" />
                <div className="item-preview-text">
                  <h3 className="item-preview-title">{customizingItem.names[language]}</h3>
                  <p className="item-preview-desc">{customizingItem.descriptions[language]}</p>
                </div>
              </div>

              {/* Portion Group */}
              <div className="option-group">
                <div className="option-group-title">{t.customSize}</div>
                <div className="option-choices-grid">
                  <button 
                    className={`choice-card ${customPortion === 'portion6' ? 'active' : ''}`}
                    onClick={() => setCustomPortion('portion6')}
                  >
                    <span>{t.portion6.split(' (+')[0]}</span>
                    <span>{formatPrice(customizingItem.basePrice, customizingItem.basePriceJa)}</span>
                  </button>
                  <button 
                    className={`choice-card ${customPortion === 'portion10' ? 'active' : ''}`}
                    onClick={() => setCustomPortion('portion10')}
                  >
                    <span>{t.portion10.split(' (+')[0]}</span>
                    <span>+{formatPrice(3.50, 350)}</span>
                  </button>
                  <button 
                    className={`choice-card ${customPortion === 'portion15' ? 'active' : ''}`}
                    onClick={() => setCustomPortion('portion15')}
                  >
                    <span>{t.portion15.split(' (+')[0]}</span>
                    <span>+{formatPrice(7.00, 700)}</span>
                  </button>
                </div>
              </div>

              {/* Sauce Selection Group */}
              <div className="option-group">
                <div className="option-group-title">{t.customSauce}</div>
                <div className="option-choices-grid">
                  {['sauceClassic', 'sauceSweet', 'sauceKewpie', 'sauceNone'].map(sauceKey => (
                    <button 
                      key={sauceKey}
                      className={`choice-card ${customSauce === sauceKey ? 'active' : ''}`}
                      onClick={() => setCustomSauce(sauceKey)}
                    >
                      <span>{t[sauceKey]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selection Group */}
              <div className="option-group">
                <div className="option-group-title">{t.customToppings}</div>
                <div className="option-choices-grid">
                  {[
                    { key: 'toppingBonito', label: t.toppingBonito.split(' (+')[0], extraUsd: 0.50, extraJpy: 50 },
                    { key: 'toppingGreenOnion', label: t.toppingGreenOnion.split(' (+')[0], extraUsd: 0.70, extraJpy: 70 },
                    { key: 'toppingSeaweed', label: t.toppingSeaweed.split(' (+')[0], extraUsd: 0.30, extraJpy: 30 }
                  ].map(topping => (
                    <button 
                      key={topping.key}
                      className={`choice-card ${customToppings[topping.key] ? 'active' : ''}`}
                      onClick={() => setCustomToppings(prev => ({ ...prev, [topping.key]: !prev[topping.key] }))}
                    >
                      <div className="choice-checkbox">
                        <div className="checkbox-custom">
                          {customToppings[topping.key] && <i className="fas fa-check"></i>}
                        </div>
                        <span>{topping.label}</span>
                      </div>
                      <span>+{formatPrice(topping.extraUsd, topping.extraJpy)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-left">
                <div className="modal-price-display">
                  <span className="modal-price-label">{t.pricePerItem}</span>
                  <span className="modal-price-value">
                    {formatPrice(currentModalPrice.usd, currentModalPrice.jpy)}
                  </span>
                </div>
              </div>

              <button className="btn btn-secondary" onClick={() => setCustomizingItem(null)}>
                <span>{t.close}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
