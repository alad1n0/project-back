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
        },
        {
            name: 'Burger King',
            address: '123 Main St, Anytown, USA',
            numberOfWorkers: 12,
            rating: 85,
            banner: 'burger_king_baner.png',
            logo: 'Burger_King_logo.png',
            workingHours: '8:00 - 22:00',
            deliveryPrice: 250,
            cookingTime: 15,
            minimumOrderPrice: 450,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'KFC',
            address: '456 Elm St, Anytown, USA',
            numberOfWorkers: 10,
            rating: 88,
            banner: 'kfc_baner.jpg',
            logo: 'KFC_Logo.png',
            workingHours: '9:00 - 23:00',
            deliveryPrice: 200,
            cookingTime: 18,
            minimumOrderPrice: 400,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'McDonald\'s',
            address: '789 Oak St, Anytown, USA',
            numberOfWorkers: 15,
            rating: 92,
            banner: 'mac_baner.png',
            logo: 'mac_logo.png',
            workingHours: '7:00 - 23:00',
            deliveryPrice: 220,
            cookingTime: 12,
            minimumOrderPrice: 500,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Pizza House',
            address: '321 Maple Ave, Anytown, USA',
            numberOfWorkers: 8,
            rating: 87,
            banner: 'pizza-house-baner.jpg',
            logo: 'pizza-house-logo.jpg',
            workingHours: '10:00 - 22:00',
            deliveryPrice: 300,
            cookingTime: 25,
            minimumOrderPrice: 550,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Sushi Store',
            address: '654 Pine Rd, Anytown, USA',
            numberOfWorkers: 6,
            rating: 90,
            banner: 'susho_store_baner.jpg',
            logo: 'susho_store_logo.png',
            workingHours: '11:00 - 21:00',
            deliveryPrice: 280,
            cookingTime: 30,
            minimumOrderPrice: 600,
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