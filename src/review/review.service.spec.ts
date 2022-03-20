import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	const reviewRepositoryFactory = () => {};
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{
					useFactory: reviewRepositoryFactory,
					provide: getModelToken('ReviewModel'),
				},
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
