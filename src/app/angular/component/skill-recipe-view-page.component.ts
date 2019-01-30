import { Component, Input, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import * as $ from 'jquery';

import 'rxjs/add/operator/switchMap';

import { RecipesService } from '../service/recipe.service';
import { SubSystemService } from '../service/sub-system.service';
import { ProductService } from '../service/product.service';
import { TriggeredService } from "../service/triggered-service";
import { SharedDataService  } from "../service/shared.data.service";

import { Recipe } from '../data/recipe';
import { Skill } from "../data/skill";
import { KPISetting } from './../Data/kpi-setting';
import { ParameterSetting } from './../Data/parameter-setting';
import { SkillRequirement } from '../data/skill-requirement';
import { Product } from '../Data/product';
import { environment } from '../../../environments/environment';

import { BaseComponent } from './base.component';

import { TriggeredRecipe } from '../Data/triggered_recipe';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'skill-recipe-view-page',
    templateUrl: '../component_html/skill-recipe-view-page.component.html'
})
 
// export class SkillRecipeViewPageComponent implements OnInit {
export class SkillRecipeViewPageComponent extends BaseComponent implements OnInit {
    private recipe: Recipe;

    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';
    // private showSelector = [true, true, true, true, true, false];
    private showSelector = [true, true, true, true, true, false, false, false];
    private toNotShowDiv = 3;
    private skillRequirement: Map<number, SkillRequirement>;

    private isEditingSkillReq = false;
    private isEditingKpiSetting = false;
    private isEditingParameterSetting = false;
    private isEditingProperties = false;

    private avaibleProducts: Product[];
    public traceSkReqCountPerProduct: number[];
    private selectedSkillReq: boolean[];

    // edit recipe chance 2 - begin
    // private avaibleProducts: Product[];
    private tmpAvailableProducts : Product[];
    // private availableRecipes : Recipe[];

    private skillRequirementsIndexsMap: Map<number, SkillRequirement>;
    private selectedSkillRequirements: boolean[];
    private newSelectedSkillRequirements: boolean[][];
    // edit recipe chance 2 - end

    private kpiSettBeforeUpdate: KPISetting[];
    private paramSettBeforeUpdate: ParameterSetting[];
    private nameBeforeUpdate: string;
    private descriptionBeforeUpdate: string;
    private validBeforeUpdate: boolean;

    public errorMessage : string;
    public triggerResponse : string;
    public wasTriggered = false;    
    public wasTriggeredSuccessfully = false;
    public showTriggerDetail: boolean;
    public selectedTriggerProd: string;


    private productInstanceId: string;
    private currentUserName : string;

    private availableRecipes : Recipe[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipesService,
        private subSystemService: SubSystemService,
        private triggeredService: TriggeredService,
        private sharedDataServce: SharedDataService,
        private productService: ProductService) 
        {
            super();
         }

    ngOnInit(): void {
        this.initializeData();
    }

