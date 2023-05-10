import { Component, OnInit } from '@angular/core';
import {ApiVkService} from '../../shared/api-vk.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public postData: any = null;
  public domain = '';
  public count = 10;
  public groupInfo: any = null;
  public error = null;

  constructor(private apiVk: ApiVkService) { }

  ngOnInit() {}

  getGroup(domain: string) {
    this.error = '';
    this.domain = domain;
    const fields = 'description,counters,contacts,wall,verified,status';
    this.apiVk.groupsGetById(this.domain, fields).subscribe((group: any) => {
      if (group && group.error) {
        this.error = group.error.error_msg;
      } else if (group && group.response) {
        this.groupInfo = group.response[0];
      } else {
        this.error = 'Нет данных';
      }
    });
  }

  getPosts() {
    this.apiVk.wallGet(this.domain, this.count)
      .subscribe(res => this.postData = res);
  }

  reset() {
    this.groupInfo = '';
    this.postData = null;
  }
}
