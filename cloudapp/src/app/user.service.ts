import { CloudAppRestService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private cloudAppRestService: CloudAppRestService) {}

  /**
   * 
   * @param link path to the Alma REST user
   */
  get(link: string): Observable<User> {
    // it'd be nice if the call method used generics
    return this.cloudAppRestService.call(link)
      .pipe(map(User.of));
  }

  update(user: User): Observable<User> {
    const request = {
      url: user.link || `/users/${user.primary_id}`,
      method: HttpMethod.PUT,
      requestBody: user
    }
    return this.cloudAppRestService.call(request)
      .pipe(map(User.of));
  }
}
