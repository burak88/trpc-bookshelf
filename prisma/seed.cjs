const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed_password = await bcrypt.hash("admin", 12);
  // Default bir kullanıcı ekleyelim
  const user = await prisma.user.create({
    data: {
      id: uuidv4(), // UUID'yi manuel olarak oluşturuyoruz
      email: 'admin@example.com',
      password: hashed_password,
      name: 'admin',
    },
  });

  console.log({ user });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });