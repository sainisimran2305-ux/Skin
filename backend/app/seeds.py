import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

SEED_PRODUCTS = [
  {
    "id": "radiant-glow-serum",
    "name": "Radiant Glow Face Serum",
    "subtitle": "Organic Rosehip & Saffron Elixir",
    "category": "serums",
    "categoryLabel": "Face Serums",
    "price": 2499.0,
    "originalPrice": 2899.0,
    "rating": 4.9,
    "reviewsCount": 128,
    "badge": "Best Seller",
    "skinType": ["all", "dry", "combination", "dull"],
    "volumeOptions": ["30ml", "50ml"],
    "selectedVolume": "30ml",
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1608248597263-00079e95a329?auto=format&fit=crop&w=800&q=80",
    "description": "A potent, cold-pressed botanical serum enriched with Kashmiri Saffron, Wild Rosehip Seed Oil, and Gotu Kola. Formulated to restore natural radiance, deeply nourish dry lipid layers, and balance hyperpigmentation.",
    "keyIngredients": ["Kashmiri Saffron", "Wild Rosehip Seed Oil", "Gotu Kola", "Sea Buckthorn"],
    "benefits": [
      "Fades hyperpigmentation and restores cellular glow",
      "Shields skin with natural antioxidants & Omega 3, 6, 9",
      "Non-greasy, fast-absorbing elixir texture",
      "100% Organic & Cold-Pressed Botanicals"
    ],
    "usage": "Dispense 3-4 drops onto clean fingertips. Warm gently between palms and press lightly onto cleansed face, neck, and décolletage in upward circular motions.",
    "ritualTime": "AM & PM Routine"
  },
  {
    "id": "sage-neem-cleanser",
    "name": "Purifying Sage & Neem Cleanser",
    "subtitle": "Gentle Herbal Gel-to-Milk Wash",
    "category": "cleansers",
    "categoryLabel": "Cleansers",
    "price": 1299.0,
    "originalPrice": None,
    "rating": 4.8,
    "reviewsCount": 94,
    "badge": "Formulated for Sensitivity",
    "skinType": ["oily", "combination", "acne-prone", "sensitive"],
    "volumeOptions": ["150ml", "250ml"],
    "selectedVolume": "150ml",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    "description": "Sustainably harvested Himalayan Neem paired with clarifying Clary Sage and Aloe Vera leaf juice. Sweeps away impurities, excess sebum, and pollution without stripping essential moisture.",
    "keyIngredients": ["Himalayan Neem", "Clary Sage", "Aloe Vera Juice", "Green Tea Leaf"],
    "benefits": [
      "Calms inflammation and reduces breakouts",
      "Maintains the skin's protective moisture barrier",
      "Soothes redness with natural antiseptic herbs",
      "PH-balanced formula (5.5)"
    ],
    "usage": "Massage 1-2 pumps onto damp face for 60 seconds. Rinse thoroughly with lukewarm water.",
    "ritualTime": "AM & PM Step 1"
  },
  {
    "id": "rosehip-night-cream",
    "name": "Cellular Renewal Night Cream",
    "subtitle": "Deep Moisture & Phytolipid Balm",
    "category": "moisturizers",
    "categoryLabel": "Moisturizers",
    "price": 2999.0,
    "originalPrice": 3499.0,
    "rating": 4.95,
    "reviewsCount": 156,
    "badge": "Award Winner",
    "skinType": ["dry", "mature", "normal"],
    "volumeOptions": ["50ml", "100ml"],
    "selectedVolume": "50ml",
    "image": "https://images.unsplash.com/photo-1608248597263-00079e95a329?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "description": "An intensive overnight recovery cream infused with Rosehip, Ashwagandha adaptogens, and Shorea Butter. Accelerates cellular repair while you sleep, leaving skin velvet-smooth by morning.",
    "keyIngredients": ["Wild Rosehip", "Ashwagandha Extract", "Shorea Butter", "Squalane"],
    "benefits": [
      "Deeply hydrates and restores skin elasticity",
      "Fights nocturnal oxidative stress",
      "Rich velvet texture that seals in moisture",
      "Vegan, synthetic-fragrance free"
    ],
    "usage": "Warm a pea-sized amount in your palms and smooth over cleansed face and neck before sleep.",
    "ritualTime": "PM Recovery"
  },
  {
    "id": "botanical-toning-mist",
    "name": "Lavender & Wild Sage Toning Essence",
    "subtitle": "Hydrating & Balancing Botanical Water",
    "category": "toners",
    "categoryLabel": "Toners & Mists",
    "price": 999.0,
    "originalPrice": None,
    "rating": 4.7,
    "reviewsCount": 81,
    "badge": "Organic Distillate",
    "skinType": ["all", "sensitive", "dry"],
    "volumeOptions": ["100ml"],
    "selectedVolume": "100ml",
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "description": "Pure steam-distilled French Lavender hydrosol blended with Wild Sage and Witch Hazel. Instantly refreshes skin, restores ideal pH, and prepares skin to absorb active serums.",
    "keyIngredients": ["French Lavender Hydrosol", "Wild Sage", "Witch Hazel Extract", "Vegetable Glycerin"],
    "benefits": [
      "Delivers an instant hydration burst anytime",
      "Prepares skin layers for serum absorption",
      "Calms mind with natural aromatherapeutic notes",
      "Alcohol-free and non-drying"
    ],
    "usage": "Mist generously over face after cleansing or throughout the day for an instant refreshing boost.",
    "ritualTime": "AM & PM Step 2"
  },
  {
    "id": "turmeric-clay-mask",
    "name": "Golden Turmeric Detoxifying Mask",
    "subtitle": "Brightening Mineral & Kaolin Clay Treatment",
    "category": "masks",
    "categoryLabel": "Treatments & Masks",
    "price": 1899.0,
    "originalPrice": 2199.0,
    "rating": 4.88,
    "reviewsCount": 110,
    "badge": "Customer Favorite",
    "skinType": ["dull", "oily", "combination"],
    "volumeOptions": ["75ml"],
    "selectedVolume": "75ml",
    "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "description": "Rejuvenate tired skin with organic Wild Turmeric root powder, White Kaolin Clay, and Sandalwood oil. Unclogs pores, draws out toxins, and reveals a luminous complexion.",
    "keyIngredients": ["Wild Turmeric Root", "White Kaolin Clay", "Pure Sandalwood Oil", "Honey Extract"],
    "benefits": [
      "Draws out deep impurities and pore buildup",
      "Evens skin tone and boosts natural radiance",
      "Refines skin texture without tightness",
      "Zero artificial dyes or staining"
    ],
    "usage": "Apply an even layer over face, avoiding eye area. Leave on for 10-15 minutes until dry. Rinse with warm water in gentle circles.",
    "ritualTime": "Weekly Ritual (2x/week)"
  },
  {
    "id": "eye-vitality-cream",
    "name": "Bakuchiol & Gotu Kola Eye Concentrate",
    "subtitle": "Natural Retinol Alternative Eye Treatment",
    "category": "eye-care",
    "categoryLabel": "Eye Care",
    "price": 2199.0,
    "originalPrice": None,
    "rating": 4.9,
    "reviewsCount": 76,
    "badge": "Clean Beauty Standard",
    "skinType": ["all", "mature", "sensitive"],
    "volumeOptions": ["15ml"],
    "selectedVolume": "15ml",
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "secondaryImage": "https://images.unsplash.com/photo-1608248597263-00079e95a329?auto=format&fit=crop&w=800&q=80",
    "description": "Powered by 1% Bakuchiol—nature's gentle retinol alternative—and firming Gotu Kola. Target dark circles, puffiness, and delicate fine lines around the contours of the eyes.",
    "keyIngredients": ["Bakuchiol (Natural Retinol)", "Gotu Kola", "Green Coffee Bean Oil", "Cucumber Extract"],
    "benefits": [
      "Smooths fine lines without redness or peeling",
      "Diminishes dark circles and morning puffiness",
      "Deeply hydrates delicate under-eye skin",
      "Ophthalmologist tested & fragrance-free"
    ],
    "usage": "Gently pat a tiny dot around the orbital bone using your ring finger until absorbed.",
    "ritualTime": "AM & PM Eye Ritual"
  }
]

