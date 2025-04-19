import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  private ignoredContexts = ['InstanceLoader', 'RoutesResolver', 'RouterExplorer', 'NestFactory'];

  log(message: string, context?: string) {
    if (!this.ignoredContexts.includes(context ?? '')) {
      super.log(message, context);
    }
  }

  debug(message: string, context?: string) {
    if (!this.ignoredContexts.includes(context ?? '')) {
      super.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (!this.ignoredContexts.includes(context ?? '')) {
      super.verbose(message, context);
    }
  }

  error(message: string, context?: string) {
    if (!this.ignoredContexts.includes(context ?? '')) {
      super.error(message, context);
    }
  }
}
