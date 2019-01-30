import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { AssessmentService } from "../service/assessment-service";
import { EquipmentAssessment } from "../Data/equipment-assessment";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'equipment-assessments-list',
    templateUrl: '../component_html/equipment-assessments-list.component.html'
})

export class EquipmentAssessmentsListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() openmosContext: string = 'unknown';
    @Input() openmosTarget: string = 'all';

    private equipmentAssessments: EquipmentAssessment[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private equipmentAssessmentService : AssessmentService
        ) {
            super();
    }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.has('openmosTarget'))
            this.openmosTarget = this.route.snapshot.paramMap.get('openmosTarget');
        console.log("this.openmosTarget: " + this.openmosTarget);
        if (this.route.snapshot.paramMap.has('openmosContext'))
            this.openmosContext = this.route.snapshot.paramMap.get('openmosContext');
        console.log("this.openmosContext: " + this.openmosContext);

        var realTarget = this.openmosTarget;
        if (this.openmosTarget != 'system' && this.openmosTarget != 'all')
        {
            var moduleId = super.getPrintableModuleId(this.openmosTarget);
            var subSystemId = super.getPrintableSubSystemId(this.openmosTarget);
            if (moduleId != '')
                realTarget = moduleId;
            else
                realTarget = subSystemId;
        }

        this.equipmentAssessmentService
        .getAssessments(realTarget)
        .then(
            response => {
                this.equipmentAssessments = response;

                console.log("equipment assessments = " + JSON.stringify(this.equipmentAssessments))

                var ass: any;
                var assess : EquipmentAssessment;
                for (ass in this.equipmentAssessments)
                {
                    assess = this.equipmentAssessments[ass];

                    console.log("current assess:" + JSON.stringify(assess));

                    if (assess.equipmentType == 'subSystem')
                    {
                        if (sessionStorage && sessionStorage.getItem(assess.equipmentId) != null) {
                            // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                            assess.equipmentName = sessionStorage.getItem(assess.equipmentId);
                        }  
                        else                              
                            assess.equipmentName = "-"

                        console.log("equipment name = " + assess.equipmentName);

                    }
                }
                console.log("equipment assessments = " + JSON.stringify(this.equipmentAssessments))                                    
            }
        );
    }

    goToEquipmentAssessmentDetails(selectedEquipmentAssessment: EquipmentAssessment): void {
        this.router.navigate(
            ['/skillDetail', 'skillList', this.callerId + environment.paramSeparator
                + environment.skillMarker + selectedEquipmentAssessment.uniqueId]
        );
    }

    startAssessmentAddition(): void {
        if (this.openmosTarget == 'system')
        {
            // system level observation
            // http://localhost:4200/addEquipmentObservation/subSystems/n%2Fa
            this.router.navigate(['addEquipmentAssessment', 'subSystems', 'n/a']);
        }
        else if (this.openmosTarget == 'all')
        {
            // no inserts
        }
        else if (this.openmosTarget != 'all' && this.openmosTarget != 'system' )
        {
            // specific subsystem or module
            // http://localhost:4200/addEquipmentObservation/subSystem/ss%3E239ddbf6-8ca0-45c1-94bc-6878cb6154d9
            console.log("this.openmosTarget: " + this.openmosTarget);
            this.router.navigate(['addEquipmentAssessment', this.openmosContext, this.openmosTarget]);
        }
    }
}
