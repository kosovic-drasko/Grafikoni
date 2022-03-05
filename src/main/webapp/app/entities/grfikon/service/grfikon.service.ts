import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrfikon, getGrfikonIdentifier } from '../grfikon.model';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<IGrfikon>;
export type EntityArrayResponseType = HttpResponse<IGrfikon[]>;

@Injectable({ providedIn: 'root' })
export class GrfikonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grfikons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  grafikon(): any {
    return this.http.get(this.resourceUrl).pipe(map(result => result));
  }

  create(grfikon: IGrfikon): Observable<EntityResponseType> {
    return this.http.post<IGrfikon>(this.resourceUrl, grfikon, { observe: 'response' });
  }

  update(grfikon: IGrfikon): Observable<EntityResponseType> {
    return this.http.put<IGrfikon>(`${this.resourceUrl}/${getGrfikonIdentifier(grfikon) as number}`, grfikon, { observe: 'response' });
  }

  partialUpdate(grfikon: IGrfikon): Observable<EntityResponseType> {
    return this.http.patch<IGrfikon>(`${this.resourceUrl}/${getGrfikonIdentifier(grfikon) as number}`, grfikon, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrfikon>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrfikon[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGrfikonToCollectionIfMissing(grfikonCollection: IGrfikon[], ...grfikonsToCheck: (IGrfikon | null | undefined)[]): IGrfikon[] {
    const grfikons: IGrfikon[] = grfikonsToCheck.filter(isPresent);
    if (grfikons.length > 0) {
      const grfikonCollectionIdentifiers = grfikonCollection.map(grfikonItem => getGrfikonIdentifier(grfikonItem)!);
      const grfikonsToAdd = grfikons.filter(grfikonItem => {
        const grfikonIdentifier = getGrfikonIdentifier(grfikonItem);
        if (grfikonIdentifier == null || grfikonCollectionIdentifiers.includes(grfikonIdentifier)) {
          return false;
        }
        grfikonCollectionIdentifiers.push(grfikonIdentifier);
        return true;
      });
      return [...grfikonsToAdd, ...grfikonCollection];
    }
    return grfikonCollection;
  }
}
