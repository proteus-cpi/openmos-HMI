import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { SubSystem } from '../Data/sub-system';
import { ExecutionTable } from '../Data/execution-table';
import { Recipe } from '../Data/recipe';
import { Module } from '../Data/module';
import { Skill } from '../Data/skill';
import { environment } from '../../../environments/environment';
import { PhysicalAdjustmentParameter } from '../Data/physical-adjustment-parameter';
import { PhysicalAdjustmentParameterSetting } from '../Data/physical-adjustment-parameter-setting';
import { HMIPhysicalAdjustment } from '../Data/HMI-physical-adjustment';
import { SubSystemStage } from "../Data/sub-system-stage";
import { ModuleService } from "./module.service";

@Injectable()
export class SubSystemService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http,
        private moduleService : ModuleService) { }

    private baseUrl = environment.apiUrl + `/subsystems`;
    // private baseUrl = `http://192.168.15.1:9995/api/v1/subsystems`;
    private sendPhysicalAdjustmentUrl = environment.cloudUrl + '/physicalAdjustments';
    private cloudSubSystemController = environment.cloudUrl + '/subsystems';

    // private moduleService : ModuleService;

    getSubSystemList(): Promise<SubSystem[]> {
        /* http://host:porta/api/v1/subsystems */
        console.log('getSubSystemList url -> ' + this.baseUrl);
        return this.http
                .get(this.baseUrl)
                .toPromise()
                .then(response => {
                    console.log("OK");
                    return response.json() as SubSystem[];
                })
                ;
    }
    // .catch(this.handleError)
/*
                .catch(error => {
                    console.log("KO");
                    console.log("error in service: " + error);
                    return null;    //new Array<SubSystem>();
                })
*/

