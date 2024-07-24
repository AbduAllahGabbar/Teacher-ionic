import { Injectable } from '@angular/core';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setting: setting;
  userSession: userSession;
   packagesList: [packagesList];
   lecturesList: [lecturesList];
   booksList: [booksList];
   teachersList: [teachersList];
   childrenList: [childrenList];
  constructor(public photoService: PhotoService) {

    this.setting = {
      teacher : {},
      email: '',
      host: '',
      whatsapp: '',
      supportEmail: '',
      phone: '',
      facebookAccount: '',
      instagramAccouunt: '',
      youTubeAccouunt: '',
      twitterAccouunt: '',
      snapAccouunt: '',
      linkedinAccouunt: '',
      telegramAccouunt: '',
      skypeAccouunt: '',
      siteName: '',
      titleSeparator: '',
      siteSlogan: '',
      registerAlert: '',
      description: '',
      textPurchaseByBook: '',
      textPurchaseByCode: '',
      logo: '',
      footerLogo: '',
      banner: '',
      codeCard: '',
      isShared: false,
      citiesAndAreasShow: false,
      nationalitiesShow: false,
      nameBesidLogoShow: false,
      showParent: false,
      showPackages: false,
      showLectures: false,
      showBooks: false,
      showBanner: false,

    };
  }
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface setting {
  teacher : any,
  email : string,
  host : string,
  whatsapp : string,
  supportEmail : string,
  phone : string,
  facebookAccount : string,
  instagramAccouunt : string,
  youTubeAccouunt : string,
  twitterAccouunt : string,
  snapAccouunt : string,
  linkedinAccouunt : string,
  telegramAccouunt : string,
  skypeAccouunt : string,
  siteName : string,
  titleSeparator : string,
  siteSlogan : string,
  registerAlert : string,
  description : string,
  textPurchaseByBook : string,
  textPurchaseByCode : string,
  logo : string,
  footerLogo : string,
  banner : string,
  codeCard : string,
  isShared : boolean,
  citiesAndAreasShow : boolean,
  nationalitiesShow : boolean,
  nameBesidLogoShow : boolean,
  showParent : boolean,
  showPackages : boolean,
  showLectures : boolean,
  showBooks : boolean,
  showBanner : boolean,

}

export interface childrenList {
  id: number;
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface teachersList {
  id: number;
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  title: string;
  bio: number;
}

export interface packagesList {
  id: number;
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  totalLecturesPrice: number;
}
export interface lecturesList {
  id: number;
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
}
export interface booksList {
  id: number;
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
}
export interface userSession {
  id: number;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  mobile: string;
  notificationsCount : number;
  type: string;
  notificationsList: any[];
  booksList: any[];
  lecturesList: any[];
  packagesList: any[];
  schoolYear : any;
  educationalLevel : any;


}
export interface teacher {
  id: number;
  _id: string;
  firstName: string;
}
