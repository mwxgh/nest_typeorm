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
}

export enum UserStatusEnum {
  Inactive,
  Active,
}

export enum UserLockedEnum {
  Unlocked,
  Locked,
}

export enum LabelStatusEnum {
  A = 1,
  B,
  C,
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
