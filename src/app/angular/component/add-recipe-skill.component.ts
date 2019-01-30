import { CommonModule } from '@angular/common'
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { RecipesService } from '../service/recipe.service';
import { ProductService } from '../service/product.service';

import { BaseComponent } from './base.component';
import { Skill } from '../Data/skill';
import { SkillRequirement } from './../Data/skill-requirement';
import { Recipe } from '../Data/recipe';
import { Product } from './../Data/product';

@Component({
    selector: 'add-skill-recipe',
    templateUrl: '../component_html/add-recipe-skill.component.html'
})

export class AddRecipeSkillComponent extends BaseComponent implements OnInit {
    private recipeToInsert: Recipe;
    private showInsertForm = true;
    private subSystemId: string;
    private avaibleProducts: Product[];
    private tmpAvailableProducts : Product[];
    private availableRecipes : Recipe[];
    private recipesForSkillReqIds : any[];

    private skillRequirementsIndexsMap: Map<number, SkillRequirement>;
    private selectedSkillRequirements: boolean[];
    private newSelectedSkillRequirements: boolean[][];

    @Input() callerType = 'unknown';
    @Input() callerId = 'unknown';
    @Input() callerSkill: Skill;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private subSystemService: SubSystemService,
        private recipeService: RecipesService,
        private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
        this.subSystemId = this.getPrintableSubSystemId(this.callerId);
        super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);

        this.recipeService
            .getRecipeToInsert(this.callerId, this.callerSkill)
            .then(
                resp => {
                    this.recipeToInsert = resp;
                    this.generateUniqueId();


                    this.avaibleProducts = new Array(0);

                    this.productService
                        .getProductsList()
                        .then(response => {
                            console.log("available products: " + JSON.stringify(response));

                            this.tmpAvailableProducts = response;
                            var i:number;
                            for (i = 0; i < this.tmpAvailableProducts.length; i++)
                                this.avaibleProducts.push(this.tmpAvailableProducts[i]);

                            // COMPOSITE SKILLS 
                            /////////////////////////
                            this.subSystemService
                            .getSubSystemSkills(this.subSystemId)
                            .then(response => {
                                var subSystemSkills : Skill[];
                                subSystemSkills = response;
                                console.log("subsystem skills: " + JSON.stringify(subSystemSkills));

                                // VaG - 21/01/2019
                                // NO MORE products from composite skills
                                // BUUUUUT products from composite recipes
                                // this.getProductsFromCompositeSkills(subSystemSkills);

                                this.subSystemService
                                .getSubSystemAllRecipes(this.subSystemId)
                                .then(resp => {
                                        this.availableRecipes = resp;
                                        console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));

                                        // in this case of new recipe, skill requirements are not associated to any existing recipe
                                        // so i fill this recipes per skreq list with all the recipes in the system,
                                        // all but related to thi new recipe skill
                                        this.recipesForSkillReqIds = new Array(0);
                                        for (let k = 0; k < this.availableRecipes.length; k++)
                                        {
                                            let skillId = this.availableRecipes[k].skill.uniqueId;
                                            if (skillId != this.callerSkill.uniqueId)
                                            {
                                                this.recipesForSkillReqIds.push(
                                                    {
                                                        recipe: this.availableRecipes[k].uniqueId,
                                                        selected: false
                                                    }                    
                                                );
                                            }
                                        }
                                        console.log("recipesForSkillReqIds: " + JSON.stringify(this.recipesForSkillReqIds));
                                        if (this.recipeToInsert.skillRequirements &&
                                            this.recipeToInsert.skillRequirements.length > 0)
                                        {
                                            for (let kk = 0; kk < this.recipeToInsert.skillRequirements.length; kk++)
                                            {
//                                                this.recipeToInsert.skillRequirements[kk].selectedRecipesIds = this.recipesForSkillReqIds;
                                                this.recipeToInsert.skillRequirements[kk].selectedRecipesIds = new Array(0);
                                                for (let kkk = 0; kkk < this.recipesForSkillReqIds.length; kkk++)
                                                {
                                                    // this.recipeToInsert.skillRequirements[kk].selectedRecipesIds.push(this.recipesForSkillReqIds[kkk]);
                                                    // Forced to create a new element otherwise the model element would have been the same for every skill requirement
                                                    this.recipeToInsert.skillRequirements[kk].selectedRecipesIds.push(
                                                        {
                                                            recipe: this.recipesForSkillReqIds[kkk].recipe,
                                                            selected: false
                                                        } 
                                                    );                       
                                                }
                                            }
                                        }
 
                                        // VaG - 21/01/2019
                                        // NO MORE products from composite skills
                                        // BUUUUUT products from composite recipes
                                        this.getProductsFromCompositeRecipes(this.availableRecipes);

                                        this.startSkillReq();
                                    }
                                );                            

                                }                            
                            );
                        
                            }
                        );
                            
                    this.startSkillReqForComposite();
                }
            );

        console.log('SS: ' + this.subSystemId);
        console.log('Caller Type: ' + this.callerType);
        console.log('CallerId: ' + this.callerId);
    }

    insertRecipe(): void {
        if (this.recipeToInsert.skill.skType === 'COMPOSITE' 
            && this.loadRecipeForSkillReq()) {
            console.log("ERRORE")
            return;
        }
        this.loadSkillRequirements();
        this.subSystemService
            .addNewRecipe(this.callerId, this.recipeToInsert)
            .then(
                () => {
                    this.showInsertForm = false;
                }
            )
            .catch();
        this.showInsertForm = false;
    }

    newInsert(): void {
        this.showInsertForm = true;
        this.ngOnInit();
    }

    generateUniqueId(): void {
        this.recipeToInsert.registered = new Date();
        this.recipeToInsert.uniqueId =
            this.recipeToInsert.registered.getTime()
            + '_'
            + (Math.floor(Math.random() * 3 + 1)).toString();
        console.log('Generated ID: ' + this.recipeToInsert.uniqueId);
    }

    OLD_loadSkillRequirements(): void {
        for (let i = 0; i < this.selectedSkillRequirements.length; i++) {
            if (this.selectedSkillRequirements[i]) {
                this.recipeToInsert
                    .skillRequirements
                    .push(
                        this.skillRequirementsIndexsMap.get(i)
                    );
            }
        }
        // this.test();
    }
    loadSkillRequirements(): void {
        var z : number = 0;
        for (let i = 0; i < this.avaibleProducts.length; i++) {
            for (let j = 0; j < this.avaibleProducts[i].skillRequirements.length; j++) {
//                .skillRequirements
                if (this.newSelectedSkillRequirements[i][j]) {
                this.recipeToInsert
                    .fulfilledSkillRequirements
                    .push(
                        this.skillRequirementsIndexsMap.get(z)
                    );
            }
            z++;
        }
            
        }
        // this.test();
    }

    startSkillReqForComposite(): void {
        if (this.recipeToInsert.skill.skType === 'COMPOSITE') {
            this.recipeToInsert.skillRequirements.forEach(element => {
                element.isError = false;
                element.selectedRecipesIds = [];
                if (element.recipeIDs) {
                    if (element.recipeIDs.length === 1) {
                        element.selectedRecipesIds.push(
                            {
                                recipe: element.recipeIDs[0],
                                selected: true
                            }
                        );
                    } else {
                        element.recipeIDs.forEach(ids => {
                            element.selectedRecipesIds.push(
                                {
                                    recipe: ids,
                                    selected: false
                                }
                            );
                        });
                    }
                }
            });
        }
    }

    loadRecipeForSkillReq(): boolean {
        // return true if there is some skill req without any recipe id selected
        var isErrors = false;
        this.recipeToInsert.skillRequirements.forEach(skillReq => {            
            skillReq.recipeIDs = [];
            var trueCounter = 0;
            skillReq.selectedRecipesIds.forEach(selected => {
                if (selected.selected) {
                    skillReq.recipeIDs.push(selected.recipe);
                    trueCounter++;
                }
            });
            if (skillReq.recipeIDs.length == 0 && skillReq.selectedRecipesIds.length == 0) {
                skillReq.isError = false;
                return;
            }
            skillReq.isError = trueCounter == 0;
            isErrors = isErrors || skillReq.isError;
        });

        if (!isErrors) {
            this.recipeToInsert.skillRequirements.forEach(skillReq => {
                delete skillReq.selectedRecipesIds;
                delete skillReq.isError;
            });
        }
        
        return isErrors;
    }

    onChangeRecipe(element: any, sk: SkillRequirement): void {
        if (sk.isError && element.srcElement.checked == true) {
            sk.isError = false;
        }       
    }

    startSkillReq(): void {
        this.skillRequirementsIndexsMap = new Map<number, SkillRequirement>();

        const arraySkillReqLength = this.getTotalSkillReq(0);

        this.selectedSkillRequirements = new Array<boolean>(arraySkillReqLength);
        // this.newSelectedSkillRequirements = new Array(0)(0);
        this.newSelectedSkillRequirements = []; // new Array<boolean>(this.avaibleProducts.length);
        for (let i = 0; i < this.avaibleProducts.length; i++)
            this.newSelectedSkillRequirements[i] = [];

        this.setFalse();

        let productIndex = 0, skillRequirementIndex = 0, skillRequirementCounter = 0;

        while (productIndex < this.avaibleProducts.length && skillRequirementCounter <= arraySkillReqLength) {
            skillRequirementIndex = 0;
            while (skillRequirementIndex < this.avaibleProducts[productIndex].skillRequirements.length) {
                this.skillRequirementsIndexsMap.set(skillRequirementCounter, this.getSkillReq(productIndex, skillRequirementIndex));
                skillRequirementIndex++;
                skillRequirementCounter++;
            }
            productIndex++;
        }

    }

    getSkillReq(indexProd: number, indexSReq): SkillRequirement {
       return this.avaibleProducts[indexProd].skillRequirements[indexSReq];
    }

    getTotalSkillReq(index: number): number {
        /* OLD CODE 
        return index < this.avaibleProducts.length ?
            this.avaibleProducts[index].skillRequirements.length + this.getTotalSkillReq(index + 1)
            : 0;
        */
        var i : number;
        var somma : number = 0;
        for (i = 0; i < this.avaibleProducts.length; i++ )
            if (this.avaibleProducts[i].skillRequirements)
                somma += this.avaibleProducts[i].skillRequirements.length;
        console.log("somma = " + somma);
        return somma;
    }

    setFalse(): void {
        for (let i = 0; i < this.selectedSkillRequirements.length; i++) {
            this.selectedSkillRequirements[i] = false;
        }
        for (let i = 0; i < this.avaibleProducts.length; i++)
            for (let j = 0; j < this.avaibleProducts[i].skillRequirements.length; j++)
                this.newSelectedSkillRequirements[i][j] = false;
    }

    goToRecipeList(): void {
        const recipeListUrl = this.trimSkill(this.callerId);
        console.log(recipeListUrl);
        if (recipeListUrl.lastIndexOf(environment.moduleMarker) !== -1) {
            // is module recipe
            this.router.navigate(['skillRecipes', 'module', recipeListUrl]);
        } else {
            // is subSystem recipe
            this.router.navigate(['skillRecipes', 'subSystem', recipeListUrl]);
        }
    }

    trimSkill(url: string): string {
        if (url.lastIndexOf(environment.skillMarker) !== -1) {
            url = url.substring(0, url.lastIndexOf(environment.paramSeparator + environment.skillMarker));
        }
        return url;
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

    getProductsFromCompositeSkills(subSystemSkills: Skill[]) {
        var s : number;
        if (subSystemSkills)
        {
            for (s = 0; s < subSystemSkills.length; s++)
            {
                if (subSystemSkills[s].skType == "COMPOSITE")
                {
                    var z : number;
                    if (subSystemSkills[s].skillRequirements)
                    {
                        var tmpP : Product;
                        tmpP = new Product();
                        tmpP.description = subSystemSkills[s].name;
                        tmpP.name = tmpP.description;

                        var compositeSkillsReqs : SkillRequirement[];
                        compositeSkillsReqs = new Array(0);
                                                                
                        for (z = 0; z < subSystemSkills[s].skillRequirements.length; z++)
                            compositeSkillsReqs.push(subSystemSkills[s].skillRequirements[z]);

                        tmpP.skillRequirements = compositeSkillsReqs;   // new Array(0);

                        console.log("tmpP: " + JSON.stringify(tmpP));
                            
                        this.avaibleProducts.push(tmpP);
                            
                    }
                }
            }
        }
    }

    OLD_getProductsFromCompositeRecipes(subSystemFullRecipesList: Recipe[]) {
        var s : number;
        if (subSystemFullRecipesList)
        {
            for (s = 0; s < subSystemFullRecipesList.length; s++)
            {
                if (subSystemFullRecipesList[s].skill && subSystemFullRecipesList[s].skill.skType == "COMPOSITE")
                {
                    let currentSkill = subSystemFullRecipesList[s].skill;

                    var z : number;
                    if (currentSkill.skillRequirements)
                    {
                        var tmpP : Product;
                        tmpP = new Product();
                        // tmpP.description = currentSkill.name;
                        tmpP.description = subSystemFullRecipesList[s].name;
                        tmpP.name = tmpP.description;

                        var compositeSkillsReqs : SkillRequirement[];
                        compositeSkillsReqs = new Array(0);
                                                                
                        for (z = 0; z < currentSkill.skillRequirements.length; z++)
                            compositeSkillsReqs.push(currentSkill.skillRequirements[z]);

                        tmpP.skillRequirements = compositeSkillsReqs;   // new Array(0);

                        console.log("current tmpP: " + JSON.stringify(tmpP));
                            
                        this.avaibleProducts.push(tmpP);
                            
                    }
                }
            }
        }
    }

    getProductsFromCompositeRecipes(subSystemFullRecipesList: Recipe[]) {
        var s : number;
        if (subSystemFullRecipesList)
        {
            for (s = 0; s < subSystemFullRecipesList.length; s++)
            {
                if (subSystemFullRecipesList[s].skill && subSystemFullRecipesList[s].skill.skType == "COMPOSITE")
                {
                    if (subSystemFullRecipesList[s].skill.uniqueId == this.callerSkill.uniqueId)
                        continue;
                    
                    let currentSkillRequirements = subSystemFullRecipesList[s].skillRequirements;

                    var z : number;
                    if (currentSkillRequirements)
                    {
                        var tmpP : Product;
                        tmpP = new Product();
                        // tmpP.description = currentSkill.name;
                        tmpP.description = subSystemFullRecipesList[s].name;
                        tmpP.name = tmpP.description;

                        var compositeSkillsReqs : SkillRequirement[];
                        compositeSkillsReqs = new Array(0);
                                                                
                        for (z = 0; z < currentSkillRequirements.length; z++)
                            compositeSkillsReqs.push(currentSkillRequirements[z]);

                        tmpP.skillRequirements = compositeSkillsReqs;   // new Array(0);

                        console.log("current tmpP: " + JSON.stringify(tmpP));
                            
                        this.avaibleProducts.push(tmpP);
                            
                    }
                }
            }
        }
    }
}
