import { Injectable } from '@angular/core';
import { Observable, fromEventPattern, concat } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CloudAppEventsService, PageInfo, Entity } from '@exlibris/exl-cloudapp-angular-lib';

@Injectable({
  providedIn: 'root'
})
export class AlmaPageService {
  constructor(private eventsService: CloudAppEventsService) {}


  // TODO: consider caching with shareReplay()?

  /**
   * combines initial and future page load events into a single observable
   */
  get pageInfo(): Observable<PageInfo> {
    // I don't really like the mediator / event bus style of passing in a callback
    // and getting back a subscription because 1) I can't transform the observable
    // and 2) I can't let angular manage the subscription with an async pipe
    return concat(
      this.eventsService.getPageMetadata(),
      fromEventPattern<PageInfo>(
        handler => this.eventsService.onPageLoad(handler),
        (handler, subscription) => subscription.unsubscribe()));
      //.pipe(tap(pageInfo => console.debug('PageInfo: ', pageInfo)));
  }

  get entities(): Observable<Entity[]> {
    return this.pageInfo
      .pipe(map((pageInfo => pageInfo.entities || [])));
  }

  refresh() {
    return this.eventsService.refreshPage();
  }
}