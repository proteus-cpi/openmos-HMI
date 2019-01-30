import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SubSystemService } from '../service/sub-system.service';
import { ProductService } from '../service/product.service';
import { RecipesService  } from "../service/recipe.service";
import { RecipeExecutionDataService } from "../service/recipe-execution-data.service";

import { SubSystem } from '../Data/sub-system';
import { Product } from '../Data/product';
import { Recipe } from "../Data/recipe";
import { KPISetting } from "../Data/kpi-setting";
import { RecipeExecutionData } from "../Data/recipe-execution-data";
import { environment } from '../../../environments/environment';

@Component({
    selector: 'kpis-for-product-and-recipe',
    templateUrl: '../component_html/kpis-for-product-and-recipe.html'
})

export class KpisForProductAndRecipeComponent implements OnInit {

    private recipeExecutionData: RecipeExecutionData[];
    private kpisRecipeExecutionData: KPISetting[];
    // private selectedRecipe: Recipe;
    
    @Input() productInstanceId : string = 'unknown';
    @Input() recipeId : string = 'unknown';
    @Input() recipeName : string = 'unknown';

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
        if (this.recipeId === 'unknown') {
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.recipeId = params.get('recipeId')
                )
                .subscribe();
        }
        if (this.recipeName === 'unknown') {
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.recipeName = params.get('recipeName')
                )
                .subscribe();
        }

//        this.getProductsList();
        this.getRecipeExecutionDataForProductAndRecipe(this.productInstanceId, this.recipeId);
    }

    getRecipeExecutionDataForProductAndRecipe(productInstanceId : string, recipeId : string): void {
        console.log('product instance id = ' + productInstanceId);
        console.log('recipe id = ' + recipeId);
        
        this.recipeExecutionDataService
            .getExecutionDataForProductAndRecipe(productInstanceId, recipeId)
            .then(
                response => {
                    console.log("geKpisForProductAndRecipe: " + JSON.stringify(response));
                    this.recipeExecutionData = response;

                    if (this.kpisRecipeExecutionData && this.kpisRecipeExecutionData.length > 0)
                        this.kpisRecipeExecutionData.splice(0, this.kpisRecipeExecutionData.length);
                    else
                        this.kpisRecipeExecutionData = new Array();
                    for (let red of this.recipeExecutionData)
                    {
                        console.log("current red kpiSettings = " + JSON.stringify(red.kpiSettings));
                        for (let currentKpi of red.kpiSettings)
                            // this.kpisRecipeExecutionData.push.apply(red.kpiSettings);
                            this.kpisRecipeExecutionData.push(currentKpi);
                    }
                    
                    console.log("red array  = " + this.kpisRecipeExecutionData);
               }
            );

    }

    /* onSelectRecipe(recipe: Recipe): void {
        this.selectedRecipe = recipe;
    }

    goToRecipeDetail(recipe: Recipe) {
        // subsystem id is necessary to compose the url,
        // so i get it from the recipe.equipmentIds list
        var equipmentId, firstEquipment : string;
        if (recipe == null)
            return;
        if (recipe.equipmentIds == null)
            return;
        if (recipe.equipmentIds.length == 0)
            return;        
        // /skillRecipeView/subSystem/ss%3E8819482d-eb96-456b-b1df-64d27dee22ee%3Cr%3E4752781e-07ac-43f9-8980-1b163f344b8d
        var myParameter = "ss" + ">" + recipe.equipmentIds[0] + "<" + "r" + ">" + recipe.uniqueId;
        this.router.navigate(['/skillRecipeView/subSystem', myParameter]);
    }*/
}
