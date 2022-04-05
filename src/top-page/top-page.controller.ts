import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUNT } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);
		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUNT);
		}
		return topPage;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {}

	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindTopPageDto) {}
}
