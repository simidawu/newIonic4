import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { VisitorService } from '../../../shared/service/visitor.service';
import { TranslateService } from '@ngx-translate/core';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'sg-mainlist',
  templateUrl: './mainlist.component.html',
  styleUrls: ['./mainlist.component.scss'],
})
export class MainlistComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private visitorService: VisitorService,
    private plugin: PluginService,
    private translate: TranslateService,
  ) { }

  type = '';
  status = 'visit';
  recordCounts: 0;
  listData: any[] = [];
  otherlistData: any[] = [];
  visitlistData: any[] = [];
  buildlistData: any[] = [];
  recordsData: any[] = [];
  translateTexts: any = {};


  ionViewWillEnter() {
    this.getApply();
  }

  async ngOnInit() {
    this.subscribeTranslateText();
    this.route.queryParams.subscribe((p) => {
      // console.log(p);
      this.type = p.type === undefined ? '' : p.type;
    });
    this.getApply();
  }

  async getApply() {
    let allres = await this.visitorService.getTodayCheckList();
    let alllistData = allres.json();
    // console.log(alllistData);
    if (alllistData) {
      for (let i = 0; i < alllistData.length; i++) {
        if (alllistData[i].STATUS === 'NEW') {
          alllistData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_new'];
        } else if (alllistData[i].STATUS === 'WAITING') {
          alllistData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_waiting'];
        } else if (alllistData[i].STATUS === 'REJECT') {
          alllistData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_reject'];
        } else if (alllistData[i].STATUS === 'APPROVED') {
          alllistData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_approve'];
        } else {
          alllistData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_cancel'];
        }
      }
    }
    this.visitlistData = alllistData.filter((value: any) => value.TYPE === 'visit');
    this.buildlistData = alllistData.filter((value: any) => value.TYPE === 'build');
    this.otherlistData = alllistData.filter((value: any) => value.TYPE !== 'visit' && value.TYPE !== 'build');
    const count = await this.visitorService.getVisitApplyList();
    const res = count.json();
    this.recordsData = res[1];
    this.recordCounts = res[0][0]['COUNTS'];
    if (this.recordsData) {
      for (let i = 0; i < this.recordsData.length; i++) {
        if (this.recordsData[i].APPLY_STATUS == 'in') {
          this.recordsData[i].APPLYSTATUS = this.translateTexts['Visitor.check.apply_enter'];
        } else {
          this.recordsData[i].APPLYSTATUS = this.translateTexts['Visitor.check.apply_leave'];
        }
      }
    }
    this.segmentChanged();
  }

  subscribeTranslateText() {
    this.translate
      .get([
        'Visitor.module.statu_new',
        'Visitor.module.statu_waiting',
        'Visitor.modulestatu_reject',
        'Visitor.module.statu_approve',
        'Visitor.module.statu_cancel',
        'Visitor.check.apply_enter',
        'Visitor.check.apply_leave',
        'Visitor.check.status-choose',
        'Visitor.check.enterstatu',
        'Visitor.check.leavestatu',
        'Visitor.check.checklist',
        'Visitor.check.finish_error',
        'Visitor.check.status_error',
        'cancel'
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  segmentChanged(ev?: any) {
    if (ev) {
      this.status = ev.detail.value === undefined ? 'visit' : ev.detail.value;
      // console.log(ev);
    }
    // console.log(this.status);
    if (this.status === 'visit') {
      this.listData = this.visitlistData;
    } else if (this.status === 'build') {
      this.listData = this.buildlistData;
    } else if (this.status === 'other') {
      this.listData = this.otherlistData;
    } else {
      this.listData = this.recordsData;
    }
  }

  doRefresh(refresher: any) {
    this.getApply();
    refresher.complete();
  }

  async presentPrompt(formdata: any) {
    let isCome = false;
    // console.log(formdata);
    if (formdata.STATUS !== 'APPROVED') {
      this.plugin.showToast(this.translateTexts['Visitor.check.finish_error']);
    } else {
      if (formdata.outvisitorsdata.length === 0) {
        isCome = true;
      }
      if (this.type === 'floor') {
        // let allData: any = {};
        // allData = formdata;
        // allData.IOSTATUS = 'out';
        // this.navCtrl.push('CheckDetailComponent', { type: this.type, data: allData });
        this.router.navigate(['/tabs/application/visitor/checkdetail'], {
          queryParams: {
            type: this.type,
            iostatus: 'out',
            id: formdata.ID
          }
        });
      } else {
        const alert = await this.alertCtrl.create({
          header: this.translateTexts['Visitor.check.status-choose'],
          inputs: [
            {
              type: 'radio',
              label: this.translateTexts['Visitor.check.enterstatu'],
              value: 'in',
            },
            {
              type: 'radio',
              label: this.translateTexts['Visitor.check.leavestatu'],
              value: 'out',
              disabled: isCome,
            }
          ],
          buttons: [
            {
              text: this.translateTexts['cancel'],
              role: 'cancel',
              handler: () => { }
            },
            {
              text: this.translateTexts['Visitor.check.checklist'],
              handler: data => {
                if (data === undefined) {
                  this.plugin.showToast(this.translateTexts['Visitor.check.status_error']);
                } else {
                  // let allData: any = {};
                  // allData = formdata;
                  // allData.IOSTATUS = data;
                  // this.navCtrl.push('CheckDetailComponent', { type: this.type, data: allData });
                  this.router.navigate(['/tabs/application/visitor/checkdetail'], {
                    queryParams: {
                      type: this.type,
                      iostatus: data,
                      id: formdata.ID
                    }
                  });
                }
              }
            }
          ]
        });
        alert.present();
      }
    }
  }
}
