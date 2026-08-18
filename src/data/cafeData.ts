import { MenuItem, MenuCategory, Review, GalleryItem, StatItem } from '../types';

export const RESTAURANT_INFO = {
  name: "Chacha Cafe",
  tagline: "Delicious Ice Cream & Fresh Cakes Daily Available Here!",
  shortDesc: "Kiratpur's premier cafe & dining spot offering delicious ice cream, fresh cakes, woodfired pizzas, gourmet burgers, shakes, cold coffee & Chinese delicacies on Manadwar Road.",
  address: "Manadwar Road, Kiratpur, Taqarubpur Israj Kheri, Uttar Pradesh 246731, India",
  phone: "+91 86503 67876",
  whatsapp: "+918650367876",
  email: "reservations@chachacafe.com",
  instagram: "https://www.instagram.com/aayanwebhit/?utm_source=chatgpt.com",
  googleRating: 4.9,
  googleReviewsCount: 1280,
  openingHours: "Monday – Sunday: 8:00 AM – 11:00 PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3460.518777123456!2d78.5280!3d29.7490!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjlcdegreeNDQnNTYuNCJOIDc4X2RlZ3JlZTMxJzQwLjgiRQ!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const MENU_CATEGORIES: MenuCategory[] = [
  'Combos',
  'Pizza',
  'Burger',
  'Sandwich',
  'Chinese',
  'Shakes',
  'Lassi',
  'Cold Coffee',
  'Hot Coffee',
  'Mojito',
  'Fruit Juice',
  'Desserts'
];

