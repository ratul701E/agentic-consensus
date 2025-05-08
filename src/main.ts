import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as os from "os";
import { CustomLogger } from "./logger/custom.logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.enableCors({
    origin: "*",
  });
  const PORT = process.env.PORT || 3000;
  try {
    await app.listen(PORT, getLocalIp());
    console.log("Running on: " + getLocalIp() + ":" + PORT);
  } catch (e) {
    console.log("❌ You're not connected with the internet ⛓️‍💥. Please check your network and try again.");
    process.exit();
  }
}

bootstrap();

export const getLocalIp = (): string => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];

    if (addresses) {
      for (const addressInfo of addresses) {
        if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          return addressInfo.address;
        }
      }
    }
  }
  return "172.0.0.1";
};
