import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';

import { Recipe } from '../Data/recipe';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'recipe-list-page',
    templateUrl: '../component_html/recipe-list-page.component.html'
})

export class RecipeListPageComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';

    private url: string;
    private showOnlyNonActive: boolean;

    private recipes: Recipe[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService) { }

    ngOnInit(): void {
        console.log('RRRRRRRRRRR: ' + this.router.url.toString());
        console.log('ngOnInit: ' + this.callerId);

        this.url = this.router.url;
        this.showOnlyNonActive = this.url.lastIndexOf('nonActiveRecipes') !== -1;
        console.log('RRRRRRRRRRRRRRR: ' + this.showOnlyNonActive);

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
        /*
            this.subSystemService
                .getSubSystemRecipes(this.callerId)
                .then(response => this.recipes = response);
        */
    }
    /*
        goToRecipeDetails(selectedRecipe: Recipe): void{
            this.router.navigate(['/recipe', selectedRecipe.uniqueId]);
        }
    */
}
