import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.modal';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers:[RecipeService]
})
export class RecipesComponent implements OnInit {

  selectedRecipe:Recipe;

  constructor() { }

  ngOnInit() {

  }

}
