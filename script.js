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
        renderCategories(); // Re-render to update language if needed
        // Scroll to top
        window.scrollTo(0, 0);
    }

    function showItemsView(categoryKey, catDisplayName) {
        currentCategory = categoryKey;
        // Find display name for title
        if (!catDisplayName) {
            const catObj = getCategories(currentLang).find(c => c.key === categoryKey);
            catDisplayName = catObj ? catObj.displayName : categoryKey;
        }

        categoryView.classList.add('hidden');
        itemsView.classList.remove('hidden');
        sectionTitle.textContent = catDisplayName;
        renderItems(categoryKey);
        // Scroll to top
        window.scrollTo(0, 0);
    }

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

        // Refresh current view
        if (currentCategory) {
            showItemsView(currentCategory);
        } else {
            showCategoryView();
        }
    }

    // Listeners
    backBtn.addEventListener('click', showCategoryView);
    langToggleBtn.addEventListener('click', toggleLanguage);

    // Initial Load
    showCategoryView();
});
