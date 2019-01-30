import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SubSystemService } from '../service/sub-system.service';
import { SystemService } from '../service/system.service';

import { SubSystem } from '../Data/sub-system';
import { SystemStage } from '../Data/system-stage';
import { environment } from '../../../environments/environment';
import { BaseComponent } from './base.component';
import { ObjectPrettyPritterComponent } from './object-pretty-printer.component';

declare var $: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sub-system-list',
    templateUrl: '../component_html/sub-system-list.component.html'
})

export class SubSystemListComponent extends BaseComponent implements OnInit, OnDestroy {
    private repeater;

    private subSystems: SubSystem[];
    private selectedSubSystem: SubSystem;

    private scrollExecuted: boolean = false;

    private isUpdatingStage: boolean = false;
    private systemStage: string;
    private newSystemStage = new SystemStage();
    private possibleSystemStage = environment.systemStage;

    public errorMessage : string;

    constructor(private subSystemService: SubSystemService,
        private systemService: SystemService,
        private router: Router,
        private route: ActivatedRoute) {
            super();
        }

        private cleanErrorMessage()
        {
            this.errorMessage = "";
        }
    
    ngOnDestroy(): void {
        this.repeater.unsubscribe();
    }

    ngOnInit(): void {
        this.cleanErrorMessage();

        this.getSubSystemList();
        this.checkSystemStage();

        this.repeater = Observable.interval(10000)
            .subscribe(x => {
                console.log('R: ' + x);
                this.updateData();
            }
        );
    }

    checkSystemStage(): void {
//        this.cleanErrorMessage();

        // this.systemStatus = this.systemService.getSystemStatus();
        this.systemService
            .getSystemStage()
            .then(
                response => this.systemStage = response.stage
            )
            .catch(error => {
                console.log("error -> " + error);
                this.handleError(error)
            });
    }

    updateData(): void {
        this.cleanErrorMessage();

        // update subSystems data if any modal is opened on system overview

        // VaG - 02/03/2018
        // if (this.checkIfModalIsOpen()) {
        if (this.checkIfModalIsOpen() && !this.isUpdatingStage) {
            if (document.getElementById('reload-message'))            
                document.getElementById('reload-message').style.display = 'block';
            setTimeout(function() {
                if (document.getElementById('reload-message'))
                    document.getElementById('reload-message').style.display = 'none';
            }, 1500);
            this.getSubSystemList();

            // VaG - 02/03/2018
            this.checkSystemStage();
        }
    }

    checkIfModalIsOpen(): boolean {
//        this.cleanErrorMessage();

        if (document.getElementsByClassName('modal-backdrop').length > 0) {
            console.log('Modal is open!');
            return false;
        }
        return true;
    }

    getSubSystemList(): void {
//        this.cleanErrorMessage();

        this.subSystemService.getSubSystemList()
            .then(response => {
                // console.log('Length: ' + response.length);
                this.subSystems = response;
                this.saveInSession(response);
            }
        )
        .catch(error => {
            console.log("error -> " + error);
            this.handleError(error)
        });
    }

    saveInSession(subSystems: SubSystem[]): void {
//        this.cleanErrorMessage();

        sessionStorage.clear();
        if (subSystems)
        {
            subSystems.forEach(element => {
                sessionStorage.setItem(element.uniqueId, element.name);

                if (element.internalModules !== null && element.internalModules !== undefined) {
                    element.internalModules.forEach(mod => {
                            if (mod.uniqueId !== undefined && mod.uniqueId !== null) {
                                sessionStorage.setItem(mod.uniqueId, mod.name);
                            }
                        }
                    );
                }
            });
        }
    }

    startUpdateStage(): void {
//        this.cleanErrorMessage();

        console.log("current systemStage is " + this.systemStage);
        if (
            this.systemStage === "Rampup_to_pre-production"
            || this.systemStage === "Rampup_to_production"
            || this.systemStage === "Pre-production_to_production"
            || this.systemStage === "Pre-production_to_rampup"
            || this.systemStage === "Production_to_rampup"
            || this.systemStage === "Production_to_preproduction"
        )
        {
            this.isUpdatingStage = false;
            $("#intermediatePhaseMessage").modal('show');
            return;
        }

        if (this.systemStage === environment.systemStage_rampup) {
            this.systemService
                .checkCanChangeStage()
                .then( result => {
                    if (result == true) {
                        this.isUpdatingStage = true;
                    } else {
                        this.isUpdatingStage = false;
                        $("#assestWarningMessage").modal('show');
                    }
                })
                .catch(error => {
                    console.log("error -> " + error);
                    this.handleError(error)
                });
            
        } else {
            this.isUpdatingStage = true;
        }
    }

