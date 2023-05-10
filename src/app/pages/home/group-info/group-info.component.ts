import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  public pieChartLabels: string[] = ['Album', 'Article', 'Audio', 'Photo', 'Topics', 'Video'];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';

  @Input() groupInfo: any;

  constructor() { }

  ngOnInit() {
    this.pieChartData = this.getDataForChart();
  }

  private getDataForChart() {
    return [
      this.groupInfo.counters.albums,
      this.groupInfo.counters.articles,
      this.groupInfo.counters.audios,
      this.groupInfo.counters.photos,
      this.groupInfo.counters.topics,
      this.groupInfo.counters.videos,
    ];
  }

}
