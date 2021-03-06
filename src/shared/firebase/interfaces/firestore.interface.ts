export interface IUserFirebaseCollection {
  address: IUserAddress;
  email: string;
  phone: string;
  firstName: string;
  id: string;
  interests: string[];
  logo: Blob;
  platform: PlatformEnum[];
  surname: string;
  userName: string;
  type: AccountTypeEnum;
}

export interface IProductFirebaseCollection {
  approximatePrice: number;
  category: string[];
  description: string;
  id: number;
  name: string;
  platform: PlatformEnum[];
  position: { longitude; latitude } | string;
  possibleExchangeItem: string;
  productImages: Blob[];
  state: StateEnum;
  userId: string;
}

export interface IExchangeFirebaseCollection {
  buyerOfferData: IExchangeOfferData;
  ownerOfferData: IExchangeOfferData;
  ownerId: string;
  buyerId: string;
  id: number;
  status: StatusEnum;
}

export interface IExchangeOfferData {
  productId: number;
  productName: string;
  status: StatusEnum;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  description: string;
}

export interface IUserAddress {
  city: string;
  country: string;
  flatNo: string;
  houseNo: string;
  postalCode: string;
  street: string;
}

export enum AccountTypeEnum {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum StatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
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
