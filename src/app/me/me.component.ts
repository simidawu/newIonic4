import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { MyStore } from '../shared/store';
import { UserState } from '../shared/models/user.model';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit, OnDestroy {

  user: UserState;
  mySubscription: Subscription;
  constructor(
    public router: Router,
    private store$: Store<MyStore>,
  ) { }

  ngOnInit() {
    this.mySubscription = this.store$
      .select('userReducer')
      .subscribe((user: UserState) => (this.user = user));
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
  }

  toDetail() {
    this.router.navigate(['/tabs/me/detail']);
  }

}
