import { Component, OnInit } from '@angular/core';
import { AlertController, Events, PopoverController } from '@ionic/angular';
import { VisitorService } from '../../../shared/service/visitor.service';
import { TranslateService } from '@ngx-translate/core';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'sg-check-detail',
  templateUrl: './check-detail.component.html',
  styleUrls: ['./check-detail.component.scss'],
})

export class CheckDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private events: Events,
    private plugin: PluginService,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }


  status = '';
  newvisitor = '';
  visitorlist: any;
  goodslist: any;

  page = 'detail';
  title = '';
  intervaltime = '';  // 進出時間
  id = 0; // 數據id
  type = '';  // 門禁類型
  iostatus = '';  // 進出類型
  FormData: any = [];
  applyid = 0;  // 外部申請記錄id
  isOutside = false;   // 是否外部申请记录
  canFinish = false; // 是否顯示單據終結按鈕
  visitorList: any[] = [];
  goodsList: any[] = [];
  visitorsData: any[] = [];   // 人员通行记录
  goodsData: any[] = [];    // 物品通行记录
  translateTexts: any = {};

  async ionViewWillEnter() {
    this.route.queryParams.subscribe((p) => {
      // console.log(p);
      this.id = p.id;
      this.type = p.type;
      this.iostatus = p.iostatus;
    });
    // 獲取單據信息
    const res = await this.visitorService.getTodayCheckList(this.id);
    // console.log(res);
    this.FormData = res[0];
    // console.log(this.FormData);
    // 進出時間
    this.intervaltime = moment(this.FormData.START_DATE).format('YYYY-MM-DD') + '—' + moment(this.FormData.END_DATE).format('YYYY-MM-DD');
    // 身份证显示
    if (this.iostatus === 'in' && this.FormData.invisitorsdata.length > 0) {
      this.FormData.invisitorsdata.forEach((e: any) => {
        if (e.CREDENTIALS_NO == null) {
          e.CREDENTIALS_NO_EN = '';
        } else {
          if (e.CREDENTIALS_NO.length >= 15) {
            e.CREDENTIALS_NO_EN = e.CREDENTIALS_NO.replace(/(\d{6})\d{10}(\d{2})/g, '$1**********$2');
          } else {
            let mid = e.CREDENTIALS_NO.substring(4, e.CREDENTIALS_NO.length - 3);
            mid = mid.replace(/./g, '*');
            e.CREDENTIALS_NO_EN = e.CREDENTIALS_NO.substring(0, 4) + mid + e.CREDENTIALS_NO.substring(e.CREDENTIALS_NO.length - 3, e.CREDENTIALS_NO.length);
          }
        }
      });
    } else if (this.iostatus === 'out' && this.FormData.invisitorsdata.length > 0) {
      this.FormData.invisitorsdata.forEach((e: any) => {
        if (e.CREDENTIALS_NO == null) {
          e.CREDENTIALS_NO_EN = '';
        } else {
          e.CREDENTIALS_NO_EN = e.CREDENTIALS_NO.replace(/(\d{6})\d{10}(\d{2})/g, '$1**********$2');
        }
      });
    }
    // 根据选择进出状态赋值显示人员和物品
    if (this.iostatus === 'in') {
      this.status = this.translateTexts['Visitor.check.apply_enter'];
      this.visitorList = this.FormData.invisitorsdata;
      this.goodsList = this.FormData.ingoodsdata;
    } else {
      this.status = this.translateTexts['Visitor.check.apply_leave'];
      this.visitorList = this.FormData.outvisitorsdata;
      this.goodsList = this.FormData.outgoodsdata;
    }
    if (this.visitorList.length > 0) {
      this.visitorList.forEach(e => {
        e.isChoose = true;
      });
    }
    if (this.goodsList.length > 0) {
      this.goodsList.forEach(e => {
        e.isChoose = true;
      });
    }

    // 是否掃碼申請點擊進入的
    if (this.FormData.APPLY_STATUS !== undefined) {
      this.isOutside = true;
      this.applyid = this.FormData.APPLY_ID;
    }

    // 單據終結按鈕
    if (this.FormData.END_DATE === this.visitorService.getToday()) {
      this.canFinish = true;
    }

    this.getHistory();
  }

  ngOnInit() {
    this.title = this.translateTexts['Visitor.check.checklist'];

    this.translate
    .get([
      'Visitor.add.editvisitor',
      'Visitor.add.addgoods',
      'Visitor.check.apply_enter',
      'Visitor.check.apply_leave',
      'Visitor.check.checklist',
      'Visitor.check.visitorshistory',
      'Visitor.check.goodshistory',
      'Visitor.check.visitor_err',
      'Visitor.check.finish',
      'Visitor.check.finish_message',
      'Visitor.check.enterstatu',
      'Visitor.check.leavestatu',
      'submit_success',
      'close_success',
      'cancel',
      'confirm',
    ])
    .subscribe(res => {
      this.translateTexts = res;
    });
    // this.events.subscribe('service:fillinGoods', (data: any) => {
    //   this.goodsList = data.data;
    // });

    // this.events.subscribe('service:fillinVisitors', (data: any) => {
    //   this.visitorList = data.data;
    // });
  }

  async getHistory() {
    const allres = await this.visitorService.getTodayHistory(this.id);
    const alllistData = allres.json();
    console.log(alllistData);
    alllistData.forEach((e: any) => {
      e.GOODS_BRAND = e.GOODS_BRAND == null ? '' : e.GOODS_BRAND;
      e.GOODS_MODEL = e.GOODS_MODEL == null ? '' : e.GOODS_MODEL;
      const good = e.GOODS_BRAND + e.GOODS_MODEL + e.GOODS_NAME + e.GOODS_QUANTITY + e.GOODS_UNIT;
      if (e.PERSON_NAME == null) {
        e.DATA = good;
      } else {
        e.DATA = e.PERSON_NAME;
      }
      if (e.TYPE === 'in') {
        e.CNTYPE = this.translateTexts['Visitor.check.enterstatu'];
      } else {
        e.CNTYPE = this.translateTexts['Visitor.check.leavestatu'];
      }
    });
    this.visitorsData = this.selectItems(alllistData.filter((value: any) => value.VISITOR_ID !== null));
    this.goodsData = this.selectItems(alllistData.filter((value: any) => value.GOOD_ID !== null));
    this.segmentChanged();

  }

  // 作用：用于把一维数组的数据按group分成二维数组存储
  selectItems(data: any = []) {
    let temp: any = [];
    let groupTypes: string[] = [];
    for (let i = 0; i < data.length; i++) {
      if (groupTypes.indexOf(data[i].CREATION_DATE) === -1) {
        groupTypes.push(data[i].CREATION_DATE);
      }
    }

    // 数组初始化
    for (let i = 0; i < groupTypes.length; i++) {
      temp[i] = [];
    }

    for (let i = 0; i < groupTypes.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].CREATION_DATE === groupTypes[i]) {
          temp[i].push(data[j]);
        }
      }
    }

    return temp;
  }

  segmentChanged(ev?: any) {
    if (ev) {
      this.page = ev.detail.value === undefined ? 'detail' : ev.detail.value;
    }
    if (this.page === 'detail') {
      this.title = this.translateTexts['Visitor.check.checklist'];
    } else if (this.page === 'visitor') {
      this.title = this.translateTexts['Visitor.check.visitorshistory'];
    } else {
      this.title = this.translateTexts['Visitor.check.goodshistory'];
    }
    console.log(this.page);
  }

  selectPerson(data: any, index: number) {
    if (data.isChoose) {
      this.visitorList[index].isChoose = false;
    } else {
      this.visitorList[index].isChoose = true;
    }
  }

  selectGood(data: any, index: number) {
    if (data.isChoose) {
      this.goodsList[index].isChoose = false;
    } else {
      this.goodsList[index].isChoose = true;
    }
  }

  toGoodDetail(data: any) {
    // this.navCtrl.push('AddGoodsComponent', { formPage: this.data.TYPE, data: data, title: this.translateTexts['Visitor.add.addgoods'] });
  }

  // toVisitorDetail(data: any) {
  //   if (this.data.TYPE === 'emp') {
  //     this.navCtrl.push('AddEmployeesComponent', { data: data, title: this.translateTexts['Visitor.add.editvisitor'] });
  //   } else {
  //     this.navCtrl.push('AddVisitorsComponent', { data: data, title: this.translateTexts['Visitor.add.editvisitor'], type: this.data.TYPE });
  //   }
  // }

  // presentPopover(myEvent: any) {
  //   let popover = this.popoverCtrl.create('VFormMenuComponent', { this: this, data: this.data.ID, type: 'check' });
  //   popover.present({
  //     ev: myEvent,
  //   });
  // }

  // submitForm() {
  //   // 保安放行：先更新或添加访客表和物品表，再插入一条记录到history；访客表必须先加上STATUS和DOCUMENT_ID再更新或插入；物品表必修先加上DOCUMENT_ID
  //   let allData: any = {};
  //   allData.data = {
  //     ID: '',
  //     VISITOR_ID: '',
  //     GOOD_ID: '',
  //     TYPE: this.iostatus,
  //     AREA: '',
  //     DOCUMENT_ID: this.data.ID,
  //   };

  //   if (this.visitorList.length > 0) {
  //     let times = 0;
  //     this.visitorList.forEach(e => {
  //       if (e.isChoose) {
  //         times++;
  //       }
  //       e.DOCUMENT_ID = this.data.ID;
  //       e.STATUS = '2';   // 2保安发放
  //     });
  //     if (times == 0) {
  //       this.plugin.showToast(this.translateTexts['Visitor.check.visitor_err']);
  //       return false;
  //     }
  //   }

  //   if (this.goodsList.length > 0) {
  //     this.goodsList.forEach(e => {
  //       if (e.DOCUMENT_ID == undefined) {
  //         e.DOCUMENT_ID = this.data.ID;
  //       }
  //     });
  //   }
  //   allData.visitorsdata = this.visitorList;
  //   allData.goodsdata = this.goodsList;
  //   allData.isoutside = this.isOutside;
  //   allData.applyid = this.applyid;
  //   try {
  //     this.visitorService.postCheckData(allData);
  //     this.plugin.showToast(this.translateTexts['submit_success']);
  //     this.navCtrl.getPrevious().data.type = this.type;
  //     this.navCtrl.pop();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // 单据终结
  async finishForm() {
    const confirm = await this.alertCtrl.create({
      header: this.translateTexts['Visitor.check.finish'],
      message: this.translateTexts['Visitor.check.finish_message'],
      buttons: [
        {
          text: this.translateTexts['cancel'],
          role: 'cancel',
          handler: () => { }
        },
        {
          text: this.translateTexts['confirm'],
          handler: () => {
            this.visitorService.isSameHistory(this.id).then(r => {
              let res = r.json();
              if (res[0]['INCOUNT'] == res[1]['OUTCOUNT']) {
                let sdata = {
                  ID: this.id,
                  STATUS: 'FINISHED'
                }
                this.visitorService.updateFormStatus(sdata);
                this.plugin.showToast(this.translateTexts['reservation.report.closeSucc']);
                // this.navCtrl.pop();
              }
            });
          }
        }
      ]
    });
    await confirm.present();
  }

}