import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SkillService } from '../service/skill.service';
import { TriggeredService } from "../service/triggered-service";
import { SharedDataService  } from "../service/shared.data.service";
import { SubSystemService } from '../service/sub-system.service';

import { Skill } from '../Data/skill';
import { Recipe } from '../Data/recipe';
import { Module } from '../Data/module';

import { environment } from '../../../environments/environment';

import { BaseComponent } from './base.component';
import { RecipesService } from '../service/recipe.service';
import { TriggeredSkill } from '../Data/triggered_skill';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'skill-view-page',
    templateUrl: '../component_html/skill-view-page.component.html'
})

export class SkillViewPageComponent extends BaseComponent implements OnInit {
//    export class SkillViewPageComponent implements OnInit {
    @Input() callerType: string = 'skill';
    @Input() callerId: string = 'unknown';
    @Input() skillId: string = '-1';

    /* parameter, kpis, controls, skill requirements */
    private showSelector = [true, true, true, true, true, false, false];
    private noToShowDiv = 2;
    private selectedSkill: Skill;
    // private values: any;
    private kpisCount: number;
    private parametersCount: number;

    public errorMessage : string;
    public triggerResponse : string;
    public wasTriggered = false;    
    public wasTriggeredSuccessfully = false;
    public showTriggerDetail: boolean;
    public selectedTriggerProd: string;
    public selectedTriggerRec: string;

    private tmpRecipeForSkillTriggering: Recipe;
    private currentUserName : string;

    private availableRecipes : Recipe[];

    constructor(private skillService: SkillService,
        private recipeService: RecipesService,
        private triggeredService: TriggeredService,
        private sharedDataServce: SharedDataService,
        private subSystemService: SubSystemService,
        private route: ActivatedRoute,
        private router: Router) 
    {
        super();
    }


    ngOnInit(): void {
        this.initializeSkillData();
    }

    triggeringResults(): void {
        this.changeView(6, "dunno");
        // this.router.navigate(['/recipeExecutionData', 'trg_recipe', this.recipe.uniqueId, this.productInstanceId]);
    }

    initializeSkillData(): void {
        if (this.callerId != null && this.callerId !== 'unknown') {
            console.log('uso parametro');
        } else {
            console.log('uso url');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                        this.callerId = params.get('parentId')
                        // this.skillService.getSkillById(params.get('id'))
                )
                .subscribe();
                // .subscribe(skill => this.selectedSkill = skill);
        }

        const elems = this.callerId.split(environment.paramSeparator);
        const skillElem = elems[elems.length - 1];
        const skillElem2 = skillElem.split(environment.paramValueSeparator);
        this.skillId = skillElem2[1];   // this.callerId;

