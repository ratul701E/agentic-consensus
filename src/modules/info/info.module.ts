import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NodeInfo, NodeInfoSchema } from 'src/schemas/node-info.schema';
import { InfoController } from './info.controller';

@Module({
  providers: [InfoService],
  imports: [MongooseModule.forFeature([{ name: NodeInfo.name, schema: NodeInfoSchema }])],
  controllers: [InfoController],
})
export class InfoModule {}
