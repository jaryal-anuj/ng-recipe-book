import {Actions, ofType, Effect} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.modal';
import { AuthService } from '../auth.service';

export interface AuthResponseData{
	kind:string,
	idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
	localId: string,
	registered?:boolean  
}

const handelAuthentication = (expiresIn:number, email:string, userId:string, token:string)=>{
    const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData',JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email:email,
        userId:userId,
        token:token,
        expirationDate:expirationDate,
        redirect:true
    });
};

const handleError = (errorRes:any) =>{
    let errorMessage = "An unknown error occured";
    if(!errorRes.error || !errorRes.error.error){
        return of(new AuthActions.AuthenticateFail(errorMessage));
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
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
                        tap((resData)=>{
                            this.authService.setLogoutTimer(+resData.expiresIn*1000);
                        }),
                        map(resData=>{
                           return handelAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken); 
                        }),
                        catchError(errorRes=>{
                            return handleError(errorRes);
                        })
                    )
        })
   );

   @Effect({dispatch:false})
   authRedirect = this.actions$.pipe(
       ofType(AuthActions.AUTHENTICATE_SUCCESS),
       tap((authSuccessAction:AuthActions.AuthenticateSuccess)=>{
           if(authSuccessAction.payload.redirect) {
               this.router.navigate(['/']);
           }
       })
   )


   @Effect()
   authSignup = this.actions$.pipe(
       ofType(AuthActions.SIGNUP_START),
       switchMap((signupAction:AuthActions.SignupStart)=>{
        return this.http
        .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5CucKK8-6afinj00w6FhVRdfdSei8rxw',
                {
                email:signupAction.payload.email,
                password:signupAction.payload.password,
                returnSecureToken	:true
              }
          )
          .pipe(
            tap((resData)=>{
                this.authService.setLogoutTimer(+resData.expiresIn*1000);
            }),
            map(resData=>{
               return handelAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken); 
            }),
            catchError(errorRes=>{
                return handleError(errorRes);
            })
        )
       })
   );

   @Effect({dispatch:false})
   authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(()=>{
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
   );


   @Effect()
   autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(()=>{
            const userData:{email:string,id:string,_token:string, _tokenExpirationDate:string} = JSON.parse(localStorage.getItem('userData'));
            if(!userData){
                return {type:'DUMMY'};
            }
        
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        
            if(loadedUser.token){
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);

                return new AuthActions.AuthenticateSuccess({
                    email:loadedUser.email, 
                    userId:loadedUser.id,
                    token:loadedUser.token,
                    expirationDate:new Date(userData._tokenExpirationDate),
                    redirect:false
                });
            }
            return {type:'DUMMY'};
        })
   );

    constructor(private actions$:Actions, private http:HttpClient, private router:Router,private authService:AuthService){}
}