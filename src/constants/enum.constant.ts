export enum GenderEnum {
  Male = 1, // 男性
  Female, // 女性
  Other, //不明
}

export enum RoleEnum {
  BaseAdmin = 1,
  Supervisor,
  Operator,
}

export enum RoleAcronymEnum {
  A = RoleEnum.BaseAdmin,
  S = RoleEnum.Supervisor,
  O = RoleEnum.Operator,
}

export enum BusinessEnum {
  BPO_Center = 1,
  Call_Center,
}

export enum BusinessAcronymEnum {
  J = BusinessEnum.BPO_Center,
  C = BusinessEnum.Call_Center,
}

// number 10 to convert result to number when concat department and role
export enum AppRoles {
  BPO_BaseAdmin = BusinessEnum.BPO_Center * 10 + RoleEnum.BaseAdmin,
  BPO_Supervisor = BusinessEnum.BPO_Center * 10 + RoleEnum.Supervisor,
  BPO_Operator = BusinessEnum.BPO_Center * 10 + RoleEnum.Operator,
  Call_BaseAdmin = BusinessEnum.Call_Center * 10 + RoleEnum.BaseAdmin,
  Call_Supervisor = BusinessEnum.Call_Center * 10 + RoleEnum.Supervisor,
  Call_Operator = BusinessEnum.Call_Center * 10 + RoleEnum.Operator,
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
  // TODO
  A = 1,
  B,
  C,
}

export enum FailedTransferStatusEnum {
  DeterminedContent = 1, // 入力不備確認済み
  WaitingCall, // 架電対応待ち
  WaitingCreateErrorReport, // 振込不能通知書作成待ち
  Calling, // 架電対応中
  CreatingErrorReport, // 振込不能通知書作成中
  WaitingDeliveryErrorReport, // 振込不能通知書納品待ち
  Solving, // 振込不能解消中
  WaitingApproveSolution, // 振込不能解消承認待ち
  WaitingApproveDetermination, // 振込不能確定承認待ち
  InvestigatingResponse, // 振込不能返戻書調査中
  WaitingSuperiorInstructions, // （職員エスカレ）振込不能返戻作業指示待ち
  SendingErrorReport, // 振込不能通知書再送中
  Solved, // 振込不能解消済み
  Determined, // 申請の振込不能確定
}

export enum FailedTransferReasonEnum {
  WrongAccountNumber = 1, // 口座番号相違
  WrongRecipientName, // 受取人名相違
  NotExistAccountNumber, // 該当口座なし
  BankIssue, // 受取口座側事由
  WrongSubject, // 科目相違
  Other, // その他
}

export enum MistakeApplicationStatusEnum {
  SolutionWaiting = 1, // 不備対応方針入力待ち
  GuideWaiting, //（職員エスカレ）作業指示待ち
  PhoneWaiting, // 架電対応待ち
  PaperWaiting, // 不備通知書作成待ち
  PhoneMaking, // 架電対応中
  PaperMaking, // 不備通知書作成中
  PaperShipping, // 不備通知書納品待ち
  IssueResolving, // 不備解消中
  WaitingForSolutionConfirming, // 不備解消承認待ち
  WaitingForIssueConfirming, // 不備確定承認待ち
  PaperConfirming, // 不備返戻書調査中
  WaitingForGuideResponse, //（職員エスカレ）不備返戻作業指示待ち
  ResponsePaperShipping, // 不備通知書再送中
  IssueResolved, // 不備解消済み
  IssueConfirmed, // 申請の不備確定
}

export enum ApproachTypeEnum {
  Push = 1,
  Request,
  HandRaised,
  Other,
}

export enum ProjectStatusEnum {
  Edit = 1,
  CanSubmit,
  WaitingApprove,
  Approved,
  Start,
}

export enum ActionUpdateProjectStatusEnum {
  Submit = 1,
  CancelSubmitted,
  Reject,
  Approve,
  CancelApproved,
}

