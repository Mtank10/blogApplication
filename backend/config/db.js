import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPostgresDb(){
  try{
    await prisma.$connect();
      }
    catch(err){
      console.log(err)
    }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
testPostgresDb()
export default prisma;
