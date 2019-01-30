import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ObservationService } from "../service/observation.service";
import { EquipmentObservation } from "../Data/equipment-observation";
import { EquipmentObservationRow } from "../Data/equipment-observation-row";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';

@Component({
    selector: 'equipment-observations-list',
    templateUrl: '../component_html/equipment-observations-list.component.html'
})

export class EquipmentObservationsListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() openmosContext: string = 'unknown';
    @Input() openmosTarget: string = 'all';

    private equipmentObservations: EquipmentObservation[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private equipmentObservationService : ObservationService
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

        this.equipmentObservationService
            .getObservations(realTarget)
            .then(
                response => {
                    this.equipmentObservations = response;

                    console.log("equipment observations = " + JSON.stringify(this.equipmentObservations))

                    var obs: any;
                    var equipmentObservation : EquipmentObservation;
                    for (obs in this.equipmentObservations)
                    {
                        equipmentObservation = this.equipmentObservations[obs];

                        console.log("current equipmentObservation:" + JSON.stringify(equipmentObservation));

                        if (equipmentObservation.equipmentType == 'subSystem')
                        {
                            if (sessionStorage && sessionStorage.getItem(equipmentObservation.equipmentId) != null) {
                                // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                                equipmentObservation.equipmentName = sessionStorage.getItem(equipmentObservation.equipmentId);
                            }  
                            else                              
                                equipmentObservation.equipmentName = "-"

                            console.log("equipment name = " + equipmentObservation.equipmentName);

                        }
                    }
                    console.log("equipmentObservations = " + JSON.stringify(this.equipmentObservations))

                }
            );
    }

    startObservationAddition(): void {
        if (this.openmosTarget == 'system')
        {
            // system level observation
            // http://localhost:4200/addEquipmentObservation/subSystems/n%2Fa
            this.router.navigate(['addEquipmentObservation', 'subSystems', 'n/a']);
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
            this.router.navigate(['addEquipmentObservation', this.openmosContext, this.openmosTarget]);
        }
/*         if (this.whereAmIContext === 'subSystems' ||
            this.whereAmIContext === 'subSystem' ||
            this.whereAmIContext === 'module') {
            this.router.navigate(['addEquipmentObservation', this.whereAmIContext, this.whereAmIElement]);
        } else {
            alert('TO DO: start observation addition' + this.whereAmI_ToString());
        }
 */    }
}
