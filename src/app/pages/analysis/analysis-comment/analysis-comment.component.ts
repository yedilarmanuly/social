import {Component, Input, OnInit} from '@angular/core';
import {concatMap, delay, map, mergeMap} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {ApiVkService} from '../../../shared/api-vk.service';

@Component({
  selector: 'app-analysis-comment',
  templateUrl: './analysis-comment.component.html',
  styleUrls: ['./analysis-comment.component.css']
})
export class AnalysisCommentComponent implements OnInit {

  @Input() postData;
  isVisible = true;

  isAnalysisComment = false;
  analysisCommentData = {
    ids: [],
    commentators: [],
    girls: 0,
    boys: 0,
  };

  isAnalysisCity = false;
  cities = [];

  isAnalysisAge = false;
  ages = [];

  groupAgesByCount = [];
  groupCitiesByCount = [];

  public sexPieChartLabels: string[] = ['Мужчины', 'Женщины'];
  public sexPieChartData: number[] = [];

  public cityPieChartLabels: string[] = [];
  public cityPieChartData: number[] = [];

  public agePieChartLabels: string[] = [];
  public agePieChartData: number[] = [];

  constructor(private apiVk: ApiVkService) {}

  ngOnInit() {}

  analysisCommentators() {

    const girls = this.analysisCommentData.commentators.filter(e => e.sex === 1);
    const boys = this.analysisCommentData.commentators.filter(e => e.sex === 2);
    this.analysisCommentData.girls = girls.length;
    this.analysisCommentData.boys = boys.length;

    this.sexPieChartData = [boys.length, girls.length];
    this.isAnalysisComment = true;
    console.log('users: ', this.analysisCommentData.commentators);
  }

  analysisCity() {
    this.cities = [];
    this.analysisCommentData.commentators.forEach((user: any) => {
      if (user.city) {
        const findIndex = this.cities.findIndex(e => e.title === user.city.title);
        if (findIndex > -1) {
          this.cities[findIndex].count++;
        } else {
          this.cities.push({
            title: user.city.title,
            count: 1,
          });
        }
      }
    });
    this.cities.forEach(city => {
      this.cityPieChartLabels.push(city.title);
      this.cityPieChartData.push(city.count);
    });
    this.isAnalysisCity = true;
    this.cities.sort(this.sortByCount);
    // группировка по количеству
    this.groupCitiesByCount = this.groupCities();
  }

  analysisAge() {
    this.ages = [];
    const bdateHave = this.analysisCommentData.commentators.filter(user => user.bdate);
    bdateHave.forEach(user => {
      const bdateArr = user.bdate.split('.');
      if (bdateArr.length === 3) {
        const ageUser = 2020 - (+bdateArr[2]);
        const findIndex = this.ages.findIndex(data => data.age === ageUser);
        if (findIndex > -1) {
          this.ages[findIndex].count++;
        } else {
          this.ages.push({
            age: ageUser,
            count: 1,
          });
        }
      }
    });
    this.ages.forEach(age => {
      this.agePieChartLabels.push(age.age);
      this.agePieChartData.push(age.count);
    });
    this.isAnalysisAge = true;
    this.ages.sort(this.sortByCount);
    // группировка по количеству
    this.groupAgesByCount = this.groupAges();
  }

  getCommentators() {
    this.analysisCommentData.ids = [];
    this.analysisCommentData.commentators = [];

    this.apiVk.wallGetComments(
      this.postData.owner_id,
      this.postData.id,
      this.postData.comments.count
    ).pipe(
      map((e: any) => e.response.items),
      map((items: any) => {
        const ids = [];
        items.forEach(item => {
          ids.push(item.from_id);
          if (item.thread.items.length) {
            item.thread.items.forEach(e => ids.push(e.from_id));
          }
        });
        this.analysisCommentData.ids = this.unique(ids);
        return this.analysisCommentData.ids;
      }),
      mergeMap((userIds: any) => this.getUser(userIds)),
    ).subscribe((res: any) => {
      this.analysisCommentData.commentators.push(res);
    });
  }

  private getUser(userIds: number[]) {
    if (userIds.length) {
      return from(userIds).pipe(
        concatMap(userId => {
          return this.apiVk.usersGet(userId, 'sex,city,bdate').pipe(
            delay(300),
          );
        }),
        map((res: any) => (res && res.response && res.response.length) ? res.response[0] : of(null))
      );
    } else {
      return of([]);
    }
  }

  private unique(arr): any[] {
    const result = [];
    for (const str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }
    return result;
  }

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

  private sortByCount(a: any, b: any) {
    return b.count - a.count;
  }

  private groupAges() {
    let groupped = [];
    let ages = JSON.parse(JSON.stringify(this.ages));
    ages.forEach(element => {
      if (ages.length) {
        const filter = ages.filter(e => e.count === element.count);
        groupped.push({
          count: element.count,
          data: filter,
        });
        ages = ages.filter(a => a.count !== element.count);
      }
    });
    groupped = groupped.filter(a => a.data.length);
    return groupped;
  }

  private groupCities() {
    let groupped = [];
    let cities = JSON.parse(JSON.stringify(this.cities));
    cities.forEach(element => {
      if (cities.length) {
        const filter = cities.filter(e => e.count === element.count);
        groupped.push({
          count: element.count,
          data: filter,
        });
        cities = cities.filter(a => a.count !== element.count);
      }
    });
    groupped = groupped.filter(a => a.data.length);
    return groupped;
  }

}
