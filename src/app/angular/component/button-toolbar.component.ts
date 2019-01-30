import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { environment } from '../../../environments/environment';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'button-toolbar',
    templateUrl: '../component_html/button-toolbar.component.html'
})

export class ButtonToolbarComponent implements OnInit {
    @Input() whereAmIContext: string = 'n/a';
    @Input() whereAmISubContext: string = 'n/a';
    @Input() whereAmIElement: string = 'n/a';

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
    }

    systemObservationsList(): void {
        this.router.navigate(['equipmentObservations/system']);
    }

    systemAssessmentsList(): void {
        this.router.navigate(['equipmentAssessments/system']);
    }

    equipmentObservationsList(): void {
        this.router.navigate(['equipmentObservations', this.whereAmIContext, this.whereAmIElement]);
    }

    equipmentAssessmentsList(): void {
        this.router.navigate(['equipmentAssessments', this.whereAmIContext, this.whereAmIElement]);
    }

    equipmentAdjustmentsList(): void {
        console.log("this.whereAmIContext -> " + this.whereAmIContext);
        console.log("this.whereAmIElement -> " + this.whereAmIElement);
        this.router.navigate(['physicalAdjustments', this.whereAmIContext, this.whereAmIElement]);
    }

    processAssessmentsList(): void {
        this.router.navigate(['processAssessments', this.whereAmIContext, this.whereAmIElement]);
    }

    startObservationAddition(): void {
        if (this.whereAmIContext === 'subSystems' ||
            this.whereAmIContext === 'subSystem' ||
            this.whereAmIContext === 'module') {
            this.router.navigate(['addEquipmentObservation', this.whereAmIContext, this.whereAmIElement]);
        } else {
            alert('TO DO: start observation addition' + this.whereAmI_ToString());
        }
    }

    startWorkstationAssessment(): void {
        alert('TO DO: start workstation assessment' + this.whereAmI_ToString());
    }

    startTransportAssessment(): void {
        alert('TO DO: start transport assessment' + this.whereAmI_ToString());
    }

    startExecutionTableAssessment(): void {
        alert('TO DO: start execution table assessment' + this.whereAmI_ToString());
    }

    startSubSystemsRemoval(): void {
        alert('TO DO: start workstation/transport removal process' + this.whereAmI_ToString());
    }

    startModulesRemoval(): void {
        alert('TO DO: start modules removal process' + this.whereAmI_ToString());
    }

    startSystemAdjustement(): void {
        alert('TO DO: start system adjustement' + this.whereAmI_ToString());
    }

    startModuleAdjustement(): void {
        alert('TO DO: start module adjustement' + this.whereAmI_ToString());
    }

    gotoMachineLearningRecommendations(): void {
        alert('TO DO: goto machine learning recommendations system' + this.whereAmI_ToString());
    }

    whereAmI_ToString(): string {
        return 'concerning context [' + this.whereAmIContext + '] subcontext [' + this.whereAmISubContext
        + '] element [' + this.whereAmIElement + ']';
    }

    addNewProduct(): void {
        this.router.navigate(['/addNewProduct']);
    }

    gotoProductsList(): void {
        this.router.navigate(['/products']);
    }
    gotoOrderInstancesList(): void {
        this.router.navigate(['/orderInstances']);
    }
    gotoSubSystemsList(): void {
        this.router.navigate(['/subSystems']);
    }
    addNewOrder(): void {
        this.router.navigate(['/addNewOrder']);
    }

    startSystemAssessment(): void {
        if (this.whereAmIContext === 'subSystems' ||
            this.whereAmIContext === 'subSystem' ||
            this.whereAmIContext === 'module') {
            this.router.navigate(['/addEquipmentAssessment', this.whereAmIContext, this.whereAmIElement]);
        } else {
            alert('TO DO: start observation addition' + this.whereAmI_ToString());
        }
    }

    goToInactiveRecipe(): void {
        this.router.navigate(['/nonActiveRecipes', this.whereAmIContext, this.whereAmIElement]);
    }
    startProcessAssessment(): void {
        // alert('going to start process assessment addition' + this.whereAmI_ToString());

        // VaG - 07/11/2018
        // Process assessment required also for skills.
        //
//        if (this.whereAmIContext === 'skillRecipeView') {
        if (this.whereAmIContext === 'skillRecipeView' || this.whereAmIContext === 'skillDetail') {
            this.router.navigate(['/addProcessAssessment', this.whereAmIContext, this.whereAmIElement]);
            // this.router.navigate(['addEquipmentObservation', this.whereAmIContext, this.whereAmIElement]);
        } else {
            alert('TO DO: start observation addition' + this.whereAmI_ToString());
        }
    }
}
