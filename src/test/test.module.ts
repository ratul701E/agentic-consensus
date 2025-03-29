import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestSchema } from 'src/schemas/test.schema';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),

  ]
})
export class TestModule { }
