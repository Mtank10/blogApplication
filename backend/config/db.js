import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMongoDb(){
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
testMongoDb()
export default prisma;