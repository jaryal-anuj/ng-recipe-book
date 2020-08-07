import { Ingredient } from '../shared/ingredient.modal';
import { Subject } from 'rxjs';

export class ShoppingListService{
    ingrdientsChanged = new Subject<Ingredient[]>();
    private ingredients:Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients(){
        return this.ingredients.slice();
    }

    addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingrdientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients:Ingredient[]){
        // for(let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }
        this.ingredients.push(...ingredients);
        this.ingrdientsChanged.next(this.ingredients.slice());
    }
}