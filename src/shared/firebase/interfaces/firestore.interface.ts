export interface IUserFirebaseCollection {
  address: IUserAddress;
  email: string;
  firstName: string;
  id: number;
  interests: string[];
  logo: string;
  platform: PlatformEnum[];
  surname: string;
  userName: string;
}

export interface IProductFirebaseCollection {
  approximatePrice: number;
  category: string[];
  description: string;
  id: number;
  name: string;
  platform: PlatformEnum[];
  position: [];
  possibleExchangeItem: string;
  productImages: string[];
  state: StateEnum;
  userId: number;
}

export interface IExchangeFirebaseCollection {
  buyerOfferData: IExchangeOfferData;
  ownerOfferData: IExchangeOfferData;
  id: number;
  status: StatusEnum;
}

export interface IExchangeOfferData {
  productId: number;
  productName: string;
  status: StatusEnum;
  userId: number;
  userName: string;
}

export interface IUserAddress {
  city: string;
  country: string;
  flatNo: string;
  houseNo: string;
  postalCode: string;
  street: string;
}

export enum StatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
}

export enum StateEnum {
  GOOD = 'GOOD',
  BAD = 'BAD',
  NEW = 'NEW',
  USED = 'USED',
}

export enum PlatformEnum {
  PC = 'PC',
  CONSOLE = 'KONSOLA',
  PS5 = 'PS5',
  PS4 = 'PS4',
  NINTENDO = 'NINTENDO',
  PS = 'PS',
  PEGASUS = 'PEGASUS',
}

export enum InterestsEnum {
  ADVENTURES = 'PODRÓŻE',
  GAMES = 'GRY',
  MUSIC = 'MUZYKA',
  ART = 'SZTUKA',
  CARS = 'SAMOCHODY',
  PROGRAMMING = 'PROGRAMOWANIE',
  PEOPLE = 'LUDZIE',
  NATURE = 'NATURA',
}
