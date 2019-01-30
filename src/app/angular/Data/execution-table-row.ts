import { Recipe } from './recipe';
import { Product } from './product';
import { ProductInstance } from './product-instance';

export class ExecutionTableRow {
    uniqueId: string;
    productId: string;
    recipeId: string;
    // nextRecipeIdPath: string;
    possibleRecipeChoices: string[];
    nextRecipeId: string;

    // Attributes not present on REST services
    // used only for HMI
    avaibleNextRecipe: Recipe[];
    productDetailObject: Product;
    productInstanceDetailObject: ProductInstance;
    recipeDetailObject: Recipe;
    nextRecipeObject: Recipe;


    constructor(row: ExecutionTableRow) {
        console.log("current et row: " + JSON.stringify(row));

        if (row !== null) {
            this.uniqueId = row.uniqueId;
            this.productId = row.productId;
            this.recipeId = row.recipeId;
            this.nextRecipeId = row.nextRecipeId;
//            this.nextRecipeIdPath = row.nextRecipeIdPath;
            this.possibleRecipeChoices = row.possibleRecipeChoices;
        } else {
            this.uniqueId = '';
            this.productId = '';
            this.recipeId = '';
            this.nextRecipeId = '';
        }
    }

    public setAvaibleRecipes(allRecipes: Recipe[]): void {
        const recipeIdPos = this.getRecipeFromArray(allRecipes);

        this.avaibleNextRecipe = new Array(allRecipes.length);
        this.avaibleNextRecipe = allRecipes.concat();
        if (recipeIdPos !== -1) {
            this.avaibleNextRecipe.splice(recipeIdPos, 1);
        }
    }

    public setRecipeDetailObject(allRecipes: Recipe[]): void {
        const recipeIndex = this.getRecipeObjectFromArray(this.recipeId, allRecipes);
        if (recipeIndex !== -1) {
            this.recipeDetailObject = allRecipes[recipeIndex];
        }

        // VaG - 06/11/2018
/*
        allRecipes.forEach(element => {
//            if (element.uniqueId === this.nextRecipeIdPath) {
            if (element.uniqueId === this.nextRecipeId) {
                console.log("setRecipeDetailObject -> this.nextRecipeObject: " + this.nextRecipeObject);
                this.nextRecipeObject = element;
            }
        });
*/        
    }

    // VaG - 06/11/2018
    public setNextRecipeDetailObject(allRecipes: Recipe[]): void {
        const recipeIndex = this.getRecipeObjectFromArray(this.nextRecipeId, allRecipes);
//        const recipeIndex = this.getRecipeFromArray(allRecipes);
        if (recipeIndex !== -1) {
            this.nextRecipeObject = allRecipes[recipeIndex];
        }

        // VaG - 06/11/2018
/*
        allRecipes.forEach(element => {
//            if (element.uniqueId === this.nextRecipeIdPath) {
            if (element.uniqueId === this.nextRecipeId) {
                console.log("setRecipeDetailObject -> this.nextRecipeObject: " + this.nextRecipeObject);
                this.nextRecipeObject = element;
            }
        });
*/
    }

    public setProductDetailObject(allProducts: Product[], allProductInstances: ProductInstance[]): void {
        if (allProducts === null)
            return;
        if (allProductInstances === null)
            return;

        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].uniqueId === this.productId) {
                this.productDetailObject = allProducts[i];
                return;
            }
        }
        for (let i = 0; i < allProductInstances.length; i++) {
            if (allProductInstances[i].uniqueId === this.productId) {
                this.productInstanceDetailObject = allProductInstances[i];
                return;
            }
        }
    }

    public onChangeRecipeId(newRecipe: any) {
        const newRecipeIndex = this.getRecipeFromArray(this.avaibleNextRecipe);
        /*if (this.nextRecipeIdPath === null
            || this.nextRecipeIdPath === ''
            || newRecipe === this.nextRecipeIdPath
            || newRecipeIndex !== -1) {*/
        if (this.nextRecipeId === null
                || this.nextRecipeId === ''
                || newRecipe === this.nextRecipeId
                || newRecipeIndex !== -1) {
            if (newRecipeIndex !== -1) {
//                this.nextRecipeIdPath = this.nextRecipeIdPath === '' ? '' : this.nextRecipeIdPath;
                this.nextRecipeId = this.nextRecipeId === '' ? '' : this.nextRecipeId;
                if (this.recipeDetailObject !== undefined
                    && this.recipeDetailObject !== null) {
                    this.avaibleNextRecipe.push(this.recipeDetailObject);
                }
                this.recipeDetailObject = this.avaibleNextRecipe[newRecipeIndex];
                this.avaibleNextRecipe.splice(newRecipeIndex, 1);
            }
        }
    }

    public onChangeNextRecipeId(newNextRecipeId: string) {
        this.avaibleNextRecipe.forEach(element => {
            if (element.uniqueId === newNextRecipeId) {
                this.nextRecipeObject = element;
            }
        });
        // console.log(this.nextRecipeObject);
    }

    onInsertNewRow(newRecipe: any) {
//        if (this.nextRecipeIdPath === undefined) {
        if (this.nextRecipeId === undefined) {
            const recipeIndex = this.getRecipeFromArray(this.avaibleNextRecipe);
            if (recipeIndex !== -1) {
                this.recipeDetailObject = this.avaibleNextRecipe[recipeIndex];
                this.avaibleNextRecipe.splice(recipeIndex, 1);
            }
        } else {
            this.onChangeRecipeId(newRecipe);
        }
    }

    private getRecipeFromArray(recipes: Recipe[]): number {
        let recipeIdPos = -1;
        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i].uniqueId === this.recipeId) {
                recipeIdPos = i;
            }
        }
        return recipeIdPos;
    }

    private getRecipeObjectFromArray(recipeId : String, recipes: Recipe[]): number {
        let recipeIdPos = -1;
        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i].uniqueId === recipeId) {
                recipeIdPos = i;
            }
        }
        return recipeIdPos;
    }
}
