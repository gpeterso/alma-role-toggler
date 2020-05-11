import {
  CloudAppRestService,
  HttpMethod,
} from '@exlibris/exl-cloudapp-angular-lib';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private cloudAppRestService: CloudAppRestService,
    private settings: SettingsService
  ) {}

  /**
   *
   * @param link path to the Alma REST user
   */
  get(link: string): Observable<User> {
    // it'd be nice if the call method used generics
    return this.cloudAppRestService.call(link).pipe(map(User.of));
  }

  update(user: User): Observable<User> {
    const request = {
      url: user.link || `/users/${user.primary_id}`,
      method: HttpMethod.PUT,
      requestBody: user,
    };
    return this.cloudAppRestService.call(request).pipe(map(User.of));
  }

  activateRoles(user: User): Observable<User> {
    return this.settings.get().pipe(
      map(settings => {
        user.activateRolesExcept(settings.excludedRoles);
        return user;
      }),
      switchMap(user => this.update(user))
    );
  }

  deactivateRoles(user: User): Observable<User> {
    return this.settings.get().pipe(
      map(settings => {
        user.deactivateRolesExcept(settings.excludedRoles);
        return user;
      }),
      switchMap(user => this.update(user))
    );
  }
}
