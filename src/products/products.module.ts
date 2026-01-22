import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { multerConfigFactory } from '../common/utils/multer.config';
import { PRODUCT_STORAGE_FOLDER, PRODUCT_IMAGE } from './products.constants';

@Module({
  imports: [
    // นำเข้า Schema สำหรับ MongoDB
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

    // ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
    MulterModule.registerAsync(
      multerConfigFactory(PRODUCT_STORAGE_FOLDER, {
        maxSize: PRODUCT_IMAGE.MAX_SIZE,
        allowedMimeTypes: PRODUCT_IMAGE.ALLOWED_MIME_TYPES,
      }),
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }