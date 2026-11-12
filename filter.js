(() => {
  function applyFilter(category, kind) {
    const grid = document.querySelector(`.dishes-grid[data-category="${category}"]`);
    grid.querySelectorAll('.dish').forEach((card) => {
      card.hidden = kind !== null && card.dataset.kind !== kind;
    });
  }

  document.querySelectorAll('.filters').forEach((block) => {
    const category = block.dataset.category;

    block.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const wasActive = btn.classList.contains('active');
      block.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));

      if (wasActive) {
        applyFilter(category, null);
      } else {
        btn.classList.add('active');
        applyFilter(category, btn.dataset.kind);
      }
    });
  });
})();
