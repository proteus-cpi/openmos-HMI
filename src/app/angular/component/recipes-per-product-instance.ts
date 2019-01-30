import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SubSystemService } from '../service/sub-system.service';
import { ProductService } from '../service/product.service';
import { RecipesService  } from "../service/recipe.service";
import { RecipeExecutionDataService } from "../service/recipe-execution-data.service";

import { SubSystem } from '../Data/sub-system';
import { Product } from '../Data/product';
import { Recipe } from "../Data/recipe";
import { environment } from '../../../environments/environment';

@Component({
    selector: 'recipes-per-product-instance',
    templateUrl: '../component_html/recipes-per-product-instance.html'
})

export class RecipesPerProductInstanceComponent implements OnInit {

    private recipesPerProductInstance: Recipe[];
    private selectedRecipe: Recipe;
    
    @Input() productInstanceId : string = 'unknown';


    constructor(private route: ActivatedRoute,
        private recipeService: RecipesService,
        private recipeExecutionDataService: RecipeExecutionDataService,
        private router: Router) { }


    ngOnInit(): void {
        if (this.productInstanceId === 'unknown') {
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.productInstanceId = params.get('productInstanceId')
                )
                .subscribe();
        }

//        this.getProductsList();
        this.getRecipesPerProductInstance(this.productInstanceId);
    }

    getRecipesPerProductInstance(productInstanceId : string): void {
        console.log('product instance id = ' + productInstanceId);

        this.recipeExecutionDataService
            .getRecipesPerProductInstance(productInstanceId)
            .then(
                response => {
                    console.log("recipesPerProductInstance: " + JSON.stringify(response));
                    this.recipesPerProductInstance = response;
               }
            );

    }

    onSelectRecipe(recipe: Recipe): void {
        this.selectedRecipe = recipe;
    }

    goToRecipeDetail(recipe: Recipe) {
        // subsystem id is necessary to compose the url,
        // so i get it from the recipe.equipmentIds list
        var equipmentId, firstEquipment : string;
        console.log("recipe = " + JSON.stringify(recipe));
        if (recipe == null)
            return;
        console.log("recipe equipmentids = " + JSON.stringify(recipe.equipmentIds));
        if (recipe.equipmentIds == null)
            return;
        if (recipe.equipmentIds.length == 0)
            return;        
        
        // VaG - 08/11/2018
        // From now on, this list will contain
        // - one element, the subsystem id, in case the recipe is attached to the subsystem
        // - two elements, the subsystem id and the module id, in case the recipe is attached to the module
        // /skillRecipeView/subSystem/ss%3E8819482d-eb96-456b-b1df-64d27dee22ee%3Cr%3E4752781e-07ac-43f9-8980-1b163f344b8d
        if (recipe.equipmentIds.length == 1)
        {
            var myParameter = "ss" + ">" + recipe.equipmentIds[0] + "<" + "r" + ">" + recipe.uniqueId;
            console.log("myParameter = " + myParameter);
            this.router.navigate(['/skillRecipeView/subSystem', myParameter]);
        }
        else if (recipe.equipmentIds.length == 2)
        {
            var myParameter = "ss" + ">" + recipe.equipmentIds[0]  + "<" + "m" + ">" + recipe.equipmentIds[1] + "<" + "r" + ">" + recipe.uniqueId;
            console.log("myParameter = " + myParameter);
            this.router.navigate(['/skillRecipeView/module', myParameter]);
        }
        else
            console.log("array with more than two elements -> why?");
    }

    /*goToKpisForProductAndRecipe(productInstanceId : string, recipeId: string) {
        if (productInstanceId == null)
            return;
        if (recipeId == null)
            return;
        this.router.navigate(['/kpisForProductAndRecipe', productInstanceId, recipeId]);
    }*/
    goToKpisForProductAndRecipe(productInstanceId : string, recipeId: string, recipeName : string) {
        if (productInstanceId == null)
            return;
        if (recipeId == null)
            return;
        this.router.navigate(['/kpisForProductAndRecipe', productInstanceId, recipeId, recipeName]);
    }
}
