import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
// import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/http';
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class AngularInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(event => {
        {
            if (event instanceof HttpResponse) {
              console.log('---> status:', event.status);
              console.log('---> filter:', req.params.get('filter'));
            }
          }
    }, err => {
        if(err instanceof HttpErrorResponse){ // here you can even check for err.status == 404 | 401 etc
            console.log("Error Caught By Interceptor");
            console.log("err: " + err);
            //Observable.throw(err); // send data to service which will inform the component of the error and in turn the user
        }
        else
            console.log("traced: " + err);
    });
  }
}