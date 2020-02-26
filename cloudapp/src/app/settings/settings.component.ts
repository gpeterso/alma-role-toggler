import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import { tap, map, filter, startWith } from 'rxjs/operators';
import { CloudAppRestService, CloudAppSettingsService } from '@exlibris/exl-cloudapp-angular-lib';
import { RoleTypeService } from '../services/role-type.service';
import { Settings } from '../models/settings';
import { RoleType } from '../models/user';

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

  //roleList: Set<Row> = new Set<Row>();

  /*
  private selectedRoleCodeSubject = new BehaviorSubject<string[]>([]);
  selectedRoleCodes$ = this.selectedRoleCodeSubject.asObservable();
  */

  selectedRoles: RoleType[];

  filter = new FormControl('', this.validateFilter);

  roles$: Observable<RoleType[]> = this.roleTypeService.get();
  filter$ = this.filter.valueChanges.pipe(
    startWith(''),
    filter(filterValue => typeof filterValue === "string"));
  filteredRoles$: Observable<RoleType[]>;

  @ViewChild("roleInput", {static: true}) roleInput: ElementRef;

  constructor(
    private restService: CloudAppRestService,
    private settingService: CloudAppSettingsService,
    private roleTypeService: RoleTypeService) {}

  ngOnInit() {
    this.filteredRoles$ = combineLatest(this.roles$, this.filter$).pipe(
      tap(([_, filterValue]) => console.log("value change: ", filterValue)),
      map(([roles, filterValue]) => roles.filter(
        role => role.desc.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)));

        /*
    this.settingService.get().subscribe(settings => 
      this.selectedRoles = settings.excludeRoles || []);
      */

    zip(this.settingService.get(), this.roles$).pipe(
      map(([settings, roles]) => (settings.excludeRoleCodes || [])
        .map(code => roles.find(role => role.code === code))
      )).subscribe(roles => this.selectedRoles = roles);
    
  }

  formatRoleTypeOption(role: RoleType): string {
    return role && role.desc;
  }

  addSelectedRole() {
    //this.roleList.add(this.filter.value);
    this.selectedRoles.push(this.filter.value);
    this.filter.reset();
    this.roleInput.nativeElement.focus();
  }

  validateFilter(crtl: FormControl) {
    if (typeof crtl.value === "string") {
      return {
        error: "Select a valid role"
      }
    }
    return null;
  }

  remove(role: RoleType) {
    console.log("removing: ", role);
    this.selectedRoles = this.selectedRoles.filter(r => r.code !== role.code);
    //this.roleList.delete(row);
  }

  save() {
    //TODO: add staving state & spinner
    const codes = this.selectedRoles.map(role => role.code);
    const settings = { excludeRoleCodes: codes };
    this.settingService.set(settings).subscribe(resp => {
      if (resp.success) {
        console.log("Settings Saved");
      } else {
        console.error("Failed to save settings: ", resp.error);
      }
    });
  }

  // TODO: add cacel handler; reload data (dirty check?)
}