import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123%', 10);

  // Seed Users
  const users = [
    {
      email: 'admin@hotels.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
    {
      email: 'user@gmail.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'USER',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: user,
    });
  }
  console.log('Users seeded with hashed passwords');

  // Seed Hotels
  const hotels = [
    {
      name: 'The Lumiere Grand',
      location: 'Zurich, Switzerland',
      description: 'A luxury boutique hotel exterior in Zurich, Switzerland, featuring modern glass architecture mixed with historic stone.',
      price: 420,
      rating: 4.9,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr_dcO_arhrXlkPTTN9vqt2QjyvlgQAcYv77V1Xu076bw-pGPAR6o5lWmPlYquUL4a21eJpn74pgKl1McwSQtRygnAU--8IDTm0bKmbQXu9Hpn98SkDOOyMISEHSZKLW94_fWwv_b0SMsxnwNcYu2J9EMph03U6v2aDATP_IDxjtoCgnJevxt0I56C6BYOyvCK9qu--GTyjxJ2qBBhuAkbUg_ze3F1zDZ_76F6JxIDuR7dvINiCtyjlsdPO2xR_t9wvgcKS3Ubdbc',
      status: 'OPERATIONAL',
      amenities: ['Free Wi-Fi', 'Pool', 'Fitness Center'],
    },
    {
      name: 'Azure Heights Resort',
      location: 'Santorini, Greece',
      description: 'A minimalist coastal resort in Santorini, Greece. Pristine white curved walls under a bright, high-contrast Mediterranean sun.',
      price: 680,
      rating: 4.8,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACno-0NnG3mWIxL_JO_lF1T19DLXB4Yz0M6JKr2VM3640U6e2CKbzQac_6tisiLz7L2CvsNK67nBqc5Pe1yCuI5C_ChAJPLsbOLnt8jzh6Nc7jRCnj0TOAfZhzxi718fZ3VZUmB5XccPU6jAOEyv31M1RcuEiASgLbSAMeC9kN38useppgKFZbEF56HrY9y46kjEA2fR_aoGJhpwB1J7SPbJOs0tD2B8IVzGWKfnZfTqCRY0iVERGqU_XE7I8hKvoDRMkV1trHXmQ',
      status: 'OPERATIONAL',
      amenities: ['Wellness Spa', 'Breakfast', 'Ocean View'],
    },
    {
      name: 'Neo-Metro Suites',
      location: 'Tokyo, Japan',
      description: 'A modern urban hotel interior in Tokyo, Japan. High-tech minimalist lobby with clean lines, dark wood accents.',
      price: 310,
      rating: 4.7,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTkdUYq5GliRTd_tmP8-yp0pBhRPLX2wctyHZ-0sNtE-zQRC3E7vZxXA7lQidGjrA7ujqKbkyG9tUp1grxb8IwWDhJUTEUpSsVAKqC93PGCywWMGsn64w4TJIk4lbNwW_CXdNSwITaAPZr1hoIVq9kBRxo3WWJI6p_Y8uKa0rSgKOtzBNGCCbZqSbrjpnwYvBj33Hxy33ma50xdOCoA7a_9sLF1leKr_Jtl9RRzgHi5XHYSUgWJ07oYQJOcsMn4UVm2AOl-g6Mv9Y',
      status: 'OPERATIONAL',
      amenities: ['Near Transit', '24h Gym', 'High-speed Internet'],
    },
    {
      name: 'Veridian Forest Lodge',
      location: 'Osa Peninsula, Costa Rica',
      description: 'An eco-luxury lodge in the rainforest of Costa Rica. Sustainably sourced wood architecture with open terraces.',
      price: 290,
      rating: 4.9,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAomUmhXGgdYBC6SBaDDYt1jUL4fVGljngeW0UMU1bfs7uIkJODgCZNU9xuSsk1hvSSZ04u6rWiKoETYck0lbe9422UU0XVz4aEh4BFx6nwwvoYs0E7yakTbimvEXpwb7K_RjEDs5CH8X48Jt2UIXGgfQKLLC_6m8u7yYG6FRadW7ECH-zGeIKZV6sCRqmRfSzlhZxAit1bPFu3wdJXVblEXmHgHJlV69uSiv0pqO53VMhxtrPM4dTw7fdNdw3jDxrvoLLUFdgYHkg',
      status: 'OPERATIONAL',
      amenities: ['Sustainable', 'Guided Tours', 'Nature Trails'],
    },
  ];

  for (const hotel of hotels) {
    const existing = await prisma.hotel.findFirst({ where: { name: hotel.name } });
    if (!existing) {
      await prisma.hotel.create({ data: hotel });
    }
  }
  console.log('Hotels seeded');

  console.log('Seed data process completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