export const MENU_ITEMS: MenuItem[] = [
  // COMBOS
  {
    id: 'c1',
    name: 'Combo 1 (Cheese Pizza + Cold Drink + French Fries)',
    category: 'Combos',
    price: 299,
    rating: 4.9,
    reviewsCount: 184,
    description: '1 Fresh Cheese Pizza + 1 Chilled Cold Drink + 1 Crispy French Fries portion.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    isChefSpecial: true,
    prepTime: '15 mins',
    tags: ['Best Value', 'Bestseller']
  },
  {
    id: 'c2',
    name: 'Combo 2 (French Fries + Burger + Cold Coffee)',
    category: 'Combos',
    price: 249,
    rating: 4.85,
    reviewsCount: 156,
    description: '1 Crispy French Fries + 1 Delicious Burger + 1 Creamy Cold Coffee.',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    prepTime: '12 mins',
    tags: ['Value Deal']
  },
  {
    id: 'c3',
    name: 'Combo 3 (Sandwich + French Fries + Mojito)',
    category: 'Combos',
    price: 233,
    rating: 4.8,
    reviewsCount: 120,
    description: '1 Fresh Grilled Sandwich + 1 Portion French Fries + 1 Refreshing Chilled Mojito.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    prepTime: '10 mins',
    tags: ['Refresh Combo']
  },

  // PIZZA - CLASSIC
  {
    id: 'p_classic_1',
    name: 'Sweet Corn Pizza',
    category: 'Pizza',
    price: 130,
    rating: 4.8,
    reviewsCount: 95,
    description: 'Loaded with juicy sweet corn kernels on molten mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Classic']
  },
  {
    id: 'p_classic_2',
    name: 'Onion Pizza',
    category: 'Pizza',
    price: 130,
    rating: 4.75,
    reviewsCount: 88,
    description: 'Crunchy sliced onions with Italian seasoning and melted cheese.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Classic']
  },
  {
    id: 'p_classic_3',
    name: 'Tomato Pizza',
    category: 'Pizza',
    price: 140,
    rating: 4.7,
    reviewsCount: 64,
    description: 'Fresh juicy sliced tomatoes with signature herb blend.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Classic']
  },
  {
    id: 'p_classic_4',
    name: 'Capsicum Pizza',
    category: 'Pizza',
    price: 130,
    rating: 4.7,
    reviewsCount: 72,
    description: 'Crisp green capsicum slices on baked mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Classic']
  },
  {
    id: 'p_classic_5',
    name: 'Onion & Capsicum Pizza',
    category: 'Pizza',
    price: 130,
    rating: 4.8,
    reviewsCount: 110,
    description: 'Fresh crisp onions paired with green capsicum on a cheesy base.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Classic Duo']
  },
  {
    id: 'p_classic_6',
    name: 'Onion & Paneer Pizza',
    category: 'Pizza',
    price: 159,
    rating: 4.85,
    reviewsCount: 140,
    description: 'Soft cottage cheese cubes and crunchy onions.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Popular']
  },
  {
    id: 'p_classic_7',
    name: 'Capsicum & Paneer Pizza',
    category: 'Pizza',
    price: 159,
    rating: 4.8,
    reviewsCount: 125,
    description: 'Fresh capsicum and marinated paneer cubes.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Popular']
  },
  {
    id: 'p_classic_8',
    name: 'Capsicum, Paneer & Red Paprika Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.9,
    reviewsCount: 150,
    description: 'Loaded with capsicum, paneer cubes, and zesty red paprika.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Recommended']
  },

  // PIZZA - BASIC CATEGORY
  {
    id: 'p_basic_1',
    name: 'Margherita (Simply Cheese)',
    category: 'Pizza',
    price: 179,
    rating: 4.9,
    reviewsCount: 210,
    description: '100% Mozzarella cheese with rich tomato sauce and oregano.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Cheese Lover']
  },
  {
    id: 'p_basic_2',
    name: 'Barcelona Street Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.8,
    reviewsCount: 98,
    description: 'Crunchy onions, green capsicum, and golden sweet corn.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_basic_3',
    name: 'Country Special Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.8,
    reviewsCount: 90,
    description: 'Tangy pineapple, soft paneer, and sweet corn.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_basic_4',
    name: 'London Lovers Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.85,
    reviewsCount: 115,
    description: 'Sliced onions, crisp capsicum & fresh paneer cubes.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_basic_5',
    name: 'Toronto Garden Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.75,
    reviewsCount: 82,
    description: 'Crisp onions, green capsicum, and fresh tomato slices.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_basic_6',
    name: 'Houston Delight Pizza',
    category: 'Pizza',
    price: 179,
    rating: 4.85,
    reviewsCount: 104,
    description: 'Sliced jalapenos, button mushrooms & black olives.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // PIZZA - TRADITIONAL CATEGORY
  {
    id: 'p_trad_1',
    name: 'Indie Paneer Special Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.95,
    reviewsCount: 190,
    description: 'Tandoori paneer, capsicum, red paprika topped with mint mayo.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    isPopular: true,
    tags: ['Tandoori Special']
  },
  {
    id: 'p_trad_2',
    name: 'Tandoori Paneer Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.9,
    reviewsCount: 165,
    description: 'Exotic paneer, onion, capsicum, red paprika in jalapeno dip.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_trad_3',
    name: 'Garden Fresh Veggie Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.85,
    reviewsCount: 130,
    description: 'Onions, capsicum, mushrooms, and tomatoes.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_trad_4',
    name: 'San Diego Coast Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.8,
    reviewsCount: 110,
    description: 'Black olives, mushrooms, jalapenos & capsicum in cheesy sauce.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_trad_5',
    name: 'Farm House Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.9,
    reviewsCount: 175,
    description: 'Capsicum, tomatoes, paneer, red paprika in tandoori dip.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'p_trad_6',
    name: 'Paneer Royale Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.85,
    reviewsCount: 140,
    description: 'Onion, capsicum, paneer tikka, red paprika in 1000 Island dip.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_trad_7',
    name: 'Spicy Grill Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.88,
    reviewsCount: 125,
    description: 'Tongue twisting chilly dip, jalapenos, mushrooms, olives & capsicum.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Spicy']
  },
  {
    id: 'p_trad_8',
    name: 'Mango Treat Unique Pizza',
    category: 'Pizza',
    price: 180,
    rating: 4.92,
    reviewsCount: 155,
    description: 'Paneer, capsicum, sweet corn, sun dried tomatoes with real mango puree on base.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    tags: ['Chef Special']
  },

  // PIZZA - GOURMET CATEGORY
  {
    id: 'p_gourmet_1',
    name: 'New York Special Signature Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.95,
    reviewsCount: 210,
    description: 'Onion, capsicum, red paprika, Colby & orange cheddar cheese.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    isPopular: true,
    tags: ['Signature']
  },
  {
    id: 'p_gourmet_2',
    name: 'Miami Islands Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.88,
    reviewsCount: 135,
    description: 'Black olives, paneer, red paprika, tomatoes, capsicum, cheese sauce, jalapeno dip.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_gourmet_3',
    name: 'Mallorca Street 5-Cheese Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.95,
    reviewsCount: 198,
    description: 'Orange cheese, mozzarella, white cheese, cream cheese & English cheese.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Extra Cheese']
  },
  {
    id: 'p_gourmet_4',
    name: 'Peri Peri Veg Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.9,
    reviewsCount: 160,
    description: 'Onion, capsicum, mushrooms, paneer, red paprika, topped with spicy peri peri mayo.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Spicy']
  },
  {
    id: 'p_gourmet_5',
    name: 'Pesto Special Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.89,
    reviewsCount: 110,
    description: 'Sun dried tomatoes, onion, capsicum, mushroom, olives with pesto dip.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'p_gourmet_6',
    name: 'Nacho Blast Must Try Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.96,
    reviewsCount: 220,
    description: 'Capsicum, kidney beans, sun dried tomatoes, nachos in cheese sauce, topped with cheesy nacho sauce.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Must Try']
  },
  {
    id: 'p_gourmet_7',
    name: 'Veggie Blast Extra Cheese Pizza',
    category: 'Pizza',
    price: 229,
    rating: 4.92,
    reviewsCount: 180,
    description: 'All vegetarian toppings with double extra mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // BURGER & SANDWICH
  {
    id: 'burg_1',
    name: 'Plain Burger',
    category: 'Burger',
    price: 40,
    rating: 4.7,
    reviewsCount: 130,
    description: 'Classic potato veg patty with fresh lettuce and house burger sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'burg_2',
    name: 'Tandoori Burger',
    category: 'Burger',
    price: 50,
    rating: 4.8,
    reviewsCount: 145,
    description: 'Spiced patty layered with rich tandoori sauce and onions.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'burg_3',
    name: 'Cheese Burger',
    category: 'Burger',
    price: 60,
    rating: 4.82,
    reviewsCount: 160,
    description: 'Crispy patty topped with melted cheese slice and mayo.',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'burg_4',
    name: 'Paneer Burger',
    category: 'Burger',
    price: 60,
    rating: 4.85,
    reviewsCount: 175,
    description: 'Golden fried paneer patty with spicy mayonnaise.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'burg_5',
    name: 'Double Cheese Burger',
    category: 'Burger',
    price: 79,
    rating: 4.88,
    reviewsCount: 190,
    description: 'Double cheese slices over crispy vegetable patty.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'burg_6',
    name: 'Paneer Cheese Burger',
    category: 'Burger',
    price: 89,
    rating: 4.9,
    reviewsCount: 205,
    description: 'Juicy paneer patty layered with melted cheese slice.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Bestseller']
  },
  {
    id: 'burg_7',
    name: 'Pizza Burger',
    category: 'Burger',
    price: 90,
    rating: 4.92,
    reviewsCount: 220,
    description: 'Unique fusion burger baked with pizza sauce, mozzarella cheese, and capsicum.',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    tags: ['Chacha Special']
  },

  // SANDWICH
  {
    id: 'sand_1',
    name: 'Plain Sandwich',
    category: 'Sandwich',
    price: 69,
    rating: 4.7,
    reviewsCount: 80,
    description: 'Fresh buttered bread grilled with cucumber, tomato, and spices.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sand_2',
    name: 'Green Sandwich',
    category: 'Sandwich',
    price: 69,
    rating: 4.75,
    reviewsCount: 92,
    description: 'Fresh green mint chutney with crunchy capsicum & cucumbers.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sand_3',
    name: 'Paneer Sandwich',
    category: 'Sandwich',
    price: 70,
    rating: 4.85,
    reviewsCount: 140,
    description: 'Spiced cottage cheese filling grilled to perfection.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'sand_4',
    name: 'Cheese Sandwich',
    category: 'Sandwich',
    price: 79,
    rating: 4.88,
    reviewsCount: 165,
    description: 'Oozing melted cheese grilled sandwich with herbs.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // CHINESE & PASTA
  {
    id: 'chin_1',
    name: 'Chowmin',
    category: 'Chinese',
    price: 120,
    rating: 4.82,
    reviewsCount: 195,
    description: 'Wok-tossed noodles with fresh vegetables, soy sauce, and garlic.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Street Style']
  },
  {
    id: 'chin_2',
    name: 'Macaroni',
    category: 'Chinese',
    price: 129,
    rating: 4.78,
    reviewsCount: 130,
    description: 'Desi style wok-tossed macaroni pasta with Indian spices & veggies.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'chin_3',
    name: 'Red Sauce Pasta',
    category: 'Chinese',
    price: 129,
    rating: 4.85,
    reviewsCount: 160,
    description: 'Penne pasta tossed in spicy tangy tomato arrabbiata sauce.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'chin_4',
    name: 'White Sauce Pasta',
    category: 'Chinese',
    price: 139,
    rating: 4.9,
    reviewsCount: 210,
    description: 'Rich creamy béchamel white sauce pasta with herbs and cheese.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Creamy']
  },

  // SHAKES
  {
    id: 'sh_1',
    name: 'Banana Shake',
    category: 'Shakes',
    price: 70,
    rating: 4.75,
    reviewsCount: 90,
    description: 'Fresh ripe bananas blended with cold milk.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_2',
    name: 'Coconut Shake',
    category: 'Shakes',
    price: 70,
    rating: 4.8,
    reviewsCount: 85,
    description: 'Refreshing tender coconut milk shake.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_3',
    name: 'Papita (Papaya) Shake',
    category: 'Shakes',
    price: 80,
    rating: 4.7,
    reviewsCount: 60,
    description: 'Healthy fresh papaya blended shake.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_4',
    name: 'Kokum Shake',
    category: 'Shakes',
    price: 80,
    rating: 4.75,
    reviewsCount: 55,
    description: 'Unique tangy kokum fruit chilled shake.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_5',
    name: 'Chocolate Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.88,
    reviewsCount: 180,
    description: 'Thick velvety chocolate milkshake with chocolate drizzle.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'sh_6',
    name: 'Mango Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.85,
    reviewsCount: 140,
    description: 'Sweet Alphonso mango pulp blended with rich milk.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_7',
    name: 'Strawberry Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.8,
    reviewsCount: 110,
    description: 'Sweet strawberry milkshake topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_8',
    name: 'Dragon Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.9,
    reviewsCount: 125,
    description: 'Exotic pink dragonfruit creamy thick shake.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Exotic']
  },
  {
    id: 'sh_9',
    name: 'Pineapple Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.75,
    reviewsCount: 70,
    description: 'Tangy sweet pineapple blended shake.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_10',
    name: 'Black Berry Shake',
    category: 'Shakes',
    price: 89,
    rating: 4.82,
    reviewsCount: 88,
    description: 'Rich blackberry thick shake.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_11',
    name: 'Oreo Shake',
    category: 'Shakes',
    price: 99,
    rating: 4.92,
    reviewsCount: 240,
    description: 'Crushed Oreo cookies blended with chocolate ice cream & milk.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Bestseller']
  },
  {
    id: 'sh_12',
    name: 'Vanilla Shake',
    category: 'Shakes',
    price: 99,
    rating: 4.8,
    reviewsCount: 110,
    description: 'Classic Madagascar vanilla ice cream shake.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_13',
    name: 'Butterscotch Shake',
    category: 'Shakes',
    price: 99,
    rating: 4.85,
    reviewsCount: 130,
    description: 'Butterscotch ice cream shake with crunchy caramel nuts.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_14',
    name: 'Milk Shake',
    category: 'Shakes',
    price: 99,
    rating: 4.75,
    reviewsCount: 95,
    description: 'Rich creamy milk shake.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_15',
    name: 'Kit Kat Shake',
    category: 'Shakes',
    price: 99,
    rating: 4.94,
    reviewsCount: 220,
    description: 'Kit Kat wafer bars blended into thick chocolate milkshake.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Popular']
  },
  {
    id: 'sh_16',
    name: 'Badam Shake',
    category: 'Shakes',
    price: 120,
    rating: 4.9,
    reviewsCount: 150,
    description: 'Rich almond shake loaded with real crushed badam and saffron.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true
  },
  {
    id: 'sh_17',
    name: 'Khajoor (Dates) Shake',
    category: 'Shakes',
    price: 120,
    rating: 4.88,
    reviewsCount: 115,
    description: 'Healthy date palm shake rich in natural sweetness.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_18',
    name: 'Mix Fruit Shake',
    category: 'Shakes',
    price: 120,
    rating: 4.85,
    reviewsCount: 120,
    description: 'Seasonal mixed fresh fruits blended with chilled milk.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_19',
    name: 'Anjeer Shake',
    category: 'Shakes',
    price: 120,
    rating: 4.9,
    reviewsCount: 105,
    description: 'Rich fig (anjeer) nutrient-dense milkshake.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'sh_20',
    name: 'Dry Fruit Shake',
    category: 'Shakes',
    price: 120,
    rating: 4.95,
    reviewsCount: 180,
    description: 'Loaded with almonds, cashews, pistachios, dates & saffron.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    tags: ['Royal Special']
  },

  // LASSI
  {
    id: 'las_1',
    name: 'Special Lassi',
    category: 'Lassi',
    price: 50,
    rating: 4.85,
    reviewsCount: 170,
    description: 'Traditional thick churned sweet yogurt lassi topped with malai.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'las_2',
    name: 'Vanilla Lassi',
    category: 'Lassi',
    price: 60,
    rating: 4.75,
    reviewsCount: 80,
    description: 'Fresh lassi infused with natural vanilla flavor.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'las_3',
    name: 'Chocolate Lassi',
    category: 'Lassi',
    price: 70,
    rating: 4.8,
    reviewsCount: 95,
    description: 'Chilled sweet lassi blended with rich cocoa.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'las_4',
    name: 'Strawberry Lassi',
    category: 'Lassi',
    price: 70,
    rating: 4.82,
    reviewsCount: 100,
    description: 'Sweet lassi with natural strawberry reduction.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'las_5',
    name: 'Butterscotch Lassi',
    category: 'Lassi',
    price: 70,
    rating: 4.8,
    reviewsCount: 88,
    description: 'Caramel butterscotch infused thick churned lassi.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // COLD COFFEE
  {
    id: 'cc_1',
    name: 'Plain Cold Coffee',
    category: 'Cold Coffee',
    price: 89,
    rating: 4.88,
    reviewsCount: 230,
    description: 'Chilled espresso blended with thick milk and ice cream.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Classic Coffee']
  },
  {
    id: 'cc_2',
    name: 'Cold Chocolate Coffee',
    category: 'Cold Coffee',
    price: 99,
    rating: 4.9,
    reviewsCount: 210,
    description: 'Rich dark chocolate syrup blended with thick cold coffee.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'cc_3',
    name: 'Cold Orange Coffee',
    category: 'Cold Coffee',
    price: 120,
    rating: 4.82,
    reviewsCount: 90,
    description: 'Citrus infused unique cold coffee twist.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'cc_4',
    name: 'Cold Vanilla Coffee',
    category: 'Cold Coffee',
    price: 129,
    rating: 4.88,
    reviewsCount: 130,
    description: 'Smooth cold coffee infused with french vanilla cream.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'cc_5',
    name: 'Cold Butterscotch Coffee',
    category: 'Cold Coffee',
    price: 139,
    rating: 4.92,
    reviewsCount: 150,
    description: 'Caramelized butterscotch coffee topped with ice cream scoops.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true
  },

  // HOT COFFEE & TEA
  {
    id: 'hc_1',
    name: 'Tea',
    category: 'Hot Coffee',
    price: 20,
    rating: 4.8,
    reviewsCount: 300,
    description: 'Fresh brewed hot milk tea with ginger and cardamom.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_2',
    name: 'Lipton Tea',
    category: 'Hot Coffee',
    price: 30,
    rating: 4.75,
    reviewsCount: 110,
    description: 'Classic hot dip Lipton green / yellow tea.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_3',
    name: 'Special Masala Tea',
    category: 'Hot Coffee',
    price: 30,
    rating: 4.9,
    reviewsCount: 280,
    description: 'Authentic Indian masala chai with cloves, cinnamon & ginger.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'hc_4',
    name: 'Hot Coffee',
    category: 'Hot Coffee',
    price: 35,
    rating: 4.85,
    reviewsCount: 220,
    description: 'Frothy hot coffee prepared with steamed milk.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_5',
    name: 'Black Coffee',
    category: 'Hot Coffee',
    price: 40,
    rating: 4.8,
    reviewsCount: 95,
    description: 'Strong piping hot black espresso shot.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_6',
    name: 'Hot Chocolate Coffee',
    category: 'Hot Coffee',
    price: 50,
    rating: 4.88,
    reviewsCount: 160,
    description: 'Hot espresso infused with molten Belgian cocoa.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_7',
    name: 'Hot Strong Coffee',
    category: 'Hot Coffee',
    price: 50,
    rating: 4.9,
    reviewsCount: 180,
    description: 'Double shot robust dark roast coffee.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'hc_8',
    name: 'Hot Vanilla Coffee',
    category: 'Hot Coffee',
    price: 90,
    rating: 4.85,
    reviewsCount: 120,
    description: 'Aromatic hot coffee infused with french vanilla.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // MOJITO
  {
    id: 'mo_1',
    name: 'Blue Curacao Mojito',
    category: 'Mojito',
    price: 99,
    rating: 4.9,
    reviewsCount: 210,
    description: 'Vibrant blue curacao syrup, crushed ice, mint leaves & lemon soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Refreshing']
  },
  {
    id: 'mo_2',
    name: 'Strawberry Mojito',
    category: 'Mojito',
    price: 99,
    rating: 4.85,
    reviewsCount: 140,
    description: 'Sweet strawberry puree, fresh mint, lime juice & sparkling soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'mo_3',
    name: 'Green Mint Mojito',
    category: 'Mojito',
    price: 99,
    rating: 4.88,
    reviewsCount: 180,
    description: 'Classic virgin mint mojito with muddled lime & fresh mint leaves.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true
  },
  {
    id: 'mo_4',
    name: 'Grenadine Mojito',
    category: 'Mojito',
    price: 99,
    rating: 4.8,
    reviewsCount: 95,
    description: 'Pomegranate grenadine flavor with lime and mint.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'mo_5',
    name: 'Podina Masala Mojito',
    category: 'Mojito',
    price: 99,
    rating: 4.92,
    reviewsCount: 190,
    description: 'Desi tangy mint masala mojito with rock salt & cumin powder.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isChefSpecial: true,
    tags: ['Desi Twist']
  },

  // FRUIT JUICE
  {
    id: 'fj_1',
    name: 'Mosambi Juice',
    category: 'Fruit Juice',
    price: 80,
    rating: 4.8,
    reviewsCount: 120,
    description: 'Freshly squeezed sweet lime (mosambi) juice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'fj_2',
    name: 'Pineapple Juice',
    category: 'Fruit Juice',
    price: 80,
    rating: 4.8,
    reviewsCount: 110,
    description: 'Fresh cold-pressed sweet pineapple juice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },
  {
    id: 'fj_3',
    name: 'Vegetable Juice',
    category: 'Fruit Juice',
    price: 80,
    rating: 4.85,
    reviewsCount: 85,
    description: 'Nutritious fresh carrot, beetroot, cucumber & mint juice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    tags: ['Healthy']
  },
  {
    id: 'fj_4',
    name: 'Orange Juice',
    category: 'Fruit Juice',
    price: 80,
    rating: 4.82,
    reviewsCount: 130,
    description: 'Freshly extracted rich Vitamin C orange juice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    isVeg: true
  },

  // DESSERTS & CAKES
  {
    id: 'des_1',
    name: 'Chocolate Cake Slice',
    category: 'Desserts',
    price: 40,
    rating: 4.92,
    reviewsCount: 260,
    description: 'Fresh moist Belgian chocolate sponge cake slice.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    isVeg: true,
    isPopular: true,
    tags: ['Fresh Daily']
  }
];

