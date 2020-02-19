interface UserRoleStatus {
  value: 'ACTIVE' | 'INACTIVE';
}

interface RoleType {
  desc: string;
}

interface UserRole {
  status: UserRoleStatus;
  role_type: RoleType;
}

/**
 * functions as a sort of 'aggregate root' for user data
 */
export class User {
  readonly full_name: string;
  readonly primary_id: string;
  readonly link: string;
  private user_role: UserRole[];
  private constructor() {};

  /**
   * static factory
   * @param user an Alma REST user object
   */
  static of(user: any): User {
    return Object.assign(new User(), user);
  }

  get activeStaffRoleCount(): number {
    return this.staffRoles
      .filter(role => role.status.value === 'ACTIVE')
      .length;
  }

  activateStaffRoles(): void {
    this.staffRoles.forEach(role => role.status.value = 'ACTIVE');
  }

  deactivateStaffRoles(): void {
    this.staffRoles.forEach(role => role.status.value = 'INACTIVE');
  }

  private get staffRoles(): UserRole[] {
    return this.user_role.filter(role => role.role_type.desc !== 'Patron');
  }
}