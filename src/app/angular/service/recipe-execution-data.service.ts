import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { RecipeExecutionData } from './../data/recipe-execution-data';
import { environment } from './../../../environments/environment';
import { Recipe } from "./../data/recipe";

@Injectable()
export class RecipeExecutionDataService {

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    private baseUrl = `${environment.cloudUrl}/reds`;

    getKpisForProductAndRecipe(productInstanceId: string, recipeId: string): Promise<string[]> {
        const url = `${this.baseUrl}/kpisettingnamesperproductandrecipe/${productInstanceId}/${recipeId}`;
        console.log('getKpisForProductAndRecipe URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as string[])
            ;
    }
    // .catch(this.handleError)

    getKpiName(recipeId: string): Promise<string[]> {
        const url = `${this.baseUrl}/kpisettingnamesperrecipe/${recipeId}`;
        console.log('getKpiName URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as string[])
            ;
    }
    // .catch(this.handleError)

    getRecipesPerProductInstance(productInstanceId: string): Promise<Recipe[]> {
        const url = `${this.baseUrl}/recipesperproductinstance/${productInstanceId}`;
        console.log('getRecipesPerProductInstance URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }

    getExecutionDataBetweenDates(from: string, to: string, recipeId: string, type: string): Promise<RecipeExecutionData[]> {
        const url = `${this.baseUrl}/query?from=${from}&to=${to}&recipe=${recipeId}&type=${type}`;
        console.log('getExecutionDataBetweenDates URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as RecipeExecutionData[])
            ;
    }
    // .catch(this.handleError)

    getExecutionDataForProductAndRecipe(productId: string, recipeId: string): Promise<RecipeExecutionData[]> {
        const url = `${this.baseUrl}/query?recipe=${recipeId}&product=${productId}`;
        console.log('getExecutionDataForProductAndRecipe URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as RecipeExecutionData[])
            ;
    }
    getExecutionDataForProductAndRecipeAndKpi(productId: string, recipeId: string, type: string): Promise<RecipeExecutionData[]> {
        const url = `${this.baseUrl}/query?recipe=${recipeId}&product=${productId}&type=${type}`;
        console.log('getExecutionDataForProductAndRecipeAndKpi URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as RecipeExecutionData[])
            ;
    }
/*
    getExecutionDataForProductAndRecipe(productId: string, recipeId: string): Promise<RecipeExecutionData[]> {
        const url = `${this.baseUrl}/query?recipe=${recipeId}&product=${productId}`;
        console.log('getExecutionDataForProductAndRecipe URL: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as RecipeExecutionData[])
            ;
    }
*/

    /*
    private handleError(error: any): Promise<any> {
        console.error('Errore lettura recipe execution data');
        return Promise.reject(error.message || error);
    }
    */
}
