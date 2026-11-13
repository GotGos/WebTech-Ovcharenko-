const MEALDB = 'https://www.themealdb.com/api/json/v1/1';
const COCKTAILDB = 'https://www.thecocktaildb.com/api/json/v1/1';

const PER_GROUP = 3;
const MEAT_CATEGORIES = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Goat'];
const MAIN_SOURCES = [
  { apiCategory: 'Seafood', kind: 'fish' },
  { apiCategory: 'Beef', kind: 'meat' },
  { apiCategory: 'Vegetarian', kind: 'veg' },
];
const HOT_DRINK_PATTERN = /coffee|\btea\b|chocolate|cocoa|latte|mocha|cappuccino|chai/i;
const DESSERT_SIZES = ['small', 'medium', 'large'];

let dishes = [];

async function getList(url, field) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка запроса ${response.status}: ${url}`);
    }
    const data = await response.json();
    return Array.isArray(data[field]) ? data[field] : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

function mealKind(apiCategory) {
  if (apiCategory === 'Seafood') return 'fish';
  if (MEAT_CATEGORIES.includes(apiCategory)) return 'meat';
  return 'veg';
}

function describe(category, kind, id) {
  const n = Number(id) || 0;
  const step = n % 9;

  if (category === 'soup') return { price: 190 + step * 10, count: `${280 + (n % 5) * 10} г` };
  if (category === 'main') return { price: 290 + step * 10, count: `${250 + (n % 5) * 10} г` };
  if (category === 'salad') return { price: 200 + step * 10, count: `${180 + (n % 5) * 10} г` };
  if (category === 'drink') {
    return kind === 'hot'
      ? { price: 90 + step * 10, count: '250 мл' }
      : { price: 80 + step * 10, count: '300 мл' };
  }

  const sizes = {
    small: { price: 120, count: '60 г' },
    medium: { price: 230, count: '125 г' },
    large: { price: 420, count: '250 г' },
  };
  const size = sizes[kind];
  return { price: size.price + step * 5, count: size.count };
}

function toDish({ prefix, id, name, image, category, kind }) {
  const { price, count } = describe(category, kind, id);
  return { keyword: `${prefix}-${id}`, name, image, category, kind, price, count };
}

function mealToDish(meal, category, kind) {
  return toDish({
    prefix: 'meal',
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category,
    kind: kind || mealKind(meal.strCategory),
  });
}

function drinkToDish(drink, kind) {
  return toDish({
    prefix: 'drink',
    id: drink.idDrink,
    name: drink.strDrink,
    image: drink.strDrinkThumb,
    category: 'drink',
    kind,
  });
}

async function loadDishes() {
  const [soups, salads, desserts, nonAlcoholic, coffeeTea, cocoa, ...mainLists] = await Promise.all([
    getList(`${MEALDB}/search.php?s=soup`, 'meals'),
    getList(`${MEALDB}/search.php?s=salad`, 'meals'),
    getList(`${MEALDB}/filter.php?c=Dessert`, 'meals'),
    getList(`${COCKTAILDB}/filter.php?a=Non_Alcoholic`, 'drinks'),
    getList(`${COCKTAILDB}/filter.php?c=Coffee_/_Tea`, 'drinks'),
    getList(`${COCKTAILDB}/filter.php?c=Cocoa`, 'drinks'),
    ...MAIN_SOURCES.map(({ apiCategory }) => getList(`${MEALDB}/filter.php?c=${apiCategory}`, 'meals')),
  ]);

  const hotIds = new Set([...coffeeTea, ...cocoa].map((drink) => drink.idDrink));
  const isHot = (drink) => hotIds.has(drink.idDrink) || HOT_DRINK_PATTERN.test(drink.strDrink);
  const hotDrinks = nonAlcoholic.filter(isHot).slice(0, PER_GROUP);
  const coldDrinks = nonAlcoholic.filter((drink) => !isHot(drink)).slice(0, PER_GROUP);

  const result = [
    ...soups.slice(0, PER_GROUP * 3).map((meal) => mealToDish(meal, 'soup')),
    ...MAIN_SOURCES.flatMap(({ kind }, i) =>
      mainLists[i].slice(0, PER_GROUP).map((meal) => mealToDish(meal, 'main', kind))
    ),
    ...salads.slice(0, PER_GROUP * 3).map((meal) => mealToDish(meal, 'salad')),
    ...coldDrinks.map((drink) => drinkToDish(drink, 'cold')),
    ...hotDrinks.map((drink) => drinkToDish(drink, 'hot')),
    ...desserts
      .slice(0, PER_GROUP * 3)
      .map((meal) => mealToDish(meal, 'dessert', DESSERT_SIZES[Number(meal.idMeal) % 3])),
  ];

  const seen = new Set();
  dishes = result.filter((dish) => {
    if (seen.has(dish.keyword)) return false;
    seen.add(dish.keyword);
    return true;
  });

  if (dishes.length === 0) {
    throw new Error('API не вернул ни одного блюда');
  }
  return dishes;
}
