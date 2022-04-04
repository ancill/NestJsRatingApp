import { IsNumber, IsString } from 'class-validator';
import { ReviewModel } from 'src/review/review.model';
import { ProductModel } from '../product.model';

export class FindProductDto {
	@IsString()
	category: string;

	@IsNumber()
	limit: number;
}

export class FindWithReviews extends ProductModel {
	review: ReviewModel[];
	reviewCount: number;
	reviewAvg: number;
}
