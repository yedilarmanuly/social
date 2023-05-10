import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiVkService} from '../../../shared/api-vk.service';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.component.html',
  styleUrls: ['./search-group.component.css']
})
export class SearchGroupComponent implements OnInit {

  @Input() groupInfo: any;
  @Output() searched = new EventEmitter();
  domain = '';
  tokenLink = '';
  tokenValue = '';

  constructor(private apiVk: ApiVkService) { }

  ngOnInit() {
  }

  getToken() {
    this.apiVk.getToken().subscribe(e => this.tokenLink = e);
  }

  saveToken() {
    localStorage.setItem('token', this.tokenValue);
    this.apiVk.token = this.tokenValue;
    this.tokenValue = '';
    this.tokenLink = '';
    alert('The token has been successfully saved');
  }
}
