document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const categoryView = document.getElementById('category-view');
    const itemsView = document.getElementById('items-view');
    const categoryGrid = document.getElementById('category-grid');
    const itemsGrid = document.getElementById('items-grid');
    const backBtn = document.getElementById('back-btn');
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = langToggleBtn.querySelector('.lang-text');
    const backBtnText = backBtn.querySelector('.text');
    const sectionTitle = document.getElementById('section-title');
    const body = document.body;

    // State
    let currentLang = 'en'; // 'en' or 'ar'
    let currentCategory = null; // null means viewing categories

    // Category Icons Mapping (Emojis)
    const categoryIcons = {
        "Juice": "🥤",
        "Hot Drinks": "☕",
        "Rice Items": "🍚",
        "Evening Snack": "🥟",
        "Bread Items": "🥐",
        "Tely Special": "⭐",
        "Vegetable Curry": "🥦",
        "Chicken Items": "🍗",
        "Beef Items": "🥩",
        "Soups": "🥣"
    };

    // Helper: Get unique categories
    function getCategories(lang) {
        const uniqueCategories = [];
        const seen = new Set();
        menuData.forEach(item => {
            const cat = lang === 'en' ? item.categoryEn : item.categoryAr;
            // We use English category as key for uniqueness to map icons easier
            const key = item.categoryEn;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueCategories.push({
                    key: key,
                    displayName: cat
                });
            }
        });
        return uniqueCategories;
    }

    // Helper: Get items for a category
    function getItemsForCategory(categoryKey, lang) {
        return menuData.filter(item => item.categoryEn === categoryKey).map(item => ({
            name: lang === 'en' ? item.nameEn : item.nameAr,
            price: item.price
        }));
    }

    // Render Categories
    function renderCategories() {
        categoryGrid.innerHTML = '';
        const categories = getCategories(currentLang);

        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            const icon = categoryIcons[cat.key] || "🍽️";

            card.innerHTML = `
                <span class="category-icon">${icon}</span>
                <span class="category-name">${cat.displayName}</span>
            `;

            card.addEventListener('click', () => {
                showItemsView(cat.key);
            });

            categoryGrid.appendChild(card);
        });
    }

    // Render Items
    function renderItems(categoryKey) {
        itemsGrid.innerHTML = '';
        const items = getItemsForCategory(categoryKey, currentLang);

        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'menu-item';
            itemEl.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} <span style="font-size:0.8em; font-weight:400;">OMR</span></span>
            `;
            itemsGrid.appendChild(itemEl);
        });
    }

    // View Navigation
    function showCategoryView() {
        currentCategory = null;
        itemsView.classList.add('hidden');
        categoryView.classList.remove('hidden');
        sectionTitle.textContent = currentLang === 'en' ? "Our Menu" : "قائمتنا";
        renderCategories();
        window.scrollTo(0, 0);
    }

    function showItemsView(categoryKey, catDisplayName) {
        currentCategory = categoryKey;
        if (!catDisplayName) {
            const catObj = getCategories(currentLang).find(c => c.key === categoryKey);
            catDisplayName = catObj ? catObj.displayName : categoryKey;
        }

        categoryView.classList.add('hidden');
        itemsView.classList.remove('hidden');
        sectionTitle.textContent = catDisplayName;
        renderItems(categoryKey);
        window.scrollTo(0, 0);
    }

    // History API Handling
    function navigateToCategory(categoryKey) {
        showItemsView(categoryKey);
        try {
            history.pushState({ view: 'items', category: categoryKey }, '', '#items');
        } catch (e) {
            console.warn('History API not supported or blocked:', e);
        }
    }

    function navigateToHome() {
        showCategoryView();
        // If we are navigating "back" historically, we might not want to pushState here if we are already coming from popstate.
        // But for initial load or manual "Home" button (if we had one), we might.
        // For the "Back" button which acts like browser back, we use history.back()
    }

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view === 'items') {
            showItemsView(event.state.category);
        } else {
            // Default to category view (Home)
            showCategoryView();
        }
    });

    // Language Toggle
    function toggleLanguage() {
        if (currentLang === 'en') {
            currentLang = 'ar';
            langText.textContent = 'English';
            backBtnText.textContent = 'العودة للقائمة';
            body.classList.add('rtl');
            document.documentElement.lang = 'ar';
        } else {
            currentLang = 'en';
            langText.textContent = 'العربية';
            backBtnText.textContent = 'Back to Categories';
            body.classList.remove('rtl');
            document.documentElement.lang = 'en';
        }

        // Update Hero Quote
        const heroQuote = document.querySelector('.hero-quote');
        if (heroQuote) {
            heroQuote.textContent = currentLang === 'en' ? heroQuote.dataset.en : heroQuote.dataset.ar;
        }

        // Refresh current view
        if (currentCategory) {
            showItemsView(currentCategory);
        } else {
            showCategoryView();
        }
    }

    // Listeners
    // Back button with robust fallback
    backBtn.addEventListener('click', () => {
        if (history.state && history.state.view === 'items') {
            history.back();
        } else {
            // Fallback if History API failed or state is missing/invalid
            showCategoryView();
            // Clean URL if needed
            try {
                if (window.location.hash === '#items') {
                    history.replaceState({ view: 'categories' }, '', ' ');
                }
            } catch (e) { }
        }
    });

    langToggleBtn.addEventListener('click', toggleLanguage);

    // Initial Load
    // Handle hash on load if someone shares a link (basic support)
    if (window.location.hash === '#items' && history.state && history.state.view === 'items') {
        showItemsView(history.state.category);
    } else {
        // Replace initial state to ensure we have a clean slate to go back to
        try {
            history.replaceState({ view: 'categories' }, '', ' ');
        } catch (e) {
            console.warn('History API not supported or blocked:', e);
        }
        showCategoryView();
    }
});