    updateStage(): void {
//        this.cleanErrorMessage();

        console.log('SSSSS: ' + this.systemStage);
        // using string
        this.systemService
            .updateSystemStage(this.newSystemStage.stage)
            .then(
                response => {
                    this.systemStage = response.stage;
                    this.isUpdatingStage = false;
                }
            )
            .catch(error => {
                console.log("error -> " + error);
                this.handleError(error)
            });
    }


    cancelUpdateStage(): void {
//        this.cleanErrorMessage();
        
        this.isUpdatingStage = false;
    }

    /* TEST: Remove the content of sessionStorage
    prova() {
        console.log('B: ');
        console.log(sessionStorage);
        sessionStorage.clear();
        console.log('A:');
        console.log(sessionStorage);
    } */

    onSelectSubsystem(subSystem: SubSystem): void {
//        this.cleanErrorMessage();

        this.selectedSubSystem = subSystem;
    }

    goToSubSystemDetail(subSystem: SubSystem) {
//        this.cleanErrorMessage();

        console.log('gotosubsystemdetail - ' + subSystem.uniqueId + ' null?');
        this.router.navigate(['/subSystem', environment.subSystemMarker + subSystem.uniqueId]);
    }

    goToExecutionTable(subSystem: SubSystem): void {
//        this.cleanErrorMessage();

        //        this.router.navigate(['/executionTable', subSystem.executionTable.uniqueId, 'subSystem', subSystem.uniqueId]);
        this.router.navigate(['/executionTable', 'subSystem', environment.subSystemMarker + subSystem.uniqueId]);
    }

    goToRecipeList(subSystem: SubSystem): void {
//        this.cleanErrorMessage();

        this.router.navigate(['/skillRecipes', 'subSystem', environment.subSystemMarker + subSystem.uniqueId]);
    }

    goToSkillList(subSystem: SubSystem): void {
//        this.cleanErrorMessage();

        this.router.navigate(['skills', 'subSystem', environment.subSystemMarker + subSystem.uniqueId]);
    }

    goToModulesList(subSystem: SubSystem): void {
//        this.cleanErrorMessage();

        this.router.navigate(['/modules', 'subSystem', environment.subSystemMarker + subSystem.uniqueId]);
    }

    getModuleListUrl(subSystem: SubSystem): string {
//        this.cleanErrorMessage();

        return '/subSystem/' + environment.subSystemMarker + subSystem.uniqueId;
    }

    ngAfterViewChecked(): void {
//        this.cleanErrorMessage();

        // scoll to a specific subsystem on level up
        // button click on breadcrumb's component
        if (!this.scrollExecuted) {
            let routeFragmentSubscription: Subscription;
            routeFragmentSubscription = this.route.fragment.subscribe(fragment => {
                if (fragment) {
                    let element = document.getElementById(fragment);
                    if (element) {
                        element.scrollIntoView();
                        this.scrollExecuted = true;
                        // Free resources
                        setTimeout(
                            () => {
                                console.log('routeFragmentSubscription unsubscribe');
                                routeFragmentSubscription.unsubscribe();
                        }, 0);
                    }
                }
            });
        }

    }

	/*
  gotoHashtag(fragment: string) {
      console.log('fragment : ' + fragment);
    const element = document.querySelector('#' + fragment);
    // if (element) element.scrollIntoView(element);
    if (element) element.scrollIntoView();
}
*/

    handleError(error: Response | any) {
        console.error('SUBSYSTEM LIST handleError -> ', error);
        this.errorMessage = error;
/*
        let errMsg: string;
        if (error instanceof Response) {
            console.log("errore tipo response");
            const body = error.json() || '';
//            const err = body.error || JSON.stringify(body);
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
                console.log("errore non tipo response");
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        this.errorMessage = errMsg;
*/        
    }
}
