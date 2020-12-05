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

export enum ToastMessageEnum {
  DEFAULT_SUCCESS = 'Akcja zakończyła się sukcesem',
  DEFAULT_ERROR = 'Coś poszło nie tak, spróbuj ponownie później',
  GET_DATA_ERROR = 'Nie udało sie pobrać danych',
  AUTH_ERROR = 'Użytkownik nie jest zautoryzowany',
  LOGIN_SUCCESS = 'Logowanie się powiodło',
  LOGIN_ERROR = 'Logowanie się nie powiodło',
  LOGOUT_SUCCESS = 'Wylogowanie się powiodło',
  LOGOUT_ERROR = 'Wylogowanie się nie powiodło',
  MODIFY_USER_SUCCESS = 'Dane profilu zaktualizowane',
  MODIFY_USER_ERROR = 'Nie udało się zaktualizować danych',
  REGISTER_SUCCESS = 'Rejestracja się powiodła',
  REGISTER_ERROR = 'Rejestracja się nie powiodła',
  LOGO_DOWNLOAD_ERROR = 'Nie udało się pobrać zdjęcia profilowego',
  LOGO_MODIFY_ERROR = 'Nie udało się zaktualizować zdjęcia profilowego',
  DELETE_PRODUCT_ERROR = 'Nie udało się usunąć produktu',
  DELETE_PRODUCT_SUCCESS = 'Produkt usunięty pomyślnie',
  ADD_PRODUCT_ERROR = 'Nie udało się dodać produktu',
  ADD_PRODUCT_SUCCESS = 'Produkt dodany pomyślnie',
  FILE_ADD_ERROR = 'Nie udało się dodać jednego ze zdjęć',
  PRODUCT_FOLDER_REMOVE_ERROR = 'Nie udało się usunąć zdjęć produktu',
  DIFFERENT_PASSWORD_ERROR = 'Hasła się różnią',
}
