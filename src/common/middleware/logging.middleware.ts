import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {

    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID();
        const startTime = Date.now();

        req['requestId'] = requestId; // Adjuntar el requestId al request para que otros servicios lo usen

        //Log de entrada
        const userId = req['userId']?.sub || 'anonimo';
        this.logger.log(
            `[${requestId}] → ${req.method} ${req.originalUrl} | usuario: ${userId}`,
        );

        //Cuando el response termine de procesar, log de salida
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            this.logger.log(
                `[${requestId}] ← ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`,
            );
        });
        next();
    }
}