    private cleanErrorMessage()
    {
        this.errorMessage = "";
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

        // console.log('recipe detail: callerType = ' + this.callerType);
        console.log('recipe detail: callerId = ' + this.callerId);

        this.recipeService
            .getRecipeDetail(this.callerId)
            .then(
                response => {
                    this.recipe = response;

                    console.log("RECIPE: " + JSON.stringify(response));

                    this.sharedDataServce.userInfo
                    .subscribe( userInfo => {
                        this.currentUserName = userInfo;
                        console.log('triggering recipe, user name: ' + this.currentUserName);

                        var subSystemId = this.getPrintableSubSystemId(this.callerId);

                        // done again few lines later
/*                         this.subSystemService
                        .getSubSystemAllRecipes(subSystemId)
                        .then(resp => {
                                this.availableRecipes = resp;
                                console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));        
                            }
                        );                            
 */
                        // recipe editing chance 2 - begin
                        this.avaibleProducts = new Array(0);
                        this.traceSkReqCountPerProduct = new Array(0);

                        this.productService
                            .getProductsList()
                            .then(response => {
                                console.log("available products: " + JSON.stringify(response));
    
                                this.tmpAvailableProducts = response;
                                var i:number;
                                for (i = 0; i < this.tmpAvailableProducts.length; i++)
                                {
                                    this.avaibleProducts.push(this.tmpAvailableProducts[i]);
                                    this.traceSkReqCountPerProduct.push(0);
                                }
    
                                // COMPOSITE SKILLS 
                                /////////////////////////                                
                                this.subSystemService
                                .getSubSystemSkills(/* this.subSystemId*/ subSystemId)
                                .then(response => {
                                    var subSystemSkills : Skill[];
                                    subSystemSkills = response;
                                    console.log("subsystem skills: " + JSON.stringify(subSystemSkills));

                                    // VaG - 21/01/2019
                                    // NO MORE products from composite skills
                                    // BUUUUUT products from composite recipes
                                    // this.getProductsFromCompositeSkills(subSystemSkills);
                                    
                                    this.subSystemService
                                    .getSubSystemAllRecipes(/* this.subSystemId */ subSystemId)
                                    .then(resp => {
                                            this.availableRecipes = resp;
                                            console.log("availableRecipes: " + JSON.stringify(this.availableRecipes));
            
                                            // VaG - 21/01/2019
                                            // NO MORE products from composite skills
                                            // BUUUUUT products from composite recipes
                                            this.getProductsFromCompositeRecipes(this.availableRecipes);

                                            // this.startSkillReq();
                                            this.startSkillRequirements();
                                        }
                                    );                            
            
                                    this.startSkillReqForComposite();
                                    
                                    }                            
                                );
                                // recipe editing chance 2 - end
                                }
                            );
                            }
                        );
                        }
                    );
                    }

    changeView(index: number, value: any): void {
        this.cleanErrorMessage();

        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = false;
        }
        this.showSelector[index] = true;

