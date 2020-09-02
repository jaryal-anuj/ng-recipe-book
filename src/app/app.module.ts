import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {  ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { RecipeEffects } from './recipes/store/recipe.effects';


@NgModule({
    declarations: [
    AppComponent,
    HeaderComponent,

    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        StoreModule.forRoot(fromApp.appReducer),
        StoreDevtoolsModule.instrument({
          logOnly: environment.production, 
        }),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot([AuthEffects,RecipeEffects]),
        SharedModule,
        CoreModule

    ],
  bootstrap: [AppComponent],

})
export class AppModule { }
