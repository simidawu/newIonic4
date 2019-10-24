import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { VisitorService } from '../../../shared/service/visitor.service';

@Component({
  selector: 'sg-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})

export class ResultListComponent implements OnInit {

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }

  formData: any[];
  translateTexts: any = {};


  ionViewWillEnter() {
    this.Init();
  }


  ngOnInit() {
    this.Init();
  }


  async Init() {
    this.subscribeTranslateText();
    let searchdata = this.navParams.get('searchdata');
    let res = await this.visitorService.getApplyList(searchdata);
    this.formData = res.json();
    if (this.formData) {
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].STATUS == 'NEW') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu'];
        } else if (this.formData[i].STATUS == 'WAITING') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu1'];
        } else if (this.formData[i].STATUS == 'REJECT') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu2'];
        } else if (this.formData[i].STATUS == 'APPROVED') {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu3'];
        } else {
          this.formData[i].CNSTATUS = this.translateTexts['visit.statu4'];
        }
      }
    }
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


  toDetail(formData: any) {
    // this.navCtrl.push('AformComponent', { formData: formData });
  }

}