export enum FormPropertyFieldCodeEnum {
  FullName = 1,
  FullNameKana,
  Gender,
  Age,
  PhoneNumber,
  Address,
  Date,
  UploadFile,
  OtherString,
  OtherInteger,
  OtherToggleButton,
  OtherRadioButton,
  OtherCheckboxButton,
  SubHeading,
  StringDisplay,
}

export enum FormPropertyFieldTypeEnum {
  TextInput = 1,
  TextArea,
  Checkbox,
  Radio,
  SelectBox,
  File,
  Email,
  EmailConfirm,
  // ... add more
}

export enum ChecklistQuestionTypeEnum {
  Title = 1,
  Question,
  Result,
}

export enum FileScanStatusEnum {
  Handling = 1,
  Completed,
  Failed,
}

export enum SubsidyHasSendInstructionEnum {
  NO = 1,
  BPO_SYSTEM,
  External_ORDER,
}

export enum SubsidyRegistrationMethodEnum {
  WEB = 1,
  PAPER,
  BOTH,
}

export enum HistoryTypeEnum {
  ReceiveApplication = 3,
  SiteSetting,
  Project,
  PreviewSiteSetting,
  RequestStatus = 9,
}

export enum CallTypeEnum {
  ConfirmBenefit = 1,
  ConfirmRequestStatus,
  ConfirmPaymentDay,
  ConfirmReasonForDefectAndReturn,
  ConfirmReasonForTransferMoneyFailure,
  Claim,
  Other,
}

export enum FormSectionTypeEnum {
  DEFAULT = 0,
  DEFAULT_1,
  DEFAULT_2,
  DEFAULT_3,
  BLANK,
  HOUSEHOLD,
  HOUSEHOLD_INFORMATION,
}

export enum RequestTypeEnum {
  REQUESTER_SITE = 0,
  PAPER,
}

export enum RequestStatusEnum {
  FirstInput = 1, // 画像登録待ち
  ImageAttached, // 二次入力待ち
  SecondInput, // 入力完了突合待ち
  InputComparedNG, // 入力突合結果不可
  InputComparedOK = 10, // 一次審査待ち
  FirstAudited, // 二次審査待ち
  SecondAudited, // 審査完了突合待ち
  AuditComparedNG, // 審査突合結果不可
  AuditComparedOK, // 審査承認待ち
  Duplicated, // 重複申請
  Delivering, // 審査完了データ納品待ち
  Delivered, // 審査完了データ納品済み
  PaymentAccepted, // 支給決定
  PaymentNotAccepted, // 不支給決定
}

export enum AuditStepEnum {
  Audit1 = 1,
  Audit2,
}

export enum RequestInputModeEnum {
  Input1 = 1,
  Input2,
}

export enum Screens {
  S001 = 1,
  S003,
  S004,
  S005,
  S006,
  S007,
  S018,
  S059,
  S064,
  S025,
  S060,
}

export enum FieldStyleSiteSettingEnum {
  BigHeading = 1,
  MediumHeading,
  SmallHeading,
  MainText,
  MainTextForMediumHeading,
  DivideLine,
  Link,
}

export enum DelayTypeEnum {
  ApplicationInput = 1, // 申請書入力
  AuditInput, // 内容審査
  MistakeApplication, // 申請不備
  FailedTransfer, // 振込不能
}

export enum BatchStatusEnum {
  Start = 1,
  Failed, // 異常終了/abnormal finish
  Success,
}

export enum RequesterRequestStatus {
  Received = 1,
  Confirming,
  PaymentPreparing,
  PaymentNotAccepted,
  InquiryMaking,
  TransferError,
}

export enum BatchTypeEnum {
  Monthly = 1,
  Weekly,
  Daily,
}

export const ScreenList = {
  [Screens.S001]: '001',
  [Screens.S003]: '003',
  [Screens.S004]: '004',
  [Screens.S005]: '005',
  [Screens.S007]: '007',
  [Screens.S059]: '059',
}

export const RoleList = {
  [RoleEnum.BaseAdmin]: '拠点管理者',
  [RoleEnum.Supervisor]: 'スーパーバイザー',
  [RoleEnum.Operator]: 'オペレーター',
}

