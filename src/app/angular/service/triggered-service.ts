import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { TriggeredSkill } from './../Data/triggered_skill';
import { TriggeredRecipe } from './../Data/triggered_recipe';
import { environment } from './../../../environments/environment';

@Injectable()
export class TriggeredService {

    private headers = new Headers({'Content-type' : 'application/json'});

    private triggeredBaseUrl = environment.cloudUrl + '/triggered';

    constructor(private http: Http) { }

    getTriggeredSkillsList(skillId : string): Promise<TriggeredSkill[]> {
        const url = this.triggeredBaseUrl + "/skills/" + skillId;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as TriggeredSkill[])
            ;
    }

    getTriggeredRecipesList(recipeId : string): Promise<TriggeredRecipe[]> {
        const url = this.triggeredBaseUrl + "/recipes/" + recipeId;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as TriggeredRecipe[])
            ;
    }

    insertNewTriggeredSkill(triggeredSkill: TriggeredSkill): Promise<TriggeredSkill> {
        const url = this.triggeredBaseUrl + "/skills";
        return this.http
            .post(url, JSON.stringify(triggeredSkill), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as TriggeredSkill)
            ;
    }

    insertNewTriggeredRecipe(triggeredRecipe: TriggeredRecipe): Promise<TriggeredRecipe> {
        const url = this.triggeredBaseUrl + "/recipes";
        return this.http
            .post(url, JSON.stringify(triggeredRecipe), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as TriggeredRecipe)
            ;
    }

}
