import { Component, Input, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { RecipesService } from '../service/recipe.service';
import { SubSystemService } from '../service/sub-system.service';

import { Recipe } from '../data/recipe';

import { environment } from '../../../environments/environment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'skill-recipe-view',
    templateUrl: '../component_html/skill-recipe-view.component.html'
})

export class SkillRecipeViewComponent implements OnInit {
    private recipe: Recipe;

    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';

    constructor(private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipesService,
        private subSystemService: SubSystemService) { }

    ngOnInit(): void {
        this.initializeData();
    }

    initializeData(): void {
        if (this.callerId === 'unknown') {
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }
        if (this.callerType === 'unknownType') {
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
        }

        this.recipeService
            .getRecipeDetail(this.callerId)
            .then(response => this.recipe = response );
    }

    test(): void {
        alert('AAA: ' + JSON.stringify(this.recipe));
    }
}
