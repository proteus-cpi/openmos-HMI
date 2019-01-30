import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { TriggeredService } from '../service/triggered-service';

import { TriggeredRecipe } from '../Data/triggered_recipe';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'triggered-recipes-list-page',
    templateUrl: '../component_html/triggered-recipes-list-page.component.html'
})

export class TriggeredRecipesListPageComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';
    @Input() recipeId = "unknownRecipe";
    @Output("onDetail") onDetail: EventEmitter<any> = new EventEmitter();



    private triggeredRecipes: TriggeredRecipe[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private triggeredService: TriggeredService) { }

    ngOnInit(): void {
        console.log('ngOnInit: ' + this.callerId);
/*        
       if (this.callerId === 'unknown') {
            console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }
        if (this.callerType === 'unknownType') {
            console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
            }
*/    
if (this.recipeId === 'unknownRecipe') {
    console.log('module @input parameter not found (' + this.recipeId + '), go for querystring parameter');
    this.route.paramMap
        .switchMap(
            (params: ParamMap) =>
            this.recipeId = params.get('recipeId')
        )
        .subscribe();
}


console.log('go! ');

//                this.subSystemId = this.getPrintableModuleId(this.callerId);
//                super.startPrintableModuleName(this.subSystemId, this.moduleService);

                this.triggeredService
                    .getTriggeredRecipesList(this.recipeId)
                    .then(
                        response => 
                            {
                                this.triggeredRecipes = response;
                                console.log("triggeredRecipes retrieved by the service: " + JSON.stringify(this.triggeredRecipes));
                            }
                    );

    }

    goToTriggerRecipeView(selectedTriggeredRecipe: TriggeredRecipe): void {
        // this.router.navigate(['/orderInstance',         selectedOrderInstance.uniqueId]);
        // console.log("call for detail for " + JSON.stringify(selectedTriggeredRecipe));
        this.onDetail.emit(selectedTriggeredRecipe);
    }

}
