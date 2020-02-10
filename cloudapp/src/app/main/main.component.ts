import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';
import { AlmaPageService } from '../alma-page.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

  //TODO: consider something like an onUserPage Observable<boolean>

  // TODO: maybe create an anync vm that combines the user, loading, and onUserPage observables.

  user$: Observable<User>;
  //TODO: convert the loading indicator ot an observable? Perhaps from a BehaviorSubject?
  loading = false;

  constructor(
    private almaPage: AlmaPageService,
    private toastr: ToastrService,
    private userService: UserService) { }

  ngOnInit() {
    this.user$ = this.userService.userLoaded()
      .pipe(tap(user => console.debug('user loaded: ', user)));
  }

  activateStaffRoles(user: User) {
    user.activateStaffRoles();
    this.updateUser(user);
  }

  deactivateStaffRoles(user: User) {
    user.deactivateStaffRoles();
    this.updateUser(user);
  }

  private updateUser(user: User) {
    this.loading = true;
    this.userService.update(user).subscribe({
      next: user => {
        this.refreshPage();
      },
      error: e => {
        this.toastr.error('Failed to update user');
        console.error(e);
        this.loading = false;
      }
    });
  }

  private refreshPage() {
    this.loading = true;
    this.almaPage.refresh().subscribe({
      next: () => this.toastr.success('Success!'),
      error: e => {
        console.error(e);
        this.toastr.error('Failed to refresh page');
      },
      complete: () => this.loading = false
    });
  }
}
