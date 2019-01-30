import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AssessmentService } from './../service/assessment-service';
import { SubSystemService } from './../service/sub-system.service';

import { environment } from './../../../environments/environment';
import { BaseComponent } from './base.component';
import { EquipmentAssessment } from './../Data/equipment-assessment';
import { EquipmentAssessmentRow } from './../Data/equipment-assessment-row';
import { EquipmentObservation } from './../Data/equipment-observation';
import { SharedDataService } from '../service/shared.data.service';
import { SystemService } from '../service/system.service';

@Component({
    selector: 'equipment-assessment-detail',
    templateUrl: '../component_html/equipment-assessment-detail-page.component.html'
})

export class EquipmentAssessmentDetailPageComponent extends BaseComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';

    private assessment: EquipmentAssessment;
    private mainTypes = environment.observationMainType;

    private showInsertForm = true;


    ///// assessment with Observation
    private observation: EquipmentObservation;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private assessmentService: AssessmentService,
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
        // this.startAssessmentData();
        this.assessmentService
        .getAssessmentDetail(this.callerId)
        .then(
            response => {
                this.assessment = response;
            }
        );
    }

/*     checkSystemStage(): void {
        // this.systemStatus = this.systemService.getSystemStatus();
        this.systemService
            .getSystemStage()
            .then(
                response => this.assessment.systemStage = response.stage
            );
    }

 *//*     public startAssessmentData(): void {
        this.assessment = new EquipmentAssessment();
        this.checkSystemStage();
        this.sharedDataServce.userInfo
            .subscribe( userInfo => {
                this.assessment.userName = userInfo;
                console.log('add-equipment-assessment, User info changed to: ' + this.assessment.userName);
            });
        this.assessment.registered = new Date();
        this.assessment.uniqueId = super.generateRandomId('equipmentAssessment');
        this.assessment.name = 'New assessment from HMI';
        this.assessment.description = 'New assessment upload from HMI';
        this.assessment.equipmentType = this.callerType;
        if (this.callerType !== 'subSystems') {
            this.assessment.equipmentId = super.getPrintableSubSystemId(this.callerId);
        }
        // with rows objects
        this.assessment.rows = new Array<EquipmentAssessmentRow>();

        this.mainTypes.forEach((element, index) => {
            this.assessment.rows.push(
                new EquipmentAssessmentRow(
                    super.generateRandomId('assessmentRow' + index + '_'),
                    this.assessment.uniqueId,
                    element
                )
            );
        });
    }
 */
}
