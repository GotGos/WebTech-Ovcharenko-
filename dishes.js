const dishes = [
  // Супы
  { keyword: 'pumpkin-soup',        name: 'Крем-суп из тыквы',               price: 210, category: 'soup',    kind: 'veg',    count: '300 г',  image: 'pumpkin-soup' },
  { keyword: 'gazpacho',            name: 'Гаспачо',                         price: 220, category: 'soup',    kind: 'veg',    count: '300 г',  image: 'gazpacho' },
  { keyword: 'borscht',             name: 'Борщ с говядиной',                price: 240, category: 'soup',    kind: 'meat',   count: '300 г',  image: 'borch' },
  { keyword: 'chicken-noodle-soup', name: 'Куриный суп с домашней лапшой',   price: 190, category: 'soup',    kind: 'meat',   count: '300 г',  image: 'soup-chiken' },
  { keyword: 'ukha',                name: 'Уха из лосося',                   price: 280, category: 'soup',    kind: 'fish',   count: '300 г',  image: 'ukha' },
  { keyword: 'creamy-trout-soup',   name: 'Сливочный суп с форелью',         price: 300, category: 'soup',    kind: 'fish',   count: '300 г',  image: 'fish-soup-cream' },

  // Главные блюда
  { keyword: 'chicken-cutlet',      name: 'Куриная котлета с гречкой',       price: 320, category: 'main',    kind: 'meat',   count: '250 г',  image: 'kotleti-s-grechkoi' },
  { keyword: 'beef-plov',           name: 'Плов с говядиной',                price: 350, category: 'main',    kind: 'meat',   count: '300 г',  image: 'plov-s-goviadinoi' },
  { keyword: 'salmon-pasta',        name: 'Паста с лососем и шпинатом',      price: 390, category: 'main',    kind: 'fish',   count: '280 г',  image: 'losos-i-shpinat' },
  { keyword: 'baked-trout',         name: 'Запечённая форель с картофелем',  price: 420, category: 'main',    kind: 'fish',   count: '270 г',  image: 'baked-trout' },
  { keyword: 'vegetable-stew',      name: 'Овощное рагу с нутом',            price: 290, category: 'main',    kind: 'veg',    count: '300 г',  image: 'vegetable-stew' },
  { keyword: 'mushroom-risotto',    name: 'Грибное ризотто',                 price: 340, category: 'main',    kind: 'veg',    count: '280 г',  image: 'mushroom-risotto' },

  // Салаты и стартеры
  { keyword: 'salmon-salad',        name: 'Салат с копчёным лососем',        price: 360, category: 'salad',   kind: 'fish',   count: '200 г',  image: 'salmon-salad' },
  { keyword: 'chicken-caesar',      name: 'Цезарь с курицей',                price: 330, category: 'salad',   kind: 'meat',   count: '220 г',  image: 'chicken-caesar' },
  { keyword: 'greek-salad',         name: 'Греческий салат',                 price: 270, category: 'salad',   kind: 'veg',    count: '230 г',  image: 'greek-salad' },
  { keyword: 'caprese',             name: 'Капрезе',                         price: 290, category: 'salad',   kind: 'veg',    count: '180 г',  image: 'caprese' },
  { keyword: 'beet-walnut-salad',   name: 'Салат из свёклы с грецким орехом', price: 220, category: 'salad',  kind: 'veg',    count: '180 г',  image: 'beet-walnut-salad' },
  { keyword: 'fresh-veg-salad',     name: 'Салат из свежих овощей',          price: 200, category: 'salad',   kind: 'veg',    count: '200 г',  image: 'fresh-veg-salad' },

  //  Напитки
  { keyword: 'orange-juice',        name: 'Апельсиновый сок',                price: 120, category: 'drink',   kind: 'cold',   count: '300 мл', image: 'orange-sok' },
  { keyword: 'apple-juice',         name: 'Яблочный сок',                    price: 90,  category: 'drink',   kind: 'cold',   count: '300 мл', image: 'drink-apple' },
  { keyword: 'carrot-juice',        name: 'Морковный сок',                   price: 110, category: 'drink',   kind: 'cold',   count: '300 мл', image: 'drink-carrot' },
  { keyword: 'black-tea',           name: 'Чёрный чай',                      price: 80,  category: 'drink',   kind: 'hot',    count: '300 мл', image: 'black-tea' },
  { keyword: 'cappuccino',          name: 'Капучино',                        price: 150, category: 'drink',   kind: 'hot',    count: '250 мл', image: 'cappuccino' },
  { keyword: 'hot-chocolate',       name: 'Горячий шоколад',                 price: 170, category: 'drink',   kind: 'hot',    count: '250 мл', image: 'hot-chocolate' },

  //  Десерты
  { keyword: 'macarons',            name: 'Макаруны',                        price: 140, category: 'dessert', kind: 'small',  count: '60 г',   image: 'macarons' },
  { keyword: 'truffles',            name: 'Шоколадные трюфели',              price: 130, category: 'dessert', kind: 'small',  count: '50 г',   image: 'truffles' },
  { keyword: 'mini-eclair',         name: 'Мини-эклер',                      price: 120, category: 'dessert', kind: 'small',  count: '70 г',   image: 'mini-eclair' },
  { keyword: 'cheesecake',          name: 'Чизкейк Нью-Йорк',                price: 230, category: 'dessert', kind: 'medium', count: '125 г',  image: 'cheesecake' },
  { keyword: 'tiramisu',            name: 'Тирамису',                        price: 250, category: 'dessert', kind: 'medium', count: '140 г',  image: 'tiramisu' },
  { keyword: 'napoleon-cake',       name: 'Торт Наполеон',                   price: 420, category: 'dessert', kind: 'large',  count: '250 г',  image: 'napoleon-cake' },
];
