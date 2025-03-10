import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeepseekAgentModule } from './deepseek-agent/deepseek-agent.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DeepseekAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
