import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { loginDto } from './auth.e2e-spec';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateProductDto = {
	image: '1.png',
	title: 'Iphone 5',
	price: 2444,
	oldPrice: 2300,
	credit: 540,
	description: 'This is new Iphone',
	advantages: 'Cool camera',
	disAdvantages: 'Price',
	categories: ['phone'],
	characteristics: [
		{
			name: 'Camera',
			value: '3px',
		},
		{
			name: 'Screen',
			value: 'Retina',
		},
	],
	tags: ['apple'],
};

describe('ProductController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
		token = body.access_token;
	});

	it('/product/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/product/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	// it('/review/create (POST) - fail', () => {
	// 	return request(app.getHttpServer())
	// 		.post('/review/create')
	// 		.send({ ...testDto, rating: 0 })
	// 		.expect(400);
	// });

	// it('/review/create (POST) - fail with message', async () => {
	// 	return request(app.getHttpServer())
	// 		.post('/review/create')
	// 		.send({ ...testDto, rating: 0 })
	// 		.expect(400)
	// 		.then(({ body }: request.Response) => {
	// 			const message = body.message[0];
	// 			expect(message).toBe('Rating cannot be less then 1');
	// 		});
	// });

	// it('/review/byProduct/:productId (GET) - success', async () => {
	// 	return request(app.getHttpServer())
	// 		.get('/review/byProduct/' + productId)
	// 		.expect(200)
	// 		.then(({ body }: request.Response) => {
	// 			expect(body.length).toBe(1);
	// 		});
	// });

	// it('/review/byProduct/:productId (GET) - fail', async () => {
	// 	return request(app.getHttpServer())
	// 		.get('/review/byProduct/' + new Types.ObjectId().toHexString())
	// 		.expect(200)
	// 		.then(({ body }: request.Response) => {
	// 			expect(body.length).toBe(0);
	// 		});
	// });

	// it('/review/:id (DELETE) - success', () => {
	// 	return request(app.getHttpServer())
	// 		.delete('/review/' + createdId)
	// 		.set('Authorization', 'Bearer ' + token)
	// 		.expect(200);
	// });

	// it('/review/:id (DELETE) - fail', () => {
	// 	return request(app.getHttpServer())
	// 		.delete('/review/' + new Types.ObjectId().toHexString())
	// 		.set('Authorization', 'Bearer ' + token)
	// 		.expect(404, {
	// 			statusCode: 404,
	// 			message: REVIEW_NOT_FOUND,
	// 		});
	// });

	afterAll(() => {
		disconnect();
	});
});
