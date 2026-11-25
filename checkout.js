(() => {
  const ORDER_URL = 'https://httpbin.org/post';
  const ID_FIELDS = {
    soup: 'soup_id',
    main: 'main_course_id',
    salad: 'salad_id',
    drink: 'drink_id',
    dessert: 'dessert_id',
  };

  const grid = document.getElementById('order-dishes');
  const emptyMessage = document.getElementById('order-empty');
  const form = document.getElementById('order-form');
  const submitButton = form.querySelector('.btn-submit');
  const timeInput = document.getElementById('delivery-time');
  const totalBlock = form.querySelector('.summary-total');
  const totalEl = form.querySelector('.total-sum');

  const groups = {};
  form.querySelectorAll('.pick-group').forEach((group) => {
    groups[group.dataset.category] = {
      empty: group.querySelector('.pick-empty'),
      pick: group.querySelector('.pick'),
      text: group.querySelector('.pick-text'),
      price: group.querySelector('.pick-price'),
    };
  });

  let selected = { soup: null, main: null, salad: null, drink: null, dessert: null };

  function render() {
    const picked = CATEGORY_ORDER.map((category) => selected[category]).filter(Boolean);
    const total = picked.reduce((sum, dish) => sum + dish.price, 0);

    grid.replaceChildren(...picked.map((dish) => createDishCard(dish, 'remove')));
    grid.hidden = picked.length === 0;
    emptyMessage.hidden = picked.length > 0;

    for (const [category, ui] of Object.entries(groups)) {
      const dish = selected[category];
      ui.empty.hidden = !!dish;
      ui.pick.hidden = !dish;
      if (dish) {
        ui.text.textContent = dish.name;
        ui.price.textContent = `${dish.price} ₽`;
      }
    }

    totalBlock.hidden = picked.length === 0;
    totalEl.textContent = `${total} ₽`;
  }

  grid.addEventListener('click', (e) => {
    const button = e.target.closest('.dish-button');
    if (!button) return;
    const keyword = button.closest('.dish').dataset.dish;
    for (const category of CATEGORY_ORDER) {
      if (selected[category] && selected[category].keyword === keyword) selected[category] = null;
    }
    saveSelection(selected);
    render();
  });

  function syncDelivery() {
    const scheduled = form.elements.delivery.value === 'scheduled';
    timeInput.disabled = !scheduled;
    timeInput.required = scheduled;
  }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'delivery') syncDelivery();
  });

  form.addEventListener('reset', () => setTimeout(syncDelivery, 0));

  function buildPayload() {
    const data = new FormData(form);
    const scheduled = data.get('delivery') === 'scheduled';
    const payload = {
      full_name: data.get('name'),
      email: data.get('email'),
      subscribe: data.get('promo') ? 1 : 0,
      phone: data.get('phone'),
      delivery_address: data.get('address'),
      delivery_type: scheduled ? 'by_time' : 'now',
      comment: data.get('comment') || '',
    };
    if (scheduled) payload.delivery_time = data.get('delivery_time');
    for (const [category, field] of Object.entries(ID_FIELDS)) {
      const dish = selected[category];
      if (dish) payload[field] = Number(dish.keyword.split('-')[1]);
    }
    return payload;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = getMissingMessage(selected);
    if (message !== null) {
      showNotification(message);
      return;
    }

    submitButton.disabled = true;
    try {
      const response = await fetch(ORDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!response.ok) {
        throw new Error(`Ошибка запроса ${response.status}`);
      }
      await response.json();

      clearSelection();
      selected = { soup: null, main: null, salad: null, drink: null, dessert: null };
      form.reset();
      render();
      showNotification('Заказ успешно оформлен');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось оформить заказ. Попробуйте ещё раз позже');
    } finally {
      submitButton.disabled = false;
    }
  });

  syncDelivery();

  dishesReady
    .then(() => {
      selected = restoreSelection();
      render();
    })
    .catch((err) => {
      console.error(err);
      emptyMessage.hidden = true;
      grid.hidden = false;
      grid.replaceChildren(el('p', 'hint', 'Не удалось загрузить блюда. Попробуйте обновить страницу.'));
    });
})();
