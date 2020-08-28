import {Actions, ofType, Effect} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData{
	kind:string,
	idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
	localId: string,
	registered?:boolean  
}

@Injectable()
export class AuthEffects{

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData:AuthActions.LoginStart)=>{
            return this.http
                    .post<AuthResponseData>(
                        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5CucKK8-6afinj00w6FhVRdfdSei8rxw',
                            {
                            email:authData.payload.email,
                            password:authData.payload.password,
                            returnSecureToken	:true
                        }
                    )
                    .pipe(
                        map(resData=>{
                            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
                            return new AuthActions.Login({
                                email:resData.email,
                                userId:resData.localId,
                                token:resData.idToken,
                                expirationDate:expirationDate
                            });
                        }),
                        catchError(errorRes=>{
                            let errorMessage = "An unknown error occured";
                            if(!errorRes.error || !errorRes.error.error){
                                return of(new AuthActions.LoginFail(errorMessage));
                            }
                            switch(errorRes.error.error.message){
                                case 'EMAIL_EXISTS':
                                    errorMessage = 'This email already in use!';
                                    break;
                                case 'EMAIL_NOT_FOUND':
                                    errorMessage = ' There is no user record corresponding to this identifier';
                                    break;
                                case 'INVALID_PASSWORD':
                                    errorMessage = 'The password is invalid or the user does not have a password';
                                    break;
                            }
                            return of(new AuthActions.LoginFail(errorMessage));
                        })
                    )
        })
   );

   @Effect({dispatch:false})
   authSuccess = this.actions$.pipe(
       ofType(AuthActions.LOGIN),
       tap(()=>{
           this.router.navigate(['/']);
       })
   )

    constructor(private actions$:Actions, private http:HttpClient, private router:Router){}
}