import { IsIn, IsInt, IsNumber, IsUUID, Min } from "class-validator";

export class AddStockDto{

    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number
}