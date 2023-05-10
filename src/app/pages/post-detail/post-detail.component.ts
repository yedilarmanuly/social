import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ApiVkService} from '../../shared/api-vk.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  postData = null;

  public chartLabels: string[] = ['Data'];
  public chartData: any[] = [];
  public chartType = 'bar';
  public chartOptions = {
    responsive: true,
  };

  constructor(
    private route: ActivatedRoute,
    private apiVk: ApiVkService,
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.apiVk.wallGetById(params.get('id'));
      }),
    ).subscribe((data: any) => {
      this.postData = data.response[0];
      this.chartData = this.getCommonDataForChart();
    });
  }

  private getCommonDataForChart() {
    return [
      {
        label: 'Views',
        data: [ this.postData.views.count ]
      },
      {
        label: 'Likes',
        data: [ this.postData.likes.count ]
      },
      {
        label: 'Comments',
        data: [ this.postData.comments.count ]
      },
      {
        label: 'Reposts',
        data: [ this.postData.reposts.count ]
      },
      {
        label: 'Attachment',
        data: [ this.postData.attachments && this.postData.attachments.count ? this.postData.attachments.count : 0 ]
      },
    ];
  }

  checkImage(postData) {
    return postData.attachments && postData.attachments[0].photo &&
      postData.attachments[0].photo.sizes &&
      postData.attachments[0].photo.sizes.length &&
      postData.attachments[0].photo.sizes[7] &&
      postData.attachments[0].photo.sizes[7].url;
  }

}
