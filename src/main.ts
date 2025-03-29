import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os'
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const PORT = process.argv[process.argv.indexOf("--port") + 1]
  app.enableCors()
  const PORT = process.env.PORT || 3000

  await app.listen(PORT, getLocalIp());
  console.log("Running on: " + getLocalIp() + ":" + PORT)
}

bootstrap();

export const getLocalIp = (): string => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    
    if (addresses) {
      for (const addressInfo of addresses) {
        if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
          return addressInfo.address;
        }
      }
    }
  }

  return '';
};