export const DepartmentList = {
  [BusinessEnum.BPO_Center]: '事務センター',
  [BusinessEnum.Call_Center]: 'コールセンター',
}

export const UserStatusList = {
  [UserStatusEnum.Active]: '在籍',
  [UserStatusEnum.Inactive]: '退職',
}

export const UserLockedList = {
  [UserLockedEnum.Unlocked]: '付与',
  [UserLockedEnum.Locked]: '停止',
}

export const CallTypeList = {
  [CallTypeEnum.ConfirmBenefit]: '制度の確認',
  [CallTypeEnum.ConfirmRequestStatus]: '申請状況の確認',
  [CallTypeEnum.ConfirmPaymentDay]: '支給日の確認',
  [CallTypeEnum.ConfirmReasonForDefectAndReturn]: '不備・差戻理由の確認',
  [CallTypeEnum.ConfirmReasonForTransferMoneyFailure]: '振込不能理由の確認',
  [CallTypeEnum.Claim]: 'クレーム',
  [CallTypeEnum.Other]: 'その他',
}

export const FormPropertyFieldCodeEnumList = {
  [FormPropertyFieldCodeEnum.FullName]: '氏名',
  [FormPropertyFieldCodeEnum.FullNameKana]: '氏名カナ',
  [FormPropertyFieldCodeEnum.Gender]: '性別',
  [FormPropertyFieldCodeEnum.Age]: '年齢',
  [FormPropertyFieldCodeEnum.PhoneNumber]: '電話番号',
  [FormPropertyFieldCodeEnum.Address]: '住所',
  [FormPropertyFieldCodeEnum.Date]: '日付',
  [FormPropertyFieldCodeEnum.UploadFile]: 'ファイルアップロード',
  [FormPropertyFieldCodeEnum.OtherString]: 'その他　文字列',
  [FormPropertyFieldCodeEnum.OtherInteger]: 'その他　整数',
  [FormPropertyFieldCodeEnum.OtherToggleButton]: 'その他　トグルボタン',
  [FormPropertyFieldCodeEnum.OtherRadioButton]: 'その他　ラジオボタン',
  [FormPropertyFieldCodeEnum.OtherCheckboxButton]: 'その他　チェックボタン',
  [FormPropertyFieldCodeEnum.SubHeading]: '中見出し',
  [FormPropertyFieldCodeEnum.StringDisplay]: '表示テキスト',
}

export const FormPropertyFieldTypeEnumList = Object.freeze({
  [FormPropertyFieldTypeEnum.TextInput]: 'text',
  [FormPropertyFieldTypeEnum.TextArea]: 'textarea',
  [FormPropertyFieldTypeEnum.Checkbox]: 'checkbox',
  [FormPropertyFieldTypeEnum.Radio]: 'radio',
  [FormPropertyFieldTypeEnum.SelectBox]: 'select',
  [FormPropertyFieldTypeEnum.File]: 'file',
  [FormPropertyFieldTypeEnum.Email]: 'email',
  [FormPropertyFieldTypeEnum.EmailConfirm]: 'email_confirm',
})

export const FailedTransferStatusEnumList = Object.freeze({
  [FailedTransferStatusEnum.DeterminedContent]: '入力不備確認済み',
  [FailedTransferStatusEnum.WaitingCall]: '架電対応待ち',
  [FailedTransferStatusEnum.WaitingCreateErrorReport]: '振込不能通知書作成待ち',
  [FailedTransferStatusEnum.Calling]: '架電対応中',
  [FailedTransferStatusEnum.CreatingErrorReport]: '振込不能通知書作成中',
  [FailedTransferStatusEnum.WaitingDeliveryErrorReport]:
    '振込不能通知書納品待ち',
  [FailedTransferStatusEnum.Solving]: '振込不能解消中',
  [FailedTransferStatusEnum.WaitingApproveSolution]: '振込不能解消承認待ち',
  [FailedTransferStatusEnum.WaitingApproveDetermination]:
    '振込不能確定承認待ち',
  [FailedTransferStatusEnum.InvestigatingResponse]: '振込不能返戻書調査中',
  [FailedTransferStatusEnum.WaitingSuperiorInstructions]:
    '（職員エスカレ）振込不能返戻作業指示待ち',
  [FailedTransferStatusEnum.SendingErrorReport]: '振込不能通知書再送中',
  [FailedTransferStatusEnum.Solved]: '振込不能解消済み',
  [FailedTransferStatusEnum.Determined]: '申請の振込不能確定',
})

