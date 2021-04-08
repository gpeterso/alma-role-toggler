import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Settings } from '../models/settings';
import { RoleType } from '../models/user';
import { SettingsService } from '../services/settings.service';
import { AlertService } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: Settings;
  addingRole = false;
  dirty = false;

  constructor(
    private settingService: SettingsService,
    private alert: AlertService,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.addingRole = false;
    this.dirty = false;
    this.settingService.get().subscribe(settings => (this.settings = settings));
  }

  save(): void {
    this.settingService.set(this.settings).subscribe(resp => {
      if (resp.success) {
        this.alert.success('Settings Saved');
        this.dirty = false;
      } else {
        console.error('Failed to save settings: ', resp.error);
        this.alert.error('Failed to save settings: ', resp.error);
      }
    });
  }

  addRole(role: RoleType): void {
    this.addingRole = false;
    this.dirty = true;
    this.settings.excludedRoles.push(role);
    this.sortRoles();
  }

  removeRole(index: number): void {
    this.settings.excludedRoles.splice(index, 1);
    this.dirty = true;
  }

  trackByCode(index: number, role: RoleType): string {
    return role.value;
  }

  showRolePicker(): void {
    this.addingRole = true;
    this.changeDetector.detectChanges();
    this.renderer.selectRootElement('app-role-picker input').focus();
  }

  private sortRoles(): void {
    this.settings.excludedRoles.sort((a, b) => (a.desc > b.desc ? 1 : -1));
  }
}
