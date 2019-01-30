import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { OrderInstance } from '../Data/order-instance';
import { environment } from '../../../environments/environment';

@Injectable()
export class OrderInstanceService {
    private headers = new Headers({'Content-Type': 'application/json'});

    /* http://host:porta/api/v1/recipes */
    // private baseURL = `http://192.168.15.1:9995/api/v1/recipes`;
    private baseURL = environment.cloudUrl + `/orderinstances`;

    constructor(private http: Http) { }

    getList(): Promise<OrderInstance[]> {
        const url = `${this.baseURL}`;
        console.log('getList url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as OrderInstance[])
            ;
    }
    // .catch(this.handleError)

    getDetail(orderInstanceId: string): Promise<OrderInstance> {
        const url = `${this.baseURL}/${orderInstanceId}`;
        console.log('getDetail url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as OrderInstance)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        // console.error('ERRORE LETTURA RECIPES ', error);
        return Promise.reject(error.message || error);
    }
    */
}
