import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Answer } from '../entities/answers.entity';
import { Question } from '../entities/questions.entity';

const config : ConfigService = new ConfigService();

export const typeORMConfig : TypeOrmModuleOptions = {
        type: 'postgres',
        host: config.get<ConfigService>('DATABASE_HOST'),
        port: config.get<ConfigService>('DATABASE_PORT'),
        username: config.get<ConfigService>('DATABASE_USERNAME'),
        password: config.get<ConfigService>('DATABASE_PASSWORD'),
        database: config.get<ConfigService>('DATABASE_DATABASE'),
        entities: [Question, Answer],
        synchronize : false
}

export const testTypeORMConfig : TypeOrmModuleOptions = {
        type: 'postgres',
        host: config.get<ConfigService>('TEST_DATABASE_HOST'),
        port: config.get<ConfigService>('TEST_DATABASE_PORT'),
        username: config.get<ConfigService>('TEST_DATABASE_USERNAME'),
        password: config.get<ConfigService>('TEST_DATABASE_PASSWORD'),
        database: config.get<ConfigService>('TEST_DATABASE_DATABASE'),
        entities: [Question, Answer],
        synchronize : true
}