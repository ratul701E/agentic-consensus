import { Injectable } from "@nestjs/common";
import { SysInfo } from "./types";
import * as os from "os";
import { execSync } from "child_process";

@Injectable()
export class SysInfoService {
  getSysInfo(): SysInfo {
    const cpus = os.cpus();
    const totalMemoryInBytes = os.totalmem();
    const freeMemoryInBytes = os.freemem();
    const disk = this.getDiskSpace();

    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptimeSeconds: os.uptime(),
      loadAverage: {
        oneMin: os.loadavg()[0],
        fiveMin: os.loadavg()[1],
        fifteenMin: os.loadavg()[2],
      },
      totalMemory: {
        totalMemoryInBytes,
      },
      freeMemory: {
        freeMemoryInBytes,
      },
      disk,
      networkInterfaces: this.getNetworkInterfaces(),
      cpu: {
        cpuModel: cpus[0]?.model ?? "Unknown",
        cpuCount: cpus.length,
        cpuSpeedMHz: cpus[0]?.speed ?? 0,
        cores: cpus.map((core, index) => ({
          core: index,
          speedMHz: core.speed,
          times: core.times,
        })),
      },
    };
  }

  private getDiskSpace() {
    try {
      // Cross-platform would need different strategies.
      // This works on Unix/Linux/macOS.
      const output = execSync("df -k /").toString();
      const lines = output.trim().split("\n");
      const parts = lines[1].split(/\s+/);
      const total = parseInt(parts[1], 10) * 1024; // in bytes
      const free = parseInt(parts[3], 10) * 1024; // in bytes

      return {
        totalDiskSpaceInBytes: total,
        freeDiskSpaceInBytes: free,
      };
    } catch (error) {
      return {
        totalDiskSpaceInBytes: 0,
        freeDiskSpaceInBytes: 0,
      };
    }
  }

  private getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const result = {};

    for (const [name, infos] of Object.entries(interfaces)) {
      result[name] =
        infos?.map((info) => ({
          address: info.address,
          family: info.family,
          mac: info.mac,
          internal: info.internal,
          cidr: info.cidr,
          netmask: info.netmask,
        })) ?? [];
    }

    return result;
  }
}
