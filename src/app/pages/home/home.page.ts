import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { MenuPage } from '../menu/menu.page';
import { ActivatedRoute } from '@angular/router';
import { IsiteService } from '../../services/isite.service';
import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: [
    // '../content-details/content-details.page.scss',
    './home.page.scss',
  ],
})
export class HomePage implements OnInit {
  contentList: [];

  constructor(
    public isite: IsiteService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {
    // this.filter = {
    //   new: false,
    //   near: false,
    //   with_photos: false,
    //   price: 'lowest',
    //   price_to: 0,
    //   price_from: 0,
    // };

    this.loadPackages({});
    this.loadLectures({});
    this.loadBooks({});
    this.loadChildren({});
    this.loadTeachers({});
  }

  async menu() {
    const modal = await this.modalCtrl.create({
      component: MenuPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Example header',
      subHeader: 'Example subheader',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Share',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    let result = await actionSheet.onDidDismiss();
    let result2 = JSON.stringify(result, null, 2);
  }

  ngOnInit() {}

  // addContent() {
  //   window.open(
  //     this.isite.baseURL +
  //       '/create_content?access-token=' +
  //       this.isite.accessToken,
  //     '_self'
  //   );
  // }

  doRefresh(event: Event) {}

  async loadChildren(options: any) {
    if (this.isite.db.userSession) {
      this.route.queryParams.subscribe((params) => {
        this.isite
          .api({
            url: '/api/manageUsers/all',
            body: {
              select: { id: 1, _id: 1, firstName: 1, lastName: 1, image: 1 },
              where: { 'parent.id': this.isite.db.userSession.id },
            },
          })
          .subscribe((res: any) => {
            if (res.done) {
              res.list.forEach((ad) => {
                ad.image = this.isite.baseURL + ad.image.url;
              });
              this.isite.db.childrenList = res.list;
            }
          });
      });
    }
  }

  async loadTeachers(options: any) {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/manageUsers/all',
          body: {
            select: {
              id: 1,
              _id: 1,
              firstName: 1,
              lastName: 1,
              bio: 1,
              title: 1,
              image: 1,
            },
            where: { type: 'teacher', active: true },
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.list.forEach((ad) => {
              ad.image = this.isite.baseURL + ad.image.url;
            });
            this.isite.db.teachersList = res.list;
          }
        });
    });
  }
  async loadPackages(options: any) {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/packages/all',
          body: {
            type: 'toStudent',
            select: {
              id: 1,
              _id: 1,
              name: 1,
              price: 1,
              description: 1,
              image: 1,
              totalLecturesPrice: 1,
            },
            where: {},
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.list.forEach((ad) => {
              ad.image = this.isite.baseURL + ad.image.url;
            });
            this.isite.db.packagesList = res.list;
          }
        });
    });
  }

  async loadLectures(options: any) {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/lectures/all',
          body: {
            type: 'toStudent',
            select: {
              id: 1,
              _id: 1,
              name: 1,
              price: 1,
              description: 1,
              image: 1,
            },
            where: {},
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.list.forEach((ad) => {
              ad.image = this.isite.baseURL + ad.image.url;
            });
            this.isite.db.lecturesList = res.list;
          }
        });
    });
  }

  async loadBooks(options: any) {
    this.route.queryParams.subscribe((params) => {
      this.isite
        .api({
          url: '/api/books/all',
          body: {
            type: 'toStudent',
            select: {
              id: 1,
              _id: 1,
              name: 1,
              price: 1,
              description: 1,
              image: 1,
            },
            where: {},
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.list.forEach((ad) => {
              ad.image = this.isite.baseURL + ad.image.url;
            });
            this.isite.db.booksList = res.list;
          }
        });
    });
  }

  selectTeacher(id) {
    this.isite
      .api({
        url: '/api/selectTeacher',
        body: { id: id },
      })
      .subscribe((res: any) => {
        if (res.done) {
          window.location.href = '/';
        }
      });
  }
}
export interface top_category_list {
  id: number;
  image: string;
  name_ar: string;
  name_en: string;
}
