import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {getAuthApi} from '@scillgame/scill-js';

@Component({
  selector: 'analytics-counter',
  template: `
    <p>
      analytics-counter works! {{hallo}}
    </p>
  `,
  styles: [
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class AnalyticsCounterComponent implements OnInit, OnChanges {

  @Input() hallo;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("HALLO", this.hallo, changes);
    const authApi = getAuthApi('x_Tc4uF9rf6ut4l2zZOoTtiersIeMUu-LX79T2Cbxi65h9aB9xia34Fi');
    authApi.generateAccessToken({user_id: '123456'}).then(result => {
      console.log(result.token);
    });
  }

}
