import { Module } from '@nestjs/common';
import { RedisServiceService } from './redis-service.service';
import { BullModule } from '@nestjs/bullmq';
import { Queues } from 'src/jobs/queue.enum';

@Module({
  controllers: [],
  providers: [RedisServiceService],
  imports: [BullModule.registerQueue({
    name: Queues.SYS_PERFORMENCE_ANALYZER,
  })],
})
export class RedisServiceModule {}
