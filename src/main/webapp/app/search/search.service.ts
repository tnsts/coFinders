import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Filters } from './search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(filters: Filters): Observable<{}> {
    // filers to path\body
    return this.http.post(this.applicationConfigService.getEndpointFor('api/get'), filters);
  }
}
