import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories: Prisma.CategoriesCreateInput[] = [
    {
      name: 'Азіатська кухня',
      imageUrl: 'category-restraunt/asian_cuisine.svg',
      description: 'Екзотичні страви з нотками азійської кухні.',
    },
    {
      name: 'Українська кухня',
      imageUrl: 'category-restraunt/ukrainian_cuisine.svg',
      description: 'Класичні українські рецепти з родинними традиціями.',
    },
    {
      name: 'Фастфуд',
      imageUrl: 'category-restraunt/fast_food.svg',
      description: 'Швидке харчування для зайнятих людей.',
    },
    {
      name: 'Мексиканська кухня',
      imageUrl: 'category-restraunt/mexican_cuisine.svg',
      description: 'Гострі та ароматні страви мексиканської кухні.',
    },
    {
      name: 'Італійська кухня',
      imageUrl: 'category-restraunt/italian_cuisine.svg',
      description: 'Класична італійська кухня з багатою історією.',
    },
    {
      name: 'Китайська кухня',
      imageUrl: 'category-restraunt/chinese_cuisine.svg',
      description: 'Традиційна китайська кухня зі смаженими стравами та локшиною.',
    },
    {
      name: 'Веганська кухня',
      imageUrl: 'category-restraunt/vegan_cuisine.svg',
      description: 'Інноваційна веганська кухня без продуктів тваринного походження.',
    },
    {
      name: 'Міжнародна кухня',
      imageUrl: 'category-restraunt/international_cuisine.svg',
      description: 'Різноманітні страви з усього світу для справжніх гурманів.',
    },
    {
      name: 'Кав\'ярня',
      imageUrl: 'category-restraunt/cafe.svg',
      description: 'Ароматна кава та свіжий випічка в атмосферних кав\'ярнях.',
    },
    {
      name: 'Домашня кухня',
      imageUrl: 'category-restraunt/home_cooking.svg',
      description: 'Страви, приготовані за традиційними домашніми рецептами.',
    },
    {
      name: 'Ресторанна кухня',
      imageUrl: 'category-restraunt/restaurant_kitchen.svg',
      description: 'Ексклюзивні страви високої кухні для справжніх гурманів.',
    },
  ];

  for (const category of categories) {
    await prisma.categories.create({ data: category });
  }
  console.log('Seed for categories completed.');
}

seedCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
