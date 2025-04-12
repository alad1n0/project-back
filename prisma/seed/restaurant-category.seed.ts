import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.categoryRestaurant.createMany({
        data: [
            {
                categoryId: "4db7be5e-4acf-4718-a681-9584cf907962",
                restaurantId: "1c661558-1681-47ea-9126-beaab6491591",
            },
            {
                categoryId: "4db7be5e-4acf-4718-a681-9584cf907962",
                restaurantId: "24e9a8b7-390d-4690-84f8-22f9709dd249",
            },
            {
                categoryId: "cf15004e-e098-4fed-98ee-91684470ca33",
                restaurantId: "24e9a8b7-390d-4690-84f8-22f9709dd249",
            },
            {
                categoryId: "4db7be5e-4acf-4718-a681-9584cf907962",
                restaurantId: "4606259b-786a-41d9-9058-4f631267fd5c",
            },
            {
                categoryId: "22c71281-4af7-4141-b20c-769388818b23",
                restaurantId: "795fc82c-1454-4db5-9916-b8b1190b6e03",
            },
            {
                categoryId: "4db7be5e-4acf-4718-a681-9584cf907962",
                restaurantId: "7de4137a-74c7-4b2c-8722-10eb1a5863a2",
            },
            {
                categoryId: "cf15004e-e098-4fed-98ee-91684470ca33",
                restaurantId: "7de4137a-74c7-4b2c-8722-10eb1a5863a2",
            },
            {
                categoryId: "4db7be5e-4acf-4718-a681-9584cf907962",
                restaurantId: "9c188b0f-8f15-4b20-a81e-93066fe91091",
            },
        ],
    });

    console.log('Seed data has been inserted!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
