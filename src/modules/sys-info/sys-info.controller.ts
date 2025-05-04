import { Controller, Get } from "@nestjs/common";
import { SysInfoService } from "./sys-info.service";

@Controller("sys-info")
export class SysInfoController {
  constructor(private readonly sysInfoService: SysInfoService) {}

  @Get()
  getSysInfo() {
    return this.sysInfoService.getSysInfo();
  }
}
