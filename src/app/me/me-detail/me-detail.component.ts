import { Subscription } from 'rxjs';
import { User_Update } from './../../shared/actions/user.action';
import { MyStore } from './../../shared/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PluginService } from '../../core/services/plugin.service';
import { MeService } from '../shared/service/me.service';
import { TranslateService } from '@ngx-translate/core';
import { UserState } from './../../shared/models/user.model';
import { MyHttpService } from '../../core/services/myHttp.service';
import { Router } from '@angular/router';


@Component({
  selector: 'sg-detail',
  templateUrl: 'me-detail.component.html',
})
export class MeDetailComponent implements OnInit, OnDestroy {
  errMes: string;
  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private plugin: PluginService,
    private loadingCtrl: LoadingController,
    private meService: MeService,
    private camera: Camera,
    private translate: TranslateService,
    private store$: Store<MyStore>,
    private router: Router,
    private myHttpService: MyHttpService,
  ) { }

  user: UserState;
  base64Image: string;
  translateTexts: any;
  sub1: Subscription;

  ngOnInit() {
    this.translate
      .get([
        'Me.changeavatar',
        'Me.selectPhoto',
        'Me.confirm',
        'takePhoto',
        'Me.changemobile',
        'Me.changetelephone',
        'Me.changeemail',
        'cancel',
        'correct',
        'Me.correctsuccess',
        'Me.correctsame',
        'Me.incorrectmobile',
        'Me.incorrecttelephone',
        'Me.incorrectmail',
        'Me.failTochangeAvatar',
        'Me.Qr',
        'Me.VCard',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  ionViewWillEnter() {
    const isTokenExpired = this.myHttpService.isTokenExpired();
    if (!isTokenExpired) {
      localStorage.setItem('urlParams', '');
    } else {
      localStorage.setItem('urlParams', 'MeDetailComponent');
    }
    return !isTokenExpired;
  }

  ionViewDidEnter() {
    this.errMes = '';
    this.sub1 = this.store$.select(c => c.userReducer).subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

  async getNewPhoto(type: number, size: number) {
    if (!this.plugin.isCordova()) {
      return;
    }
    let temp = await this.plugin.getNewPhoto(type, size, { allowEdit: true }).catch(e => console.log(e));
    if (!temp) {
      return;
    }
    const temp1 = temp;
    temp = 'data:image/jpeg;base64,' + temp;
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();
    const updateState = await this.meService.setAvatar(temp1).catch(err => {
      console.log(err);
      this.plugin.errorDeal(err);
      return { status: 0 };
    });
    if (updateState.status !== 0) {
      await this.meService.setLocalAvatar(this.user.username, temp);
      this.store$.dispatch(new User_Update({ avatarUrl: temp }));
    } else {
      this.plugin.showToast(
        this.translateTexts['Me.failTochangeAvatar'],
      );
    }
    loading.dismiss();
  }


  async changePhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translateTexts['Me.changeavatar'],
      buttons: [
        {
          text: this.translateTexts['takePhoto'],
          handler: () => {
            this.getNewPhoto(1, 400);
          },
        },
        {
          text: this.translateTexts['Me.selectPhoto'],
          handler: () => {
            this.getNewPhoto(0, 400);
          },
        },
        {
          text: this.translateTexts['cancel'],
          role: this.translateTexts['cancel'],
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    actionSheet.present();
  }

  showQr(): void {
    // 从前端获取
    this.router.navigate([''], {
      queryParams: {
        text: this.user.username,
        title: this.translateTexts['Me.Qr'],
        show: true,
      }
    });
  }

  showMyCradQr(): void {
    // 从前端获取
    const content = `BEGIN:VCARD
                    N;CHARSET=UTF-8:${this.user.nickname}
                    TEL;CELL:${this.user.mobile}
                    ORG;CHARSET=UTF-8:MiTAC;${this.user.department}
                    TITLE;CHARSET=UTF-8:${this.user.position}
                    EMAIL:${this.user.email}
                    END:VCARD`;
    this.router.navigate([''], {
      queryParams: {
        text: content,
        title: this.translateTexts['Me.VCard'],
        show: false,
      }
    });
    // this.navCtrl.push('QrCodeComponent', {
    //   text: content,
    //   title: this.translateTexts['Me.VCard'],
    //   show: false,
    // });
  }

  async changeDetailRequest(type: number) {
    let title = '';
    type = Number(type);
    switch (type) {
      case 1:
        title = this.translateTexts['Me.changemobile'];
        break;
      case 2:
        title = this.translateTexts['Me.changetelephone'];
        break;
      case 3:
        title = this.translateTexts['Me.changeemail'];
        break;
      default:
        break;
    }
    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'del',
          placeholder: '',
        },
      ],
      buttons: [
        {
          text: this.translateTexts['cancel'],
          handler: data => { },
        },
        {
          text: this.translateTexts['correct'],
          handler: data => {
            if (!this.validate(type, data.del)) {
              return;
            }
            this.toChangeDetail(type, data.del);
          },
        },
      ],
    });
    await alert.present();
  }
  toChangeDetail(type: number, newData: string) {
    switch (type) {
      case 1:
        this.meService
          .changeMobile(newData)
          .then(res => {
            if (Number(res.status) === 200) {
              this.user.mobile = newData;
              this.updataSucc();
            }
          })
          .catch(err => {
            console.log(err);
            this.plugin.errorDeal(err);
          });
        break;
      case 2:
        this.meService
          .changeTele(newData)
          .then(res => {
            if (Number(res.status) === 200) {
              this.user.telephone = newData;
              this.updataSucc();
            }
          })
          .catch(err => {
            console.log(err);
            this.plugin.errorDeal(err);
          });
        break;
      case 3:
        this.meService
          .changeMobile(newData)
          .then(res => {
            if (Number(res.status) === 200) {
              this.user.email = newData;
              this.updataSucc();
            }
          })
          .catch(err => {
            console.log(err);
            this.plugin.errorDeal(err);
          });
        break;
      default:
        break;
    }
  }
  updataSucc() {
    this.updateUser();
    this.plugin.showToast(this.translateTexts['Me.correctsuccess']);
  }
  updateUser() {
    this.store$.dispatch(new User_Update(this.user));
  }
  isSame() {
    this.plugin.showToast(this.translateTexts['Me.correctsame']);
  }
  validate(type: number, newData: string) {
    let res = false;
    switch (type) {
      case 1:
        if (newData === this.user.mobile) {
          this.isSame();
          return;
        }
        res =
          /^1\d{10}$/.test(newData) ||
          /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[1-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/.test(
            newData,
          );
        this.errMes = res
          ? ''
          : newData + ': ' + this.translateTexts['Me.incorrectmobile'];
        break;
      case 2:
        if (newData === this.user.telephone) {
          this.isSame();
          return;
        }
        res = /^\d{4}\-\d{8}$/.test(newData) || /^\d{4}$/.test(newData);
        this.errMes = res
          ? ''
          : newData +
          ': ' +
          this.translateTexts['Me.incorrecttelephone'];
        break;
      case 3:
        if (newData === this.user.email) {
          this.isSame();
          return;
        }
        res = /^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]*)*\@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])*/.test(
          newData,
        );
        this.errMes = res
          ? ''
          : newData + ': ' + this.translateTexts['Me.incorrectemail'];
        break;
      default:
        break;
    }
    return res;
  }
}
