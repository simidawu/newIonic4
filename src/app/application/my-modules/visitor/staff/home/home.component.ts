import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { VisitorService } from '../../shared/service/visitor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }

  formData: any = [];
  translateTexts: any = {};
  currentUser: any;

  ionViewWillEnter() {
    this.Init();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.Init();
  }

  async Init() {
    this.subscribeTranslateText();
    this.getApply();
  }

  subscribeTranslateText() {
    this.translate
      .get([
        'Visitor.module.statu_new',
        'Visitor.module.statu_waiting',
        'Visitor.module.statu_reject',
        'Visitor.module.statu_approve',
        'Visitor.module.statu_cancel',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  async getApply() {
    const data = {
      userid: this.currentUser.id,
      apply_empno: '',
      docno: '',
      s_apply_date: '',
      e_apply_date: '',
      s_create_date: '',
      e_create_date: '',
      status: '',
      phone: '',
      check: '',
    }
    const res = await this.visitorService.getApplyList(data);
    this.formData = res.json();
    if (this.formData) {
      for (let i in this.formData) {
        if (this.formData[i].STATUS === 'NEW') {
          this.formData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_new'];
        } else if (this.formData[i].STATUS === 'WAITING') {
          this.formData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_waiting'];
        } else if (this.formData[i].STATUS === 'REJECT') {
          this.formData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_reject'];
        } else if (this.formData[i].STATUS === 'APPROVED') {
          this.formData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_approve'];
        } else {
          this.formData[i].CNSTATUS = this.translateTexts['Visitor.module.statu_cancel'];
        }
      }
    }
  }

  doRefresh(refresher: any) {
    this.getApply();
    refresher.complete();
  }


  toDetail(formData: any) {
    console.log('todetail');
    // this.navCtrl.push('AformComponent', {
    //   formData: formData,
    // });
  }

}
