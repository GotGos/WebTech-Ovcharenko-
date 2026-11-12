(() => {
  const FIELD_NAMES = { soup: 'soup', main: 'main_dish', salad: 'salad', drink: 'drink', dessert: 'dessert' };

  const main = document.querySelector('main');
  const form = document.getElementById('order-form');
  const emptyMessage = document.querySelector('.summary-empty');
  const totalBlock = document.querySelector('.summary-total');
  const totalEl = document.querySelector('.total-sum');

  const selected = { soup: null, main: null, salad: null, drink: null, dessert: null };

  const groups = {};
  document.querySelectorAll('.pick-group').forEach((group) => {
    groups[group.dataset.category] = {
      group,
      empty: group.querySelector('.pick-empty'),
      pick: group.querySelector('.pick'),
      text: group.querySelector('.pick-text'),
      remove: group.querySelector('.remove'),
    };
  });

  function render() {
    const hasAny = Object.values(selected).some((dish) => dish !== null);
    let total = 0;

    emptyMessage.hidden = hasAny;
    totalBlock.hidden = !hasAny;

    for (const [category, ui] of Object.entries(groups)) {
      const dish = selected[category];
      ui.group.hidden = !hasAny;
      ui.empty.hidden = !!dish;
      ui.pick.hidden = !dish;
      if (dish) {
        ui.text.textContent = `${dish.name} — ${dish.price} ₽`;
        total += dish.price;
      }
    }
    totalEl.textContent = `${total} ₽`;

    const chosen = Object.values(selected).filter(Boolean).map((dish) => dish.keyword);
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
    const keyword = button.closest('.dish').dataset.dish;
    const dish = dishes.find((d) => d.keyword === keyword);
    selected[dish.category] = dish;
    render();
  });

  for (const [category, ui] of Object.entries(groups)) {
    ui.remove.addEventListener('click', () => {
      selected[category] = null;
      render();
    });
  }

  form.addEventListener('reset', () => {
    for (const category of Object.keys(selected)) selected[category] = null;
    render();
  });

  form.addEventListener('formdata', (e) => {
    for (const [category, field] of Object.entries(FIELD_NAMES)) {
      e.formData.set(field, selected[category] ? selected[category].keyword : '');
    }
  });

  function showNotification(text) {
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';

    const box = document.createElement('div');
    box.className = 'notification';

    const message = document.createElement('p');
    message.className = 'notification-text';
    message.textContent = text;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'notification-btn';
    button.textContent = 'Окей';
    button.addEventListener('click', () => overlay.remove());

    box.append(message, button);
    overlay.append(box);
    document.body.append(overlay);
  }

  function getMissingMessage() {
    const hasSoup = selected.soup !== null;
    const hasMain = selected.main !== null;
    const hasSalad = selected.salad !== null;
    const hasDrink = selected.drink !== null;
    const hasDessert = selected.dessert !== null;

    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
      return 'Ничего не выбрано. Выберите блюда для заказа';
    }

    if (hasMain || (hasSoup && hasSalad)) {
      if (!hasDrink) return 'Выберите напиток';
      return null;
    }

    if (hasSoup) return 'Выберите главное блюдо/салат/стартер';
    if (hasSalad) return 'Выберите суп или главное блюдо';
    return 'Выберите главное блюдо';
  }

  form.addEventListener('submit', (e) => {
    const message = getMissingMessage();
    if (message !== null) {
      e.preventDefault();
      showNotification(message);
    }
  });

  render();
})();
