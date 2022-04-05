import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export enum TopLevelCategoryDto {
	Courses,
	Services,
	Books,
	Products,
}

export class HhDataDto {
	@IsNumber()
	count: number;

	@IsNumber()
	juniorSalary: number;

	@IsNumber()
	middleSalary: number;

	@IsNumber()
	seniorSalary: number;
}

export class TopPageAdvantageDto {
	@IsString()
	title: string;

	@IsString()
	description: string;
}

export class CreateTopPageDto {
	@IsEnum(TopLevelCategoryDto)
	firstCategory: TopLevelCategoryDto;

	@IsString()
	secondCategory: string;

	@IsNotEmpty()
	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	category: string;

	@IsObject()
	@ValidateNested()
	@Type(() => HhDataDto)
	hh?: HhDataDto;

	@IsArray()
	@ValidateNested()
	@Type(() => TopPageAdvantageDto)
	advantages: TopPageAdvantageDto[];

	@IsString()
	seoText: string;

	@IsString()
	tagsTitle: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