/*
    handleError(error: Response | any) {
        console.error('SUBSYSTEM LIST handleError -> ', error);
//        this.errorMessage = error;
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
//            const err = body.error || JSON.stringify(body);
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("errMsg = " + errMsg);
        // this.errorMessage = errMsg;
    }    
*/

    getSubSystemById(subSystemId: string): Promise<SubSystem> {
        /* http://host:porta/api/v1/subsystems/{subsystemId} */
        const url = `${this.baseUrl}/${subSystemId}`;
        console.log('getSubSystemById url -> ' + url);
        return this.http
        .get(url)
        .toPromise()
        .then(response => response.json() as SubSystem)
        ;
    }
    // .catch(this.handleError)

    updateSubSystem(subSystem: SubSystem): Promise<SubSystem> {
        /* http://host:porta/api/v1/subsystems/{subsystemId} */
        const url = `${this.baseUrl}/${subSystem.uniqueId}`;
        console.log('updateSubSystem url -> ' + url);
        return this.http
            .post(url, JSON.stringify(subSystem), {headers: this.headers})
            .toPromise()
            .then(() => subSystem)
            ;
    }
    // .catch(this.handleError)

    getSubSystemRecipes(subSystemId: string): Promise<Recipe[]> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/recipes */
        const url = `${this.baseUrl}/${subSystemId}/recipes`;
        console.log('getSubSystemRecipes url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    getSubSystemAllRecipes(subSystemId: string): Promise<Recipe[]> {
        const url = `${this.baseUrl}/${subSystemId}/fullRecipes`;
        console.log('getSubSystemRecipes url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

/*
    getSubSystemAllRecipes(subSystemId: string): Promise<Recipe[]> {
        var fullRecipesList : Recipe[];
        var modulesList : Module[];
        var moduleRecipesList : Recipe[];

        this.getSubSystemRecipes(subSystemId)
        .then(resp => {
            fullRecipesList = resp;
            // console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));

            this.getSubSystemModules(subSystemId)
            .then(resp => {
                modulesList = resp;
                // console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));
    
                if (modulesList)
                {
                    for (let i = 0; i < modulesList.length; i++)
                    {
                        this.moduleService
                        .getModuleRecipes("ss>" + subSystemId + "<m>" + modulesList[i].uniqueId)
                        .then(
                            response => {
                                moduleRecipesList = response;
                                for (let m of moduleRecipesList)
                                    fullRecipesList.push(m);                    
                            }
                        );
                    }
                    return fullRecipesList;
                }
                else
                    return fullRecipesList;
            });                
            return fullRecipesList;
        });      
    }
*/

    addNewRecipe(subSystemId: string, newRecipe: Recipe): Promise<Recipe[]> {
        console.log('NEW RECIPE -----------------------');
        console.log(JSON.stringify(newRecipe));
        /* http://host:porta/api/v1/subSystems/{subSystemId}/recipes */
        const url = `${this.baseUrl}/${subSystemId}/recipes`;
        // console.log('addNewRecipe url -> ' + url);
        // console.log('NEW RECIPE: ' + JSON.stringify(newRecipe));
        return this.http
            .post(url, JSON.stringify(newRecipe, this.replacer), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    getSubSystemModules(subSystemId: string): Promise<Module[]> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/modules */
        const url = `${this.baseUrl}/${subSystemId}/modules`;
        console.log('getSubSystemModules url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Module[])
            ;
    }
    // .catch(this.handleError)

    getExecutionTable(subSystemId: string): Promise<ExecutionTable> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/executionTable */
        const url = `${this.baseUrl}/${subSystemId}/executionTable`;
        console.log('getExecutionTable url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ExecutionTable)
            ;
    }
    // .catch(this.handleError)

    getSubSystemSkills(subSystemId: string): Promise<Skill[]> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/skills */
        const url = `${this.baseUrl}/${subSystemId}/skills`;
        console.log('getSubSystemSkills url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    addNewSkill(subSystemId: string, newSkill: Skill): Promise<Skill[]> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/skills */
        const url = `${this.baseUrl}/${subSystemId}/skills`;
        console.log('addNewSkill url -> ' + url);
        console.log('Add new Skill for SS: ' + subSystemId);
        return this.http
            .post(url, JSON.stringify(newSkill), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    sendPhysicalAdjustment(activeModule: SubSystem, 
        currentSystemStage : string,
        currentUser : string,
        editing: PhysicalAdjustmentParameter, 
        editValue: string): Promise<boolean> {

        const url = this.sendPhysicalAdjustmentUrl;
//        const paramAdjust = new PhysicalAdjustmentParameterSetting();

        var paramAdjust = new HMIPhysicalAdjustment();
        paramAdjust.equipmentId = activeModule.uniqueId;
        paramAdjust.equipmentStage = activeModule.stage;  // TBV!!!!
        paramAdjust.equipmentType = "subSystem";
        paramAdjust.newValue = editValue;
        paramAdjust.oldValue = "dontknow";
        paramAdjust.physicalAdjustmentParameterId = editing.uniqueId;
        paramAdjust.systemStage = currentSystemStage;
        paramAdjust.userName = currentUser;

        return this.http
            .post(url, JSON.stringify(paramAdjust), {headers: this.headers})
            .toPromise()
            .then(response => true)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA SUBSYSTEM: ', error);
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

    checkSubSystemCanChangeStage(subSystemId: string): Promise<boolean> {
        // AUTOMATICA2018 
        /*
        const url = `${this.cloudSubSystemController}/${subSystemId}/isrampupchangestagepossible`;
        console.log('checkSubSystemCanChangeStage -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as boolean)
            ;
        */
        return Promise.resolve(true);
    }
    // .catch(this.handleError)

    updateSubSystemStage(newSubSystemStage : SubSystemStage): Promise<SubSystemStage> {
        const url = `${this.baseUrl}/${newSubSystemStage.subSystemId}/stage`;
        console.log('updateSubSystemStage -> ' + url);
        return this.http
            .post(url, newSubSystemStage, {headers: this.headers})
            .toPromise()
            .then(response => response.json() as SubSystemStage)
            ;
    }
    // .catch(this.handleError)

    getSubSystemStage(subSystemId: string): Promise<SubSystemStage> {
        /* http://host:porta/api/v1/subSystems/{subSystemId}/executionTable */
        const url = `${this.baseUrl}/${subSystemId}/stage`;
        console.log('getSubSystemStage url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as SubSystemStage)
            ;
    }
}
