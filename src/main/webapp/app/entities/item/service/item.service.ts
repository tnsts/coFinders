import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItem, getItemIdentifier } from '../item.model';

export type EntityResponseType = HttpResponse<IItem>;
export type EntityArrayResponseType = HttpResponse<IItem[]>;

@Injectable({ providedIn: 'root' })
export class ItemService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/items');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(item: IItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http
      .post<IItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(item: IItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http
      .put<IItem>(`${this.resourceUrl}/${getItemIdentifier(item) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(item: IItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http
      .patch<IItem>(`${this.resourceUrl}/${getItemIdentifier(item) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addItemToCollectionIfMissing(itemCollection: IItem[], ...itemsToCheck: (IItem | null | undefined)[]): IItem[] {
    const items: IItem[] = itemsToCheck.filter(isPresent);
    if (items.length > 0) {
      const itemCollectionIdentifiers = itemCollection.map(itemItem => getItemIdentifier(itemItem)!);
      const itemsToAdd = items.filter(itemItem => {
        const itemIdentifier = getItemIdentifier(itemItem);
        if (itemIdentifier == null || itemCollectionIdentifiers.includes(itemIdentifier)) {
          return false;
        }
        itemCollectionIdentifiers.push(itemIdentifier);
        return true;
      });
      return [...itemsToAdd, ...itemCollection];
    }
    return itemCollection;
  }

  protected convertDateFromClient(item: IItem): IItem {
    return Object.assign({}, item, {
      foundAt: item.foundAt?.isValid() ? item.foundAt.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.foundAt = res.body.foundAt ? dayjs(res.body.foundAt) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((item: IItem) => {
        item.foundAt = item.foundAt ? dayjs(item.foundAt) : undefined;
      });
    }
    return res;
  }
}
