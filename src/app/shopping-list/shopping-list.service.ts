import { Ingredient } from '../shared/ingredient.modal';
import { EventEmitter } from '@angular/core';

export class ShoppingListService{
    ingrdientsChanged = new EventEmitter<Ingredient[]>();
    private ingredients:Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients(){
        return this.ingredients.slice();
    }

    addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingrdientsChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients:Ingredient[]){
        // for(let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }
        this.ingredients.push(...ingredients);
        this.ingrdientsChanged.emit(this.ingredients.slice());
    }
}