import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.modal';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {
  ingredients:Observable<{ingredients:Ingredient[]}> ;
 // private idChangedSub :Subscription;

  constructor(
    private store:Store<fromApp.AppState>) { }

  ngOnInit() {
    this.ingredients =this.store.select('shoppingList');

    // this.ingredients = this.slService.getIngredients();
    // this.idChangedSub = this.slService.ingrdientsChanged.subscribe((ingredients:Ingredient[])=>{
    //   this.ingredients = ingredients;
    // })
  }

  onEditItem(index:number){

    //this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy():void{
   // this.idChangedSub.unsubscribe();
  }



}
