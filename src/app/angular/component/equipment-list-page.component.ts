import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { CPADService } from '../service/cpad.service';

import { Equipment } from '../Data/equipment';

@Component({
    selector: 'equipment-list-page',
    templateUrl: '../component_html/equipment-list-page.component.html'
})

export class EquipmentListPageComponent implements OnInit {
    @Input() callerType: string = "unknownType";    
    @Input() callerId: string = "unknown";

    private equipments: Equipment[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private cpadService: CPADService) { }

    ngOnInit(): void{
        console.log("ngOnInit: " + this.callerId);
//        if (this.callerElement.indexOf("notfound") != -1)
        if (this.callerId == "unknown")
            {
                console.log("module @input parameter not found (" + this.callerId + "), go for querystring parameter");
                this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get("parentId")
                )
                .subscribe();
            }
        if (this.callerType == "unknownType")
            {
                console.log("module @input parameter not found (" + this.callerType + "), go for querystring parameter");
                this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerType = params.get("parentType")
                )
                .subscribe();
            }
            this.cpadService
                .getCPADEquipments(this.callerId)
                .then(response => this.equipments = response);
//        }
    }
/*
    goToRecepies(selectedequipment: Equipment){
        this.router.navigate(['/recipes', selectedequipment.uniqueId])
    }

    goToRecipeList(equipment: Equipment): void{
        this.router.navigate(['/recipes', equipment.uniqueId]);
    }

    goToSkillList(equipment: Equipment): void{
        this.router.navigate(['skills', equipment.uniqueId]);
    }
    */
}