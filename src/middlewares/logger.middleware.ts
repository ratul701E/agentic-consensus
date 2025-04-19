
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        const startTime = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const contentLength = res.get('Content-Length') || 0;
            const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${contentLength}B ${duration}ms`;
            console.log(logMessage);
        })
        next();
    }
}
