import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ProcessAssessmentService } from "../service/process-assessment-service";
import { Recipe } from "../Data/recipe";
import { RecipesService } from "../service/recipe.service";
import { ProcessAssessment } from "../Data/process-assessment";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'process-assessments-list',
    templateUrl: '../component_html/process-assessments-list.component.html'
})

export class ProcessAssessmentsListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() openmosContext: string = 'unknown';
    @Input() openmosTarget: string = 'all';

    private processAssessments: ProcessAssessment[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private processAssessmentService : ProcessAssessmentService,
        private recipesService : RecipesService
        ) {
            super();
    }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.has('openmosTarget'))
            this.openmosTarget = this.route.snapshot.paramMap.get('openmosTarget');
        console.log("this.openmosTarget: " + this.openmosTarget);
        if (this.route.snapshot.paramMap.has('openmosContext'))
            this.openmosContext = this.route.snapshot.paramMap.get('openmosContext');
        console.log("this.openmosContext: " + this.openmosContext);

        var realTarget = this.openmosTarget;
        if (this.openmosTarget != 'all')
        {
            if (this.openmosContext == 'skillDetail')
            {
                var skillId = super.getPrintableSkillId(this.openmosTarget);
                realTarget = skillId;
            }
            else if (this.openmosContext == 'skillRecipeView')
            {
                var recipeId = super.getPrintableRecipeId(this.openmosTarget);
                realTarget = recipeId;
            }
        }

        this.processAssessmentService
            .getProcessAssessments(this.openmosContext, realTarget)
            .then(
                response => {
                    this.processAssessments = response;

                    console.log("equipment assessments = " + JSON.stringify(this.processAssessments))

                    var ass: any;
                    var assess : ProcessAssessment;
                    for (ass in this.processAssessments)
                    {
                        assess = this.processAssessments[ass];

                        console.log("current assess:" + JSON.stringify(assess));

                        if (sessionStorage && sessionStorage.getItem(assess.recipeId) != null) {
                            // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                            assess.recipeName = sessionStorage.getItem(assess.recipeId);
                        }  
                        else      
                        {                        
                            assess.recipeName = "-"
                            // var myparam : string;
                            var myparam = environment.subSystemMarker + assess.equipmentId + environment.paramSeparator + environment.recipeMarker + assess.recipeId;
                            console.log("myparam = " + myparam);
                            var currentRecipe : Recipe;
                            this.recipesService
                            .getRecipeDetail(myparam)
                            .then(
                                response => {
                                    currentRecipe = response;
                                    console.log("currentRecipe: " + JSON.stringify(currentRecipe));
                                    assess.recipeName = currentRecipe.name;

                                    sessionStorage.setItem(assess.recipeId, assess.recipeName);
                                }
                            );
                        }
                        if (sessionStorage && sessionStorage.getItem(assess.equipmentId) != null) {
                            // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                            assess.equipmentName = sessionStorage.getItem(assess.equipmentId);
                        }  
                        else      
                        {
                            assess.equipmentName = "-";
                        }                   

                        console.log("recipe name = " + assess.recipeName);
                    }
                    console.log("process assessments = " + JSON.stringify(this.processAssessments))                                    
                }
            );
    }

    goToProcessAssessmentDetails(selectedProcessAssessment: ProcessAssessment): void {
        this.router.navigate(
            ['/skillDetail', 'skillList', this.callerId + environment.paramSeparator
                + environment.skillMarker + selectedProcessAssessment.uniqueId]
        );
    }

    startAssessmentAddition(): void {
        // http://localhost:4200/addProcessAssessment/skillRecipeView/ss%3Efd916ab3-d6d4-47f1-b2fb-fcea41e0a852%3Cr%3Ee7609f99-966c-45b9-b7d9-4ccc0e08e1ba        
        console.log("this.openmosTarget: " + this.openmosTarget);
        this.router.navigate(['addProcessAssessment', this.openmosContext, this.openmosTarget]);
    }
}
