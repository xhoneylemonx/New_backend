import { 

  Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, 

  MaxFileSizeValidator 

} from '@nestjs/common'; 

import { ProductsService } from './products.service'; 

import { CreateProductDto } from './dto/create-product.dto'; 

import { UpdateProductDto } from './dto/update-product.dto'; 

import { FileInterceptor } from '@nestjs/platform-express'; 

import type { Express } from 'express'; 

import { PRODUCT_IMAGE } from './products.constants'; 

 

  // ------------------------------------------------------- 

  // ------------------------------------------------------- 

  // ------------------------------------------------------- 

 

 

  // สร้างสินค้า (Create) แบบมีไฟล์แนบ 

  @Post() 

  @UseInterceptors(FileInterceptor('image')) // ชื่อฟิลด์ที่รับไฟล์จาก form-data “image” 

  create( 

    @Body() dto: CreateProductDto, 

    @UploadedFile( 

      new ParseFilePipe({ 

        fileIsRequired: false, 

        validators: [ 

          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE }) 

        ], 

      }), 

    ) 

    file?: Express.Multer.File, 

  ) { 

    return this.productsService.create(dto, file); 

  } 

 