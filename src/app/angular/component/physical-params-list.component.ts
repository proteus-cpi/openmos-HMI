import { BaseComponent } from "./base.component";
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ModuleService } from "../service/module.service";
import { SubSystemService } from "../service/sub-system.service";
import { Module } from "../Data/module";
import { SubSystem } from "../Data/sub-system";
import { PhysicalAdjustmentParameter } from "../Data/physical-adjustment-parameter";
import { SystemService } from '../service/system.service';
import { SharedDataService } from "../service/shared.data.service";

import { environment } from "../../../environments/environment";

// import { jsonpFactory } from "@angular/http";
declare var $: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'physical-params-list',
    templateUrl: '../component_html/physical-params-list.component.html'
})

export class PhysicalParamsListComponent extends BaseComponent implements OnInit {

    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';
    private activeModule: Module;
    private activeSubSystem: SubSystem;
    //If true this adds a fake PhysicalAdjustmentParameter for testing
    private unitTest = true;

    private listOfParams: PhysicalAdjustmentParameter[];

    private editValue: string;
    private editing = false;
    private editingParam: PhysicalAdjustmentParameter;
    private subSystemId = '-1';

    private currentSystemStage : string;
    private currentUser : string;

    
    constructor(private route: ActivatedRoute,
                private router: Router,
                private moduleService: ModuleService,
                private subSystemService: SubSystemService,
                private sharedDataService: SharedDataService,
                private systemService: SystemService) {
        super();
    }

    ngOnInit(): void {
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

        console.log("physical params list: " + this.callerType);
        console.log("physical params list: " + this.callerId);

        this.subSystemId = this.getPrintableSubSystemId(this.callerId);
        super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);

        this.callerIdToBePrinted = this.subSystemId;
        this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);
        
        switch (this.callerType) {
            case 'module':
                // shouldn't happen
                // callerId is not correct, must have module Id in case
                this.moduleService.getModuleById(this.callerId).then(
                    resp => {
                        this.activeModule = resp;
                        console.log(this.activeModule) || JSON;
                        if (this.activeModule
                            && this.activeModule != null
                            && this.activeModule.physicalAdjustmentParameters 
                            && this.activeModule.physicalAdjustmentParameters != null) {
                                this.listOfParams = this.activeModule.physicalAdjustmentParameters;
                        }
                    }
                );
                break;
            case 'subSystem':
                this.subSystemService.getSubSystemById(this.subSystemId).then(
                    resp => {
                        this.activeSubSystem = resp;
                        console.log(this.activeSubSystem) || JSON;
                        if (this.activeSubSystem
                            && this.activeSubSystem != null
/*                             && this.activeSubSystem.physicalAdjustmentParameters 
                            && this.activeSubSystem.physicalAdjustmentParameters != null
 */                        ) {
                            this.listOfParams = this.activeSubSystem.physicalAdjustmentParameters;

                            if (this.unitTest === true) {
                                if (this.listOfParams === null 
                                    || this.listOfParams === undefined)
                                    {
                                        console.log("lista nulla!!!!")
                                    this.listOfParams = new Array<PhysicalAdjustmentParameter>();
                                }
                                let param = new PhysicalAdjustmentParameter();
                                param.name = 'Test name';
                                param.description = 'test Description';
                                param.defaultValue = '5';
                                param.lowerBound = '1';
                                param.upperBound = '10';
                                param.unit = 'A';
                                // this.listOfParams[0] = param;
                                console.log ("param list length prima : " + this.listOfParams.length);
                                this.listOfParams[this.listOfParams.length] = param;
                                console.log ("param list length dopo : " + this.listOfParams.length);
                    
                                for (var  i = 0; i < this.listOfParams.length; i++)
                                    console.log("list of params " + i + ": " + JSON.stringify(this.listOfParams[i]));
                    
                                // param = null;
                    
                            }
                                                
                        }
                    }
                );
                break;
            default:
        }

        this.checkSystemStage();
    }

    editParamValue(param: PhysicalAdjustmentParameter) {
        // for tests
        // this.activeSubSystem.stage = environment.systemStage_rampup;
        
        console.log("current subsystem " + JSON.stringify(this.activeSubSystem));
        console.log("subsystem stage now is " + this.activeSubSystem.stage);
        if (this.activeSubSystem.stage !== undefined 
            && this.activeSubSystem.stage === environment.systemStage_rampup )
        {
            this.editValue = param.defaultValue;
            this.editingParam = param;
            this.editing = true;
        }   
        else
            $("#rampUpWarningMessage").modal('show');        
    }

    checkSystemStage(): void {
        this.systemService
            .getSystemStage()
            .then(
                response => this.currentSystemStage = response.stage
            );
    }    

    confirmEdit() {
        /////
        this.sharedDataService.userInfo
            .subscribe( userInfo => {
                this.currentUser = userInfo;
                console.log('add-physical-adjustment, User info changed to: ' + this.currentUser);
            });        
        /////
        
        switch (this.callerType) {
            case 'module':
                // shouldnt happen
                this.moduleService.sendPhysicalAdjustment(this.activeModule, this.editingParam, this.editValue).then(
                    resp => {
                        if (resp === true) {
                            this.editingParam.defaultValue = this.editValue;
                            this.cancelEdit();
                        } else {
                            this.cancelEdit();
                        }
                    }
                ).catch(error => {
                    this.cancelEdit();
                });
                break;
            case 'subSystem':
                this.subSystemService.sendPhysicalAdjustment(this.activeSubSystem, 
                    this.currentSystemStage,
                    this.currentUser,
                    this.editingParam, 
                    this.editValue).then(
                    resp => {
                        if (resp === true) {
                            this.editingParam.defaultValue = this.editValue;
                            this.cancelEdit();
                        } else {
                            this.cancelEdit();
                        }
                    }
                ).catch(error => {
                    this.cancelEdit();
                });
                break;
            default:
        }
    }

    cancelEdit() {
        this.editing = false;
        this.editValue = undefined;
        this.editingParam = undefined;
    }

}
