import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ComicService {
  constructor(private http: HttpClient) { }

  apiKey: string = "5804d3bf538b01ed307615f4f7939920";

  getComic(url: string): Observable<any> {
    return this.http.get<any>(url + "?apikey=" + this.apiKey);
  }

  getComicById(id: number): Observable<any> {
    const url: string = "https://gateway.marvel.com:443/v1/public/comics/";
    return this.http.get<any>(url + id + "?apikey=" + this.apiKey);
  }
}
