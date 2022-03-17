import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductModel } from './product.model';

@Controller('product')
export class ProductController {
	@Post('create')
	async create(@Body() dto: Omit<ProductModel, '_id'>) {}

	@Get(':id')
	async get() {}
}
