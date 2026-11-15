import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error-service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorServ = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'დაფიქსირდა შეცდომა, სცადეთ თავიდან';

      if (error.status === 0) message = 'სერვერთან კავშირი ვერ დამყარდა';
      else if (error.status === 404) message = 'მონაცემი ვერ მოიძებნა';
      else if (error.status >= 500) message = 'სერვერის შეცდომა';

      errorServ.setErrorMsg(message);
      errorServ.clearMsg();
      return throwError(() => error);
    }),
  );
};