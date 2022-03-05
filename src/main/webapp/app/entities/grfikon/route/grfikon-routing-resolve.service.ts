import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrfikon, Grfikon } from '../grfikon.model';
import { GrfikonService } from '../service/grfikon.service';

@Injectable({ providedIn: 'root' })
export class GrfikonRoutingResolveService implements Resolve<IGrfikon> {
  constructor(protected service: GrfikonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrfikon> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grfikon: HttpResponse<Grfikon>) => {
          if (grfikon.body) {
            return of(grfikon.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Grfikon());
  }
}
