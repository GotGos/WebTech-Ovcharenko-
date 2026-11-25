(() => {
  const CHECKOUT_URL = 'checkout.html';

  const main = document.querySelector('main');
  const panel = document.getElementById('checkout-panel');
  const totalEl = document.getElementById('panel-total');
  const hintEl = document.getElementById('panel-hint');
  const link = document.getElementById('checkout-link');

  let selected = { soup: null, main: null, salad: null, drink: null, dessert: null };

  function render() {
    const picked = Object.values(selected).filter(Boolean);
    const total = picked.reduce((sum, dish) => sum + dish.price, 0);

    panel.hidden = picked.length === 0;
    totalEl.textContent = `${total} ₽`;

    const message = getMissingMessage(selected);
    if (message === null) {
      link.href = CHECKOUT_URL;
      link.classList.remove('disabled');
      link.removeAttribute('aria-disabled');
      hintEl.hidden = true;
    } else {
      link.removeAttribute('href');
      link.classList.add('disabled');
      link.setAttribute('aria-disabled', 'true');
      hintEl.textContent = message;
      hintEl.hidden = false;
    }

    const chosen = picked.map((dish) => dish.keyword);
    document.querySelectorAll('.dish').forEach((card) => {
      const isSelected = chosen.includes(card.dataset.dish);
      card.classList.toggle('is-selected', isSelected);
      const button = card.querySelector('.dish-button');
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  main.addEventListener('click', (e) => {
    const button = e.target.closest('.dish-button');
    if (!button) return;
    const dish = dishes.find((d) => d.keyword === button.closest('.dish').dataset.dish);
    if (!dish) return;
    selected[dish.category] = dish;
    saveSelection(selected);
    render();
  });

  link.addEventListener('click', (e) => {
    if (link.classList.contains('disabled')) e.preventDefault();
  });

  dishesReady
    .then(() => {
      selected = restoreSelection();
      render();
    })
    .catch((err) => console.error(err));

  render();
})();
