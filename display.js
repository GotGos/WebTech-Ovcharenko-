(() => {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createDishCard(dish) {
    const card = el('div', 'dish');
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;

    const img = el('img');
    img.src = dish.image;
    img.alt = dish.name;
    img.width = 600;
    img.height = 600;

    const button = el('button', 'dish-button');
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.append(el('span', 'add', 'Добавить'), el('span', 'added', 'Выбрано ✓'));

    card.append(
      img,
      el('p', 'dish-price', `${dish.price} ₽`),
      el('p', 'dish-name', dish.name),
      el('p', 'dish-weight', dish.count),
      button
    );
    return card;
  }

  function displayDishes() {
    document.querySelectorAll('.dishes-grid').forEach((grid) => {
      grid.replaceChildren();
      dishes
        .filter((dish) => dish.category === grid.dataset.category)
        .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        .forEach((dish) => grid.append(createDishCard(dish)));
    });
  }

  function showLoadError() {
    document.querySelectorAll('.dishes-grid').forEach((grid) => {
      grid.replaceChildren(el('p', 'hint', 'Не удалось загрузить блюда. Попробуйте обновить страницу.'));
    });
  }

  loadDishes().then(displayDishes).catch((err) => {
    console.error(err);
    showLoadError();
  });
})();
