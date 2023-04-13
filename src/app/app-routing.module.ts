import { ComicsComponent } from './comics/comics.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersComponent } from './characters/characters.component';
import { AuthGuard } from './auth-guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'character/:id', component: CharactersComponent
  },
  {
    path: 'comic/:id', component: ComicsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
