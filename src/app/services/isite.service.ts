import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserObject,
} from '@awesome-cordova-plugins/in-app-browser/ngx';

import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { timeout } from 'rxjs';
import { get } from 'http';

@Injectable({
  providedIn: 'root',
})
// https://harajtmor.com
export class IsiteService {
  busy: boolean = false;
  accessToken: string = null;
  baseURL: string = 'http://shared.localhost';
  loader: HTMLIonLoadingElement = null;
  browser: InAppBrowserObject = null;
  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public iab: InAppBrowser
  ) {
    let ii = setInterval(() => {
      if (this.accessToken) {

        clearInterval(ii);
        this.getSetting();
      }
    }, 1000);
    this.start();
  }

  alert(title: any, msg: any) {
    return this.alerCtrl.create({
      header: title,
      message: msg,
      buttons: [
        {
          text: 'موافق',
        },
      ],
    });
  }

  toast(msg: string) {
    return this.toastCtrl
      .create({
        message: msg,
        duration: 2000,
        position: 'bottom',
        cssClass: 'toast',
      })
      .then((toast) => {
        toast.present();
      });
  }

  async start() {
    if (this.busy) {
      return false;
    }
    this.busy = true;
   
    const loader = await this.loadingCtrl.create({
      message: ' انتظر قليلا - جاري التحميل',
    });

    await loader.present();
    if (!this.accessToken) {
      this.accessToken =
        (await (await Preferences.get({ key: 'accessToken' })).value) || null;
    }
    
    this.getUserSession(() => {
      loader.dismiss();
    });
  }

  async getUserSession(callback) {
    this.api({
      url: '/x-api/session',
      body: {},
    }).subscribe((resUserSession: any) => {
      if (callback) {
        callback();
      }
      if (resUserSession.session.accessToken) {
        this.accessToken = resUserSession.session.accessToken;
        Preferences.set({ key: 'accessToken', value: this.accessToken });
      }

      if (resUserSession.done) {
        if (resUserSession.session.user) {
        // this.updateVisit();

          this.db.userSession = {
            id: resUserSession.session.user.id,
            _id: resUserSession.session.user._id,
            email: resUserSession.session.user.email,
            mobile: resUserSession.session.user.mobile,
            firstName: resUserSession.session.user.firstName,
            lastName: resUserSession.session.user.lastName,
            image: resUserSession.session.user.image.url,
            type: resUserSession.session.user.type,
            notificationsCount: resUserSession.session.user.notificationsCount,
            notificationsList: resUserSession.session.user.notificationsList,
            booksList: resUserSession.session.user.booksList,
            lecturesList: resUserSession.session.user.lecturesList,
            packagesList: resUserSession.session.user.packagesList,
            schoolYear: resUserSession.session.user.schoolYear,
            educationalLevel: resUserSession.session.user.educationalLevel,
 
          };
          this.db.userSession.image =
            this.baseURL + this.db.userSession.image;
          /*           this.updateVisit();
           */

        }
      }
    });
  }

  async getSetting() {
    this.api('/api/get-site-setting').subscribe((res: any) => {
      if (res.done) {
        
        this.db.setting = res.doc;
        this.db.setting.teacher = res.doc.teacher || {};
        this.db.setting.email = res.doc.email || '';
        this.db.setting.host = 'shared.localhost';
        this.db.setting.whatsapp = res.doc.whatsapp || '';
        this.db.setting.supportEmail = res.doc.supportEmail || '';
        this.db.setting.phone = res.doc.phone || '';
        this.db.setting.facebookAccount = res.doc.facebookAccount || '';
        this.db.setting.instagramAccouunt = res.doc.instagramAccouunt || '';
        this.db.setting.youTubeAccouunt = res.doc.youTubeAccouunt || '';
        this.db.setting.twitterAccouunt = res.doc.twitterAccouunt || '';
        this.db.setting.snapAccouunt = res.doc.snapAccouunt || '';
        this.db.setting.linkedinAccouunt = res.doc.linkedinAccouunt || '';
        this.db.setting.telegramAccouunt = res.doc.telegramAccouunt || '';
        this.db.setting.skypeAccouunt = res.doc.skypeAccouunt || '';
        this.db.setting.siteName = res.doc.siteName || '';
        this.db.setting.titleSeparator = res.doc.titleSeparator || '';
        this.db.setting.siteSlogan = res.doc.siteSlogan || '';
        this.db.setting.description = res.doc.description || '';
        this.db.setting.textPurchaseByBook = res.doc.textPurchaseByBook || '';
        this.db.setting.textPurchaseByCode = res.doc.textPurchaseByCode || '';
        this.db.setting.logo = res.doc.logo ? this.baseURL +  res.doc.logo.url : '';
        this.db.setting.footerLogo = res.doc.footerLogo ? this.baseURL +  res.doc.footerLogo.url : '';
        this.db.setting.banner = res.doc.banner ? this.baseURL +  res.doc.banner.url : '';
        this.db.setting.codeCard = res.doc.codeCard || '';
        this.db.setting.isShared = res.doc.isShared || false;
        this.db.setting.citiesAndAreasShow = res.doc.citiesAndAreasShow || false;
        this.db.setting.nationalitiesShow = res.doc.nationalitiesShow || false;
        this.db.setting.nameBesidLogoShow = res.doc.nameBesidLogoShow || false;
        this.db.setting.showParent = res.doc.showParent || false;
        this.db.setting.showPackages = res.doc.showPackages || false;
        this.db.setting.showLectures = res.doc.showLectures || false;
        this.db.setting.showBooks = res.doc.showBooks || false;
        this.db.setting.showBanner = res.doc.showBanner || false;
     
      }
    });
  }

  api(options: any) {
    if (typeof options == 'string') {
      options = {
        url: options,
        type: 'post',
      };
    }

    options.headers = options.headers || {};
    options.headers['Access-Token'] = this.accessToken || '';
    options.url = this.baseURL + options.url;
    if (options.type == 'get') {
      return this.http.get(options.url, {
        headers: options.headers,
      });
    } else {
      return this.http.post(options.url, options.body, {
        headers: options.headers,
      });
    }
  }

  openOnlineSite() {
    let ii = setInterval(() => {
      if (this.accessToken) {
        clearInterval(ii);
        if (this.browser) {
          this.browser.show();
        } else {
          this.initBrowser();
          this.browser.show();
        }
      }
    }, 100);
  }

  updateVisit() {
    this.api({
      type: 'get',
      url: '/api/user/update-visit-date',
    }).subscribe((res: any) => {
    });
  }

  initBrowser() {
    let ii = setInterval(() => {
      if (this.accessToken) {
        clearInterval(ii);
        if (!this.browser) {
          this.browser = this.iab.create(
            this.baseURL + '/create-ad' + '?access-token=' + this.accessToken,
            '_self',
            {
              location: 'no', //Or 'no'
              hidden: 'yes', //Or  'yes'
              clearcache: 'no',
              clearsessioncache: 'no',
              zoom: 'no', //Android only ,shows browser zoom controls
              hardwareback: 'yes',
              mediaPlaybackRequiresUserAction: 'no',
              shouldPauseOnSuspend: 'no', //Android only
              closebuttoncaption: 'Close', //iOS only
              disallowoverscroll: 'no', //iOS only
              toolbar: 'no', //iOS only
              enableViewportScale: 'no', //iOS only
              allowInlineMediaPlayback: 'no', //iOS only
              presentationstyle: 'pagesheet', //iOS only
              fullscreen: 'yes', //Windows only
            }
          );
          this.browser.on('loadstart').subscribe(
            (event) => {
              console.log('loadstart -->', event);
            },
            (err) => {
              console.log('InAppBrowser loadstart Event Error: ' + err);
            }
          );
        }
      }
    }, 100);
  }
}
