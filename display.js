(() => {
  function displayDishes() {
    document.querySelectorAll('.dishes-grid').forEach((grid) => {
      grid.replaceChildren();
      dishes
        .filter((dish) => dish.category === grid.dataset.category)
        .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        .forEach((dish) => grid.append(createDishCard(dish, 'add')));
    });
  }

  function showLoadError() {
    document.querySelectorAll('.dishes-grid').forEach((grid) => {
      grid.replaceChildren(el('p', 'hint', 'Не удалось загрузить блюда. Попробуйте обновить страницу.'));
    });
  }

  dishesReady.then(displayDishes).catch((err) => {
    console.error(err);
    showLoadError();
  });
})();
