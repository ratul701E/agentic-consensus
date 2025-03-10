import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiAgentModule } from './openai-agent/openai-agent.module';

@Module({
  imports: [OpenaiAgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
