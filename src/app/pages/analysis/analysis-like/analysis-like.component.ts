import { Component, OnInit, Input } from '@angular/core';
import { ApiVkService } from 'src/app/shared/api-vk.service';
import { from, of } from 'rxjs';
import { concatMap, delay, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-analysis-like',
  templateUrl: './analysis-like.component.html',
  styleUrls: ['./analysis-like.component.css']
})
export class AnalysisLikeComponent implements OnInit {

  @Input() postData;
  isVisible = true;

  users = [];
  sex = {
    girls: 0,
    boys: 0,
  };
  cities = [];
  ages = [];

  groupAgesByCount = [];
  groupCitiesByCount = [];

  sexPieChartData = [];
  sexPieChartLabels = ['Мужчины', 'Женщины'];

  cityPieChartLabels: string[] = [];
  cityPieChartData: number[] = [];

  agePieChartLabels: string[] = [];
  agePieChartData: number[] = [];

  isAnalysisSex = false;
  isAnalysisCity = false;
  isAnalysisAge = false;

  constructor(private apiVk: ApiVkService) { }

  ngOnInit() {

  }

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

  likesGetList() {
    this.users = [];
    this.apiVk.likesGetList(
      this.postData.post_type,
      this.postData.owner_id,
      this.postData.id
    ).pipe(
      mergeMap((res: any) => {
        if (res.response && res.response.items && res.response.items.length) {
          return this.getUser(res.response.items);
        }
        return of(null);
      }),
    ).subscribe((user: any) => {
      this.users.push(user);
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
    }
    return of([]);
  }

  analysisSex() {
    const girls = this.users.filter(e => e.sex === 1);
    const boys = this.users.filter(e => e.sex === 2);
    this.sex.girls = girls.length;
    this.sex.boys = boys.length;

    this.sexPieChartData = [boys.length, girls.length];
    this.isAnalysisSex = true;
  }

  analysisCity() {
    this.cities = [];
    this.users.forEach((user: any) => {
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
    const bdateHave = this.users.filter(user => user.bdate);
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

  private sortByCount(a: any, b: any) {
    return b.count - a.count;
  }

}
