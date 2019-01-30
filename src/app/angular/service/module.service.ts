import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { SubSystem } from '../Data/sub-system';
import { Recipe } from '../Data/recipe';
import { Module } from '../Data/module';
import { Skill } from '../Data/skill';
import { environment } from '../../../environments/environment';
import { PhysicalAdjustmentParameter } from '../Data/physical-adjustment-parameter';
import { ParameterSetting } from '../Data/parameter-setting';
import { PhysicalAdjustmentParameterSetting } from '../Data/physical-adjustment-parameter-setting';

@Injectable()
export class ModuleService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    // private baseUrl = `http://192.168.15.1:9995/api/v1/modules`;
    private baseUrl = environment.apiUrl + `/modules`;

    private sendPhysicalAdjustmentUrl = environment.cloudUrl + '/sendphysicaladjustment';

    getModuleById(moduleId: string): Promise<Module> {
        const url = `${this.baseUrl}/${moduleId}`;
        console.log('getModuleById url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Module)
            ;
    }
    // .catch(this.handleError)

    getModuleModules(moduleId: string): Promise<Module[]> {
        const url = `${this.baseUrl}/${moduleId}/modules`;
        console.log('getModuleModules url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Module[])
            ;
    }
    // .catch(this.handleError)

    getModuleSkills(moduleId: string): Promise<Skill[]> {
        const url = `${this.baseUrl}/${moduleId}/skills`;
        console.log('getModuleSkills url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    getModuleRecipes(moduleId: string): Promise<Recipe[]> {
        const url = `${this.baseUrl}/${moduleId}/recipes`;
        console.log('getModuleRecipes url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    sendPhysicalAdjustment(activeModule: Module, editing: PhysicalAdjustmentParameter, editValue: string): Promise<boolean> {

        const url = this.sendPhysicalAdjustmentUrl;
        const paramAdjust = new PhysicalAdjustmentParameterSetting();
        //paramAdjust
        //TODO Finish
        return this.http
            .post(url, JSON.stringify(paramAdjust), {headers: this.headers})
            .toPromise()
            .then(response => true)
            ;
    }
    // .catch(this.handleError)
                    
    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA MODULE: ', error);
        return Promise.reject(error.message || error);
    }
    */
}
