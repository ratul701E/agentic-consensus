import { Module } from '@nestjs/common';
import { SysInfoService } from './sys-info.service';
import { SysInfoController } from './sys-info.controller';

@Module({
  controllers: [SysInfoController],
  providers: [SysInfoService],
  exports: [SysInfoService]
})
export class SysInfoModule {}
