import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { RecipesService } from './../service/recipe.service';
import { SkillService } from './../service/skill.service';
import { ModuleService } from './../service/module.service';

import { Recipe } from '../Data/recipe';
import { SkillRecipes } from '../Data/skillRecipes';
import { Skill } from '../Data/skill';
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';
import { SubSystem } from './../Data/sub-system';
import { Module } from "./../Data/module";

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'recipe-list',
    templateUrl: '../component_html/recipe-list.component.html'
})

export class RecipeListComponent extends BaseComponent implements OnInit {
    private skillRecipes: SkillRecipes[];
    private callerSkill: Skill;
    private recipes: Recipe[];

    private fromSkill: boolean;

    private isUpdating = false;
    private indexToUpdate: number;

    private selectedRecipe: Recipe;
    private newRecipe: Recipe;

    // Introsys demo
    private subSystem: SubSystem;
    private modules: Module[];
    private module: Module;

    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() showSubModules = true;
    @Input() showAddButton = true;
    @Input() showOnlyNonActive = false;
    private selectedIndex: number;
    private subSystemId: string = '-1';

    private nonActiveCounter = 0;

    private isSubsystem: boolean;
    private isModule: boolean;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private subSystemService: SubSystemService,
        private recipeService: RecipesService,
        private skillService: SkillService,
        private moduleService: ModuleService) {
            super();
        }

    ngOnInit(): void {
        console.log('RRRRRRRRRRRRRRRRRRRRRRRR: --ngOnInit: ' + this.callerId);
        if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }
        if (this.callerType === 'unknownType') {
            // console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
        }
        /*
        var myElem = this.callerId.split(environment.paramValueSeparator);
        this.subSystemId = myElem[1];
        */


        this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);
        // console.log('>>' + this.callerTypeToBePrinted);
        // this.callerIdToBePrinted = this.subSystemId;

        // console.log('caller to be printed: ' + this.callerTypeToBePrinted + ' ' + this.callerIdToBePrinted)


        console.log(this.callerType);
        switch (this.callerType) {
            case 'skill':
                console.log('FFFROM SKILL');
                this.skillRecipes = new Array<SkillRecipes>(1);
                this.skillRecipes[0] = new SkillRecipes();
                this.skillService
                    .getSkillById(this.callerId)
                    .then(
                        response => {
                            this.skillRecipes[0].skill = response;
                            this.callerSkill = response;
                        }
                    );
                this.skillService
                    .getSkillRecipes(this.callerId)
                    .then(
                        response =>
                            this.skillRecipes[0].associatedRecipes = response
                    );
                this.fromSkill = true;
                break;

            case 'subSystem':
                console.log('From subSystem');
                this.subSystemId = this.getPrintableSubSystemId(this.callerId);
                super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);

                this.subSystemService
                    // .getSubSystemRecipes(this.callerId)
                    .getSubSystemRecipes(this.subSystemId)
                    .then(
                        response => {
                            this.recipes = response;
                            this.countNonActive(response);
/*
                            this.subSystemService
                                .getSubSystemById(this.callerId.split(environment.paramValueSeparator)[1])
                                .then(                                    
                                    resp => {
                                        console.log("resp = " + JSON.stringify(resp));
                                        this.subSystem = resp;
                                    }
                                );
*/
                            this.subSystemService
                            // .getSubSystemModules(this.callerId)
                            .getSubSystemModules(this.subSystemId)
                            .then(resp => 
                                {
                                    console.log("resp = " + JSON.stringify(resp));
                                    this.modules = resp;
                                }
                            );

                        }
                    );
                this.fromSkill = false;
                this.isSubsystem = true;
                break;

            case  'module':
                this.isModule = true;
                console.log('From module - callerId = ' + this.callerId);

                this.subSystemId = this.getPrintableModuleId(this.callerId);
//                super.startPrintableModuleName(this.subSystemId, this.moduleService);
                super.startPrintableModuleName(this.callerId, this.moduleService);

                this.moduleService
                    .getModuleRecipes(this.callerId)
                    .then(
                        response => {
                            this.recipes = response;
                            this.countNonActive(response);

                            this.moduleService
                            .getModuleById(this.callerId)
                            .then(module => this.module = module);
                
                        }
                    );

                // this.recipes = new Array<Recipe>();
                break;

            default:
                console.log('Error reading from pre page');
                this.skillRecipes = null;
                break;
        }
    }

    countNonActive(recipeList: Recipe[]): void {
        recipeList.forEach(element => {
            if (!element.valid) {
                this.nonActiveCounter++;
            }
        });
    }

    goToAddPage(): void {
        this.router.navigate(['addRecipeSkill', this.callerType, this.callerId]);
    }

    goToSkillRecipeView(selectedRecipe: Recipe): void {
        this.router.navigate(['/skillRecipeView', this.callerType,
            this.callerId + environment.paramSeparator + environment.recipeMarker + selectedRecipe.uniqueId]);
    }

    getUrlForSubModule(moduleId: string): string {
        // console.log('ss>' + this.subSystem.uniqueId + '<m>' + moduleId);
        return 'ss>' + this.subSystem.uniqueId + '<m>' + moduleId;
    }

    goToFullList(): void {
        this.router.navigate(['/skillRecipes', 
            'subSystem',
            environment.subSystemMarker + this.subSystem.uniqueId]);
    }
}
