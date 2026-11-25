const ORDER_STORAGE_KEY = 'lunchOrder';
const CATEGORY_ORDER = ['soup', 'main', 'salad', 'drink', 'dessert'];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function loadSelection() {
  let stored = {};
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) stored = parsed;
  } catch (err) {
    console.error(err);
  }
  const result = {};
  CATEGORY_ORDER.forEach((category) => {
    result[category] = typeof stored[category] === 'string' ? stored[category] : null;
  });
  return result;
}

function saveSelection(selected) {
  const data = {};
  CATEGORY_ORDER.forEach((category) => {
    if (selected[category]) data[category] = selected[category].keyword;
  });
  try {
    if (Object.keys(data).length > 0) {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(ORDER_STORAGE_KEY);
    }
  } catch (err) {
    console.error(err);
  }
}

function clearSelection() {
  try {
    localStorage.removeItem(ORDER_STORAGE_KEY);
  } catch (err) {
    console.error(err);
  }
}

function restoreSelection() {
  const stored = loadSelection();
  const selected = {};
  CATEGORY_ORDER.forEach((category) => {
    selected[category] =
      dishes.find((dish) => dish.keyword === stored[category] && dish.category === category) || null;
  });
  saveSelection(selected);
  return selected;
}

function getMissingMessage(selected) {
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

function createDishCard(dish, action) {
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
  if (action === 'remove') {
    button.textContent = 'Удалить';
  } else {
    button.setAttribute('aria-pressed', 'false');
    button.append(el('span', 'add', 'Добавить'), el('span', 'added', 'Выбрано ✓'));
  }

  card.append(
    img,
    el('p', 'dish-price', `${dish.price} ₽`),
    el('p', 'dish-name', dish.name),
    el('p', 'dish-weight', dish.count),
    button
  );
  return card;
}

function showNotification(text) {
  const overlay = el('div', 'notification-overlay');
  const box = el('div', 'notification');
  const message = el('p', 'notification-text', text);
  const button = el('button', 'notification-btn', 'Окей');
  button.type = 'button';
  button.addEventListener('click', () => overlay.remove());
  box.append(message, button);
  overlay.append(box);
  document.body.append(overlay);
}
