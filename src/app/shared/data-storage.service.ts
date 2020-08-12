import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.modal';
import { map, tap, take, exhaustMap} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable({
    providedIn:'root'
})
export class DataStorageService{

    

    constructor(
        private http:HttpClient, 
        private recipeService:RecipeService,
        private authService:AuthService){

    }

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://ng-course-recipe-book-ae979.firebaseio.com/recipes.json',recipes).subscribe(response=>{
            console.log(response)
        });
    }

    fetchRecipes(){
      
            return  this.http.get<Recipe[]>('https://ng-course-recipe-book-ae979.firebaseio.com/recipes.json')
                .pipe(
                map(recipes=>{
                    return recipes.map(recipe=>{
                        return {...recipe, ingredients:recipe.ingredients?recipe.ingredients:[]};
                    })
                }),
                tap(recipes=>{
                    console.log(recipes)
                    this.recipeService.setRecipes(recipes);
                })
            );


    }
}