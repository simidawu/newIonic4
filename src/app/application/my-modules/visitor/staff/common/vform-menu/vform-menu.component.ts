import { OnInit, Component } from '@angular/core';
import { NavController, NavParams, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sg-vform-menu',
  templateUrl: 'vform-menu.component.html',
})
export class VFormMenuComponent implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
  ) { }

  lastNavCtr: any;
  that: any;
  type: string;
  data: any = {
    No: this.navParams.get('data')
  };

  ionViewDidLoad() {
    this.that = this.navParams.data.this;
    this.lastNavCtr = this.that.navCtrl;
  }

  ngOnInit() {
    this.type = this.navParams.get('type');
  }

  toSignList() {
    // this.viewCtrl.dismiss();
    // this.lastNavCtr.push('SignListComponent', {
    //   formData: this.data,
    // });
  }

  toReleaseList() {
    // this.viewCtrl.dismiss();
    // this.lastNavCtr.push('HistorylistComponent', {
    //   formData: this.data,
    // });
  }

}
