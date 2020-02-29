import { Pipe, PipeTransform } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { RoleTypeService } from '../services/role-type.service';
import { RoleType } from '../models/user';

const toLookupTable = (roleTypes: RoleType[]) =>
  roleTypes.reduce(
    (table, roleType) => {
      table[roleType.code] = roleType.desc; return table;
    }, {});

@Pipe({
  name: 'roleTypeDesc',
  pure: true
})
export class RoleTypeDescPipe implements PipeTransform {
  private lookupTable = null;

  constructor(private roleTypeService: RoleTypeService) {
    console.log("creating new pipe instance");
  }

  transform(code: string): string {
    if (!this.lookupTable) {
      console.log("No Lookup table found");
      this.roleTypeService.get()
        .pipe(
          map(toLookupTable),
          tap(_ => console.log('LOADING LOOKUP TABLE FOR PIPE'))
        )
        .subscribe(lookupTable => this.lookupTable = lookupTable);
    }

    return this.lookupTable[code] || null;
  }

}
