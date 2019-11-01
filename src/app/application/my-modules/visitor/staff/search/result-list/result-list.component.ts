import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { VisitorService } from '../../../shared/service/visitor.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'sg-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})

export class ResultListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }

  param: any;
  formData: any[];
  translateTexts: any = {};


  ngOnInit() {
    this.subscribeTranslateText();
    this.route.params.subscribe((params: any) => {
      this.param = params;
    });
    this.Init();
  }


  async Init() {
    console.log(this.param);
    const res = await this.visitorService.getApplyList(this.param);
    this.formData = res.json();
    console.log(this.formData);
    if (this.formData) {
      for (let i = 0; i < this.formData.length; i++) {
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


  toDetail(formData: any) {
    // this.navCtrl.push('AformComponent', { formData: formData });
  }

}
