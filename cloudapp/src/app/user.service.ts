import { CloudAppRestService, HttpMethod, PageInfo, Entity} from '@exlibris/exl-cloudapp-angular-lib';
import { Injectable } from '@angular/core';
import { Observable, partition, merge, EMPTY } from 'rxjs';
import { pluck, switchMap, map, mapTo } from 'rxjs/operators';
import { AlmaPageService } from './alma-page.service';
import { User } from './user';

const toUser = (response: any): User => User.create(response)
const isUserEntity = (entities: Entity[]): boolean => 
  entities.length == 1 && entities[0].type === 'USER'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private cloudAppRestService: CloudAppRestService,
    private almaPageService: AlmaPageService) {}

  /**
   * 
   * @param link path to the Alma REST user
   */
  get(link: string): Observable<User> {
    // it'd be nice if the call method used generics
    return this.cloudAppRestService.call(link)
      .pipe(map(toUser));
  }

  update(user: User): Observable<User> {
    const request = {
      url: user.link || `/users/${user.primary_id}`,
      method: HttpMethod.PUT,
      requestBody: user
    }
    return this.cloudAppRestService.call(request)
      .pipe(map(toUser));
  }

  /**
   * if the currently-loaded page is not a user page, 
   * the emitted value will be null
   */
  userLoaded(): Observable<User> {
    const entities$ = this.almaPageService.entities;
    const [userEntity$, otherEntities$] = partition(entities$, isUserEntity);
    return merge(
      userEntity$.pipe(
        pluck(0, 'link'),
        switchMap(link => this.get(link))), 
      otherEntities$.pipe(
        mapTo(null)));
  }
}
