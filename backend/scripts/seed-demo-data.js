const bcrypt = require('bcryptjs');
const prisma = require('../src/utils/prisma');

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@magicapp.local';
const ADMIN_PASSWORD = 'admin';

const DEMO_DECKS = [
  {
    name: 'Demo - Mono Red Aggro',
    description: 'Mazo agresivo de ejemplo para pruebas rápidas',
    format: 'Modern',
    isPublic: false,
    cards: [
      {
        scryfallId: 'bolt-demo-001',
        quantity: 4,
        name: 'Lightning Bolt',
        manaCost: '{R}',
        type: 'Instant',
        rarity: 'common',
        setCode: 'M10',
        setName: 'Magic 2010',
        imageUrl: 'https://cards.scryfall.io/small/front/f/e/fef3b4b1-2d8d-4ff6-ac6d-ad52fbf8df1f.jpg',
        oracleText: 'Lightning Bolt deals 3 damage to any target.',
        colors: ['R'],
        cmc: 1,
        priceEur: 2.2,
        priceUsd: 2.45
      },
      {
        scryfallId: 'guide-demo-002',
        quantity: 4,
        name: 'Goblin Guide',
        manaCost: '{R}',
        type: 'Creature — Goblin Scout',
        rarity: 'rare',
        setCode: 'ZEN',
        setName: 'Zendikar',
        imageUrl: 'https://cards.scryfall.io/small/front/c/1/c1949d3e-629f-4ac1-8b2f-5d792fdf72e9.jpg',
        oracleText: 'Haste',
        colors: ['R'],
        cmc: 1,
        priceEur: 15,
        priceUsd: 16.5
      },
      {
        scryfallId: 'swiftspear-demo-003',
        quantity: 4,
        name: 'Monastery Swiftspear',
        manaCost: '{R}',
        type: 'Creature — Human Monk',
        rarity: 'common',
        setCode: 'KTK',
        setName: 'Khans of Tarkir',
        imageUrl: 'https://cards.scryfall.io/small/front/3/8/39f7aa0a-4aff-4169-af20-104f3f4e9da4.jpg',
        oracleText: 'Haste, prowess',
        colors: ['R'],
        cmc: 1,
        priceEur: 0.85,
        priceUsd: 1
      }
    ]
  },
  {
    name: 'Demo - Azorius Control',
    description: 'Mazo control de ejemplo para pruebas de cartas azules/blancas',
    format: 'Pioneer',
    isPublic: false,
    cards: [
      {
        scryfallId: 'counterspell-demo-101',
        quantity: 4,
        name: 'Counterspell',
        manaCost: '{U}{U}',
        type: 'Instant',
        rarity: 'uncommon',
        setCode: '2XM',
        setName: 'Double Masters',
        imageUrl: 'https://cards.scryfall.io/small/front/1/b/1b27f084-a62d-4e3a-8308-a335a45da76a.jpg',
        oracleText: 'Counter target spell.',
        colors: ['U'],
        cmc: 2,
        priceEur: 1.8,
        priceUsd: 2
      },
      {
        scryfallId: 'wrath-demo-102',
        quantity: 2,
        name: 'Supreme Verdict',
        manaCost: '{1}{W}{W}{U}',
        type: 'Sorcery',
        rarity: 'rare',
        setCode: 'RTR',
        setName: 'Return to Ravnica',
        imageUrl: 'https://cards.scryfall.io/small/front/a/6/a679cc74-6119-468f-8c64-8e6db24d62d9.jpg',
        oracleText: 'Supreme Verdict can\'t be countered. Destroy all creatures.',
        colors: ['W', 'U'],
        cmc: 4,
        priceEur: 3.6,
        priceUsd: 4
      },
      {
        scryfallId: 'teferi-demo-103',
        quantity: 2,
        name: 'Teferi, Hero of Dominaria',
        manaCost: '{3}{W}{U}',
        type: 'Legendary Planeswalker — Teferi',
        rarity: 'mythic',
        setCode: 'DAR',
        setName: 'Dominaria',
        imageUrl: 'https://cards.scryfall.io/small/front/5/d/5d10b752-d9ea-4c6c-87c8-b5c4aebf0365.jpg',
        oracleText: '+1: Draw a card. At the beginning of the next end step, untap two lands.',
        colors: ['W', 'U'],
        cmc: 5,
        priceEur: 9.5,
        priceUsd: 10.3
      }
    ]
  }
];

async function upsertAdminUser() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }]
    }
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: passwordHash
      }
    });
  }

  return prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      password: passwordHash
    }
  });
}

async function upsertDeckWithCards(userId, deckConfig) {
  let deck = await prisma.deck.findFirst({
    where: {
      userId,
      name: deckConfig.name
    }
  });

  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        userId,
        name: deckConfig.name,
        description: deckConfig.description,
        format: deckConfig.format,
        isPublic: deckConfig.isPublic
      }
    });
  } else {
    deck = await prisma.deck.update({
      where: { id: deck.id },
      data: {
        description: deckConfig.description,
        format: deckConfig.format,
        isPublic: deckConfig.isPublic
      }
    });
  }

  for (const card of deckConfig.cards) {
    await prisma.deckCard.upsert({
      where: {
        deckId_scryfallId: {
          deckId: deck.id,
          scryfallId: card.scryfallId
        }
      },
      update: {
        ...card
      },
      create: {
        deckId: deck.id,
        ...card
      }
    });
  }
}

async function main() {
  const adminUser = await upsertAdminUser();

  for (const deck of DEMO_DECKS) {
    await upsertDeckWithCards(adminUser.id, deck);
  }

  console.log('✅ Datos de prueba cargados.');
  console.log(`Usuario: ${ADMIN_USERNAME}`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('Mazos de ejemplo: 2');
  console.log('Inventario de ejemplo: se inicializa automáticamente en frontend si localStorage está vacío.');
}

main()
  .catch((error) => {
    console.error('❌ Error cargando datos de prueba:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
