import { Component, OnInit, Input } from '@angular/core';
import {PopoverPreviewComponent}    from '../popover-preview/popover-preview.component';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent extends PopoverPreviewComponent{}
