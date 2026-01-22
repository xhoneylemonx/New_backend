import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const productsService = appContext.get(ProductsService);

  const products = [
    {
      name: 'Gaming Mouse',
      price: 1500,
      description: 'High precision optical sensor',
      colors: ['black', 'rgb'],
    },
    {
      name: 'Mechanical Keyboard',
      price: 3200,
      description: 'Blue switches, clicky sound',
      colors: ['black', 'white', 'pink'],
    },
    {
      name: 'Gaming Monitor 24"',
      price: 5500,
      description: '144Hz Refresh Rate',
      colors: ['black'],
    },
    {
      name: 'Gaming Headset',
      price: 2100,
      description: '7.1 Surround Sound',
      colors: ['black', 'red'],
    },
  ];

  console.log('Seeding data...');
  for (const product of products) {
    await productsService.create(product);
    console.log(`Created: ${product.name}`);
  }

  console.log('Seeding complete!');
  await appContext.close();
}

bootstrap();
