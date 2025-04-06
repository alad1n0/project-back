import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const faqs = [
    {
      title: 'Як знайти потрібну страву чи заклад?',
      description:
        'Ви можете скористатися пошуком на головній сторінці, вибрати категорію страв або застосувати фільтри для швидкого пошуку.',
    },
    {
      title: 'Як зробити замовлення?',
      description:
        'Обираєте страву, додаєте до кошика та підтверджуєте замовлення в кошику, вказавши свої контактні дані.',
    },
    {
      title: 'Чи можна зробити повторне замовлення?',
      description:
        'Так — у вашому профілі в розділі “Історія замовлень” можна обрати будь‑яке попереднє замовлення й повторити його.',
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
