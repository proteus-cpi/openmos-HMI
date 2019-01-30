import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ObservationService } from './../service/observation.service';
import { SubSystemService } from './../service/sub-system.service';

import { EquipmentObservation } from './../Data/equipment-observation';
import { EquipmentObservationRow } from './../Data/equipment-observation-row';
import { environment } from '../../../environments/environment';
import { BaseComponent } from './base.component';
import { SharedDataService } from '../service/shared.data.service';
import { SystemService } from '../service/system.service';

@Component({
    selector: 'add-equipment-observation',
    templateUrl: '../component_html/add-equipment-observation.component.html'
})

export class AddEquipmentObservationComponent extends BaseComponent {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';

    // Main observation type
    private observationType = environment.observationMainType;

    // Sub Types for each main type
    private functionalitySubType = environment.functionalitySubType;
    private qualitySubType = environment.qualitySubType;
    private performanceSubType = environment.performanceSubType;

    private observation: EquipmentObservation;

    private showInsertForm = true;

    private subTypeMap = new Map<string, any>();
    private unitTypes: string[];
    private rowsMap = new Map<string, EquipmentObservationRow[]>();
    private subTypeToInsert: string;
    private valueToInsert: number;
    private unitToInsert: string;

    constructor(private observationService: ObservationService,
        private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private sharedDataServce: SharedDataService,
        private systemService: SystemService) {
            super();
    }

    startDataMaps(): void {
        this.rowsMap = new Map<string, EquipmentObservationRow[]>();
        this.observationType.forEach(element => {
            this.rowsMap.set(element, new Array<EquipmentObservationRow>());
        });

        this.subTypeMap.set('Functionality', this.functionalitySubType);
        this.subTypeMap.set('Quality', this.qualitySubType);
        this.subTypeMap.set('Performance', this.performanceSubType);
    }

    startObservationData(): void {
        this.startDataMaps();
        this.observation = new EquipmentObservation();
        this.checkSystemStage();
        this.sharedDataServce.userInfo
            .subscribe( userInfo => {
                this.observation.userName = userInfo;
                console.log('add-equipment-observation, User info changed to: ' + this.observation.userName);
            });
        this.observation.uniqueId = super.generateRandomId('observation');
        this.observation.name = 'Observation upload from HMI';
        this.observation.description = 'Observation from HMI';
        this.observation.registered = new Date();
        this.observation.equipmentId = super.getPrintableSubSystemId(this.callerId);
        this.observation.equipmentType = this.callerType;
        this.observation.rows = new Array<EquipmentObservationRow>();
    }

    ngOnInit(): void {
        // console.log('ngOnInit: ' + this.callerId);
        if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                    // this.callerId = params.get('id')
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

        if (this.callerType === 'subSystems') {
            this.callerTypeToBePrinted = 'the system';
            this.callerIdToBePrinted = '';
        } else {
            this.callerTypeToBePrinted = this.callerType;
            this.callerIdToBePrinted = super.getPrintableSubSystemId(this.callerId);
            super.startPrintableSubSystemName(this.callerIdToBePrinted, this.subSystemService);
            this.callerIdToBePrinted = this.subSystemNameToPrint;
        }

        this.startObservationData();
    }

    checkSystemStage(): void {
        // this.systemStatus = this.systemService.getSystemStatus();
        this.systemService
            .getSystemStage()
            .then(
                response => this.observation.systemStage = response.stage
            );
    }

    public insertNewRow(index: number): void {
        // getting from session if is possible to insert new row
        // after javascript control of input fields
        const toInsert = JSON.parse(sessionStorage.getItem('INSERT_OBS')) as boolean;
        // console.log('value from session: ' + toInsert);
        if (toInsert !== null && toInsert) {
            const rowId = super.generateRandomId('eqObsRow');
            const mainType = this.observationType[index];
            if (mainType !== null) {
                const rows = this.rowsMap.get(mainType);
                if (rows !== null ) {
                    rows.push(
                        new EquipmentObservationRow(rowId, this.observation.uniqueId,
                            this.observationType[index], this.subTypeToInsert,
                            this.unitToInsert, this.valueToInsert)
                    );
                }
                this.removeSubType(this.observationType[index], this.subTypeToInsert);
            }

            this.valueToInsert = null;
            this.subTypeToInsert = null;
            this.unitToInsert = null;
            this.unitTypes = null;
        } else {
            // console.error('Some empty fields or error during javascript checks');
        }
        sessionStorage.removeItem('INSERT_OBS');
    }

    public removeSubType(type: string, subType: string): void {
        const subTypeList = this.subTypeMap.get(type);
        if (subTypeList !== null) {
            const index = subTypeList.indexOf(subType);
            if (index !== -1) {
                subTypeList.splice(
                    index,
                    1
                );
            }
        }
    }

    public removeRow(row: EquipmentObservationRow): void {
        if (this.rowsMap.get(row.eorType) != null) {
            const index = this.rowsMap.get(row.eorType).indexOf(row);
            if (index !== -1) {
                this.rowsMap.get(row.eorType).splice(index, 1);
                this.insertSubType(row.eorType, row.subtype);
            }
        }
    }

    public insertSubType(type: string, subType: string): void {
        if (this.subTypeMap.get(type) !== null) {
            this.subTypeMap.get(type).push(subType);
        }
    }

    insertObservation(): void {
        this.observation.rows = new Array<EquipmentObservationRow>();
        this.getAllRows();

        // console.log(JSON.stringify(this.observation));
        this.observationService
            .insertNewObservation(this.observation)
            .then(
                response => {
                    console.log('RESP: ' + JSON.stringify(response));
                    this.showInsertForm = false;
                }
            );
        // this.showInsertForm = false;
    }

    getAllRows(): void {
        this.observationType.forEach(element => {
                if (this.rowsMap.get(element) !== null) {
                    this.rowsMap
                        .get(element)
                        .forEach(row => {
                            this.observation.rows.push(row);
                        }
                    );
                }
            }
        );
    }

    startNewInsert(): void {
        this.restartSubTypeArrays();
        this.startObservationData();
        this.showInsertForm = true;
    }

    restartSubTypeArrays(): void {
        this.observationType.forEach(element => {
            if (this.rowsMap.get(element) !== null) {
                this.rowsMap.get(element).forEach(row => {
                    this.subTypeMap.get(element).push(row.subtype);
                });
            }
        });
    }

    subTypeSelected(value, mainType) {
        const subTypes = this.subTypeMap.get(mainType);
        for (let i = 0; i < subTypes.length; i++) {
            if (subTypes[i].name === value) {
                this.unitTypes = subTypes[i].units;
                this.unitToInsert = this.unitTypes[0];
                return;
            }
        }
    }

    gotoList() {
        if (this.callerType === 'subSystems')
            this.router.navigate(['equipmentObservations', 'system']);
        else
            this.router.navigate(['equipmentObservations', this.callerId]);
    }
}
