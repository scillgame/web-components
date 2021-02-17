import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  @Input('task') task: object;
  @Input('background') background: string;
  constructor() { }

  ngOnInit(): void {
      console.log('%c progress', 'color:gold;', this.task);
  }

}
