import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'sg-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() { }

  toSettingList(type: string) {
    // this.navCtrl.push('SettinglistComponent', { type: type });
  }

}