export const FailedTransferReasonEnumList = Object.freeze({
  [FailedTransferReasonEnum.WrongAccountNumber]: '口座番号相違',
  [FailedTransferReasonEnum.WrongRecipientName]: '受取人名相違',
  [FailedTransferReasonEnum.NotExistAccountNumber]: '該当口座なし',
  [FailedTransferReasonEnum.BankIssue]: '受取口座側事由',
  [FailedTransferReasonEnum.WrongSubject]: '科目相違',
  [FailedTransferReasonEnum.Other]: 'その他',
})

export enum ActionUpdateProjectStatus {
  Submit = '申請',
  CancelSubmitted = '申請取り下げ',
  Reject = '差し戻し',
  Approve = '承認',
  CancelApproved = '承認取り下げ',
  Start = '業務開始',
}

export const MistakeApplicationStatusEnumList = {
  [MistakeApplicationStatusEnum.SolutionWaiting]: '不備対応方針入力待ち',
  [MistakeApplicationStatusEnum.GuideWaiting]: '（職員エスカレ）作業指示待ち',
  [MistakeApplicationStatusEnum.PhoneWaiting]: '架電対応待ち',
  [MistakeApplicationStatusEnum.PaperWaiting]: '不備通知書作成待ち',
  [MistakeApplicationStatusEnum.PhoneMaking]: '架電対応中',
  [MistakeApplicationStatusEnum.PaperMaking]: '不備通知書作成中',
  [MistakeApplicationStatusEnum.PaperShipping]: '不備通知書納品待ち',
  [MistakeApplicationStatusEnum.IssueResolving]: '不備解消中',
  [MistakeApplicationStatusEnum.WaitingForSolutionConfirming]:
    '不備解消承認待ち',
  [MistakeApplicationStatusEnum.WaitingForIssueConfirming]: '不備確定承認待ち',
  [MistakeApplicationStatusEnum.PaperConfirming]: '不備返戻書調査中',
  [MistakeApplicationStatusEnum.WaitingForGuideResponse]:
    '（職員エスカレ）不備返戻作業指示待ち',
  [MistakeApplicationStatusEnum.ResponsePaperShipping]: '不備通知書再送中',
  [MistakeApplicationStatusEnum.IssueResolved]: '不備解消済み',
  [MistakeApplicationStatusEnum.IssueConfirmed]: '申請の不備確定',
}

export enum MistakeApplicationReasonEnum {
  Duplicated = 1,
}

export const MistakeApplicationReasonEnumList = {
  [MistakeApplicationReasonEnum.Duplicated]: '重複申請',
}

export const RequestStatusAcronymEnumList = {
  [RequestStatusEnum.FirstInput]: 'firstInput',
  [RequestStatusEnum.ImageAttached]: 'imageAttached',
  [RequestStatusEnum.SecondInput]: 'secondInput',
  [RequestStatusEnum.InputComparedNG]: 'inputComparedNG',
  [RequestStatusEnum.InputComparedOK]: 'inputComparedOK',
  [RequestStatusEnum.FirstAudited]: 'firstAudited',
  [RequestStatusEnum.SecondAudited]: 'secondAudited',
  [RequestStatusEnum.AuditComparedNG]: 'auditComparedNG',
  [RequestStatusEnum.AuditComparedOK]: 'auditComparedOK',
  [RequestStatusEnum.Duplicated]: 'duplicated',
  [RequestStatusEnum.Delivering]: 'delivering',
  [RequestStatusEnum.Delivered]: 'delivered',
  [RequestStatusEnum.PaymentAccepted]: 'paymentAccepted',
  [RequestStatusEnum.PaymentNotAccepted]: 'paymentNotAccepted',
}
