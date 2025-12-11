document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------
    // DOM ELEMENTS
    // ----------------------------------------------------------
    const categoryView = document.getElementById('category-view');
    const itemsView = document.getElementById('items-view');
    const categoryGrid = document.getElementById('category-grid');
    const itemsGrid = document.getElementById('items-grid');
    const backBtn = document.getElementById('back-btn');
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = langToggleBtn.querySelector('.lang-text');
    const backBtnText = backBtn.querySelector('.text');
    const sectionTitle = document.getElementById('section-title');
    const logoHome = document.getElementById('logo-home');
    const body = document.body;

    // ----------------------------------------------------------
    // STATE
    // ----------------------------------------------------------
    let currentLang = 'en';
    let currentCategory = null;

    // Emoji Icons
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

    // ----------------------------------------------------------
    // HELPERS
    // ----------------------------------------------------------
    function getCategories(lang) {
        const uniqueCategories = [];
        const seen = new Set();

        menuData.forEach(item => {
            const key = item.categoryEn;
            const display = lang === "en" ? item.categoryEn : item.categoryAr;

            if (!seen.has(key)) {
                seen.add(key);
                uniqueCategories.push({
                    key,
                    displayName: display
                });
            }
        });

        return uniqueCategories;
    }

    function getItemsForCategory(categoryKey, lang) {
        return menuData
            .filter(item => item.categoryEn === categoryKey)
            .map(item => ({
                name: lang === "en" ? item.nameEn : item.nameAr,
                price: item.price
            }));
    }

    // ----------------------------------------------------------
    // RENDERING
    // ----------------------------------------------------------
    function renderCategories() {
        categoryGrid.innerHTML = "";
        const categories = getCategories(currentLang);

        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = "category-card";

            const icon = categoryIcons[cat.key] || "🍽️";

            card.innerHTML = `
                <span class="category-icon">${icon}</span>
                <span class="category-name">${cat.displayName}</span>
            `;

            // Use navigateToCategory instead of direct view
            card.addEventListener('click', () => navigateToCategory(cat.key));

            categoryGrid.appendChild(card);
        });
    }

    function renderItems(categoryKey) {
        itemsGrid.innerHTML = "";
        const items = getItemsForCategory(categoryKey, currentLang);

        items.forEach(item => {
            const element = document.createElement('div');
            element.className = "menu-item";

            element.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} 
                    <span style="font-size:0.8em; font-weight:400;">OMR</span>
                </span>
            `;

            itemsGrid.appendChild(element);
        });
    }

    // ----------------------------------------------------------
    // VIEW SWITCHING
    // ----------------------------------------------------------
    function showCategoryView() {
        currentCategory = null;

        itemsView.classList.add('hidden');
        categoryView.classList.remove('hidden');

        sectionTitle.textContent = currentLang === "en" ? "Our Menu" : "قائمتنا";

        renderCategories();
        window.scrollTo(0, 0);
    }

    function showItemsView(categoryKey) {
        currentCategory = categoryKey;

        const catObj = getCategories(currentLang).find(c => c.key === categoryKey);
        const displayName = catObj ? catObj.displayName : categoryKey;

        categoryView.classList.add('hidden');
        itemsView.classList.remove('hidden');

        sectionTitle.textContent = displayName;

        renderItems(categoryKey);
        window.scrollTo(0, 0);
    }

    // ----------------------------------------------------------
    // HISTORY API
    // ----------------------------------------------------------
    function navigateToCategory(categoryKey) {
        showItemsView(categoryKey);

        try {
            history.pushState({ view: "items", category: categoryKey }, "", "#items");
        } catch (e) {
            console.warn("History API failed:", e);
        }
    }

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view === "items") {
            showItemsView(event.state.category);
        } else {
            showCategoryView();
        }
    });

    // ----------------------------------------------------------
    // LANGUAGE SWITCH
    // ----------------------------------------------------------
    function toggleLanguage() {
        if (currentLang === "en") {
            currentLang = "ar";
            langText.textContent = "English";
            backBtnText.textContent = "العودة للقائمة";
            body.classList.add('rtl');
            document.documentElement.lang = "ar";
        } else {
            currentLang = "en";
            langText.textContent = "العربية";
            backBtnText.textContent = "Back to Categories";
            body.classList.remove('rtl');
            document.documentElement.lang = "en";
        }

        // Update hero quote
        const quote = document.querySelector(".hero-quote");
        if (quote) {
            quote.textContent = quote.dataset[currentLang];
        }

        if (currentCategory) {
            showItemsView(currentCategory);
        } else {
            showCategoryView();
        }
    }

    langToggleBtn.addEventListener('click', toggleLanguage);

    // ----------------------------------------------------------
    // BACK BUTTON
    // ----------------------------------------------------------
    backBtn.addEventListener('click', () => {
        if (history.state && history.state.view === "items") {
            history.back();
        } else {
            showCategoryView();
        }
    });

    // ----------------------------------------------------------
    // SWIPE LEFT → GO BACK
    // ----------------------------------------------------------
    let startX = 0;
    let endX = 0;

    document.addEventListener("touchstart", (e) => {
        startX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].screenX;

        if (startX - endX > 60) {
            if (currentCategory) {
                if (history.state && history.state.view === "items") {
                    history.back();
                } else {
                    showCategoryView();
                }
            }
        }
    });

    // ----------------------------------------------------------
    // LOGO CLICK → GO HOME
    // ----------------------------------------------------------
    if (logoHome) {
        logoHome.style.cursor = "pointer";

        logoHome.addEventListener("click", () => {
            showCategoryView();

            try {
                history.pushState({ view: "categories" }, "", " ");
            } catch (e) {}
        });
    }

    // ----------------------------------------------------------
    // INITIAL LOAD
    // ----------------------------------------------------------
    try {
        history.replaceState({ view: "categories" }, "", " ");
    } catch (e) {}

    showCategoryView();
});
