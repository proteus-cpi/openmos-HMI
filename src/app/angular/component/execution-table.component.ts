import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';

import 'rxjs/add/operator/switchMap';

import { ExecutionTableService } from '../service/execution-table.service';
import { SubSystemService } from '../service/sub-system.service';
import { ProductService } from '../service/product.service';

import { ExecutionTable } from '../Data/execution-table';
import { ExecutionTableRow } from '../Data/execution-table-row';
import { ExecutionTableRowHelper } from '../Data/execution-table-row-helper';
import { Product } from '../Data/product';
import { Recipe } from '../Data/recipe';
import { SubSystem } from "../Data/sub-system";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';
import { ObjectPrettyPritterComponent  } from './object-pretty-printer.component';
import { ProductInstance } from '../Data/product-instance';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'execution-table',
    templateUrl: '../component_html/execution-table.component.html'
})

export class ExecutionTableComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() showLinkPage: boolean = false;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
    private subSystemId = '-1';

    executionTableRowHelper: ExecutionTableRowHelper;
    executionTable: ExecutionTable;
    preUpdateExecutionTable: ExecutionTable;
    executionTableRows: ExecutionTableRow[];

    avaibleProducts: Product[];
    avaibleProductsInstances: ProductInstance[];
    
    // avaibleRecepies = new Array<Recipe>(0);
    avaibleRecepies: Recipe[];
    fullRecipesList : Recipe[];    

    isEditing = false;
    addRow: boolean;

    newRowIndex: number;
    subSystemStageInRampup: boolean = false;

    constructor(private executionTableService: ExecutionTableService,
        private route: ActivatedRoute,
        private router: Router,
        private subSystemService: SubSystemService,
        private productService: ProductService) {
            super();
        }

    ngOnInit(): void {
        // console.log('ngOnInit: ' + this.callerId);
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

        this.subSystemId = this.getPrintableSubSystemId(this.callerId);
        super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);

        this.callerIdToBePrinted = this.subSystemId;
        this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);

        this.productService
            .getProductsList()
            .then(
                response => {
                    this.avaibleProducts = response;

                    var fullSubSystemsList : SubSystem[];
                    this.fullRecipesList = new Array();
                    var singleRecipesList : Recipe[];
                    this.subSystemService.getSubSystemList()
                    .then(response => {
                        // console.log('Length: ' + response.length);
                        fullSubSystemsList = response;

                        for (var zz = 0; zz < fullSubSystemsList.length; zz++)
                        {
                            this.subSystemService
                            .getSubSystemRecipes(fullSubSystemsList[zz].uniqueId)
                            .then(resp => {
                                    singleRecipesList = resp;

                                    for (var zzz = 0; zzz < singleRecipesList.length; zzz++)
                                        this.fullRecipesList.push(singleRecipesList[zzz]);
                                    
                            });
                        }
                            

                    this.subSystemService
                    .getSubSystemRecipes(this.subSystemId)
                    .then(resp => {
                            this.avaibleRecepies = resp;

                            this.productService
                            .getProductsInstancesList().then (rsp => {

                                // this.avaibleProductsInstances = rsp;
                                var tmpAvaibleProductsInstances: ProductInstance[];
                                this.avaibleProductsInstances = new Array();

                                tmpAvaibleProductsInstances = rsp;
                                console.log("tmpAvaibleProductsInstances; " + JSON.stringify(tmpAvaibleProductsInstances));
                                for (var i = 0; i< tmpAvaibleProductsInstances.length; i++ )
                                {
                                    console.log("tmpAvaibleProductsInstances[i]: " + JSON.stringify(tmpAvaibleProductsInstances[i]));
                                    if (tmpAvaibleProductsInstances[i].uniqueId.indexOf("trg_rcp_") == -1)
                                    {                                        
                                        this.avaibleProductsInstances.push(tmpAvaibleProductsInstances[i]);
                                    }
                                }

                                this.subSystemService
                                .getExecutionTable(this.subSystemId)
                                .then(et => {
                                        this.executionTable = new ExecutionTable(et);
                                        this.setRowsData();


                                        this.subSystemService.getSubSystemStage(this.subSystemId)
                                        .then(st => {
                                            if(st.stage == environment.systemStage_rampup )
                                                this.subSystemStageInRampup = true;
                                            else
                                                this.subSystemStageInRampup = false;

                                        });
                                    }
                                );
                            });
                        }
                    );
                }
            );
                }
            );
    }

    setRowsData(): void {
        for (let i = 0; i < this.executionTable.rows.length; i++) {
// VaG - TO CHECK!!!! 05/11/2018 21:54            this.executionTable.rows[i].setAvaibleRecipes(this.avaibleRecepies);
            this.executionTable.rows[i].setAvaibleRecipes(this.fullRecipesList);
            this.executionTable.rows[i].setProductDetailObject(this.avaibleProducts, this.avaibleProductsInstances);
            this.executionTable.rows[i].setRecipeDetailObject(this.avaibleRecepies);
            this.executionTable.rows[i].setNextRecipeDetailObject(this.fullRecipesList);
        }
    }

    startEditing(): void {
        this.isEditing = true;
        this.addRow = false;
        this.preUpdateExecutionTable = new ExecutionTable(this.executionTable);
    }

    discardModifications(): void {
        this.isEditing = false;
        this.executionTable = new ExecutionTable(this.preUpdateExecutionTable);
        this.setRowsData();
    }

    saveModifications(): void {
        this.executionTableService
            .updateExecutionTable(this.subSystemId, this.executionTable)
            .then(et => {
                this.executionTable = new ExecutionTable(et);
                this.setRowsData();
            });
        this.isEditing = false;
    }

    deleteRow(rowPosition: number): void {
        if (this.executionTable.rows[rowPosition] != null) {
            this.executionTableService
                .deleteRow(this.subSystemId, this.executionTable.rows[rowPosition].uniqueId)
                .then(response => {
                        this.executionTable = new ExecutionTable(response);
                        this.setRowsData();
                    }
                );
        }
    }

    addNewRow(index: number, before: boolean): void {
        // window.alert('N:' + index + ' b: ' + before);
        this.isEditing = false;
        this.addRow = true;
        this.newRowIndex = index;

        this.executionTableRowHelper = new ExecutionTableRowHelper();
        this.executionTableRowHelper.row = new ExecutionTableRow(null);
        // this.executionTableRowHelper.row.setAvaibleRecipes(this.avaibleRecepies);
        this.executionTableRowHelper.row.setAvaibleRecipes(this.fullRecipesList);
        this.executionTableRowHelper.executionTableId = this.executionTable.uniqueId;
        this.executionTableRowHelper.rowPosition = index;
    }

