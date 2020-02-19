import { Injectable } from '@angular/core';
import { Observable, fromEventPattern, concat } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { CloudAppEventsService, PageInfo, Entity } from '@exlibris/exl-cloudapp-angular-lib';

/**
 * Wraps the CloudAppEventService to provide a simplified interface for 
 * interacting with the currently-loaded Alma page.
 */
@Injectable({
  providedIn: 'root'
})
export class AlmaPageService {
  private currentPageInfo$: Observable<PageInfo> = 
    this.eventsService.getPageMetadata();

  private futurePageInfo$: Observable<PageInfo> = 
    fromEventPattern<PageInfo>(
      handler => this.eventsService.onPageLoad(handler),
      (_, subscription) => subscription.unsubscribe())
      .pipe(skip(1)) //ignore the initially-emitted value of `{ entities: [] }`

  /**
   * Never completes; users should unsubscribe.
   */
  readonly pageInfo$: Observable<PageInfo> = 
    concat(this.currentPageInfo$, this.futurePageInfo$)

  /**
   * Never completes; users should unsubscribe.
   */
  readonly entities$: Observable<Entity[]> = 
    this.pageInfo$.pipe(map(pageInfo => pageInfo.entities || []));

  constructor(private eventsService: CloudAppEventsService) {}

  refresh() {
    return this.eventsService.refreshPage();
  }
}