SEED_INGREDIENTS = [
  {
    "id": "sage",
    "name": "Wild Clary Sage",
    "latinName": "Salvia sclarea",
    "originRegion": "Mediterranean Coast & Southern Europe",
    "lat": 43.7,
    "lng": 7.2,
    "benefits": ["Regulates Sebum", "Natural Antiseptic", "Aromatherapeutic Calming"],
    "skinTypeSuitability": "Oily, Combination & Acne-Prone Skin",
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    "description": "Clary Sage has been revered since antiquity for its clarifying, antimicrobial, and soothing properties. Harvested in early dawn when essential oil concentrations peak."
  },
  {
    "id": "neem",
    "name": "Himalayan Organic Neem",
    "latinName": "Azadirachta indica",
    "originRegion": "Foothills of the Indian Himalayas",
    "lat": 28.6,
    "lng": 77.2,
    "benefits": ["Calms Inflammation", "Deep Purifying", "Antioxidant Shield"],
    "skinTypeSuitability": "Sensitive, Blemish-Prone Skin",
    "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "description": "Known in Ayurvedic tradition as the 'Wonder Leaf', Neem is rich in nimbin and fatty acids that clear blemishes while shielding against environmental stressors."
  },
  {
    "id": "rosehip",
    "name": "Wild Patagonian Rosehip",
    "latinName": "Rosa rubiginosa",
    "originRegion": "High Andes, Southern Chile",
    "lat": -33.4,
    "lng": -70.6,
    "benefits": ["Cellular Regeneration", "Rich in Omega 3,6 & 9", "Smooths Fine Lines"],
    "skinTypeSuitability": "Dry, Mature & Sun-Exposed Skin",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    "description": "Cold-pressed from wild rose bushes high in the pristine Andean air, Rosehip oil contains natural trans-retinoic acid for deep cellular rejuvenation."
  },
  {
    "id": "turmeric",
    "name": "Golden Wild Turmeric",
    "latinName": "Curcuma aromatica",
    "originRegion": "Kerala & Western Ghats, India",
    "lat": 10.8,
    "lng": 76.2,
    "benefits": ["Brightens Complexion", "Fades Dark Spots", "Powerful Anti-inflammatory"],
    "skinTypeSuitability": "Dull, Uneven & Hyperpigmented Skin",
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    "description": "Hand-harvested rhizomes dried under native sunlight. Curcumin compounds provide potent antioxidant defense and unrivaled golden radiance."
  },
  {
    "id": "lavender",
    "name": "Organic High-Altitude Lavender",
    "latinName": "Lavandula angustifolia",
    "originRegion": "Provence, France",
    "lat": 43.8,
    "lng": 6.0,
    "benefits": ["Instant Hydration", "Calms Redness", "Promotes Restful Sleep"],
    "skinTypeSuitability": "All Skin Types & Sensitive Skin",
    "image": "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80",
    "description": "Cultivated at 1,000+ meters in Provence. High altitudes produce elevated linalyl acetate levels for maximum skin-calming efficacy."
  }
]

async def seed_database(db: AsyncIOMotorDatabase):
  try:
    # 1. Seed Products
    product_count = await db.products.count_documents({})
    if product_count == 0:
      logger.info("Products collection is empty. Seeding products...")
      await db.products.insert_many(SEED_PRODUCTS)
      logger.info(f"Successfully seeded {len(SEED_PRODUCTS)} products.")
    else:
      logger.info(f"Products collection already has {product_count} items. Skipping seeding.")

    # 2. Seed Ingredients
    ingredient_count = await db.ingredients.count_documents({})
    if ingredient_count == 0:
      logger.info("Ingredients collection is empty. Seeding ingredients...")
      await db.ingredients.insert_many(SEED_INGREDIENTS)
      logger.info(f"Successfully seeded {len(SEED_INGREDIENTS)} ingredients.")
    else:
      logger.info(f"Ingredients collection already has {ingredient_count} items. Skipping seeding.")

  except Exception as e:
    logger.error(f"Error occurred while seeding database: {e}")
