import { ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddProductDto{

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsEnum(ProductCategory)
    categary: ProductCategory;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    price: Decimal;

    @IsNumber()
    stock: number;
}