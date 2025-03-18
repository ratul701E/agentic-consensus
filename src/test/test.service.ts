import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from 'src/schema/test.schema';

@Injectable()
export class TestService {
    constructor(
        @InjectModel(Test.name) private readonly testModel: Model<Test>
    ){}

    async create(name: string) {
        const res = await this.testModel.create({name});
        return res;
    }
}
