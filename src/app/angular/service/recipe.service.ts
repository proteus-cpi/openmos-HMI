import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Recipe } from '../Data/recipe';
import { environment } from '../../../environments/environment';
import { Skill } from '../Data/skill';
import { SkillRequirement } from '../Data/skill-requirement';

@Injectable()
export class RecipesService {
    private headers = new Headers({'Content-Type': 'application/json'});

    /* http://host:porta/api/v1/recipes */
    // private baseURL = `http://192.168.15.1:9995/api/v1/recipes`;
    private baseURL = environment.apiUrl + `/recipes`;

    constructor(private http: Http) { }

    getRecipesForComponent(componentId: string): Promise<Recipe[]> {
        const url = ``;
        console.log('getRecipesForComponent url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    getRecipeDetail(recipeId: string): Promise<Recipe> {
        /* http://host:porta/api/v1/recipes/{recipeId} */
        const url = `${this.baseURL}/${recipeId}`;
        console.log('getRecipeDetail url -> ' + url);
        // console.log('getting recipe data');
        return this.http
            .get(url)
            .toPromise()
            .then(response => 
                {
                    var thisRecipe : Recipe;
                    thisRecipe = response.json();
                    console.log("thisRecipe 1: " + JSON.stringify(thisRecipe));

                    // test data begin
/*                     var testFSR : SkillRequirement[];
                    var testFSR1: SkillRequirement;
                    testFSR = new Array(1);
                    testFSR1 = new SkillRequirement();
                    testFSR1.uniqueId = "e477cac2-2076-493a-b9ac-c0c4679513bc";
                    testFSR1.name = "SR02_HandlePickHub";
                    testFSR[0] = testFSR1;
                    thisRecipe.fulfilledSkillRequirements = testFSR;
                    console.log("thisRecipe 2: " + JSON.stringify(thisRecipe));
 */                    // test data end 

                    return thisRecipe;
                    // return response.json() as Recipe
                })
            ;
    }
    // .catch(this.handleError)

    updateRecipe(recipeId: string, recipeToUpdate: Recipe): Promise<Recipe> {
        const url = `${this.baseURL}/${recipeId}`;
        // console.log(JSON.stringify(recipeToUpdate, this.replacer));
        console.log('updateRecipe url -> ' + url);
        return this.http
            .put(url, JSON.stringify(recipeToUpdate, this.replacer), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Recipe)
            ;
    }
    // .catch(this.handleError)

    /* First Test Insert New Recipe Skill
       - Getting a Recipe Object from server that
        will be edited by user -
    */
    getRecipeToInsert(subSystemId: string, skill: Skill): Promise<Recipe> {
        const url = `${this.baseURL}/insertNewRecipe/${subSystemId}`;
        // const url = `${this.baseURL}/insertNewRecipe2/${subSystemId}`;
        console.log('getRecipeToInsert url -> ' + url);
        return this.http
            .post(url, JSON.stringify(skill), {headers: this.headers})
            .toPromise()
            /*
            .then(response => response.json() as Recipe)
            ;
            */
            .then(response => {
                console.log("RECIPE READY FOR FORM: " + JSON.stringify(response.json()));
                return response.json() as Recipe;
            })
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        // console.error('ERRORE LETTURA RECIPES ', error);
        return Promise.reject(error.message || error);
    }
    */

    private replacer(key, value) {
        if (key === 'type') {
            return undefined;
        } else {
            return value;
        }
    }

    OLD_trigger(recipeId: string): Promise<string> {
        const url = `${this.baseURL}/${recipeId}/trigger`;
        console.log('trigger url -> ' + url);
        // console.log('getting recipe data');
        return this.http
            .get(url)
            .toPromise()
            .then(response => {
                console.log("response = " + response);
                return response.text() as string;
            })
            ;
    }

    trigger(recipeId: string, productInstanceId: string): Promise<string> {
        const url = `${this.baseURL}/${recipeId}/trigger/${productInstanceId}`;
        console.log('trigger url -> ' + url);
        // console.log('getting recipe data');
        return this.http
            .get(url)
            .toPromise()
            .then(response => {
                console.log("response = " + response);
                return response.text() as string;
            })
            ;
    }
    // .catch(this.handleError)
}
