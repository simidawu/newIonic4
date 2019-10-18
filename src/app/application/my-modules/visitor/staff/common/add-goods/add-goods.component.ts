import { NavParams, Events, AlertController, LoadingController, } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, } from '@angular/forms';
import { VisitorService } from '../../../shared/service/visitor.service';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'sg-add-goods',
  templateUrl: 'add-goods.component.html',
  styleUrls: ['./add-goods.component.scss'],
})

class good {
  goods: goodList[];
  constructor() { }
}

class goodList {
  ID = 0;
  GOODS_NAME = '';
  GOODS_BRAND = '';
  GOODS_MODEL = '';
  GOODS_UNIT = '';
  GOODS_QUANTITY = 1;
}

export class AddGoodsComponent implements OnInit {

  translateTexts: any;
  goodForm: FormGroup;
  formPage = '';
  formData = [];
  type = '';
  title = '';
  errTip = '';

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    private events: Events,
    private plugin: PluginService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }



  async ngOnInit() {
    this.subscribeTranslateText();
    this.init();
    this.formPage = this.navParams.get('formPage'); // 进入页面，值有 vip|ctm|emp|visit|build|setting
    this.formData = this.navParams.get('data');  // 初始数据
    this.title = this.navParams.get('title');  // 標題
    this.type = this.navParams.get('type'); // 施工物品类别
    if (this.formPage === 'setting') {
      // 系统设定点击进来的
      if (this.type) {
        const gooddata = await this.visitorService.getGoodsList(this.type);
        this.formData = gooddata.json();
      }
    } else if (this.formPage === 'build') {
      // 施工类单据申请进来的
      if (this.type) {
        // 选了施工物品分类
        if (!this.formData) {
          // 有初始数据，用初始数据，没有才从api加载
          const gooddata = await this.visitorService.getGoodsList(this.type);
          this.formData = gooddata.json();
        }
      }
    }

    if (this.formData) {
      const goodArr = this.goodForm.get('goods') as FormArray;
      for (let i = 0; i <= this.formData.length - 1; i++) {
        if (i !== 0) {
          this.addGoodGroup();
        }
        const goodGou = goodArr.controls[i] as FormGroup;
        const dataID = this.formData[i].ID ? this.formData[i].ID : '';
        goodGou.get('ID').setValue(dataID);
        goodGou.get('GOODS_NAME').setValue(this.formData[i].GOODS_NAME);
        goodGou.get('GOODS_BRAND').setValue(this.formData[i].GOODS_BRAND);
        goodGou.get('GOODS_MODEL').setValue(this.formData[i].GOODS_MODEL);
        goodGou.get('GOODS_UNIT').setValue(this.formData[i].GOODS_UNIT);
        goodGou.get('GOODS_QUANTITY').setValue(this.formData[i].GOODS_QUANTITY);
      }
    }
  }


  subscribeTranslateText() {
    this.translate
      .get([
        'visit.add.delGoodTitle',
        'visit.add.delGoodMessage',
        'visit.add.No',
        'visit.add.gnameEntry_error',
        'visit.add.unitEntry_error',
        'messagecomponent.confirm',
        'messagecomponent.cancel',
        'taxModule.submit_success'
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }


  init() {
    this.goodForm = this.initForm(new good());
  }


  /**
   * 初始化基础FormGroup
   *
   * @param {*} 需要绑定的数据
   * @returns {FormGroup}
   */
  initForm(work: any = {}): FormGroup {
    return this.fb.group({
      goods: this.fb.array([
        this.initSubForm(work.goods ? work.goods : new goodList()),
      ]),
    });
  }


  initSubForm(work: any) {
    let sub: any;
    sub = this.fb.group(
      {
        ID: [work.ID],
        GOODS_NAME: [work.GOODS_NAME, Validators.required],
        GOODS_BRAND: [work.GOODS_BRAND],
        GOODS_MODEL: [work.GOODS_MODEL],
        GOODS_UNIT: [work.GOODS_UNIT, Validators.required],
        GOODS_QUANTITY: [work.GOODS_QUANTITY, Validators.required],
      },
    );
    return sub;
  }


  // 添加多一組
  addGoodGroup(index?: any) {
    let noerror = true;
    for (let i = 0; i < this.goodgroups.controls.length; i++) {
      const fg = this.goodgroups.controls[i] as FormGroup;
      if (fg.controls['GOODS_NAME'].status === "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.gnameEntry_error']);
        return;
      } else if (fg.controls['GOODS_UNIT'].status === "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.unitEntry_error']);
        return;
      } else if (i === this.goodgroups.controls.length - 1) {
        noerror = false;
      }
    }
    if (!noerror) {
      if (index !== undefined) {
        let g = this.goodgroups.at(index).value;
        this.goodgroups.push(this.initSubForm(g));
      } else {
        this.goodgroups.push(this.initSubForm(new goodList()));
      }
    }
  }


  // 刪除一組
  async removeGoodGroup(index: any) {
    const gid = this.goodgroups.at(index).value.ID;
    if (gid > 0) {
      const alert = await this.alertCtrl.create({
        header: this.translateTexts['visit.add.delGoodTitle'],
        message: this.translateTexts['visit.add.delGoodMessage'],
        buttons: [
          {
            text: this.translateTexts['messagecomponent.cancel'],
            handler: () => { },
          },
          {
            text: this.translateTexts['messagecomponent.confirm'],
            handler: () => {
              this.visitorService.delGood(gid);
              this.goodgroups.removeAt(index);
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.goodgroups.removeAt(index);
    }
  }


  get goodgroups(): FormArray {
    return this.goodForm.get('goods') as FormArray;
  }


  submitForm() {
    if (this.formPage !== 'setting') {

      // senddatas.data = this.goodForm.value.goods;
      let data = [];
      for (var i = 0; i < this.goodForm.value.goods.length; i++) {
        this.goodForm.value.goods[i].GOODS_BRAND = this.goodForm.value.goods[i].GOODS_BRAND == null ? '' : this.goodForm.value.goods[i].GOODS_BRAND;
        this.goodForm.value.goods[i].GOODS_MODEL = this.goodForm.value.goods[i].GOODS_MODEL == null ? '' : this.goodForm.value.goods[i].GOODS_MODEL;
        const names = this.goodForm.value.goods[i].GOODS_BRAND +
          this.goodForm.value.goods[i].GOODS_MODEL +
          this.goodForm.value.goods[i].GOODS_NAME +
          this.goodForm.value.goods[i].GOODS_QUANTITY +
          this.goodForm.value.goods[i].GOODS_UNIT;
        data.push(names);
      }
      const namedata = data.join(',');
      // senddatas.namedata = namedata;
      const senddatas = {
        data: this.goodForm.value.goods,
        namedata: namedata,
      };
      this.events.publish('service:fillinGoods', senddatas);
      // this.viewCtrl.dismiss();
    } else {
      let formdata = [];
      for (var i = 0; i < this.goodForm.value.goods.length; i++) {
        formdata.push({
          ID: this.goodForm.value.goods[i]['ID'],
          GOODS_BRAND: this.goodForm.value.goods[i]['GOODS_BRAND'],
          GOODS_MODEL: this.goodForm.value.goods[i]['GOODS_MODEL'],
          GOODS_NAME: this.goodForm.value.goods[i]['GOODS_NAME'],
          GOODS_QUANTITY: this.goodForm.value.goods[i]['GOODS_QUANTITY'],
          GOODS_UNIT: this.goodForm.value.goods[i]['GOODS_UNIT'],
          TYPE: this.type,
        })
      }
      this.postFormData(formdata);
    }
  }


  async postFormData(data: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();
    try {
      await this.visitorService.postGoodsList(data);
      loading.dismiss();
      this.plugin.showToast(this.translateTexts['taxModule.submit_success']);
      // this.viewCtrl.dismiss();
    } catch (err) {
      loading.dismiss();
      console.log(err);
      this.errTip = err;
    }
  }


  goBack() {
    // this.viewCtrl.dismiss({ selected: false });
  }
}



