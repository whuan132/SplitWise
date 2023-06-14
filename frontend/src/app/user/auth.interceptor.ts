import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from './state.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private stateService = inject(StateService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.stateService.user().token;
    if (token !== '') {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedRequest);
    }
    // default handle
    return next.handle(request);
  }
}
