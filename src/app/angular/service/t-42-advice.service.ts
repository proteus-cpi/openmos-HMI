import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { T42Product } from './../Data/t-42-product';
import { T42Message } from "./../Data/t-42-message";

// import { EquipmentAssessment } from './../Data/equipment-assessment';
import { environment } from './../../../environments/environment';

@Injectable()
export class T42AdviceService {

    private headers = new Headers({'Content-type' : 'application/json'});

    private t42AdviceBaseUrl = environment.t42Url + '/postEnergyBasedAdvice';

    constructor(private http: Http) { }

    OLD_getT42Advice(products : T42Product[]): Promise<string> {
        const url = this.t42AdviceBaseUrl;
        console.log('calling ' + url + " with " + JSON.stringify(products));
        return this.http
            .post(url, products, {headers: this.headers})
            .toPromise()
            .then( response => {
                // response => response.json() as String;
                console.log(response);
                console.log(response.text());
                return response.text() as string;
            })
            ;
    }
    getT42Advice(products : T42Product[]): Promise<T42Message[]> {
        const url = this.t42AdviceBaseUrl;
        console.log('calling ' + url + " with " + JSON.stringify(products));
        return this.http
            .post(url, products, {headers: this.headers})
            .toPromise()
            .then( response => {
                // response => response.json() as String;
                console.log("t42 service response: " + JSON.stringify(response));
                // console.log(response.text());
                // return response.text() as string;
                return response.json() as T42Message[];
            })
            ;
    }
}
