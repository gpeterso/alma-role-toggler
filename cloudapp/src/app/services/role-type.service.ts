import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, pluck, shareReplay } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { RoleType } from '../models/user';
import { CodeTable, CodeTableRow } from '../models/code-table';

const toRoleTypes = (rows: CodeTableRow[]): RoleType[] =>
  rows.map(row => ({ code: row.code, desc: row.description }));

@Injectable({
  providedIn: 'root',
})
export class RoleTypeService {
  private cache$: Observable<RoleType[]>;

  constructor(private restService: CloudAppRestService) {}

  /**
   * Fetch the role types from the HFrUserRoles.roleType code table,
   * sorted by desc. The result is cached until the app is reloaded.
   */
  get(): Observable<RoleType[]> {
    if (!this.cache$) {
      this.cache$ = this.loadData().pipe(shareReplay(1));
    }
    return this.cache$;
  }

  // TODO: consider adding retries
  private loadData(): Observable<RoleType[]> {
    return this.restService
      .call('/conf/code-tables/HFrUserRoles.roleType')
      .pipe(
        map(resp => resp as CodeTable),
        pluck('row'),
        map(toRoleTypes),
        map(roleTypes => sortBy(roleTypes, 'desc')),
        tap(rt => console.debug('fetched role types: ', rt))
      );
  }
}
