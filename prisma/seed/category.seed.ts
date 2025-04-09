import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories: Prisma.CategoriesCreateInput[] = [
    {
      name: 'Піца',
      imageUrl: '',
      description: 'Смачні піци, приготовлені за класичними рецептурами.',
    },
    {
      name: 'Суші',
      imageUrl: '',
      description: 'Японські суші, виготовлені з найсвіжіших інгредієнтів.',
    },
    {
      name: 'Бургери',
      imageUrl: '',
      description: 'Соковиті бургери з різноманітними начинками.',
    },
    {
      name: 'Морепродукти',
      imageUrl: '',
      description: 'Різноманітні страви з морепродуктів.',
    },
    {
      name: 'Грузинська',
      imageUrl: '',
      description: 'Традиційні грузинські страви з неповторним смаком.',
    },
    {
      name: 'Азіатська',
      imageUrl: '',
      description: 'Екзотичні страви з нотками азійської кухні.',
    },
    {
      name: 'Українська',
      imageUrl: '',
      description: 'Класичні українські рецепти з родинними традиціями.',
    },
    {
      name: 'Сніданок',
      imageUrl: '',
      description: 'Ідеальні страви для бадьорого початку дня.',
    },
    {
      name: 'Напої',
      imageUrl: '',
      description: 'Освіжаючі напої та коктейлі для будь-якого настрою.',
    },
    {
      name: 'Вегетаріанська',
      imageUrl: '',
      description: 'Здорові та поживні страви для вегетаріанців.',
    },
    {
      name: 'Випічка',
      imageUrl: '',
      description: 'Свіжа випічка та ароматні десерти.',
    },
    {
      name: 'Гриль',
      imageUrl: '',
      description: 'Страви, приготовані на грилі, для поціновувачів м’яса.',
    },
    {
      name: 'Салати',
      imageUrl: '',
      description: 'Легкі та свіжі салати з різноманітних інгредієнтів.',
    },
    {
      name: 'Десерти',
      imageUrl: '',
      description: 'Солодкі ласощі для справжніх гурманів.',
    },
    {
      name: 'Фастфуд',
      imageUrl: '',
      description: 'Швидке харчування для зайнятих людей.',
    },
    {
      name: 'Паста',
      imageUrl: '',
      description: 'Італійська паста з різними соусами та начинками.',
    },
    {
      name: 'Закуски',
      imageUrl: '',
      description: 'Ідеальні закуски для вечірок та зустрічей.',
    },
    {
      name: 'Мексиканська',
      imageUrl: '',
      description: 'Гострі та ароматні страви мексиканської кухні.',
    },
    {
      name: 'Італійська',
      imageUrl: '',
      description: 'Класична італійська кухня з багатою історією.',
    },
    {
      name: 'Французька',
      imageUrl: '',
      description: 'Елегантна французька кухня з вишуканими смаками.',
    },
    {
      name: 'Індійська',
      imageUrl: '',
      description: 'Ароматна індійська кухня з різноманітними спеціями.',
    },
    {
      name: 'Китайська',
      imageUrl: '',
      description: 'Традиційна китайська кухня зі смаженими стравами та локшиною.',
    },
    {
      name: 'Тайська',
      imageUrl: '',
      description: 'Екзотичні тайські страви з гострим смаком.',
    },
    {
      name: 'Латиноамериканська',
      imageUrl: '',
      description: 'Барвиста латиноамериканська кухня з широким асортиментом.',
    },
    {
      name: 'Гастропаб',
      imageUrl: '',
      description: 'Сучасна кухня з поєднанням ресторанних традицій та барної атмосфери.',
    },
    {
      name: 'Барбекю',
      imageUrl: '',
      description: 'Смачно приготовані м’ясні страви на грилі, що підкорюють будь-кого.',
    },
    {
      name: 'Кафе',
      imageUrl: '',
      description: 'Затишні кафе з легкими закусками та кавовими напоями.',
    },
    {
      name: 'Кондитерські вироби',
      imageUrl: '',
      description: 'Солодкі ласощі та кондитерські шедеври для будь-якого свята.',
    },
    {
      name: 'Шашлики',
      imageUrl: '',
      description: 'Апетитні шашлики та страви на грилі для зустрічей з друзями.',
    },
    {
      name: 'Веганська',
      imageUrl: '',
      description: 'Інноваційна веганська кухня без продуктів тваринного походження.',
    },
    {
      name: 'Органічна їжа',
      imageUrl: '',
      description: 'Страви з органічних, натуральних інгредієнтів.',
    },
    {
      name: 'Супи',
      imageUrl: '',
      description: 'Багатий асортимент супів для будь-якого настрою.',
    },
    {
      name: 'Смузі та соки',
      imageUrl: '',
      description: 'Свіжі смузі та натуральні соки для додаткової енергії.',
    },
    {
      name: 'Міжнародна кухня',
      imageUrl: '',
      description: 'Різноманітні страви з усього світу для справжніх гурманів.',
    },
    {
      name: 'Кав\'ярня',
      imageUrl: '',
      description: 'Ароматна кава та свіжий випічка в атмосферних кав\'ярнях.',
    },
    {
      name: 'Делікатеси',
      imageUrl: '',
      description: 'Вишукані делікатеси для справжніх поціновувачів смаку.',
    },
    {
      name: 'Фітнес-їжа',
      imageUrl: '',
      description: 'Страви, багаті на білки та поживні речовини для спортсменів.',
    },
    {
      name: 'Домашня кухня',
      imageUrl: '',
      description: 'Страви, приготовані за традиційними домашніми рецептами.',
    },
    {
      name: 'Ф\'южн',
      imageUrl: '',
      description: 'Інноваційне поєднання кулінарних традицій різних країн.',
    },
    {
      name: 'Ресторанна кухня',
      imageUrl: '',
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
