import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductCategory() {
    const productCategories: Prisma.ProductCategoryCreateInput[] = [
        {name: 'Піца'},
        {name: 'Бургери'},
        {name: 'Суші'},
        {name: 'Напої'},
        {name: 'Десерти'},
        {name: 'Фрі'},
        {name: 'Салати'},
        {name: 'Снеки'},
        {name: 'Курячі крильця'},
        {name: 'Нагетси'},
        {name: 'Роли'}
    ];

    for (const productCategory of productCategories) {
        await prisma.productCategory.create({ data: productCategory });
    }

    console.log('✅ Категорії продуктів успішно додано!');
}

seedProductCategory()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });