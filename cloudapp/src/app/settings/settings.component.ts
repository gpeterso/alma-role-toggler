import { Component, OnInit } from '@angular/core';
import { Settings } from '../models/settings';
import { RoleType } from '../models/user';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: Settings;

  constructor(private settingService: SettingsService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingService.get().subscribe(settings => (this.settings = settings));
  }

  save(): void {
    //TODO: add staving state & spinner
    this.settingService.set(this.settings).subscribe(resp => {
      if (resp.success) {
        console.debug('Settings Saved');
      } else {
        console.error('Failed to save settings: ', resp.error);
      }
    });
  }

  addRole(role: RoleType): void {
    this.settings.excludedRoles.push(role);
    this.sortRoles();
  }

  removeRole(index: number): void {
    this.settings.excludedRoles.splice(index, 1);
  }

  trackByCode(index: number, role: RoleType): string {
    return role.value;
  }

  private sortRoles(): void {
    this.settings.excludedRoles.sort((a, b) => (a.desc > b.desc ? 1 : -1));
  }
}
