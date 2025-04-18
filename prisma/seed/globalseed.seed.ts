import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurantCategories: Prisma.CategoriesCreateManyInput[] = [
    {
      name: 'Азіатська кухня',
      imageUrl: 'category-restaurant/asian_cuisine.svg',
      description: 'Екзотичні страви з нотками азійської кухні.',
    },
    {
      name: 'Українська кухня',
      imageUrl: 'category-restaurant/ukrainian_cuisine.svg',
      description: 'Класичні українські рецепти з родинними традиціями.',
    },
    {
      name: 'Фастфуд',
      imageUrl: 'category-restaurant/fast_food.svg',
      description: 'Швидке харчування для зайнятих людей.',
    },
  ];
  await prisma.categories.createMany({ data: restaurantCategories });

  const productCategories: Prisma.ProductCategoryCreateManyInput[] = [
    { name: 'Піца' },
    { name: 'Бургери' },
    { name: 'Суші' },
    { name: 'Напої' },
    { name: 'Десерти' },
  ];
  await prisma.productCategory.createMany({ data: productCategories });

  const restaurantsData: Prisma.RestaurantCreateManyInput[] = [
    {
      name: 'DonatelloPizza',
      address: '123 Main St, Anytown, USA',
      numberOfWorkers: 5,
      rating: 90,
      banner: 'restaurants/donatello_banner.png',
      logo: 'restaurants/donatello_logo.png',
      workingHours: '08:00-22:00',
      deliveryPrice: 250,
      cookingTime: 20,
      minimumOrderPrice: 450,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Burger King',
      address: '456 Elm St, Anytown, USA',
      numberOfWorkers: 12,
      rating: 85,
      banner: 'restaurants/burgerking_banner.png',
      logo: 'restaurants/burgerking_logo.png',
      workingHours: '08:00-22:00',
      deliveryPrice: 250,
      cookingTime: 15,
      minimumOrderPrice: 450,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await prisma.restaurant.createMany({ data: restaurantsData });

  const categories = await prisma.categories.findMany();
  const productCats = await prisma.productCategory.findMany();
  const restaurants = await prisma.restaurant.findMany();

  const catRestLinks: Prisma.CategoryRestaurantCreateManyInput[] = [];
  categories.forEach((cat) => {
    restaurants.forEach((rest) => {
      catRestLinks.push({ categoryId: cat.id, restaurantId: rest.id });
    });
  });
  await prisma.categoryRestaurant.createMany({ data: catRestLinks, skipDuplicates: true });

  const restProdCatLinks: Prisma.RestaurantProductCategoryCreateManyInput[] = [];
  restaurants.forEach((rest) => {
    productCats.forEach((pc) => {
      restProdCatLinks.push({ restaurantId: rest.id, categoryId: pc.id });
    });
  });
  await prisma.restaurantProductCategory.createMany({ data: restProdCatLinks, skipDuplicates: true });

  const productsData: Prisma.ProductCreateManyInput[] = productCats.map((pc) => ({
    name: `${pc.name} Стандарт`,  
    description: `Стандартний набір ${pc.name}`,
    categoryId: pc.id, 
  }));
  await prisma.product.createMany({ data: productsData });

  const products = await prisma.product.findMany();

  const restaurantProducts: Prisma.RestaurantProductCreateManyInput[] = [];
  restaurants.forEach((rest) => {
    products.forEach((prod) => {
      restaurantProducts.push({
        restaurantId: rest.id,
        productId: prod.id,
        price: parseFloat((Math.random() * 100 + 50).toFixed(2)),
        discount: 0,
        isAvailable: true,
      });
    });
  });
  await prisma.restaurantProduct.createMany({ data: restaurantProducts, skipDuplicates: true });

  console.log('🌱 Global seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
