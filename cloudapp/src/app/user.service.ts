import { CloudAppRestService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { AppModule } from './app.module';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: AppModule
})
export class UserService {
  constructor(private cloudAppRestService: CloudAppRestService) {}

  get(link: string): Observable<User> {
    return this.cloudAppRestService.call(link)
      .pipe(map(this.toUser));
  }

  update(user: User): Observable<User> {
    const request = {
      url: user.link || `/users/${user.primary_id}`,
      method: HttpMethod.PUT,
      requestBody: user
    }
    return this.cloudAppRestService.call(request)
      .pipe(map(this.toUser));
  }

  private toUser(response: any): User {
    return User.create(response);
  }
}