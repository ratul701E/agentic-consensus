import { Injectable } from "@nestjs/common";
import { getLocalIp } from "src/main";

@Injectable()
export class P2pClientService {
  private readonly PORT = process.env.PORT || 3000; //process.argv[process.argv.indexOf("--port") + 1]
  private node_addresses: Record<string, string> = {
    own: getLocalIp() + ":" + this.PORT,
  };
  private sockets: any = [];
  private seed_sockets: any = [];
  private readonly seed_servers: string[] = [
    process.env.SEED_SERVER_ADDRESS || "http://192.168.31.202:4000",
    //"http://localhost:4001",
    //"http://localhost:4002",
  ];

  constructor() {
    //this.seed_servers.push(process.env.SEED_SERVER_ADDRESS_1 || "http://seed:4000")
  }

  addNodeAddress(id: string, addr: string): void {
    const existingAddresses = Object.values(this.node_addresses);
    if (!existingAddresses.includes(addr)) {
      this.node_addresses[id] = addr;
    }
  }

  addNodeAddresses(addresses: Record<string, string>): void {
    for (const [id, addr] of Object.entries(addresses)) {
      const existingAddresses = Object.values(this.node_addresses);
      if (!existingAddresses.includes(addr)) {
        this.node_addresses[id] = addr;
      }
    }
  }

  // replaceNodeAddressList(addrs: string[]) : void {
  //     this.node_addresses = addrs
  // }

  appendNodeAddrList(addrs: string[]): void {
    // this.node_addresses = [...new Set(...addrs, ...this.node_addresses)];
  }

  getNodeAddress(): string[] {
    return Object.values(this.node_addresses);
  }

  removeFromActiveNodeList(id: string): void {
    delete this.node_addresses[id];
  }

  addSocket(socket: any): void {
    this.sockets.push(socket);
  }

  getSocketList(): any[] {
    return this.sockets;
  }

  replaceSocketList(sockets: any[]): void {
    this.sockets = sockets;
  }

  getSeedNodeAddrList(): string[] {
    return this.seed_servers;
  }

  // addSeedNodeAddr(addr: string): void {
  //     this.seed_servers.push(addr)
  // }

  // replaceSeedNodeAddr(addrs: string[]): void {
  //     this.seed_servers = addrs
  // }

  addSeedSocket(seedSocket: any): void {
    this.seed_sockets.push(seedSocket);
  }

  getSeedSocketList(): any[] {
    return this.seed_sockets;
  }
}
