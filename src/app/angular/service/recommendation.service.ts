import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Recommendation } from '../Data/recommendation';
import { environment } from '../../../environments/environment';

@Injectable()
export class RecommendationService {
    private headers = new Headers({'Content-Type' : 'application/json'});

    private recommendationBaseUrl = environment.recommendationSystemUrl + `/recommendations`;

    constructor(private http: Http) { }

    getRecommendationsList(): Promise<Recommendation[]> {
        console.log('getRecommendationsList url -> ' + this.recommendationBaseUrl);
        // var recommendations : Recommendation[];
        // return Promise.resolve(recommendations);
        //
        return this.http
                .get(this.recommendationBaseUrl)
                .toPromise()
                .then(response => {
                    console.log("OK");
                    return response.json() as Recommendation[];
                })
                ;
                //
    }
    
    getRecommendationById(id: string): Promise<Recommendation> {
        const url = `${this.recommendationBaseUrl}${id}`;
        console.log('getRecommendationById url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recommendation)
            ;
    }
}
