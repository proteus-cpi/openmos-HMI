import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Skill } from '../Data/skill';
import { Module } from '../Data/module';
import { Recipe } from './../Data/recipe';
import { environment } from '../../../environments/environment';

@Injectable()
export class SkillService {
    private headers = new Headers({'Content-Type' : 'application/json'});

    /* http://host:porta/api/v1/skills */
    // private skillBaseUrl = `http://192.168.15.1:9995/api/v1/skills/`;
    private skillBaseUrl = environment.apiUrl + `/skills/`;

    constructor(private http: Http) { }

    getSkillById(id: string): Promise<Skill> {
        /* http://host:porta/api/v1/skills/{skillId} */
        const url = `${this.skillBaseUrl}${id}`;
        console.log('getSkillById url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Skill)
            ;
    }
    // .catch(this.handleError)

    getSkillModules(skillId: string): Promise<Module> {
        const url = `${this.skillBaseUrl}${skillId}/modules`;
        console.log('getSkillModules url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Module)
            ;
    }
    // .catch(this.handleError)

    getSkillRecipes(skillId: string): Promise<Recipe[]> {
        const url = `${this.skillBaseUrl}${skillId}/recipes`;
        console.log('getSkillRecipes url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Recipe[])
            ;
    }
    // .catch(this.handleError)

    addNewRecipeSkill(skillId: string, recipe: Recipe): Promise<Recipe> {
        const url = `${this.skillBaseUrl}${skillId}/recipes`;
        console.log('addNewRecipeSkill url -> ' + url);
        // console.log('INSERT 2');
        return this.http
            .post(url, JSON.stringify(recipe), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Recipe)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA SKILL: ', error);
        return Promise.reject(error.message || error);
    }
    */

   trigger(skillId: string, productIntanceId: string, tmpRecipe: Recipe): Promise<string> {
        console.log('skill trigger: skill path  -----------------------');
        console.log(skillId);        
        console.log('skill trigger: productIntanceId  -----------------------');
        console.log(productIntanceId);        
        console.log('skill trigger: TMP RECIPE -----------------------');
        console.log(JSON.stringify(tmpRecipe));        

/*        
        var tmpRecipe2 : Recipe = new Recipe();
        console.log('skill trigger: TMP RECIPE 2 -----------------------');
        console.log(JSON.stringify(tmpRecipe2));

        var tmpSkill2 : Skill = new Skill();
        console.log('skill trigger: TMP SKILL 2 -----------------------');
        console.log(JSON.stringify(tmpSkill2));

        
        // tmpRecipe2.skill = tmpRecipe.skill;
        tmpRecipe2.skill = tmpSkill2;
        tmpSkill2.classificationType = tmpRecipe.skill.classificationType;
        tmpSkill2.controlPorts = tmpRecipe.skill.controlPorts;        
        tmpSkill2.description = tmpRecipe.skill.description;
        tmpSkill2.informationPorts = tmpRecipe.skill.informationPorts;
        tmpSkill2.kpis = tmpRecipe.skill.kpis;        
        tmpSkill2.label = tmpRecipe.skill.label;
        tmpSkill2.name = tmpRecipe.skill.name;        
        tmpSkill2.parameterPorts = tmpRecipe.skill.parameterPorts;
        tmpSkill2.parameters = tmpRecipe.skill.parameters;
        tmpSkill2.recipeIds = tmpRecipe.skill.recipeIds;
        tmpSkill2.registered = tmpRecipe.skill.registered;
        tmpSkill2.skillRequirements = tmpRecipe.skill.skillRequirements;
        tmpSkill2.skillType = tmpRecipe.skill.skillType;
        tmpSkill2.subSystemId = tmpRecipe.skill.subSystemId;
        tmpSkill2.skType = tmpRecipe.skill.skType;
console.log("skill type = " + tmpRecipe.skill.skType);
        tmpSkill2.uniqueId = tmpRecipe.skill.uniqueId;
        tmpRecipe2.skill = tmpSkill2;

        tmpRecipe2.description = tmpRecipe.description;
        tmpRecipe2.equipmentIds = tmpRecipe.equipmentIds;
        tmpRecipe2.executedBySkillControlPort = tmpRecipe.executedBySkillControlPort;
        tmpRecipe2.fulfilledSkillRequirements = tmpRecipe.fulfilledSkillRequirements;
        tmpRecipe2.invokeMethodID = tmpRecipe.invokeMethodID;
        tmpRecipe2.invokeObjectID = tmpRecipe.invokeObjectID;
        tmpRecipe2.kpiSettings = tmpRecipe.kpiSettings;
        tmpRecipe2.lastOptimizationTime = tmpRecipe.lastOptimizationTime;
        tmpRecipe2.msbProtocolEndpoint = tmpRecipe.msbProtocolEndpoint;
        tmpRecipe2.name = tmpRecipe.name;
        tmpRecipe2.optimized = tmpRecipe.optimized;
        tmpRecipe2.parameterSettings = tmpRecipe.parameterSettings;
        tmpRecipe2.registered = tmpRecipe.registered;
        
        tmpRecipe2.skillRequirements = tmpRecipe.skillRequirements;
        tmpRecipe2.state = tmpRecipe.state;
        tmpRecipe2.statePath = tmpRecipe.statePath;
        tmpRecipe2.uniqueAgentName = tmpRecipe.uniqueAgentName;
        tmpRecipe2.uniqueId = tmpRecipe.uniqueId;
        tmpRecipe2.valid = tmpRecipe.valid;
        
        console.log('skill trigger: TMP RECIPE 3 -----------------------');
        console.log(JSON.stringify(tmpRecipe2));
*/
        const url = `${this.skillBaseUrl}${skillId}/trigger/${productIntanceId}`;
        console.log("url for skill triggering: " + url);
        return this.http
            .post(url, JSON.stringify(tmpRecipe /*, this.replacer */), {headers: this.headers})
            .toPromise()
            .then(response => {
                console.log("response = " + response);
                return response.text() as string;
            })
            ;
    }
}
