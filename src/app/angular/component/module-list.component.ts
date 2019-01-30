import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { ModuleService } from '../service/module.service';

import { Module } from '../Data/module';
import { environment } from '../../../environments/environment';
import { ObjectPrettyPritterComponent } from './object-pretty-printer.component';

import { BaseComponent  } from './base.component';

@Component({
    selector: 'module-list',
    templateUrl: '../component_html/module-list.component.html'
})

export class ModuleListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    private subSystemId: string = '-1';
    private moduleId: string = '-1';
    // private callerIdToBePrinted : string = '';
    // private callerTypeToBePrinted : string = '';

    private prettyModuleJson: string;
    private selectedModule: Module;

    private modules: Module[];

    private sub: any;

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private moduleService: ModuleService) {
            super();
        }

    ngOnInit(): void {
        /*
        this.sub = this.route.params.subscribe(params => {
            const parentId = params['parentId'];
            const parentType = params['parentType'];
            this.callerId = parentId;
            this.callerType = parentType;
            console.log('sub in component: ' + this.callerType);
            console.log('sub in component: ' + this.callerId);

            if (this.callerType == 'subSystem')
                {
                    this.subSystemService
                        .getSubSystemModules(this.callerId)
                        .then(response => this.modules = response);
                }
                if (this.callerType == 'module')
                {
        // callerId can be in this id1-id2-id3... form
                    this.moduleService
                    .getModuleModules(this.callerId)
                    .then(response => this.modules = response);

                    console.log(this.modules);
                }
        });
        */
        // console.log('ngOnInit module list component: ' + this.callerId);
        // console.log('ngOnInit module list component: ' + this.callerType);
        if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerId = params.get('id')
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
        // console.log('ngOnInit module list component: ' + this.callerId);
        // console.log('ngOnInit module list component: ' + this.callerType);
/*
        var myElem;
        if (this.callerId.indexOf(environment.paramSeparator) != -1)
            myElem = this.callerId.split(environment.paramSeparator);
        else
            myElem = [this.callerId];
        var myFirstElem = myElem[0].split(environment.paramValueSeparator);
        this.subSystemId = myFirstElem[1];
        var myLastElem = myElem[myElem.length - 1].split(environment.paramValueSeparator);
        this.moduleId = myLastElem[1];
*/
        this.subSystemId =  this.getPrintableSubSystemId(this.callerId);
        this.moduleId =  this.getPrintableModuleId(this.callerId);

        if (this.callerType === 'subSystem') {
            this.subSystemService
                // .getSubSystemModules(this.callerId)
                .getSubSystemModules(this.subSystemId)
                .then(response => this.modules = response);
        }
        if (this.callerType === 'module') {
            // callerId can be in this id1-id2-id3... form
            this.moduleService
                .getModuleModules(this.callerId)
                .then(response => this.modules = response);
        }

        if (this.callerType === 'subSystem') {
            // this.callerIdToBePrinted = super.getPrintableSubSystemName(this.subSystemId, this.subSystemService);
            super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);
        } else if (this.callerType === 'module') {
            this.callerIdToBePrinted = this.moduleId;
        }
        this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);

        // console.log('AAA: ' + JSON.stringify(this.modules[0]));
    }
    goToRecipeList(module: Module): void {
        // this.router.navigate(['/skillRecipes', 'module', module.uniqueId]);
        this.router.navigate(['/skillRecipes', 'module',
            this.callerId + environment.paramSeparator + environment.moduleMarker + module.uniqueId]);
    }

    goToSkillList(module: Module): void {
        // this.router.navigate(['skills', 'module', module.uniqueId]);
        this.router.navigate(['skills', 'module', this.callerId + environment.paramSeparator + environment.moduleMarker + module.uniqueId]);
    }

    goToModuleList(module: Module): void {
        // this.router.navigate(['/modules', 'module', module.uniqueId]);
        console.log('goto module list for module');
        this.router.navigate(['/modules', 'module',
            this.callerId + environment.paramSeparator + environment.moduleMarker + module.uniqueId]);
    }

    goToModuleDetail(module: Module) {
        console.log('goToModuledetail - ' + module.uniqueId + ' null?');
        this.router.navigate(['/module', this.callerId + environment.paramSeparator + environment.moduleMarker + module.uniqueId]);
    }

    showModuleDetail(module: Module) {
        this.selectedModule = module;
        this.prettyModuleJson = JSON.stringify(module, null, '   ');
        console.log(this.selectedModule);
    }

    getModuleDetailUrl(module: Module): string {
        return module.internalModules != null
            &&  module.internalModules.length > 0 ?
            '/module/' + this.callerId + environment.paramSeparator + environment.moduleMarker + module.uniqueId
            : '/';
    }
}
