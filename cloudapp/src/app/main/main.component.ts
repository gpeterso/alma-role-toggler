import { BehaviorSubject } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Entity } from '@exlibris/exl-cloudapp-angular-lib';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AlmaPageService } from '../alma-page.service';

const isUserEntity = (entities: Entity[]): boolean =>
  entities.length == 1 && entities[0].type == 'USER';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private userUpdateObserver = {
    next: user => {
      this.refreshPage();
    },
    error: e => {
      this.toastr.error('Failed to update user');
      console.error(e);
      this.loadingSubject.next(false);
    },
  };
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  onUserPage$ = this.almaPage.entities$.pipe(map(isUserEntity));
  user$ = this.almaPage.entities$.pipe(
    pluck(0, 'link'),
    switchMap(link => this.userService.get(link))
  );

  constructor(
    private almaPage: AlmaPageService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  activateRoles(user: User): void {
    this.loadingSubject.next(true);
    this.userService.activateRoles(user).subscribe(this.userUpdateObserver);
  }

  deactivateRoles(user: User): void {
    this.loadingSubject.next(true);
    this.userService.deactivateRoles(user).subscribe(this.userUpdateObserver);
  }

  private refreshPage(): void {
    this.loadingSubject.next(true);
    this.almaPage.refresh().subscribe({
      next: () => this.toastr.success('Success!'),
      error: e => {
        console.error(e);
        this.toastr.error('Failed to refresh page');
      },
      complete: () => this.loadingSubject.next(false),
    });
  }
}