export const SPECIAL_OFFERS = {
  chefsRecommendations: MENU_ITEMS.filter(item => item.isChefSpecial),
  popularDishes: MENU_ITEMS.filter(item => item.isPopular),
  todaysSpecials: MENU_ITEMS.filter(item => item.category === 'Combos' || item.category === 'Pizza' || item.category === 'Burger').slice(0, 4),
  weekendOffers: [
    {
      id: 'wo1',
      title: 'Family Feast Combo Deal (Save Big!)',
      description: 'Order Combo 1 + Combo 2 & Get Free Chocolate Cake Slice.',
      code: 'WEEKENDCHACHA',
      validity: 'Fri - Sun (All Day)',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wo2',
      title: 'Free Fresh Cake Slice with Gourmet Pizza',
      description: 'Enjoy a free Fresh Chocolate Cake Slice on ordering any Gourmet Pizza above ₹200.',
      code: 'FREECAKE',
      validity: 'Saturdays & Sundays All Day',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
    }
  ]
};

export const SPECIAL_SECTIONS = SPECIAL_OFFERS;

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Aarav Sharma',
    location: 'Kiratpur, Uttar Pradesh',
    avatar: '/src/assets/images/regenerated_image_1786467455970.jpg',
    rating: 5,
    date: '2 days ago',
    comment: "Chacha Cafe is by far the most magnificent cafe on Manadwar Road in Kiratpur! The combos are super affordable, and the Nacho Blast Pizza & Oreo Shake are heavenly. Must visit!",
    favoriteDish: 'Nacho Blast Must Try Pizza'
  },
  {
    id: 'r2',
    name: 'Priya Verma',
    location: 'Bijnor, Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 week ago',
    comment: "Visiting Chacha Cafe in Taqarubpur Israj Kheri Kiratpur was a great decision. The Pizza Burger, White Sauce Pasta, and Blue Curacao Mojito were fresh and full of flavor!",
    favoriteDish: 'Pizza Burger'
  },
  {
    id: 'r3',
    name: 'Vikram Singh',
    location: 'Kiratpur Local',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '3 weeks ago',
    comment: "Brought my friends for an evening party. Great ambience, fast service, and really good prices. The Dry Fruit Shake and Paneer Cheese Burger are top class!",
    favoriteDish: 'Dry Fruit Shake'
  },
  {
    id: 'r4',
    name: 'Meera Kapoor',
    location: 'Kiratpur, Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    comment: "Extremely hygienic, cozy place with fresh daily cakes and ice creams. Love their Special Masala Tea and Cold Coffee options!",
    favoriteDish: 'Special Masala Tea'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Warm & Cozy Dining Ambience',
    category: 'Ambience',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    description: 'Modern cafe lighting, comfortable seating, and lively music on Manadwar Road.'
  },
  {
    id: 'g2',
    title: 'Artisan Cold Coffee & Shakes Corner',
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=1200',
    description: 'Chilled coffees, thick shakes, and refreshing mojitos prepared fresh.'
  },
  {
    id: 'g3',
    title: 'Fresh Woodfired Pizza Oven',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200',
    description: 'Oven-fresh cheesy pizzas with generous toppings.'
  },
  {
    id: 'g4',
    title: 'Outdoor Garden & Patio Vibes',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&q=80&w=1200',
    description: 'Relaxing outdoor seating area perfect for evening hangouts.'
  },
  {
    id: 'g5',
    title: 'Fresh Cake & Ice Cream Section',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200',
    description: 'Delicious ice creams and fresh daily cakes.'
  }
];

export const STATS_DATA: StatItem[] = [
  {
    label: 'Happy Customers',
    value: 5000,
    suffix: '+',
    subtext: 'Delighted diners in Kiratpur'
  },
  {
    label: 'Menu Items',
    value: 95,
    suffix: '+',
    subtext: 'Pizzas, burgers, shakes & combos'
  },
  {
    label: 'Google Rating',
    value: 4.9,
    suffix: '★',
    subtext: 'Based on verified customer reviews'
  },
  {
    label: 'Years of Service',
    value: 5,
    suffix: ' Yrs',
    subtext: 'Serving happiness in Kiratpur'
  }
];
