import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
  Entity, PageInfo, RestErrorResponse
} from '@exlibris/exl-cloudapp-angular-lib';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private pageLoad$: Subscription;
  pageEntities: Entity[];
  public user: User;

  hasApiResult: boolean = false;
  loading = false;

  constructor(private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private toastr: ToastrService,
    private userService: UserService) { }

  ngOnInit() {
    this.eventsService.getPageMetadata().subscribe(this.onPageLoad);
    this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  onPageLoad = (pageInfo: PageInfo) => {
    this.pageEntities = pageInfo.entities;
    console.log(pageInfo.entities);
    if ((pageInfo.entities || []).length == 1) {
      const entity = pageInfo.entities[0];
      if (entity.type == 'USER') {
       this.userService.get(entity.link).subscribe(user => this.user = user);
      }
    } else {
      this.user = null;
    }
  }

  activateStaffRoles() {
    this.user.activateStaffRoles();
    this.updateUser();
  }

  deactivateStaffRoles() {
    this.user.deactivateStaffRoles();
    this.updateUser();
  }

  refreshPage = () => {
    this.loading = true;
    this.eventsService.refreshPage().subscribe({
      next: () => this.toastr.success('Success!'),
      error: e => {
        console.error(e);
        this.toastr.error('Failed to refresh page');
      },
      complete: () => this.loading = false
    });
  }

  private updateUser() {
    this.loading = true;
    this.userService.update(this.user).subscribe({
      next: user => {
        this.user = user;
        this.refreshPage();
      },
      error: (e: RestErrorResponse) => {
        this.toastr.error('Failed to update data');
        console.error(e);
        this.loading = false;
      }
    });
  }

  private sendUpdateRequest(user: User) {
    this.userService.update(user).subscribe({
      next: user => {
        //this.apiResult = result;
        this.user = user;
        this.refreshPage();
      },
      error: (e: RestErrorResponse) => {
        this.toastr.error('Failed to update data');
        console.error(e);
        this.loading = false;
      }
    });
  }

}
