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
        'visit.statu',
        'visit.statu1',
        'visit.statu2',
        'visit.statu3',
        'visit.statu4',
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
      // for (var i = 0; i < this.formData.length; i++) {
      for (let i in this.formData) {
        if (this.formData[i].STATUS === 'NEW') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu'];
        } else if (this.formData[i].STATUS === 'WAITING') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu1'];
        } else if (this.formData[i].STATUS === 'REJECT') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu2'];
        } else if (this.formData[i].STATUS === 'APPROVED') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu3'];
        } else {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu4'];
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
