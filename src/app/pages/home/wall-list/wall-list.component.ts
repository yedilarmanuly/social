import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-wall-list',
  templateUrl: './wall-list.component.html',
  styleUrls: ['./wall-list.component.css']
})
export class WallListComponent implements OnInit {

  @Input() postData: any;
  @Output() selectPost = new EventEmitter();

  constructor() { }

  ngOnInit() {}

}
