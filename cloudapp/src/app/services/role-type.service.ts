import { Injectable } from '@angular/core';
import { Observable, fromEventPattern, concat } from 'rxjs';
import { map, skip, pluck } from 'rxjs/operators';
import { sortBy, partialRight } from 'lodash';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { RoleType } from '../models/user';
import { CodeTable, CodeTableRow} from '../models/code-table';


const toRoleTypes = (rows: CodeTableRow[]): RoleType[] => 
  rows.map(row => ({code: row.code, desc: row.description}))

const sortByDesc = partialRight(sortBy, 'desc');

/**
 */
@Injectable({
  providedIn: 'root'
})
export class RoleTypeService {
  constructor(private restService: CloudAppRestService) {}

  get(): Observable<RoleType[]> {
    return this.restService.call('/conf/code-tables/HFrUserRoles.roleType')
    .pipe(
      map(resp => resp as CodeTable),
      pluck('row'),
      map(toRoleTypes),
      map(sortByDesc));
  }
}