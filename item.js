fetch("possessions_frozen_v2_generated.json")
  .then(res => res.json())
  .then(items => {
    const params = new URLSearchParams(window.location.search);
    const currentId = Number(params.get("id"));
    const category = params.get("category"); // may be null

    if (!currentId) return;

    // 🔑 decide navigation scope
    const scopedItems = category
      ? items.filter(i => i.category === category)
      : items;

    let currentIndex = scopedItems.findIndex(i => i.id === currentId);
    if (currentIndex === -1) return;

    const img = document.getElementById("image");
    const meta = document.getElementById("meta");

    function show(index) {
      const item = scopedItems[index];

      img.src = `images/${item.image}`;
      meta.textContent = category ? item.category : "";

      const url = new URL(window.location.href);
      url.searchParams.set("id", item.id);

      // only persist category if scoped
      if (category) {
        url.searchParams.set("category", category);
      } else {
        url.searchParams.delete("category");
      }

      history.replaceState(null, "", url.toString());
      currentIndex = index;
    }

    show(currentIndex);

    // ---------- CLICK NAV ----------
    document.getElementById("left-zone").onclick = () => {
      if (currentIndex > 0) show(currentIndex - 1);
    };

    document.getElementById("right-zone").onclick = () => {
      if (currentIndex < scopedItems.length - 1) show(currentIndex + 1);
    };

    // ---------- KEYBOARD NAV ----------
    window.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        show(currentIndex - 1);
      }

      if (e.key === "ArrowRight" && currentIndex < scopedItems.length - 1) {
        show(currentIndex + 1);
      }

      if (e.key === "Escape") {
        window.history.back();
      }
    });
  });

