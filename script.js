fetch("possessions_frozen_v2_generated.json")
  .then(res => res.json())
  .then(items => {
    const grid = document.getElementById("grid");
    const filters = document.getElementById("filters");

    const categories = [...new Set(items.map(i => i.category))];

    // track current context (null = ALL)
    let activeCategory = null;

    const clothingOrder = [
      "t-shirts",
      "shirts",
      "tops",
      "pants",
      "shorts",
      "sweaters",
      "jackets",
      "shoes",
      "socks",
      "underwear",
      "accessories"
    ];

    // normalize for css class names
    const normalize = str =>
      str.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

    function getFilteredItems(category) {
      if (category !== "clothing") {
        return items.filter(i => i.category === category);
      }

      return items
        .filter(i => i.category === "clothing")
        .sort((a, b) => {
          const aIndex = clothingOrder.indexOf(a.subcategory?.trim());
          const bIndex = clothingOrder.indexOf(b.subcategory?.trim());

          return (aIndex === -1 ? 999 : aIndex) -
                 (bIndex === -1 ? 999 : bIndex);
        });
    }

    // ---------- FILTER BUTTONS ----------

    const allBtn = document.createElement("button");
    allBtn.textContent = "all";
    allBtn.classList.add("all");
    allBtn.onclick = () => {
      activeCategory = null;
      render(items);
    };
    filters.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.classList.add(normalize(cat));
      btn.onclick = () => {
        activeCategory = cat;
        render(getFilteredItems(cat));
      };
      filters.appendChild(btn);
    });

    // ---------- GRID RENDER ----------

    function render(list) {
      grid.innerHTML = "";

      list.forEach(item => {
        const img = document.createElement("img");
        img.src = `images/${item.image}`;
        img.alt = item.title;
        img.loading = "lazy";

// inside render(list) -> img.onclick
img.onclick = () => {
  sessionStorage.setItem("gridScrollY", window.scrollY);

  // Build a relative URL so it respects the repo basename on GitHub Pages
  let href = `./item.html?id=${encodeURIComponent(item.id)}`;

  // ONLY pass category if we are in a category view
  if (activeCategory) {
    href += `&category=${encodeURIComponent(activeCategory)}`;
  }

  window.location.href = href;
};

        grid.appendChild(img);
      });
    }

    // ---------- INITIAL RENDER ----------

    render(items);

    // ---------- RESTORE SCROLL ----------

    const savedScroll = sessionStorage.getItem("gridScrollY");
    if (savedScroll !== null) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(savedScroll));
        sessionStorage.removeItem("gridScrollY");
      });
    }
  });