        this.skillService
            // .getSkillById(this.skillId)
            .getSkillById(this.callerId)
            .then(response => {
                this.selectedSkill = response;
                this.setKPIsNumber();
                this.setParametersNumber();

                // 
                this.recipeService
                    .getRecipeToInsert(this.callerId, this.selectedSkill)
                    .then(
                        resp => {
                            this.tmpRecipeForSkillTriggering = resp;

                            var uniqueId : string;
                            uniqueId = super.generateRandomId('trg_skill_' + this.selectedSkill.uniqueId + "_with_tmprecipe_" + this.tmpRecipeForSkillTriggering.uniqueId + "_");

                            this.tmpRecipeForSkillTriggering.name =  uniqueId;
                            this.tmpRecipeForSkillTriggering.description = uniqueId;
                            // this.generateUniqueId();

                            console.log("def tmp recipe: " + JSON.stringify(this.tmpRecipeForSkillTriggering) );

                            this.sharedDataServce.userInfo
                            .subscribe( userInfo => {
                                this.currentUserName = userInfo;
                                console.log('triggering skill, user name: ' + this.currentUserName);

                                var subSystemId = this.getPrintableSubSystemId(this.callerId);
                                this.subSystemService
                                .getSubSystemAllRecipes(subSystemId)
                                .then(resp => {
                                        this.availableRecipes = resp;
                                        console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));        
                                    }
                                );                            

                            });
        

                        }
                    );

            });
    }


    goToRecipes () {
        this.router.navigate(['skillRecipes', 'skill', this.callerId]);
        // + environment.paramSeparator + environment.skillMarker + this.selectedSkill.uniqueId]);
    }

    changeView(index: number, value: any): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = false;
        }
        // this.values = value;
        // this.fetchData(index);
        this.showSelector[index] = true;
    }

    /*
    fetchData(index: number) {
        switch (index) {
            case 0:
                this.values = this.selectedSkill.parameters;
                break;

            case 1:
                this.values = this.selectedSkill.kpis;
                break;

            case 2:
                this.values = this.selectedSkill.controlPorts;  // null;
                break;

            case 3:
                this.values = this.selectedSkill.skillRequirements;
                break;

            default:
                break;
        }
    } */

    showAllProperties(): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = i < this.showSelector.length - this.noToShowDiv;
        }
    }

    setParametersNumber(): void {
        let cont = 0;
        if (this.selectedSkill !== null
            && this.selectedSkill.parameterPorts !== undefined
            && this.selectedSkill.parameterPorts !== null) {
            for (let i = 0; i < this.selectedSkill.parameterPorts.length; i++) {
                cont += this.selectedSkill.parameterPorts[i].parameters.length;
            }
        }
        this.parametersCount = cont;
        // console.log('PARAM : ' + this.parametersCount);
    }

    setKPIsNumber(): void {
        let cont = 0;
        if (this.selectedSkill !== null
            && this.selectedSkill.informationPorts !== undefined
            && this.selectedSkill.informationPorts !== null) {
            for (let i = 0; i < this.selectedSkill.informationPorts.length; i++) {
                cont += this.selectedSkill.informationPorts[i].kpis.length;
            }
        }
        this.kpisCount = cont;
        // console.log('KPIS: ' + this.kpisCount);
    }

    private cleanErrorMessage()
    {
        this.errorMessage = "";
    }

    triggerThisSkill(): void {
        this.cleanErrorMessage();

        var productInstanceId : string;
        productInstanceId = super.generateRandomId('trg_skill_' + this.selectedSkill.uniqueId + "_trg_prodinst_");
        console.log("triggering skill " + this.selectedSkill.uniqueId + " with this product instance id: " + productInstanceId);
        console.log("tmp recipe to be triggered: " + JSON.stringify(this.tmpRecipeForSkillTriggering));
        // productInstanceId = "rec";

        if (document.getElementById("loader-container") !== null) {
            document.getElementById("loader-container").style.display = 'inline-block';
        }

        this.skillService
            .trigger(this.callerId /* this.selectedSkill.uniqueId */ , productInstanceId, this.tmpRecipeForSkillTriggering)
            .then(
                response => {
                    this.triggerResponse = response;

                    this.wasTriggered = true;

                    document.getElementById("loader-container").style.display = 'none';

                    console.log(JSON.stringify(this.triggerResponse));

                    if (this.triggerResponse == 'Success')
                        this.wasTriggeredSuccessfully = true;
                    console.log("wasTriggeredSuccessfully: " + this.wasTriggeredSuccessfully);

                    // after triggering success, track the event in the log
                    var triggeredSkill = new TriggeredSkill();

                    triggeredSkill.skillId = this.selectedSkill.uniqueId;
                    triggeredSkill.productInstanceId = productInstanceId;
                    triggeredSkill.recipeId = this.tmpRecipeForSkillTriggering.uniqueId;

                    triggeredSkill.uniqueId = triggeredSkill.skillId + "___" + triggeredSkill.productInstanceId + "___" + triggeredSkill.recipeId;

                    triggeredSkill.userName = this.currentUserName;

                    triggeredSkill.successfully = this.wasTriggeredSuccessfully;
                    /*
                    this.sharedDataServce.userInfo
                    .subscribe( userInfo => {
                        triggeredSkill.userName = userInfo;
                        console.log('triggered skill, user name: ' + triggeredSkill.userName);
                    });
                    */
                    triggeredSkill.registered = new Date();

                    this.triggeredService
                        .insertNewTriggeredSkill(triggeredSkill)
                        .then(
                            response => {
                                console.log('triggered skill log info: ' + JSON.stringify(response));
                                // this.assessment = response;
                                // this.showInsertForm = false;
                            }
                        );
            

                }
            )
            .catch(error => {
                console.log("error -> " + error);
                document.getElementById("loader-container").style.display = 'none';
                this.handleError(error)
            });
    }

    goToTriggerList() {
        this.showTriggerDetail = false;
    }

    onTriggerDetail(triggeredSkill: any) {
        this.showTriggerDetail = true;
        this.selectedTriggerProd = triggeredSkill.productInstanceId;
        this.selectedTriggerRec = triggeredSkill.recipeId;
    }

    handleError(error: any) {
        console.error('ERRORE LETTURA SKILLS handleError -> ', error);
        this.errorMessage = error;
    }

    getRecipeName(recipeId : string) : string {
        //console.log("recipe id to find: " + recipeId);
        //console.log("this.availableRecipes.length: " + this.availableRecipes.length);
        if (this.availableRecipes) {
            var i : number;
            for (i = 0; i < this.availableRecipes.length; i++ )
                if (this.availableRecipes[i].uniqueId == recipeId)
                    return this.availableRecipes[i].name;
        }
        return null;
    }

    goToAddNewRecipeSkill(): void {
        this.router.navigate(['addRecipeSkill', 'skill', this.callerId + environment.paramSeparator 
            + environment.skillMarker + this.selectedSkill.uniqueId]);
    }

}
