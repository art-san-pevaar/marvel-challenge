import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from 'src/services/characters.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  providers: [CharactersService],
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent {
  constructor(private route: ActivatedRoute, private characterService: CharactersService) { }

  character: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getCharacter(id);
    });
  }

  getCharacter(id: number): void {
    this.characterService.getCharacter(id)
      .subscribe(response => {
        this.character = response.data.results[0];
        if (this.character.description == "") {
          this.character.description = "There isn't a description available for this character.";
        }

        this.character.thumbnail.path += "." + this.character.thumbnail.extension;
      });
  }
}
