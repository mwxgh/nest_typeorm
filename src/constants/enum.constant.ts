export enum GenderEnum {
  Male = 1,
  Female,
  Other,
}

export enum RelationTypeEnum {
  Content = 1,
  Product,
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

export enum BaseStatusEnum {
  Inactive,
  Active,
}

export enum UserLockedEnum {
  Unlocked,
  Locked,
}

export enum ContentStatusEnum {
  Draft,
  Review,
  Published,
  Rejected,
  Hide,
  Expired,
}

export enum ContentPriorityEnum {
  Low,
  Medium,
  High,
  Urgent,
  Critical,
}

export enum ContentTypeEnum {
  Article,
  Video,
  Image,
  Audio,
  Infographic,
  Tutorial,
  Review,
  Interview,
  CaseStudy,
  EBook,
  FAQ,
}

export const RelationTypeList = {
  [RelationTypeEnum.Content]: 'Content',
  [RelationTypeEnum.Product]: 'Product',
}

export const RoleList = {
  [RoleEnum.BaseAdmin]: 'Base Admin',
  [RoleEnum.Supervisor]: 'Supervisor',
  [RoleEnum.Operator]: 'Operator',
  [RoleEnum.NormalUser]: 'NormalUser',
}

export const UserLockedList = {
  [UserLockedEnum.Unlocked]: 'Unlocked',
  [UserLockedEnum.Locked]: 'Locked',
}

export const BaseStatusList = {
  [BaseStatusEnum.Active]: 'Active',
  [BaseStatusEnum.Inactive]: 'Inactive',
}

export const ContentStatusList = {
  [ContentStatusEnum.Draft]: 'Draft',
  [ContentStatusEnum.Review]: 'Review',
  [ContentStatusEnum.Published]: 'Published',
  [ContentStatusEnum.Rejected]: 'Rejected',
  [ContentStatusEnum.Hide]: 'Hide',
  [ContentStatusEnum.Expired]: 'Expired',
}

export const ContentPriorityList = {
  [ContentPriorityEnum.Low]: 'Low',
  [ContentPriorityEnum.Medium]: 'Medium',
  [ContentPriorityEnum.High]: 'High',
  [ContentPriorityEnum.Urgent]: 'Urgent',
  [ContentPriorityEnum.Critical]: 'Critical',
}

export const ContentTypeList = {
  [ContentTypeEnum.Article]: 'Article',
  [ContentTypeEnum.Video]: 'Video',
  [ContentTypeEnum.Image]: 'Image',
  [ContentTypeEnum.Audio]: 'Audio',
  [ContentTypeEnum.Infographic]: 'Infographic',
  [ContentTypeEnum.Tutorial]: 'Tutorial',
  [ContentTypeEnum.Review]: 'Review',
  [ContentTypeEnum.Interview]: 'Interview',
  [ContentTypeEnum.CaseStudy]: 'CaseStudy',
  [ContentTypeEnum.EBook]: 'EBook',
  [ContentTypeEnum.FAQ]: 'FAQ',
}
