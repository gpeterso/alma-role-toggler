interface UserRoleStatus {
  value: 'ACTIVE' | 'INACTIVE';
}

interface UserRole {
  status: UserRoleStatus;
  role_type: RoleType;
}

export interface RoleType {
  value: string;
  desc: string;
}

/**
 * functions as a sort of 'aggregate root' for user data
 */
export class User {
  readonly full_name: string;
  readonly primary_id: string;
  readonly link: string;
  private user_role: UserRole[];
  private constructor() {}

  /**
   * static factory
   * @param user an Alma REST user object
   */
  static of(user: Partial<User>): User {
    return Object.assign(new User(), user);
  }

  get activeRoleCount(): number {
    return this.user_role.filter(role => role.status.value === 'ACTIVE').length;
  }

  /**
   * Activate all of the user's roles, except those specified in roleCodes
   * @param roleTypes role types to exclude
   */
  activateRolesExcept(roleTypes: Array<RoleType> = []): void {
    this.allRolesExcept(roleTypes).forEach(
      role => (role.status.value = 'ACTIVE')
    );
  }

  /**
   * Deactivate all of the user's roles, except those specified in roleCodes
   * @param roleTypes role types to exclude
   */
  deactivateRolesExcept(roleTypes: Array<RoleType> = []): void {
    this.allRolesExcept(roleTypes).forEach(
      role => (role.status.value = 'INACTIVE')
    );
  }

  private allRolesExcept(roleTypes: Array<RoleType>): UserRole[] {
    const blacklist = new Set(roleTypes.map(roleType => roleType.value));
    return this.user_role.filter(role => !blacklist.has(role.role_type.value));
  }
}
