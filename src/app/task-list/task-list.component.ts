import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'scill-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  @Input() battlePassId: string;
  @Input('access-token') accessToken: string;
  @Input() appId: string;
  @Input() userId: string;
  @Input('api-key') apiKey: string;

  constructor() { }

  ngOnInit(): void {
  }

}
