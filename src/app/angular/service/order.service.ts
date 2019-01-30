import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { Order } from './../Data/order';
import { environment } from '../../../environments/environment';

@Injectable()
export class OrderService {
    private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});

    private orderBaseUrl = environment.apiUrl;

    constructor(private http: Http) { }

    insertNewOrder(orderToInsert: Order): Promise<Order> {
        const url = `${this.orderBaseUrl}/orders`;
        return this.http
            .post(url, JSON.stringify(orderToInsert), {headers : this.headers})
            .toPromise()
            .then(response => response.json() as Order)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('Errore inserimento nuovo ordine');
        return Promise.reject(error.message || error);
    }
    */
}
