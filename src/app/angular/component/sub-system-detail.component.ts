import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';

import { SubSystem } from '../Data/sub-system';
import { SubSystemStage } from "../Data/sub-system-stage";
// import { Module } from '../Data/module';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'sub-system-detail',
    templateUrl: '../component_html/sub-system-detail.component.html'
})

export class SubSystemDetailComponent implements OnInit {
    @Input() private subSystemId: string = '-1';
    private selectedSubSystem: SubSystem;
    private mysubsystem: SubSystem;
    @Input() callerType: string = 'subSystem';
    @Input() callerId: string = 'unknown';
    // private myElem: String[];

    private isUpdatingSubSystemStage: boolean = false;
    private subSystemStage: string;
    private newSubSystemStage = new SubSystemStage();
    private possibleSubSystemStage = environment.systemStage;

constructor(private cpdService: SubSystemService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit(): void {
        console.log('ss detail callerType = ' + this.callerType);
        console.log('ss detail callerId = ' + this.callerId);
        if (this.callerId === 'unknown')
        {
            console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerId = params.get('parentId')
            )
            .subscribe();
        }
        if (this.callerType === 'unknownType')
        {
            console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerType = params.get('parentType')
            )
            .subscribe();
        }
        console.log('ss detail callerType = ' + this.callerType);
        console.log('ss detail callerId = ' + this.callerId);

        var myElem = this.callerId.split(environment.paramValueSeparator);
        this.subSystemId = myElem[1];

        this.cpdService.getSubSystemById(this.subSystemId)
        .then(response => 
            {
                this.selectedSubSystem = response;

                this.newSubSystemStage.subSystemId = this.selectedSubSystem.uniqueId;

                // TEST CASE
                if (this.selectedSubSystem.stage === undefined
                    || this.selectedSubSystem.stage === "")
                    this.selectedSubSystem.stage = "Production";

                this.subSystemStage = this.selectedSubSystem.stage;
            });

        console.log('cpad = ' + this.selectedSubSystem);

    }

    goToExecutionTable(): void {
        this.router.navigate(['/executionTable', this.selectedSubSystem.executionTable.uniqueId]);
    }

    startUpdateSubSystemStage(): void {
        console.log("current subSystemStage is " + this.subSystemStage);
        if (
            this.subSystemStage === "Rampup_to_pre-production"
            || this.subSystemStage === "Rampup_to_production"
            || this.subSystemStage === "Pre-production_to_production"
            || this.subSystemStage === "Pre-production_to_rampup"
            || this.subSystemStage === "Production_to_rampup"
            || this.subSystemStage === "Production_to_preproduction"
        )
        {
            this.isUpdatingSubSystemStage = false;
            $("#intermediatePhaseMessage").modal('show');
            return;
        }

        if (this.subSystemStage === environment.systemStage_rampup) {
            this.cpdService
                .checkSubSystemCanChangeStage(this.subSystemId)
                .then( result => {
                    if (result == true) {
                        this.isUpdatingSubSystemStage = true;
                    } else {
                        this.isUpdatingSubSystemStage = false;
                        $("#assestWarningMessage").modal('show');
                    }
                });            
        } else {
            this.isUpdatingSubSystemStage = true;
        }
    }

    updateSubSystemStage(): void {
        console.log('SSSSS: ' + this.subSystemStage);
        console.log('TTTTT: ' + JSON.stringify(this.newSubSystemStage));
        // using string
        this.cpdService
            .updateSubSystemStage(this.newSubSystemStage)
            .then(
                response => {
                    this.subSystemStage = response.stage;
                    this.selectedSubSystem.stage = response.stage;
                    this.isUpdatingSubSystemStage = false;
                }
            );
    }

    cancelUpdateSubSystemStage(): void {
        this.isUpdatingSubSystemStage = false;
    }    
}
