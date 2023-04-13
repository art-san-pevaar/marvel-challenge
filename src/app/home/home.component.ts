import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CharactersService } from 'src/services/characters.service';
import { ComicService } from 'src/services/comic.service';

interface Option {
  value: string,
  viewValue: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [CharactersService,
              ComicService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('modalComic', {static: false})
  private modalComic!: TemplateRef<any>;

  optionsToSort: Option[] = [
    {value: 'name-asc', viewValue: 'Name (Asc)'},
    {value: "name-desc", viewValue: "Name (Desc)"},
    {value: "date-asc", viewValue: "Date (Asc)"},
    {value: "date-desc", viewValue: "Date (Desc)"}
  ];

  selectedSortOption: string = "";
  comicsFav: any[] = [];
  comicInUse: any;
  characters: any;
  inputSearch: string = "";
  page: number = 1;

  constructor(private characterService: CharactersService, 
              private modalService: NgbModal,
              private comicService: ComicService) { }

  ngOnInit(): void {
    this.getCharacters(this.page, this.inputSearch);
    if (sessionStorage.getItem("comicsFav") != null) {
      let arrayJson = sessionStorage.getItem("comicsFav");
      this.comicsFav = JSON.parse(arrayJson!);
    }
  }

  getCharacters(pageNumber: number, nameStarts: string): void {
    var offset = (pageNumber * 10) - 10;
    var sortFilter = "";
    switch (this.selectedSortOption) {
      case "":
      case "name-asc":
        sortFilter = "name";
        break;
      case "name-desc":
        sortFilter = "-name";
        break;
      case "date-asc":
        sortFilter = "modified";
        break;
      case "date-desc":
        sortFilter = "-modified";
        break;
    }

    this.characterService.getCharacters(offset, sortFilter, nameStarts)
      .subscribe(data => {
        this.characters = data;
        this.characters.data.results.forEach((character: any) => {
          if (character.description.trim() === "") {
            character.description = "There isn't a description available for this character";
          }

          character.description = character.description.substring(0, 100) + "...";
          character.thumbnail.path += "." + character.thumbnail.extension;
        });
      });
  }

  onPageChange(event: any): void {
    this.page = event;
    this.getCharacters(this.page, this.inputSearch);
  }

  onFilterChange(event: any): void {
    this.getCharacters(this.page, this.inputSearch);
  }

  onInputEnter(value: string): void {
    this.inputSearch = value;
    if (value != "") {
      this.page = 1;
      this.getCharacters(this.page, value);
    } else {
      this.getCharacters(this.page, this.inputSearch);
    }
  }

  showModalComic(value: string): void {
    value = value.replace("http", "https");
    this.comicService.getComic(value)
      .subscribe(response => {
        this.comicInUse = response.data.results[0];
        if (this.comicInUse.description == "" || this.comicInUse.description == null) {
          this.comicInUse.description = "There isn't a description available for this comic.";
        }
        this.comicInUse.thumbnail.path += "." + this.comicInUse.thumbnail.extension;
        this.comicInUse.inFav = this.comicsFav.some(value => {
          return value.id == this.comicInUse.id;
        });
        this.modalService.open(this.modalComic, { size: 'lg', centered: true });
      });
  }

  addFavoriteComic(): void {
    this.comicsFav.push(this.comicInUse);
    sessionStorage.setItem("comicsFav", JSON.stringify(this.comicsFav));
    this.modalService.dismissAll();
  }

  removeFavoriteComic(id: number): void {
    const indexOfComic = this.comicsFav.findIndex((comic: any) => {
      return comic.id == id;
    });

    // If the comic doesn't exists, it gets a -1 in the index
    if (indexOfComic != -1) {
      this.comicsFav.splice(indexOfComic, 1);
    }

    sessionStorage.setItem("comicsFav", JSON.stringify(this.comicsFav));
    this.modalService.dismissAll();
  }

  returnPrincipalPage(): void {
    this.page = 1;
    this.inputSearch = "";
    this.getCharacters(this.page, this.inputSearch);
  }
}
