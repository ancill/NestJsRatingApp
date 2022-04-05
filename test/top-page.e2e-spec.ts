import { Types, disconnect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTopPageDto, TopLevelCategoryDto } from '../src/top-page/dto/create-top-page.dto';
import { loginDto } from './auth.e2e-spec';
import { TOP_PAGE_NOT_FOUNT } from '../src/top-page/top-page.constants';

const testDto: CreateTopPageDto = {
	advantages: [{ description: 'test description', title: 'Test' }],
	category: 'Blog',
	alias: 'TOP_PRODUCT_ALIAS',
	firstCategory: TopLevelCategoryDto.Courses,
	secondCategory: 'secondCategory',
	seoText: 'A lot of text',
	tags: ['Test'],
	tagsTitle: 'Test',
	title: 'Top page Test',
	hh: {
		count: 3,
		juniorSalary: 4000,
		middleSalary: 6000,
		seniorSalary: 8000,
	},
};

describe('TopPageController (e2e)', () => {
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

	it('/top-page/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/top-page/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/top-page/create (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/top-page/create')
			.send({ ...testDto, category: 42 })
			.expect(400);
	});

	it('/top-page/:id (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page/' + createdId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.advantages.length).toBe(1);
			});
	});

	it('/top-page/:id (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/top-page/' + new Types.ObjectId().toHexString())
			.expect(404, {
				statusCode: 404,
				message: TOP_PAGE_NOT_FOUNT,
				error: 'Not Found',
			});
	});

	it('/top-page/byAlias/:alias (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page/byAlias/' + 'TOP_PRODUCT_ALIAS')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.firstCategory).toBe(TopLevelCategoryDto.Courses);
			});
	});

	it('/top-page/update (PATCH) - success', async () => {
		return request(app.getHttpServer())
			.patch('/top-page/' + createdId)
			.send({ ...testDto, seoText: 'cool test' })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.seoText).toBe('cool test');
			});
	});

	it('/top-page/update (PATCH) - fail', async () => {
		return request(app.getHttpServer())
			.patch('/top-page/' + new Types.ObjectId().toHexString())
			.send({ ...testDto, seoText: 'cool test' })
			.expect(404);
	});

	it('/top-page/find (GET) - success', async () => {
		return request(app.getHttpServer())
			.post('/top-page/find')
			.send({ firstCategory: TopLevelCategoryDto.Courses })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body[0].alias).toBe('TOP_PRODUCT_ALIAS');
			});
	});

	it('/top-page/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/top-page/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/top-page/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete('/top-page/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: TOP_PAGE_NOT_FOUNT,
				error: 'Not Found',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
