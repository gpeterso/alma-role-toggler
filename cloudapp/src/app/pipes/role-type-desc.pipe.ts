import { Pipe, PipeTransform } from '@angular/core';
import { map, tap, first, shareReplay } from 'rxjs/operators';
import { RoleTypeService } from '../services/role-type.service';
import { RoleType } from '../models/user';
import { Observable } from 'rxjs';

const toLookupTable = (roleTypes: RoleType[]) =>
  roleTypes.reduce(
    (table, roleType) => ({ ...table, [roleType.code]: roleType.desc }),
    {}
  );

/**
 * Transforms a role type code to it's corresponding description.
 */
@Pipe({
  name: 'roleTypeDesc',
  pure: false,
})
export class RoleTypeDescPipe implements PipeTransform {
  private lookupTable: Record<string, string> = null;

  private cache$ = null;

  constructor(private roleTypeService: RoleTypeService) {}

  transform(code: string): string {
    console.debug(`${this.constructor.name} called`);
    /*
    if (!this.lookupTable) {
      this.getLookupTable()
        .pipe(shareReplay(1))
        .subscribe(
          lookupTable => (this.lookupTable = lookupTable),
          error => console.error('Failed to load lookup table ', error)
        );
    }
    */

    if (!this.cache$) this.cache$ = this.getLookupTable().pipe(shareReplay(1));

    this.cache$.subscribe(cache => {
      this.lookupTable = cache;
    });

    return this.lookupCode(code);
  }

  private lookupCode(code: string): string {
    if (this.lookupTable) {
      return this.lookupTable[code] || `UNKNOWN ROLE (${code})`;
    } else {
      return '...';
    }
  }

  private getLookupTable(): Observable<Record<string, string>> {
    return this.roleTypeService.get().pipe(
      map(toLookupTable),
      first(),
      tap(lookupTable =>
        console.debug(
          `${this.constructor.name}: loading lookup table `,
          lookupTable
        )
      )
    );
  }
}
