import { Pipe, PipeTransform } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { RoleTypeService } from '../services/role-type.service';
import { RoleType } from '../models/user';

const toLookupTable = (roleTypes: RoleType[]) =>
  roleTypes.reduce(
    (table, roleType) => ({ ...table, [roleType.code]: roleType.desc }),
    {}
  );

@Pipe({
  name: 'roleTypeDesc',
  pure: true
})
export class RoleTypeDescPipe implements PipeTransform {
  private lookupTable: Record<string, string> = null;

  constructor(private roleTypeService: RoleTypeService) {}

  transform(code: string): string {
    if (!this.lookupTable) this.loadLookupTable();
    return this.lookupTable[code] || `UNKNOWN ROLE (${code})`;
  }

  private loadLookupTable(): void {
    this.roleTypeService
      .get()
      .pipe(
        map(toLookupTable),
        tap(_ =>
          console.debug(`${this.constructor.name}: loading lookup table`)
        )
      )
      .subscribe(lookupTable => (this.lookupTable = lookupTable));
  }
}
