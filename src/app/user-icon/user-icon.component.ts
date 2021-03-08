import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'scill-user-icon',
  templateUrl: './user-icon.component.svg',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent implements OnInit {

  @Input() width = 24;
  @Input() height = 24;

  constructor() { }

  ngOnInit(): void {
  }

}
