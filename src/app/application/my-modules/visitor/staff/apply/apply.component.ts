import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sg-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }


  toOrder(type: string) {
    // this.router.navigate(['/tabs/application/26273/apply']);
  }

}
