export enum GenderEnum {
  Male = 1,
  Female,
  Other,
}

export enum RoleEnum {
  BaseAdmin = 1,
  Supervisor,
  Operator,
  NormalUser,
}

export enum RoleAcronymEnum {
  A = RoleEnum.BaseAdmin,
  S = RoleEnum.Supervisor,
  O = RoleEnum.Operator,
  N = RoleEnum.NormalUser,
}

export const AllRoles: RoleEnum[] = [
  RoleEnum.BaseAdmin,
  RoleEnum.Supervisor,
  RoleEnum.Operator,
  RoleEnum.NormalUser,
]

export enum UserStatusEnum {
  Inactive,
  Active,
}

export enum UserLockedEnum {
  Unlocked,
  Locked,
}

export const RoleList = {
  [RoleEnum.BaseAdmin]: 'Base Admin',
  [RoleEnum.Supervisor]: 'Supervisor',
  [RoleEnum.Operator]: 'Operator',
  [RoleEnum.NormalUser]: 'NormalUser',
}

export const UserStatusList = {
  [UserStatusEnum.Active]: 'Active',
  [UserStatusEnum.Inactive]: 'Inactive',
}

export const UserLockedList = {
  [UserLockedEnum.Unlocked]: 'Unlocked',
  [UserLockedEnum.Locked]: 'Locked',
}
