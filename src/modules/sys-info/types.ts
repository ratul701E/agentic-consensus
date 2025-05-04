export interface CpuTimes {
  user: number;
  nice: number;
  sys: number;
  idle: number;
  irq: number;
}

export interface SysInfo {
  hostname: string;
  platform: string;
  arch: string;
  uptimeSeconds: number;
  loadAverage: {
    oneMin: number;
    fiveMin: number;
    fifteenMin: number;
  };
  totalMemory: {
    totalMemoryInBytes: number;
  };
  freeMemory: {
    freeMemoryInBytes: number;
  };
  disk: {
    totalDiskSpaceInBytes: number;
    freeDiskSpaceInBytes: number;
  };
  networkInterfaces: Record<string, Array<{
    address: string;
    family: string;
    mac: string;
    internal: boolean;
    cidr: string | null;
    netmask: string;
  }>>;
  cpu: {
    cpuModel: string;
    cpuCount: number;
    cpuSpeedMHz: number;
    cores: Array<{
      core: number;
      speedMHz: number;
      times: CpuTimes;
    }>;
  };
}
