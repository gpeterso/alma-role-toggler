import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { startWith, filter, tap, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { RoleType } from '../../models/user';
import { RoleTypeService } from '../../services/role-type.service';

@Component({
  selector: 'app-role-picker',
  templateUrl: './role-picker.component.html',
  styleUrls: ['./role-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePickerComponent implements OnInit {
  @Output() roleAdded = new EventEmitter<RoleType>();
  @ViewChild('roleInput', { static: true }) roleInput: ElementRef;

  /**
   * User input value
   */
  role = new FormControl('', this.validateRole);

  /**
   * Current filtered roles for autocomplete
   */
  filteredRoles$: Observable<RoleType[]>;

  constructor(private roleTypeService: RoleTypeService) {}

  ngOnInit(): void {
    const allRoles$ = this.roleTypeService.get();
    const roleFilter$ = this.role.valueChanges.pipe(
      startWith(''),
      filter(roleValue => typeof roleValue === 'string')
    );
    this.filteredRoles$ = combineLatest(allRoles$, roleFilter$).pipe(
      map(([roles, filter]) =>
        roles.filter(
          role => role.desc.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        )
      )
    );
  }

  addSelectedRole(): void {
    this.roleAdded.emit(this.role.value);
    this.role.reset();
    this.roleInput.nativeElement.focus();
  }

  formatRoleOption(role: RoleType): string {
    return role && role.desc;
  }

  private validateRole(formControl: FormControl): ValidationErrors | null {
    if (!formControl.value || typeof formControl.value === 'string') {
      return {
        error: 'Enter a valid role',
      };
    }
    return null;
  }
}
