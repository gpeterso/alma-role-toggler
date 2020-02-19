import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { tap, map, pluck, switchMap, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Entity } from '@exlibris/exl-cloudapp-angular-lib';
import { User } from '../user';
import { UserService } from '../user.service';
import { AlmaPageService } from '../alma-page.service';

const isUserEntity = (entities: Entity[]): boolean => 
  entities.length == 1 && entities[0].type == 'USER'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  onUserPage$ = this.almaPage.entities$.pipe(map(isUserEntity));
  user$ = this.almaPage.entities$.pipe(
    pluck(0, 'link'),
    switchMap(link => this.userService.get(link)));

  constructor(
    private almaPage: AlmaPageService,
    private toastr: ToastrService,
    private userService: UserService) { }

  activateStaffRoles(user: User) {
    user.activateStaffRoles();
    this.updateUser(user);
  }

  deactivateStaffRoles(user: User) {
    user.deactivateStaffRoles();
    this.updateUser(user);
  }

  private updateUser(user: User) {
    this.loadingSubject.next(true);
    this.userService.update(user).subscribe({
      next: user => {
        this.refreshPage();
      },
      error: e => {
        this.toastr.error('Failed to update user');
        console.error(e);
        this.loadingSubject.next(false);
      }
    });
  }

  private refreshPage() {
    this.loadingSubject.next(true);
    this.almaPage.refresh().subscribe({
      next: () => this.toastr.success('Success!'),
      error: e => {
        console.error(e);
        this.toastr.error('Failed to refresh page');
      },
      complete: () => this.loadingSubject.next(false)
    });
  }
}
