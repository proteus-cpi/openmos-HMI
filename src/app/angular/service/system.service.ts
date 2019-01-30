import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';

import { SystemStage } from './../Data/system-stage';

@Injectable()
export class SystemService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    private baseUrl = environment.apiUrl + `/systemstage`;
    private checkChangeStageURL = environment.cloudUrl + `/equipmentAssessments/isrampupchangestagepossible`;

    getSystemStage(): Promise<SystemStage> {
        console.log('getSystemStage -> ' + this.baseUrl);
        return this.http
            .get(this.baseUrl)
            .toPromise()
            .then(response => response.json() as SystemStage)
            ;
    }
    // .catch(this.handleError)

    checkCanChangeStage(): Promise<boolean> {
        // AUTOMATICA2018 
        /*
        console.log('checkCanChangeStage -> ' + this.checkChangeStageURL);
        return this.http
            .get(this.checkChangeStageURL)
            .toPromise()
            .then(response => response.json() as boolean)
            ;
        */
        return Promise.resolve(true);
    }
    // .catch(this.handleError)

    updateSystemStage(newStage: string): Promise<SystemStage> {
        console.log('updateSystemStage -> ' + this.baseUrl);
        return this.http
            .post(this.baseUrl, newStage, {headers: this.headers})
            .toPromise()
            .then(response => response.json() as SystemStage)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('CANT READ SYSTEM STAGE CHANGE: ', error);
        return Promise.reject(error.message || error);
    }
    */
}
