import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { CyberPhysicalDescription } from '../Data/cyber-physical-description';
import { Recipe } from '../Data/recipe';
import { Equipment } from '../Data/equipment';
import { Skill } from '../Data/skill';

@Injectable()
export class CPADService{
    private headers = new Headers({'Content-Type':'application/json'});

    constructor(private http: Http) { }

    /* http://host:porta/api/v1/cpads */
    private baseUrl = `http://192.168.10.96:9995/api/v1/cpads`;
    
    getCPADList(): Promise<CyberPhysicalDescription[]>{
        /* http://host:porta/api/v1/cpads */
        return this.http    
                .get(this.baseUrl)
                .toPromise()
                .then(response => response.json() as CyberPhysicalDescription[])
                ;
    }
    // .catch(this.handleError)

    getCPADById(cpadId: string): Promise<CyberPhysicalDescription>{
        /* http://host:porta/api/v1/cpads/{cpadId} */
        const url = `${this.baseUrl}/${cpadId}`;   
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as CyberPhysicalDescription)
            ;
    }
    // .catch(this.handleError)
    
    updateCPAD(cpd: CyberPhysicalDescription): Promise<CyberPhysicalDescription>{
        /* http://host:porta/api/v1/cpads/{cpadId} */
        const url = `${this.baseUrl}/${cpd.equipmentId}`;
        return this.http
            .post(url, JSON.stringify(cpd), {headers: this.headers})
            .toPromise()
            .then(() => cpd)
            ;
    }
    // .catch(this.handleError)

    getCPADRecipes(cpadId: string): Promise<Recipe[]>{
        /* http://host:porta/api/v1/cpads/{cpadsId}/recipes */ 
        const url = `${this.baseUrl}/${cpadId}/recipes`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    addNewRecipe(cpadId: string, newRecipe: Recipe): Promise<Recipe[]>{
        /* http://host:porta/api/v1/cpads/{cpadsId}/recipes */
        const url = `${this.baseUrl}/${cpadId}/recipes`;
        return this.http
            .post(url, JSON.stringify(newRecipe), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    getCPADEquipments(cpadId: string): Promise<Equipment[]>{
        /* http://host:porta/api/v1/cpads/{cpadId}/equipments */
        const url = `${this.baseUrl}/${cpadId}/equipments`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Equipment[])
            ;
    }
    // .catch(this.handleError)

    getCPADSkills(cpadId: string): Promise<Skill[]>{
        /* http://host:porta/api/v1/cpads/{cpadId}/skills */
        const url = `${this.baseUrl}/${cpadId}/skills`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    addNewSkill(cpadId: string, newSkill: Skill): Promise<Skill[]>{
        /* http://host:porta/api/v1/cpads/{cpadId}/skills */
        const url = `${this.baseUrl}/${cpadId}/skills`;
        return this.http
            .post(url, JSON.stringify(newSkill), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error("ERRORE LETTURA CPD: ", error);
        return Promise.reject(error.message || error);
    } 
    */   
}