/*insertNewRow */
    checkAndInsertRow(): void {
        /* Getting boolean value from session storage after js control
            for empty fields
         */
        console.log('nrid: ' + this.executionTableRowHelper.row.nextRecipeId);
        // console.log('ANGULAR: ' + sessionStorage.getItem('INSERT_ET_ROW'));
        let insertRow = JSON.parse(sessionStorage.getItem('INSERT_ET_ROW')) as boolean;
        insertRow = insertRow === null || insertRow === undefined ? false : insertRow;
        console.log('After parsing: ' + insertRow);
        if (insertRow) {
            this.insertRow();
        } else {
            // console.error('error during js check or some empty fields');
        }
    }

    insertRow(): void {
        this.executionTableRowHelper.row.uniqueId = super.generateRandomId('rowId');
        console.log("et row to be inserted: " + JSON.stringify(this.executionTableRowHelper));
        this.executionTableService
            .addNewRow(this.subSystemId, this.executionTableRowHelper)
            .then(et => {
                this.executionTable = new ExecutionTable(et);
                this.setRowsData();
            });
        this.addRow = false;
    }

    stopInsertNewRow(): void {
        this.executionTableRowHelper = new ExecutionTableRowHelper();
        this.executionTableRowHelper.row = new ExecutionTableRow(null);
        this.addRow = false;
    }

    duplicateLine(rowIndex: number) {
        this.executionTableRowHelper = new ExecutionTableRowHelper();
        this.executionTableRowHelper.row = new ExecutionTableRow(this.executionTable.rows[rowIndex]);
        this.executionTableRowHelper.rowPosition = rowIndex + 1;
        this.executionTableRowHelper.executionTableId = this.executionTable.uniqueId;

        this.insertRow();
    }

    goToProductDetail(prodId: string) {
        this.router.navigate(['productDetail', prodId]);
    }

    goToRecipeDetails(recipeId: string) {
        this.router.navigate(['skillRecipeView', 'executionTable',
            this.callerId + environment.paramSeparator + environment.recipeMarker + recipeId]);
    }

    goToOrderDetail(productId: string) {
        this.router.navigate(['orderInstance', productId]);
    }
    goToFullPage(): void {
        this.router.navigate(['/executionTable', 'subSystem',
            environment.subSystemMarker + this.subSystemId]);
    }
}
