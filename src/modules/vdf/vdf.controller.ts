import { Controller, Get } from "@nestjs/common";
import { VdfService } from "./vdf.service";

@Controller("vdf")
export class VdfController {
  constructor(private readonly vdfService: VdfService) {}

  @Get("get-latest-tick")
  getLatestTick() {
    return this.vdfService.getLatestTick();
  }
}
