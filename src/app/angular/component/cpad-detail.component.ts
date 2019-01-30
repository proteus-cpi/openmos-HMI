import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { CPADService } from '../service/cpad.service';

import { CyberPhysicalDescription } from '../Data/cyber-physical-description';
import { Equipment } from '../Data/equipment';

@Component({
    selector: 'cpad-detail',
    templateUrl: '../component_html/cpad-detail.component.html'
})

export class CPADDetailComponent implements OnInit{
    private cpadId : string = "-1";
    private selectedCpad: CyberPhysicalDescription;

    constructor(private cpdService: CPADService,
        private router: Router,
        private route: ActivatedRoute) { }

        ngOnInit(): void{
        this.route.paramMap
            .switchMap(
                (params: ParamMap) => this.cpdService.getCPADById(params.get('id'))
            )
            .subscribe(cpad => this.selectedCpad = cpad);
        console.log("cpad = " + this.selectedCpad);
    }

    goToExecutionTable(): void{
        this.router.navigate(['/executionTable', this.selectedCpad.executionTable.uniqueId]);
    }

}