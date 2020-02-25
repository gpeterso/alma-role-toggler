import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { tap, map, filter, startWith } from 'rxjs/operators';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';



interface Row {
  code: string;
  description: string;
  enabled: boolean;
}

interface CodeTable {
  row: Row[];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  roleList: Set<Row> = new Set<Row>();

  roles$: Observable<Row[]> = this.restService.call('/conf/code-tables/HFrUserRoles.roleType')
    .pipe(
      map(ct => (<CodeTable>ct).row),
      map(rts => (<Row[]>rts)
        .filter(rt => rt.enabled)
        .sort((a, b) => {
          if (a.description < b.description) return -1;
          if (a.description < b.description) return 1;
          return 0})),
      tap(r => console.log("ROLE TYPES: ", r)));
  filter = new FormControl('', this.validateFilter);
  filter$ = this.filter.valueChanges.pipe(
    startWith(''),
    filter(filterValue => typeof filterValue === "string"));
  filteredRoles$: Observable<Row[]>;

  value: Row;

  constructor(private restService: CloudAppRestService) {}

  ngOnInit() {
    /*
    this.filteredRoles$ = this.roleControl.valueChanges.pipe(
      startWith(''),
      map(this.filterRoles));

      */

    this.value = this.filter.value;


    this.filteredRoles$ = combineLatest(this.roles$, this.filter$).pipe(
      tap(([_, filterValue]) => console.log("value change: ", filterValue)),
      map(([roles, filterValue]) => roles.filter(
        role => role.description.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)));

  }

  formatRoleTypeOption(row: Row): string {
    return row && row.description;
  }

  selected(row: Row) {
    console.log("Selected: ", row);

    console.log("Form Crtl Value: ", this.filter.value);
  }

  addSelectedRow() {
    this.roleList.add(this.filter.value);
  }

  validateFilter(crtl: FormControl) {
    if (typeof crtl.value === "string") {
      return {
        error: "Select a valid role"
      }
    }
    return null;
  }

  remove(row: Row) {
    console.log("removing: ", row);
    //this.roleList = this.roleList.filter(r => r.code !== row.code);
    this.roleList.delete(row);
  }




}
