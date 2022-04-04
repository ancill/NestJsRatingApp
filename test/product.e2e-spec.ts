import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import { Types, disconnect } from 'mongoose';

import { loginDto } from './auth.e2e-spec';
import { INVALID_VALIDATION_ID } from '../src/pipes/id-validation.constant';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { PRODUCT_NOT_FOUND } from '../src/product/product.constants';
import { FindProductDto } from '../src/product/dto/find-product.dto';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';

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

	it('/product/create (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/product/create')
			.send({ ...testDto, oldPrice: 'Cool' })
			.expect(400);
	});

	it('/product/update (PATCH) - success', async () => {
		return request(app.getHttpServer())
			.patch('/product/' + createdId)
			.send({ ...testDto, advantages: 'USB charger not included' })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.advantages).toBe('USB charger not included');
			});
	});
	it('/product/update (PATCH) - fail', async () => {
		return request(app.getHttpServer())
			.patch('/product/' + new Types.ObjectId().toHexString())
			.send({ ...testDto, advantages: 'USB charger not included' })
			.expect(404);
	});

	it('/product/:id (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/product/' + createdId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.characteristics.length).toBe(2);
			});
	});

	it('/product/:id (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/product/' + new Types.ObjectId().toHexString())
			.expect(404, {
				statusCode: 404,
				message: PRODUCT_NOT_FOUND,
				error: 'Not Found',
			});
	});

	it('/product/:id (GET) - fail with Bad Request', async () => {
		return request(app.getHttpServer())
			.get('/product/' + '412412412')
			.expect(400, {
				statusCode: 400,
				message: INVALID_VALIDATION_ID,
				error: 'Bad Request',
			});
	});

	// Mock review for this product
	it('/review/create (POST) - MOCK success', async () => {
		const reviewTestDto: CreateReviewDto = {
			name: 'test 1',
			title: 'title',
			description: 'descr for test',
			rating: 5,
			productId: createdId,
		};
		await request(app.getHttpServer())
			.post('/review/create')
			.send({ ...reviewTestDto, name: 'test 2', rating: 3 })
			.expect(201);
		return request(app.getHttpServer()).post('/review/create').send(reviewTestDto).expect(201);
	});

	it('/product/:id (POST) - success', async () => {
		const testFindDto: FindProductDto = { limit: 5, category: 'phone' };

		return request(app.getHttpServer())
			.post('/product/find')
			.send(testFindDto)
			.expect(200)
			.then(async ({ body }: request.Response) => {
				const id_1 = body[0].reviews[0]._id;
				const id_2 = body[0].reviews[1]._id;
				// remove found review mocks
				await request(app.getHttpServer())
					.delete('/review/' + id_1)
					.set('Authorization', 'Bearer ' + token)
					.expect(200);
				await request(app.getHttpServer())
					.delete('/review/' + id_2)
					.set('Authorization', 'Bearer ' + token)
					.expect(200);
			});
	});

	it('/product/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/product/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/product/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete('/product/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: PRODUCT_NOT_FOUND,
				error: 'Not Found',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
