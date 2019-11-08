import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sg-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  toCheckList(type: string) {
    this.router.navigate(['/tabs/application/visitor/mainlist'], {
      queryParams: {
        type: type
      }
    });
  }

}
