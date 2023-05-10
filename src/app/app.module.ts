import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AuthorComponent } from './pages/author/author.component';
import { AboutComponent } from './pages/about/about.component';
import { NewsComponent } from './pages/news/news.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { MomentPipe } from './shared/pipes/moment.pipe';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { ApiVkService } from './shared/api-vk.service';
import { GroupInfoComponent } from './pages/home/group-info/group-info.component';
import { SearchGroupComponent } from './pages/home/search-group/search-group.component';
import { WallListComponent } from './pages/home/wall-list/wall-list.component';
import {ChartsModule} from 'ng2-charts';
import { AnalysisCommentComponent } from './pages/analysis/analysis-comment/analysis-comment.component';
import { AnalysisLikeComponent } from './pages/analysis/analysis-like/analysis-like.component';
import { AnalysisTextComponent } from './pages/analysis/analysis-text/analysis-text.component';
import {ShowWordsPipe} from './shared/pipes/show-words.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AuthorComponent,
    AboutComponent,
    NewsComponent,
    HomeComponent,
    MomentPipe,
    ShowWordsPipe,
    PostDetailComponent,
    GroupInfoComponent,
    SearchGroupComponent,
    WallListComponent,
    AnalysisCommentComponent,
    AnalysisLikeComponent,
    AnalysisTextComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: HomeComponent},
      {path: 'news', component: NewsComponent},
      {path: 'about', component: AboutComponent},
      {path: 'author', component: AuthorComponent},
      {path: 'post/:id', component: PostDetailComponent},
    ]),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbEvaIconsModule,
    FormsModule,
    ChartsModule
  ],
  providers: [
    ApiVkService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
