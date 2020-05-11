import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, pluck, shareReplay } from 'rxjs/operators';
import { sortBy } from 'lodash';
import {
  CloudAppSettingsService,
  WriteSettingsResponse,
} from '@exlibris/exl-cloudapp-angular-lib';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private cloudAppSettingsService: CloudAppSettingsService) {}

  get(): Observable<Settings> {
    return this.cloudAppSettingsService.get().pipe(
      map(settings => {
        if (typeof settings.excludedRoles === 'undefined') {
          settings.excludedRoles = [];
        }
        return settings as Settings;
      }),
      tap(s => console.debug('fetched settings: ', s))
    );
  }

  set(settings: Settings): Observable<WriteSettingsResponse> {
    return this.cloudAppSettingsService.set(settings);
  }
}
