import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { PhysicalAdjustmentService } from "../service/physical-adjustment-service";
import { PhysicalAdjustment } from "../Data/physical-adjustment";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';

@Component({
    selector: 'physical-adjustments-list',
    templateUrl: '../component_html/physical-adjustments-list.component.html'
})

export class PhysicalAdjustmentsListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() openmosContext: string = 'unknown';
    @Input() openmosTarget: string = 'all';

    private physicalAdjustments: PhysicalAdjustment[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private physicalAdjustmentService : PhysicalAdjustmentService
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

        this.physicalAdjustmentService
            .getPhysicalAdjustments(realTarget)
            .then(
                response => {
                    this.physicalAdjustments = response;

                    console.log("physical adjustments = " + JSON.stringify(this.physicalAdjustments))

                    var adj: any;
                    var physicalAdjustment : PhysicalAdjustment;
                    for (adj in this.physicalAdjustments)
                    {
                        physicalAdjustment = this.physicalAdjustments[adj];

                        console.log("current adjustment:" + JSON.stringify(physicalAdjustment));

                        if (physicalAdjustment.equipmentType == 'subSystem')
                        {
                            if (sessionStorage && sessionStorage.getItem(physicalAdjustment.equipmentId) != null) {
                                // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                                physicalAdjustment.equipmentName = sessionStorage.getItem(physicalAdjustment.equipmentId);
                            }  
                            else                              
                            physicalAdjustment.equipmentName = "-"

                            console.log("equipment name = " + physicalAdjustment.equipmentName);

                        }
                    }
                    console.log("physical adjustments = " + JSON.stringify(this.physicalAdjustments))
                }
            );
    }

}
