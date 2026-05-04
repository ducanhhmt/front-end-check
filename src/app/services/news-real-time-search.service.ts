import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsRealTimeSearchService {

  constructor() { }
  private newsSubject = new BehaviorSubject<any[]>([]);
  news$ = this.newsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setNews(data: any[]) {
    this.newsSubject.next(data);
  }

  setLoading(state: boolean) {
    this.loadingSubject.next(state);
  }
}