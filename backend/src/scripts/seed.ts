import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from '../seeder/seeder.service';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const seederService = app.get(SeederService);
    await seederService.seedAll();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeder();