import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
// NestInterceptor: interfaz que obliga a implementar intercept()
// ExecutionContext: info sobre el request actual (igual que en los guards)
// CallHandler: representa el siguiente paso en la cadena (el controller)

import { Observable } from 'rxjs';
// Observable: tipo de RxJS — el flujo de datos que va y viene

import { map } from 'rxjs/operators';
// map: transforma el valor que sale del controller ANTES de enviarlo al cliente

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // context = info del request (no la usamos aquí pero está disponible)
    // next = el controller que va a ejecutarse

    return next.handle().pipe(
      // next.handle() ejecuta el controller y retorna un Observable con la respuesta
      // .pipe() permite encadenar operadores de transformación

      map((data) => {
        if (data && data.meta) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}