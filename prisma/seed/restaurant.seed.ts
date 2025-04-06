import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRestaurant() {
    const restaurants: Prisma.RestaurantCreateInput[] = [
        {
            name: 'DonatelloPizza',
            address: '123 Main St, Anytown, USA',
            numberOfWorkers: 5,
            rating: 90,
            banner: 'restoran-pizza.png',
            logo: 'logo_rest.png',
            workingHours: '8:00 - 22:00',
            deliveryPrice: 250,
            cookingTime: 20,
            minimumOrderPrice: 450,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    for (const restaurant of restaurants) {
        await prisma.restaurant.create({ data: restaurant });
    }
}

seedRestaurant()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });