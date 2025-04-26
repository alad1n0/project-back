import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const restaurantCategoriesData = [
        {
            name: 'Азіатська кухня',
            imageUrl: 'category-restraunt/asian_cuisine.svg',
            description: 'Екзотичні страви з нотками азійської кухні.'
        },
        {
            name: 'Українська кухня',
            imageUrl: 'category-restraunt/ukrainian_cuisine.svg',
            description: 'Класичні українські рецепти з родинними традиціями.'
        },
        {
            name: 'Фастфуд',
            imageUrl: 'category-restraunt/fast_food.svg',
            description: 'Швидке харчування для зайнятих людей.'
        },
        {
            name: 'Мексиканська кухня',
            imageUrl: 'category-restraunt/mexican_cuisine.svg',
            description: 'Гострі та ароматні страви мексиканської кухні.'
        },
        {
            name: 'Італійська кухня',
            imageUrl: 'category-restraunt/italian_cuisine.svg',
            description: 'Класична італійська кухня з багатою історією.'
        },
        {
            name: 'Китайська кухня',
            imageUrl: 'category-restraunt/chinese_cuisine.svg',
            description: 'Традиційна китайська кухня зі смаженими стравами та локшиною.'
        },
        {
            name: 'Веганська кухня',
            imageUrl: 'category-restraunt/vegan_cuisine.svg',
            description: 'Інноваційна веганська кухня без продуктів тваринного походження.'
        },
        {
            name: 'Міжнародна кухня',
            imageUrl: 'category-restraunt/international_cuisine.svg',
            description: 'Різноманітні страви з усього світу для справжніх гурманів.'
        },
        {
            name: 'Кав\'ярня',
            imageUrl: 'category-restraunt/cafe.svg',
            description: 'Ароматна кава та свіжий випічка в атмосферних кав\'ярнях.'
        },
        {
            name: 'Домашня кухня',
            imageUrl: 'category-restraunt/home_cooking.svg',
            description: 'Страви, приготовані за традиційними домашніми рецептами.'
        },
        {
            name: 'Ресторанна кухня',
            imageUrl: 'category-restraunt/restaurant_kitchen.svg',
            description: 'Ексклюзивні страви високої кухні для справжніх гурманів.'
        },
    ];

    const categories = await Promise.all(restaurantCategoriesData.map((data) => prisma.categories.create({data})));

    const restaurantsData = [
        {
            name: 'Eats Easy',
            address: '123 Main St',
            numberOfWorkers: 8,
            rating: 95,
            banner: 'restaurants/eats_easy_banner.jpg',
            logo: 'restaurants/eats_easy_logo.png',
            workingHours: '8:00 - 22:00',
            deliveryPrice: 200,
            cookingTime: 15,
            minimumOrderPrice: 400,
            categoryNames: ['Українська кухня', 'Фастфуд', 'Азіатська кухня'],
        },
        {
            name: 'DonatelloPizza',
            address: '123 Main St',
            numberOfWorkers: 5,
            rating: 90,
            banner: 'restaurants/restoran-pizza.png',
            logo: 'restaurants/logo_rest.png',
            workingHours: '8:00 - 22:00',
            deliveryPrice: 250,
            cookingTime: 20,
            minimumOrderPrice: 450,
            categoryNames: ['Італійська кухня', 'Фастфуд'],
        },
        {
            name: 'Burger King',
            address: '123 Main St',
            numberOfWorkers: 12,
            rating: 85,
            banner: 'restaurants/burger_king_baner.png',
            logo: 'restaurants/Burger_King_logo.png',
            workingHours: '8:00 - 22:00',
            deliveryPrice: 250,
            cookingTime: 15,
            minimumOrderPrice: 450,
            categoryNames: ['Фастфуд'],
        },
        {
            name: 'KFC',
            address: '456 Elm St',
            numberOfWorkers: 10,
            rating: 88,
            banner: 'restaurants/kfc_baner.jpg',
            logo: 'restaurants/KFC_Logo.png',
            workingHours: '9:00 - 23:00',
            deliveryPrice: 200,
            cookingTime: 18,
            minimumOrderPrice: 400,
            categoryNames: ['Фастфуд'],
        },
        {
            name: 'McDonald\'s',
            address: '789 Oak St',
            numberOfWorkers: 15,
            rating: 92,
            banner: 'restaurants/mac_baner.png',
            logo: 'restaurants/mac_logo.png',
            workingHours: '7:00 - 23:00',
            deliveryPrice: 220,
            cookingTime: 12,
            minimumOrderPrice: 500,
            categoryNames: ['Фастфуд'],
        },
        {
            name: 'Pizza House',
            address: '321 Maple Ave',
            numberOfWorkers: 8,
            rating: 87,
            banner: 'restaurants/pizza-house-baner.jpg',
            logo: 'restaurants/pizza-house-logo.jpg',
            workingHours: '10:00 - 22:00',
            deliveryPrice: 300,
            cookingTime: 25,
            minimumOrderPrice: 550,
            categoryNames: ['Італійська кухня', 'Фастфуд'],
        },
        {
            name: 'Sushi Store',
            address: '654 Pine Rd',
            numberOfWorkers: 6,
            rating: 90,
            banner: 'restaurants/susho_store_baner.jpg',
            logo: 'restaurants/susho_store_logo.png',
            workingHours: '11:00 - 21:00',
            deliveryPrice: 280,
            cookingTime: 30,
            minimumOrderPrice: 600,
            categoryNames: ['Азіатська кухня'],
        },
    ];

    const createdRestaurants = [];

    for (const data of restaurantsData) {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: data.name,
                address: data.address,
                numberOfWorkers: data.numberOfWorkers,
                rating: data.rating,
                banner: data.banner,
                logo: data.logo,
                workingHours: data.workingHours,
                deliveryPrice: data.deliveryPrice,
                cookingTime: data.cookingTime,
                minimumOrderPrice: data.minimumOrderPrice,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        createdRestaurants.push({...restaurant, categoryNames: data.categoryNames});

        for (const categoryName of data.categoryNames) {
            const category = categories.find((c) => c.name === categoryName);
            if (category) {
                await prisma.categoryRestaurant.create({
                    data: {
                        restaurantId: restaurant.id,
                        categoryId: category.id,
                    },
                });
            }
        }
    }

    const productCategoriesData = [
        'Піца', 'Бургери', 'Суші', 'Напої', 'Десерти', 'Фрі',
        'Салати', 'Снеки', 'Курячі крильця', 'Нагетси', 'Роли', 'Супи', 'Боули'
    ];

    const productCategories = await Promise.all(productCategoriesData.map(name => prisma.productCategory.create({data: {name}})));

    const productCategoryMap: Record<string, string[]> = {
        'Eats Easy': ['Піца', 'Салати', 'Напої', 'Десерти', 'Боули', 'Бургери', 'Суші'],
        'DonatelloPizza': ['Піца', 'Напої'],
        'Burger King': ['Бургери', 'Фрі', 'Напої'],
        'KFC': ['Бургери', 'Курячі крильця', 'Фрі', 'Напої'],
        'McDonald\'s': ['Бургери', 'Фрі', 'Напої', 'Нагетси', 'Десерти'],
        'Pizza House': ['Піца', 'Салати', 'Напої'],
        'Sushi Store': ['Суші', 'Роли', 'Снеки', 'Напої'],
    };

    for (const restaurant of createdRestaurants) {
        const categoryNames = productCategoryMap[restaurant.name] || [];
        const matchedCategories = productCategories.filter(c => categoryNames.includes(c.name));

        for (const category of matchedCategories) {
            await prisma.restaurantProductCategory.create({
                data: {
                    restaurantId: restaurant.id,
                    categoryId: category.id,
                },
            });
        }
    }

    const categoryProductsMap = {
        "Суші": [
            {
                name: 'Філадельфія',
                subcategory: 'Філадельфія',
                description: 'Рис, норі, лосось норвезький слабосолений, огірок, крем-сир',
                image: 'product/sushi_philadelphia.jpg',
                restaurantNames: ['Sushi Store', 'Eats Easy'],
                weight: {
                    'Sushi Store': 300,
                    'Eats Easy': 330,
                },
                prices: {
                    'Sushi Store': 150,
                    'Eats Easy': 160,
                },
            },
            {
                name: 'Філадельфія Мікс',
                subcategory: 'Філадельфія',
                description: 'Рис, норі, крем-сир, огірок, тунець, норвезький лосось слабосолений, соус унагі',
                image: 'product/sushi_philadelphia_mix.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 310,
                },
                prices: {
                    'Eats Easy': 190,
                },
            },
            {
                name: 'Філадельфія лайт',
                subcategory: 'Філадельфія',
                description: 'Рис, норі, лосось норвезький слабосолений, крем-сир, соус унагі',
                image: 'product/sushi_philadelphia_lite.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 310,
                },
                prices: {
                    'Eats Easy': 190,
                },
            },
            {
                name: 'Каліфорнія креветка-мигдаль',
                subcategory: 'Каліфорнія',
                description: 'Рис, норі, креветка в темпурі, сухарі панко, тамаго, крем-сир, манго-чілі, мигдальні пластівці',
                image: 'product/sushi_california_krevetka.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 260,
                },
                prices: {
                    'Eats Easy': 138,
                },
            },
            {
                name: 'Фісташкова каліфорнія',
                subcategory: 'Каліфорнія',
                description: 'Суші з крабом, авокадо та огірком.',
                image: 'product/sushi_california_fistashka.jpg',
                restaurantNames: ['Sushi Store', 'Eats Easy'],
                weight: {
                    'Sushi Store': 250,
                    'Eats Easy': 260,
                },
                prices: {
                    'Sushi Store': 180,
                    'Eats Easy': 190,
                },
            },
            {
                name: 'Каліфорнія з креветкою',
                subcategory: 'Каліфорнія',
                description: 'Суші з крабом, авокадо та огірком.',
                image: 'product/sushi_california_krevetka_2.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 250,
                },
                prices: {
                    'Eats Easy': 154,
                },
            },
            {
                name: 'Дракон Авокадо-креветка',
                subcategory: 'Дракон',
                description: 'Рис, норі, крем-сир, тигрові креветки, авокадо, темпура, соус унагі, кунжут білий',
                image: 'product/drakon-avokado-krevetka.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 210,
                },
                prices: {
                    'Eats Easy': 210,
                },
            },
            {
                name: 'Дракон з креветкою та лососем',
                subcategory: 'Дракон',
                description: 'Рис, норі, тигрові креветки, лосось норвезький слабосолений, огірок, темпура, кунжут чорний, спайс соус',
                image: 'product/chervonyj-drakon.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 210,
                },
                prices: {
                    'Eats Easy': 210,
                },
            },
            {
                name: 'Дракон з креветкою',
                subcategory: 'Дракон',
                description: 'Рис, норі, крем-сир, тигрові креветки, огірок',
                image: 'product/drakon-z-krevetkoyu-1.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 210,
                },
                prices: {
                    'Eats Easy': 210,
                },
            }
        ],
        "Піца": [
            {
                name: 'Піца курка-бекон',
                description: 'Вершковий соус, сир моцарела, куряче філе, бекон, сир мармуровий, сир пармезан, кукурудза',
                subcategory: "М'ясні",
                image: 'product/pizza-bekon.jpg',
                sizes: ['30 см', '40 см'],
                restaurantNames: ['DonatelloPizza', 'Pizza House', 'Eats Easy'],
                weight: {
                    'DonatelloPizza': 460,
                    'Pizza House': 470,
                    'Eats Easy': 460,
                },
                prices: {
                    'DonatelloPizza': {
                        '30 см': 100,
                        '40 см': 120,
                    },
                    'Pizza House': {
                        '30 см': 110,
                        '40 см': 130,
                    },
                    'Eats Easy': {
                        '30 см': 100,
                        '40 см': 120,
                    },
                },
            },
        ],
        "Бургери": [
            {
                name: 'Чізбургер',
                description: 'Бургер з яловичиною та сиром чеддер.',
                image: 'product/burger_cheeseburger.jpg',
                restaurantNames: ['McDonald\'s'],
                weight: {
                    'McDonald\'s': 400,
                },
                prices: {
                    'McDonald\'s': 50,
                },
            },
            {
                name: 'Kid\'s burger',
                description: 'Булочка бріош, котлета з індички, салат айсберг, помідор, маринований огірок, сир чеддер, майонез',
                image: 'product/kdids_burger.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 190,
                },
                prices: {
                    'Eats Easy': 240,
                },
            },
        ],
        "Фрі": [
            {
                name: 'Картопля фрі',
                description: 'Хрустка картопля фрі',
                image: 'product/fri_classic.jpg',
                restaurantNames: ['McDonald\'s', 'Burger King', 'KFC', 'Eats Easy'],
                weight: {
                    'McDonald\'s': 300,
                    'Burger King': 310,
                    'KFC': 320,
                    'Eats Easy': 300,
                },
                prices: {
                    'McDonald\'s': 30,
                    'Burger King': 35,
                    'KFC': 40,
                    'Eats Easy': 30,
                },
            },
        ],
        "Напої": [
            {
                name: 'Кола 0.5л',
                description: 'Прохолодний напій Coca-Cola.',
                image: 'product/coca-cola-05l.jpg',
                restaurantNames: ['McDonald\'s', 'Eats Easy', 'Pizza House', 'DonatelloPizza', 'Burger King', 'Sushi Store', 'KFC'],
                weight: {
                    'McDonald\'s': 50,
                    'Pizza House': 50,
                    'DonatelloPizza': 50,
                    'Burger King': 50,
                    'Sushi Store': 50,
                    'KFC': 50,
                    'Eats Easy': 50,
                },
                prices: {
                    'McDonald\'s': 20,
                    'Pizza House': 22,
                    'DonatelloPizza': 18,
                    'Burger King': 20,
                    'Sushi Store': 25,
                    'KFC': 22,
                    'Eats Easy': 22,
                },
            },
            {
                name: 'Coca-cola zero 0,5л',
                description: 'Прохолодний напій Coca-cola zero',
                image: 'product/coca-cola-zero.jpg',
                restaurantNames: ['McDonald\'s', 'Eats Easy', 'Pizza House', 'DonatelloPizza', 'Burger King', 'Sushi Store', 'KFC'],
                weight: {
                    'McDonald\'s': 50,
                    'Pizza House': 50,
                    'DonatelloPizza': 50,
                    'Burger King': 50,
                    'Sushi Store': 50,
                    'KFC': 50,
                    'Eats Easy': 50,
                },
                prices: {
                    'McDonald\'s': 20,
                    'Pizza House': 22,
                    'DonatelloPizza': 18,
                    'Burger King': 20,
                    'Sushi Store': 25,
                    'KFC': 22,
                    'Eats Easy': 22,
                },
            },
        ],
        "Боули": [
            {
                name: 'Боул з креветкою',
                description: 'Рис, креветки, темпура, соус унагі, манго-чілі, боби едамаме, помідори чері, огірок, кунжут чорний, манго',
                image: 'product/boul_krevetka.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 390
                },
                prices: {
                    'Eats Easy': 314
                },
            },
            {
                name: 'Боул з куркою',
                description: 'Рис, куряче філе, соус теріякі, манго-чілі, помідори чері, ананаси консервовані, перець болгарський, огірок',
                image: 'product/boul-z-kurkoyu.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 390
                },
                prices: {
                    'Eats Easy': 219
                },
            },
            {
                name: 'Боул з лососем',
                description: 'Рис, норвезький лосось слабосолений, спайс соус, авокадо, боби едамаме, чука, помідори чері, кунжут чорний',
                image: 'product/boul_losos.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 360
                },
                prices: {
                    'Eats Easy': 314
                },
            }
        ],
        "Салати": [
            {
                name: 'Салат з морепродуктами',
                description: 'В салаті поєднюються пікантні креветками і кальмари, ніжний сир лабне, салатний мікс та соковиті помідори чері',
                subcategory: 'Салати з морепродуктами',
                image: 'product/xsalat-z-moreproduktamy.jpeg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 390
                },
                prices: {
                    'Eats Easy': 219
                },
            },
            {
                name: 'Салат з яловичиною',
                description: 'Соковита яловичина з салатним міксом, помідорами чері та ніжним сиром лабне. Доповнений огірком, та зеленим горошком',
                subcategory: "Салати з м'ясом",
                image: 'product/z-yalovychynoyu.jpg',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 390
                },
                prices: {
                    'Eats Easy': 219
                },
            }
        ],
        "Десерти": [
            {
                name: 'Вафельний торт',
                description: 'Хрумкі вафельні коржі, згущене молоко з вершковим маслом, солона карамель та мигдалеві пластівці',
                subcategory: "Торти",
                image: 'product/waffle_cake.png',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 390
                },
                prices: {
                    'Eats Easy': 219
                }
            },
            {
                name: 'Еклер Класичний',
                description: 'Повітряне заварне тісто з ніжним вершковим кремом всередині — класика, яка ніколи не набридає',
                subcategory: "Еклери",
                image: 'product/eclair_classic.png',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 100
                },
                prices: {
                    'Eats Easy': 165
                }
            },
            {
                name: 'Брауні',
                description: 'Шоколадний десерт з насиченим смаком, без цукру, глютену та лактози — ідеальний варіант для поціновувачів здорових солодощів',
                subcategory: "Десерти без цукру, глютену та лактози",
                image: 'product/brownie.png',
                restaurantNames: ['Eats Easy'],
                weight: {
                    'Eats Easy': 125
                },
                prices: {
                    'Eats Easy': 265
                }
            },
        ]
    };

    for (const [categoryName, products] of Object.entries(categoryProductsMap)) {
        const category = await prisma.productCategory.findUnique({where: {name: categoryName}});
        if (!category) {
            console.log(`Category ${categoryName} does not exist. Skipping...`);
            continue;
        }

        for (const product of products) {
            let subcategoryId: string | undefined;

            if ('subcategory' in product && product.subcategory) {
                const existingSubcategory = await prisma.productSubcategory.findFirst({
                    where: {
                        name: product.subcategory,
                        categoryId: category.id,
                    },
                });

                if (existingSubcategory) {
                    subcategoryId = existingSubcategory.id;
                } else {
                    const createdSubcategory = await prisma.productSubcategory.create({
                        data: {
                            name: product.subcategory,
                            categoryId: category.id,
                        },
                    });
                    subcategoryId = createdSubcategory.id;
                }
            }

            if ('sizes' in product && Array.isArray(product.sizes) && product.sizes.length > 0) {
                for (const size of product.sizes) {
                    const sizedProductName = `${product.name} (${size})`;

                    await prisma.product.create({
                        data: {
                            name: sizedProductName,
                            description: product.description,
                            image: product.image,
                            categoryId: category.id,
                            subcategoryId,
                            sizes: { create: [{ size }] },
                            restaurantProducts: {
                                create: product.restaurantNames.map(restaurantName => {
                                    const restaurant = createdRestaurants.find(r => r.name === restaurantName);
                                    return {
                                        restaurant: { connect: { id: restaurant?.id } },
                                        price: product.prices?.[restaurantName]?.[size] || 0,
                                        weight: product.weight?.[restaurantName] || null,
                                        isAvailable: true,
                                    };
                                }),
                            },
                        },
                    });
                }
            } else {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        image: product.image,
                        categoryId: category.id,
                        subcategoryId,
                        restaurantProducts: {
                            create: product.restaurantNames.map(restaurantName => {
                                const restaurant = createdRestaurants.find(r => r.name === restaurantName);
                                return {
                                    restaurant: { connect: { id: restaurant?.id } },
                                    price: product.prices?.[restaurantName] || 0,
                                    weight: product.weight?.[restaurantName] || null,
                                    isAvailable: true,
                                };
                            }),
                        },
                    },
                });
            }
        }
    }

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
