import { Component } from '@angular/core';
import { ComicService } from 'src/services/comic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  providers: [ComicService],
  styleUrls: ['./comics.component.css']
})
export class ComicsComponent {
  constructor(private comicService: ComicService, private route: ActivatedRoute) { }

  comic: any;
  detailAvailable: boolean = false;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getComic(id);
    });
  }

  getComic(id: number): void {
    this.comicService.getComicById(id)
      .subscribe(response => {
        this.comic = response.data.results[0];
        if (this.comic.description == "" || this.comic.description == null) {
          this.comic.description = "There isn't a description available for this comic.";
        }

        this.comic.urls.forEach((link: any) => {
          if (link.type == "detail") {
            this.comic.marvelDetail = link.url;
          }
        });

        this.comic.thumbnail.path += "." + this.comic.thumbnail.extension;
      });
  }
}
