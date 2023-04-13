import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CharactersService {
    constructor(private http: HttpClient) { }

    url: string = "https://gateway.marvel.com:443/v1/public/characters";
    apiKey: string = "5804d3bf538b01ed307615f4f7939920";

    getCharacters(offset: number, sortBy: string, nameStarts: string): Observable<any[]> {
        if (nameStarts != "") {
            return this.http.get<any[]>(this.url + "?nameStartsWith=" + nameStarts + "&orderBy=" + sortBy + "&limit=10&offset=" + offset + "&apikey=" + this.apiKey);
        } else {
            return this.http.get<any[]>(this.url + "?orderBy=" + sortBy + "&limit=10&offset=" + offset + "&apikey=" + this.apiKey);
        }
    }

    getCharacter(id: number): Observable<any> {
        return this.http.get<any>(this.url + "/" + id + "?apikey=" + this.apiKey);
    }
}