import { Component, OnInit, Input } from '@angular/core';
import { ApiVkService } from 'src/app/shared/api-vk.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-analysis-text',
  templateUrl: './analysis-text.component.html',
  styleUrls: ['./analysis-text.component.css']
})
export class AnalysisTextComponent implements OnInit {

  @Input() postData;
  isVisible = true;

  wordStat = [];
  wordLength = 0;

  isAnalysisPostText = false;

  groupWordsByCount = [];

  badWords = [];
  goodWords = [];


  constructor(private apiVk: ApiVkService) { }

  ngOnInit() { }

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

  analysisPostText() {
    this.isAnalysisPostText = true;
    this.wordStat = [];
    const words = this.postData.text.replace (/\r\n?|\n/g, ' ').replace (/ {2,}/g, ' ').replace (/^ /, '').replace (/ $/, '').split(" ");
    this.__analyzText(words);
  }

  analysisTextComments() {
    this.apiVk.wallGetComments(
      this.postData.owner_id,
      this.postData.id,
      this.postData.comments.count
    )
    .pipe(
      map((response: any) => response && response.response && response.response.items ? response.response.items : []),
    )
    .subscribe((items: any) => {
      if (items && items.length) {
        const words = items.map(item => item.text).join(' ')
        .replace (/\r\n?|\n/g, ' ').replace (/ {2,}/g, ' ').replace (/^ /, '').replace (/ $/, '').split(' ');
        this.__analyzText(words);
        this.analysisTextCommentsNegative(items.map(item => item.text));
        this.isAnalysisPostText = true;
      }
    });
  }

  private async analysisTextCommentsNegative(data: string[]) {
    const text = data.join(' ')
      .replace (/\r\n?|\n/g, ' ')
      .replace (/ {2,}/g, ' ')
      .replace (/^ /, '')
      .replace (/ $/, '')
      .replace (/,/g, '')
      .replace (/\./g, '')
      .split(' ');
    const badWordsD = await this.apiVk.getBadWords().toPromise();
    const goodWordsD = await this.apiVk.getGoodWords().toPromise();

    text.forEach(item => {
      const word = item.toLowerCase();
      if (badWordsD.includes(word)) {
        this.badWords.push(word);
      } else if (goodWordsD.includes(word)) {
        this.goodWords.push(word);
      }
    });
    console.log(this.badWords);
    console.log(this.goodWords);
  }

  private __analyzText(words: string[]) {
    this.wordStat = [];
    this.wordLength = words.length;
    words.forEach(word => {
      if (word.length > 3) {
        const i = this.wordStat.findIndex(e => e.title === word);
        if (i > -1) {
          this.wordStat[i].count++;
        } else {
          this.wordStat.push({
            title: word,
            count: 1,
          });
        }
      }
    });
    this.wordStat.sort((a: any, b: any) => {
      return b.count - a.count;
    });
    // группировка по количеству
    this.groupWords();
  }

  private groupWords() {
    this.groupWordsByCount = [];
    let items = JSON.parse(JSON.stringify(this.wordStat));
    items.forEach(element => {
      if (items.length) {
        const filter = items.filter(e => e.count === element.count);
        this.groupWordsByCount.push({
          count: element.count,
          data: filter,
        });
        items = items.filter(a => a.count !== element.count);
      }
    });
    this.groupWordsByCount = this.groupWordsByCount.filter(a => a.data.length);
  }

}
