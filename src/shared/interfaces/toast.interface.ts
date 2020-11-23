export enum ToastTypeEnum {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  INFORMATION = 'INFORMATION',
}

export interface IToastInterface {
  type: ToastTypeEnum;
  message: string;
  time?: number;
}
