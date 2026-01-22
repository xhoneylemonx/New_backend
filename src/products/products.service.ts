// src/products/products.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { safeUnlinkByRelativePath } from '../common/utils/file.utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  /**
   * แปลง disk path ให้เป็น public path
   * เช่น "uploads/products/uuid.jpg" -> "products/uuid.jpg"
   */
  private toPublicImagePath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/'); // กัน Windows path
    // ตัด 'uploads/' หรือ './uploads/' ออกให้หมด
    return normalized
      .replace(/^\.?\/?uploads\//, '')
      .replace(/^uploads\//, '');
  }

  // --- สร้างสินค้า (Create) ---
  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const diskPath = file?.path?.replace(/\\/g, '/'); // เช่น uploads/products/uuid.jpg
    const imageUrl = diskPath ? this.toPublicImagePath(diskPath) : undefined; // products/uuid.jpg

    try {
      const product = await this.productModel.create({
        ...dto,
        ...(imageUrl ? { imageUrl } : {}),
      });
      return product;
    } catch (err) {
      // หาก error ให้ลบไฟล์ที่อัปโหลดไว้
      if (diskPath) await safeUnlinkByRelativePath(diskPath);
      throw new InternalServerErrorException('Create product failed');
    }
  }

  // --- ดึงสินค้าทั้งหมด (Read All) ---
  async findAll() {
    return this.productModel.find().exec();
  }

  // --- ดึงสินค้าตาม ID (Read One) ---
  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // --- อัปเดตสินค้า (Update) ---
  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      // ลบไฟล์ใหม่ที่อัปโหลดมาเพราะไม่มี product
      if (file?.path) await safeUnlinkByRelativePath(file.path);
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const diskPath = file?.path?.replace(/\\/g, '/');
    const newImageUrl = diskPath ? this.toPublicImagePath(diskPath) : undefined;

    // ถ้ามีรูปใหม่ ให้ลบรูปเก่า
    if (newImageUrl && existingProduct.imageUrl) {
      const oldDiskPath = `uploads/${existingProduct.imageUrl}`;
      await safeUnlinkByRelativePath(oldDiskPath);
    }

    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(
          id,
          {
            ...dto,
            ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
          },
          { new: true },
        )
        .exec();
      return updatedProduct;
    } catch (err) {
      if (diskPath) await safeUnlinkByRelativePath(diskPath);
      throw new InternalServerErrorException('Update product failed');
    }
  }

  // --- ลบสินค้า (Delete) ---
  async remove(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // ลบรูปภาพถ้ามี
    if (product.imageUrl) {
      const diskPath = `uploads/${product.imageUrl}`;
      await safeUnlinkByRelativePath(diskPath);
    }

    await this.productModel.findByIdAndDelete(id).exec();
    return { message: `Product with ID "${id}" has been deleted` };
  }
}