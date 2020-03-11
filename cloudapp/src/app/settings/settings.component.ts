import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import { tap, map, filter, startWith } from 'rxjs/operators';
import {
  CloudAppRestService,
  CloudAppSettingsService,
} from '@exlibris/exl-cloudapp-angular-lib';
import { Settings } from '../models/settings';
import { RoleType } from '../models/user';
import { SettingsService } from '../services/settings.service';

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
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  //roleList: Set<Row> = new Set<Row>();

  /*
  private selectedRoleCodeSubject = new BehaviorSubject<string[]>([]);
  selectedRoleCodes$ = this.selectedRoleCodeSubject.asObservable();
  */

  //TODO: consider using a trackBy function in the selectedRoles list

  //excludedRoles: RoleType[];
  //excludedRoleCodes: Set<string>;
  settings: Settings;

  constructor(private settingService: SettingsService) {}

  ngOnInit(): void {
    this.loadSettings();
    //this.settings = new Settings();
  }

  loadSettings(): void {
    this.settingService.get().subscribe(settings => (this.settings = settings));
  }

  save(): void {
    //TODO: add staving state & spinner
    //const codes = this.excludedRoleCodes.map(role => role.code || role);
    //const settings = { excludedRoleCodes: Array.from(this.excludedRoleCodes) };
    this.settingService.set(this.settings).subscribe(resp => {
      if (resp.success) {
        console.log('Settings Saved');
      } else {
        console.error('Failed to save settings: ', resp.error);
      }
    });
  }

  addRoleCode(code: RoleType | string): void {
    this.settings.excludedRoleCodes.push(
      (code as RoleType).code || (code as string)
    );
  }

  removeRoleCode(code: RoleType | string): void {
    console.log('removing: ', code);
    const index = this.settings.excludedRoleCodes.indexOf(
      (code as RoleType).code || (code as string)
    );
    this.settings.excludedRoleCodes.splice(index, 1);
    //this.settings.excludedRoleCodes.delete();
  }

  // TODO: add cacel handler; reload data (dirty check?)
}

/*

<settings>
  <excluded-roles>
    <role-picker>

*/
