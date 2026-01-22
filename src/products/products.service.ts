// src/products/products.service.ts 

import { Injectable, NotFoundException,InternalServerErrorException} from '@nestjs/common'; 

import { InjectModel } from '@nestjs/mongoose'; 

import { Model } from 'mongoose'; 

import { CreateProductDto } from './dto/create-product.dto'; 

import { UpdateProductDto } from './dto/update-product.dto'; 

import { Product } from './entities/product.entity'; 

import { safeUnlinkByRelativePath } from '../common/utils/file.utils'; 
import { async } from 'rxjs';
import { string, file } from 'zod';

 

  // ------------------------------------------------------- 

  // ------------------------------------------------------- 

  // ------------------------------------------------------- 

 

 

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

      return await this.productModel.create({ 

        ...dto, 

        ...(imageUrl ? { imageUrl } : {}), 

      }); 

    } catch (err) { 

      if (diskPath) await safeUnlinkByRelativePath(diskPath); // ลบ “disk path” เท่านั้น 

      throw new InternalServerErrorException('Create product failed'); 

    } 

  } 



function toPublicImagePath(filePath: any, string: any) {
  throw new Error('Function not implemented.');
}


function create(dto: any, CreateProductDto: typeof CreateProductDto, arg2: any) {
  throw new Error('Function not implemented.');
}
 