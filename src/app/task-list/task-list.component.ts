import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'scill-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  @Input() battlePassId: string;
  @Input() apiKey: string;
  @Input() appId: string;
  @Input() userId: string;

  constructor() { }

  ngOnInit(): void {
  }

}
