import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'sg-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {}

  toCheckList(type: string) {
    // this.navCtrl.push('MainlistComponent', { type: type });
  }

}