        this.isEditingKpiSetting =
        this.isEditingParameterSetting =
        this.isEditingSkillReq =
        this.isEditingProperties =
        this.showTriggerDetail
        = false;
    }

    showAllProperties(): void {
        this.cleanErrorMessage();

        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = i < this.showSelector.length - this.toNotShowDiv;
        }
        // this.showSelector[this.showSelector.length - 1] = false;
        // this.showSelector[this.showSelector.length - 2] = false;
    }

    startSkillRequirements(): void {
        this.skillRequirementsIndexsMap = new Map<number, SkillRequirement>();

        const arraySkillReqLength = this.getTotalSkillReq(0);

        this.selectedSkillRequirements = new Array<boolean>(arraySkillReqLength);
        // this.newSelectedSkillRequirements = new Array(0)(0);
        this.newSelectedSkillRequirements = []; // new Array<boolean>(this.avaibleProducts.length);
        for (let i = 0; i < this.avaibleProducts.length; i++)
            this.newSelectedSkillRequirements[i] = [];

        this.setFalse();
        console.log("traceSkReqCountPerProduct: " + this.traceSkReqCountPerProduct);

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

        console.log("avaibleProducts = " + this.avaibleProducts.length);

    }

    OLD_startSkillRequirements(): void {
        this.cleanErrorMessage();

        this.skillRequirement = new Map<number, SkillRequirement>();
        const totalSkillReq = this.getTotalSkillReq(0);

        let maxSkillRequirement = this.recipe.skillRequirements !== null && this.recipe.skillRequirements !== undefined ?
            this.recipe.skillRequirements.length
            : 0;
        // console.log('MAX: ' + maxSkillRequirement);

        this.selectedSkillReq = new Array<boolean>(totalSkillReq);
        this.setFalse();

        let productIndex = 0, skillRequirementIndex = 0, skillRequirementCounter = 0;
        while (productIndex < this.avaibleProducts.length && skillRequirementCounter <= totalSkillReq) {
            skillRequirementIndex = 0;
            while (skillRequirementIndex < this.avaibleProducts[productIndex].skillRequirements.length) {
                const skillReq = this.getSkillReq(productIndex, skillRequirementIndex);
                this.skillRequirement.set(skillRequirementCounter, skillReq);
                skillRequirementIndex++;
                if (this.checkIfIsSelected(skillReq) && maxSkillRequirement > 0) {
                    // console.log('selected');
                    this.selectedSkillReq[skillRequirementCounter] = true;
                    maxSkillRequirement--;
                }
                skillRequirementCounter++;
            }
            productIndex++;
        }
        // console.log(this.selectedSkillReq);
        // console.log(skillRequirementCounter);
    }

    checkIfIsSelected(skillRequirement: SkillRequirement): boolean {
        this.cleanErrorMessage();

        for (let i = 0; i < this.recipe.skillRequirements.length; i++) {
            if (this.recipe.skillRequirements[i].uniqueId === skillRequirement.uniqueId) {
                // console.log('return true');
                return true;
            }
        }
        // console.log('return false');
        return false;
    }

    OLD_getSkillReq(indexProd: number, indexSReq): SkillRequirement {
        this.cleanErrorMessage();

        return this.avaibleProducts[indexProd].skillRequirements[indexSReq];
     }
     getSkillReq(indexProd: number, indexSReq): SkillRequirement {
        return this.avaibleProducts[indexProd].skillRequirements[indexSReq];
     }
 

     OLD_getTotalSkillReq(index: number): number {
        this.cleanErrorMessage();

        return index < this.avaibleProducts.length ?
            this.avaibleProducts[index].skillRequirements.length + this.getTotalSkillReq(index + 1)
            : 0;
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

    OLD_setFalse(): void {
        this.cleanErrorMessage();

        for (let i = 0; i < this.selectedSkillReq.length; i++) {
            this.selectedSkillReq[i] = false;
        }
    }
    setFalse(): void {
        for (let i = 0; i < this.selectedSkillRequirements.length; i++) {
            this.selectedSkillRequirements[i] = false;
        }
        for (let i = 0; i < this.avaibleProducts.length; i++)
            for (let j = 0; j < this.avaibleProducts[i].skillRequirements.length; j++)
            {
                var found : boolean = false;
                if (this.recipe.fulfilledSkillRequirements && this.recipe.fulfilledSkillRequirements.length > 0)
                {
                    console.log("abbiamo fulfilledskreqs");
                    for (var z = 0; z < this.recipe.fulfilledSkillRequirements.length; z++)
                    {
                        console.log("fulfilledskreq: " + this.recipe.fulfilledSkillRequirements[z].uniqueId);
                        console.log("comparo con " + this.avaibleProducts[i].skillRequirements[j].uniqueId);
                        if (this.recipe.fulfilledSkillRequirements[z].uniqueId == this.avaibleProducts[i].skillRequirements[j].uniqueId)
                        {
                            console.log("trovato");
                            found = true;
                            ++this.traceSkReqCountPerProduct[i];
                            break;
                        }
                    }
                }
                // this.newSelectedSkillRequirements[i][j] = false;
                this.newSelectedSkillRequirements[i][j] = found;
            }
    }


    editSkillReq(): void {
        this.cleanErrorMessage();

        this.isEditingSkillReq = true;
        // $('.hidden-tr').removeClass('hidden-tr');
    }

    saveModification(): void {
        this.cleanErrorMessage();

        this.isEditingSkillReq = false;

/* OLD CODE         this.recipe.skillRequirements = new Array<SkillRequirement>();
        for (let i = 0; i < this.selectedSkillReq.length; i++) {
            if (this.selectedSkillReq[i]) {
                this.recipe.skillRequirements.push(this.skillRequirement.get(i));
            }
        }
 */
/* NEW CODE */
if (this.recipe.skill.skType === 'COMPOSITE' 
&& this.loadRecipeForSkillReq()) {
console.log("ERRORE")
return;
}
this.loadSkillRequirements();
/* NEW CODE END */



        /* this.recipe.skillRequirements.forEach(element => {
            console.log(element.name);
        }); */

        // console.log('TYPE: ' + this.recipe.kpiSettings[0].type);
        console.log(JSON.stringify(this.recipe));

        // console.log('');

        this.recipeService
            .updateRecipe(this.callerId, this.recipe)
            .then(
                response => {
                    this.recipe = response;
                }
            );

        this.isEditingKpiSetting =
        this.isEditingParameterSetting =
        this.isEditingSkillReq =
        this.isEditingProperties
        = false;
    }

    cancelModification(): void {
        this.cleanErrorMessage();

        this.isEditingSkillReq = false;
    }

    editKpiSetting(isStarting: boolean): void {
        this.cleanErrorMessage();

        this.isEditingKpiSetting = isStarting;
        if (!isStarting) {
            this.saveModification();
        } else {
            this.createBackupKpiSett();
        }
    }

    cancelKpiSettModification(): void {
        this.cleanErrorMessage();

        this.isEditingKpiSetting = false;
        this.recipe.kpiSettings = this.kpiSettBeforeUpdate.slice();
    }

    editParamSetting(isStarting: boolean): void {
        this.cleanErrorMessage();

        this.isEditingParameterSetting = isStarting;
        if (!isStarting) {
            this.saveModification();
        } else {
            this.createBackupParamSett();
        }
    }

    cancelParameterSettingModification(): void {
        this.cleanErrorMessage();

        this.isEditingParameterSetting = false;
    }

    createBackupKpiSett(): void {
        this.cleanErrorMessage();

        this.kpiSettBeforeUpdate = new Array<KPISetting>();
        for (let i = 0; i < this.recipe.kpiSettings.length; i++) {
            const kpiSettToInsert = new KPISetting(this.recipe.kpiSettings[i]);
            this.kpiSettBeforeUpdate.push(kpiSettToInsert);
        }
    }

    createBackupParamSett(): void {
        this.cleanErrorMessage();

        this.paramSettBeforeUpdate = new Array<ParameterSetting>();
        for (let i = 0; i < this.recipe.parameterSettings.length; i++) {
            const paramSettToInsert = new ParameterSetting(this.recipe.parameterSettings[i]);
            this.paramSettBeforeUpdate.push(paramSettToInsert);
        }
    }

    editProperties(isStarting: boolean): void {
        this.cleanErrorMessage();

        this.isEditingProperties = isStarting;
        if (!isStarting) {
            this.saveModification();
        } else {
            this.createBackupProperties();
        }
    }

    createBackupProperties(): void {
        this.cleanErrorMessage();

        this.nameBeforeUpdate = this.recipe.name;
        this.descriptionBeforeUpdate = this.recipe.description;
        this.validBeforeUpdate = this.recipe.valid;
    }

    cancelPropertiesModifications(): void {
        this.cleanErrorMessage();

        this.recipe.name = this.nameBeforeUpdate;
        this.recipe.description = this.descriptionBeforeUpdate;
        this.recipe.valid = this.validBeforeUpdate;
        this.isEditingProperties = false;
    }

    triggeringResults(): void {
        this.changeView(6, "dunno");
        // this.router.navigate(['/recipeExecutionData', 'trg_recipe', this.recipe.uniqueId, this.productInstanceId]);
    }

    goToGraph(): void {
        this.cleanErrorMessage();

//        this.router.navigate(['http://localhost:4201/recipeExecutionData', this.recipe.uniqueId]);
        this.router.navigate(['/recipeExecutionData', this.recipe.uniqueId]);
    }

    /*
    OLD_triggerThisRecipe(): void {
        this.cleanErrorMessage();

        this.recipeService
            .trigger(this.recipe.uniqueId)
            .then(
                response => {
                    this.triggerResponse = response;

                    console.log(JSON.stringify(this.triggerResponse));

                    // stamparlo in pagina

                }
            )
            .catch(error => {
                console.log("error -> " + error);
                this.handleError(error)
            });
    }
    */
    triggerThisRecipe(): void {
        this.cleanErrorMessage();

        // var productInstanceId : string;
        this.productInstanceId = super.generateRandomId('trg_rcp_' + this.recipe.uniqueId + "_trg_prodinst_" + this.getFormattedDate(new Date()) + "_");
        console.log("triggering recipe " + this.recipe.uniqueId + " with this product instance id: " + this.productInstanceId);

        if (document.getElementById("loader-container") !== null) {
            document.getElementById("loader-container").style.display = 'inline-block';
        }

        this.recipeService
            .trigger(this.recipe.uniqueId, this.productInstanceId)
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
                    var triggeredRecipe = new TriggeredRecipe();

                    triggeredRecipe.productInstanceId = this.productInstanceId;
                    triggeredRecipe.recipeId = this.recipe.uniqueId;

                    triggeredRecipe.uniqueId = triggeredRecipe.recipeId + "___" + triggeredRecipe.productInstanceId;

                    triggeredRecipe.userName = this.currentUserName;

                    triggeredRecipe.successfully = this.wasTriggeredSuccessfully;
                    /*
                    this.sharedDataServce.userInfo
                    .subscribe( userInfo => {
                        triggeredSkill.userName = userInfo;
                        console.log('triggered skill, user name: ' + triggeredSkill.userName);
                    });
                    */
                   triggeredRecipe.registered = new Date();

                    this.triggeredService
                        .insertNewTriggeredRecipe(triggeredRecipe)
                        .then(
                            response => {
                                console.log('triggered recipe log info: ' + JSON.stringify(response));
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

    onTriggerDetail(triggeredRecipe: any) {
        this.showTriggerDetail = true;
        this.selectedTriggerProd = triggeredRecipe.productInstanceId;
    }

    handleError(error: any) {
        console.error('ERRORE LETTURA RECIPES handleError -> ', error);
        this.errorMessage = error;
    }

    getFormattedDate(dt : Date) : string
    {
        var myDay="";
        if ((""+dt.getDate()).length == 1)
            myDay = "0"; 
        var myMonth="";
        if ((""+((dt.getMonth() + 1))).length == 1)
            myMonth = "0";
        var myHour="";
        if ((""+dt.getHours()).length == 1)
            myHour = "0"; 
        var myMinute="";
        if ((""+dt.getMinutes()).length == 1)
            myMinute = "0"; 
        var mySecond="";
        if ((""+dt.getSeconds()).length == 1)
            mySecond = "0"; 
        var myMillisecond="";
        if ((""+dt.getMilliseconds()).length == 1)
            myMillisecond = "00"; 
        else if ((""+dt.getMilliseconds()).length == 2)
            myMillisecond = "0";                     
            
        var formattedDt = dt.getFullYear() + "-" + 
            myMonth + (dt.getMonth()+1)+'-'+
            myDay + dt.getDate()+'-'+
            myHour + dt.getHours()+"-"+
            myMinute + dt.getMinutes()+"-"+
            mySecond + dt.getSeconds()+"-"+
            myMillisecond + dt.getMilliseconds();

        console.log("formatted date = " + formattedDt);

        return formattedDt;
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

    onChangeRecipe(element: any, sk: SkillRequirement): void {
        if (sk.isError && element.srcElement.checked == true) {
            sk.isError = false;
        }       
    }

    startSkillReqForComposite(): void {
        if (this.recipe.skill.skType === 'COMPOSITE') {
            this.recipe.skillRequirements.forEach(element => {
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

    updateTraceSkReqCountPerProduct()
    {
        for (var q = 0; q < this.newSelectedSkillRequirements.length; q++)
        {
            this.traceSkReqCountPerProduct[q] = 0;
            for (var k = 0; k < this.newSelectedSkillRequirements[q].length; k++)
            {
                if (this.newSelectedSkillRequirements[q][k])
                    this.traceSkReqCountPerProduct[q]++;
            }
        }
        console.log("traceSkReqCountPerProduct: " + this.traceSkReqCountPerProduct);
    }

    loadRecipeForSkillReq(): boolean {
        // return true if there is some skill req without any recipe id selected
        var isErrors = false;
        this.recipe.skillRequirements.forEach(skillReq => {            
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
            this.recipe.skillRequirements.forEach(skillReq => {
                delete skillReq.selectedRecipesIds;
                delete skillReq.isError;
            });
        }
        
        return isErrors;
    }

    loadSkillRequirements(): void {
        var z : number = 0;
        this.recipe.fulfilledSkillRequirements = new Array(0);

        for (let i = 0; i < this.avaibleProducts.length; i++) {
            for (let j = 0; j < this.avaibleProducts[i].skillRequirements.length; j++) {
//                .skillRequirements
                if (this.newSelectedSkillRequirements[i][j]) {
                this.recipe
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

    getProductsFromCompositeSkills(subSystemSkills: Skill[]): void {
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
                        this.traceSkReqCountPerProduct.push(0);
                            
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
                        this.traceSkReqCountPerProduct.push(0);                            
                    }
                }
            }
        }
    }
}   
