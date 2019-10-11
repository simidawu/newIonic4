import { User_Update_module } from './../../shared/actions/user.action';
import { MyStore } from './../../shared/store';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MyModule } from './../../shared/models/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ApplicationService } from '../shared/service/application.service';

@Component({
  selector: 'sg-more-application',
  templateUrl: 'more-application.component.html',
})
export class MoreApplicationComponent implements OnInit, OnDestroy {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: ApplicationService,
    private store$: Store<MyStore>,
  ) {}
  items: MyModule[];
  showBtn = false;
  mySub: Subscription;

  moveItemToAppPage(id: number): void {
    this.updateLocalModuleList(id);
  }

  goToDetailPage(id: number) {
    // this.router.go(this.navCtrl, this.navParams, id);
  }

  ngOnInit() {
    this.mySub = this.appService
      .observeModulesN()
      .subscribe(ms => (this.items = ms));
  }

  ngOnDestroy() {
    this.mySub && this.mySub.unsubscribe();
  }

  showEditBtn(): void {
    this.showBtn = true;
  }

  hideEditBtn(): void {
    this.showBtn = false;
  }

  updateLocalModuleList(id: any) {
    let list: MyModule = this.items.find(m => m.MODULE_ID === id);
    if (list) {
      list.DISPLAY = 'Y';
      this.store$.dispatch(new User_Update_module(list));
    }
  }

}
