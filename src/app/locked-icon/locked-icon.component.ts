import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'scill-locked-icon',
  templateUrl: './locked-icon.component.svg',
  styleUrls: ['./locked-icon.component.scss']
})
export class LockedIconComponent implements OnInit {

  @Input() width = '1em';
  @Input() height = '1em';

  constructor() { }

  ngOnInit(): void {
  }

}
