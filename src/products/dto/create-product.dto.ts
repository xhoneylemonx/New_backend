import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator'; 

import { Type } from 'class-transformer'; 

 

export class CreateProductDto { 

    @IsNotEmpty() 

    @IsString() 

    name: string; 

 

    @IsNotEmpty() 

    @IsNumber() 

    @Min(0) 

    @Type(() => Number) // แปลงจาก form-data (string) เป็น number 

    price: number; 

 

    @IsOptional() 

    @IsString() 

    description?: string; 

 

} 