import { NavParams, Events, AlertController, } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, } from '@angular/forms';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { VisitorService } from '../../../shared/service/visitor.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'sg-add-visitors',
  templateUrl: 'add-visitors.component.html',
  styleUrls: ['./add-visitors.component.scss'],
})


class visit {
  visits: visitor[];
  constructor() { }
}

class visitor {
  ID = 0;
  PERSON_NAME = '';
  CREDENTIALS_NO = '';
  CREDENTIALS = '';
}

export class AddVisitorsComponent implements OnInit {

  translateTexts: any;
  visitForm: FormGroup;
  title: string;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private plugin: PluginService,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }



  async ngOnInit() {
    this.subscribeTranslateText();
    this.init();
    let data = this.navParams.get('data');
    this.title = this.navParams.get('title');  // 標題
    if (data) {
      let visitsArr = this.visitForm.controls['visits'] as FormArray;
      for (let i = 0; i <= data.length - 1; i++) {
        if (i !== 0) {
          this.addGoodGroup();
        }
        let visitsGou = visitsArr.controls[i] as FormGroup;
        let dataID = data[i].ID ? data[i].ID : '';
        visitsGou.controls['ID'].setValue(dataID);
        visitsGou.controls['PERSON_NAME'].setValue(data[i].PERSON_NAME);
        visitsGou.controls['CREDENTIALS_NO'].setValue(data[i].CREDENTIALS_NO);
        visitsGou.controls['CREDENTIALS'].setValue(data[i].CREDENTIALS);
      }
    }
  }


  subscribeTranslateText() {
    this.translate
      .get([
        'visit.add.delVisitorTitle',
        'visit.add.delVisitorMessage',
        'visit.add.No',
        'visit.add.card_error',
        'visit.add.pnameEntry_error',
        'messagecomponent.confirm',
        'messagecomponent.cancel',
        'taxModule.submit_success'
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }


  init() {
    this.visitForm = this.initForm(new visit());
  }


  /**
   * 初始化基础FormGroup
   *
   * @param {*} 需要绑定的数据
   * @returns {FormGroup}
   */
  initForm(work: any = {}): FormGroup {
    return this.fb.group({
      visits: this.fb.array([
        this.initSubForm(work.visits ? work.visits : new visitor()),
      ]),
    });
  }


  initSubForm(work: any) {
    let sub: any;
    sub = this.fb.group(
      {
        ID: [work.ID],
        PERSON_NAME: [work.PERSON_NAME, Validators.required],
        CREDENTIALS_NO: [work.CREDENTIALS_NO, this.validateCardID.bind(this)],
        CREDENTIALS: ['身份證'],
      },
    );
    return sub;
  }


  validateCardID(c: FormControl): { [key: string]: any } {
    if (!c.value) {
      return null;
    }
    let res: any =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(c.value) ||
      /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(c.value);
    if (res) {
      return null;
    } else {
      return {
        cardIdError: this.translateTexts['visit.add.card_error'],
        cid: true
      }
    }
  }


  //添加多一組
  addGoodGroup() {
    let noerror = true;
    for (let i = 0; i < this.visitgroups.controls.length; i++) {
      let fg = this.visitgroups.controls[i] as FormGroup;
      if (fg.controls['PERSON_NAME'].status == "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.pnameEntry_error']);
      } else if (i == this.visitgroups.controls.length - 1) {
        noerror = false;
      }
    }
    if (!noerror) {
      this.visitgroups.push(this.initSubForm(new visitor()));
      return;
    }
  }


  // 刪除一組
  async removeGoodGroup(index: any) {
    const vid = this.visitgroups.at(index).value.ID;
    if (vid > 0) {
      const alert = await this.alertCtrl.create({
        header: this.translateTexts['visit.add.delVisitorTitle'],
        message: this.translateTexts['visit.add.delVisitorMessage'],
        buttons: [
          {
            text: this.translateTexts['messagecomponent.cancel'],
            handler: () => { },
          },
          {
            text: this.translateTexts['messagecomponent.confirm'],
            handler: () => {
              this.visitorService.delVisitor(vid);
              this.visitgroups.removeAt(index);
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.visitgroups.removeAt(index);
    }

  }

  get visitgroups(): FormArray {
    return this.visitForm.get('visits') as FormArray;
  }

  submitForm(): void {
    let senddata = {
      data: '',
      status: '1',
      namedata: '',
    };
    senddata.data = this.visitForm.value.visits;
    let data = [];
    for (var i = 0; i < this.visitForm.value.visits.length; i++) {
      data.push(this.visitForm.value.visits[i].PERSON_NAME)
    }
    let namedata = data.join(',');
    senddata.namedata = namedata;
    this.events.publish('service:fillinVisitors', senddata);
    // this.viewCtrl.dismiss();
  }

  goBack() {
    // this.viewCtrl.dismiss();
  }

}



