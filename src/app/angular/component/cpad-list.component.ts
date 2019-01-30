import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CPADService } from '../service/cpad.service';

import { CyberPhysicalDescription } from '../Data/cyber-physical-description';

@Component({
    selector: 'cpad-list',
    templateUrl: '../component_html/cpad-list.component.html'
})

export class CPADListComponent implements OnInit {

    private cpads: CyberPhysicalDescription[];
    private selectedCpd: CyberPhysicalDescription;

    constructor(private cpdService: CPADService,
        private router: Router) { }

    ngOnInit(): void{
        this.getCpadList();
    }

    getCpadList(): void{
        this.cpdService.getCPADList()
            .then(response => this.cpads = response);
    }

    onSelectCpad(cpad: CyberPhysicalDescription): void{
        this.selectedCpd = cpad;
    }

    goToCpadDetail(cpad: CyberPhysicalDescription){
        this.router.navigate(['/cpad', cpad.equipmentId]);
//        this.router.navigate(['/cpad', "systemOverview", cpad.equipmentId]);
    }

    goToExecutionTable(cpad: CyberPhysicalDescription): void{
        this.router.navigate(['/executionTable', cpad.executionTable.uniqueId, "cpad", cpad.equipmentId]);
    }

    goToRecipeList(cpad: CyberPhysicalDescription): void{
        this.router.navigate(['/recipes', "cpad", cpad.equipmentId]);
    }

    goToSkillList(cpad: CyberPhysicalDescription): void{
//        this.router.navigate(['skillList', cpad.equipmentId]);
        this.router.navigate(['skills', "cpad", cpad.equipmentId]);
    }

    goToEquipmentsList(cpad: CyberPhysicalDescription): void{
//        this.router.navigate(['/equipmentsList', cpad.equipmentId]);
        this.router.navigate(['/equipments', "cpad", cpad.equipmentId]);
    }

}