import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ProcessAssessmentService } from './../service/process-assessment-service';
//import { SubSystemService } from './../service/sub-system.service';

import { environment } from './../../../environments/environment';
import { BaseComponent } from './base.component';
import { ProcessAssessment } from './../Data/process-assessment';
import { ProcessAssessmentRow } from './../Data/process-assessment-row';
import { SharedDataService } from '../service/shared.data.service';
import { SystemService } from '../service/system.service';
//import { EquipmentObservation } from './../Data/equipment-observation';

@Component({
    selector: 'add-process-assessment',
    templateUrl: '../component_html/add-process-assessment-page.component.html'
})

export class AddProcessAssessmentPageComponent extends BaseComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';

    private processAssessment: ProcessAssessment;
    private mainTypes = environment.observationMainType;

    private showInsertForm = true;

    ///// assessment with Observation
//    private observation: EquipmentObservation;

    constructor(private router: Router,
        private route: ActivatedRoute,
//        private subSystemService: SubSystemService,
        private processAssessmentService: ProcessAssessmentService,
        private sharedDataServce: SharedDataService,
        private systemService: SystemService) {
            super();
    }

    ngOnInit(): void {
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
        console.log("this.callerType = " + this.callerType);
        console.log("this.callerId = " + this.callerId);

        if (this.callerType == 'skillRecipeView')
        {
            this.callerTypeToBePrinted = "recipe";  // this.callerType;
            this.callerIdToBePrinted = super.getPrintableRecipeId(this.callerId);
        }
        else if (this.callerType == 'skillDetail')
        {
            this.callerTypeToBePrinted = "skill";  // this.callerType;
            this.callerIdToBePrinted = super.getPrintableSkillId(this.callerId);
        }

        this.startProcessAssessmentData();
    }

    checkSystemStage(): void {
        // this.systemStatus = this.systemService.getSystemStatus();
        this.systemService
            .getSystemStage()
            .then(
                response => this.processAssessment.systemStage = response.stage
            );
    }

    public startProcessAssessmentData(): void {
        this.processAssessment = new ProcessAssessment();
        this.checkSystemStage();
        this.sharedDataServce.userInfo
            .subscribe( userInfo => {
                this.processAssessment.userName = userInfo;
                console.log('add-process-assessment, User info changed to: ' + this.processAssessment.userName);
            });
        this.processAssessment.registered = new Date();
        this.processAssessment.uniqueId = super.generateRandomId('processAssessment');
        this.processAssessment.name = 'New process assessment from HMI';
        this.processAssessment.description = 'New process assessment upload from HMI';

//        this.processAssessment.recipeId = super.getPrintableRecipeId(this.callerId);
        if (this.callerType == 'skillRecipeView')
        {
            this.processAssessment.recipeId = super.getPrintableRecipeId(this.callerId);
            this.processAssessment.skillId = null;
        } else if (this.callerType == 'skillDetail')
        {
            this.processAssessment.skillId = super.getPrintableSkillId(this.callerId);
            this.processAssessment.recipeId = null;
        } 

        // with rows objects
        this.processAssessment.rows = new Array<ProcessAssessmentRow>();

        this.mainTypes.forEach((element, index) => {
            this.processAssessment.rows.push(
                new ProcessAssessmentRow(
                    super.generateRandomId('assessmentRow' + index + '_'),
                    this.processAssessment.uniqueId,
                    element
                )
            );
        });

// VaG - 05/09/2018
var subSystemId : string;
var moduleId : string;
subSystemId = super.getPrintableSubSystemId(this.callerId);
moduleId = super.getPrintableModuleId(this.callerId);
console.log("subSystemId: " + subSystemId);
console.log("moduleId: " + moduleId);
if (subSystemId != "")
{
    this.processAssessment.equipmentType = "subSystem";
    this.processAssessment.equipmentId = subSystemId;    
}
else
{
    if (moduleId == "")
    {
        this.processAssessment.equipmentType = "module";
        this.processAssessment.equipmentId = moduleId;    
    }
}
    }

    insertProcessAssessment(): void {
        this.processAssessmentService
            .insertNewProcessAssessment(this.processAssessment)
            .then(
                response => {
                    console.log('PROVA');
                    this.processAssessment = response;
                    this.showInsertForm = false;
                }
            );
    }

    startNewInsert(): void {
        this.startProcessAssessmentData();
        this.showInsertForm = true;
    }

    gotoList() {
        this.router.navigate(['processAssessments', this.callerType, this.callerId]);
    }
}
