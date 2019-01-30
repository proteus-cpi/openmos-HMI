import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { ModuleService } from '../service/module.service';

import { Skill } from '../Data/skill';
import { SubSystem } from '../Data/sub-system';
import { Module } from "./../Data/module";
import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'skill-list',
    templateUrl: '../component_html/skill-list.component.html'
})

export class SkillListComponent extends BaseComponent implements OnInit {
    // tslint:disable-next-line:no-inferrable-types
    @Input() callerType: string = 'unknownType';
    // tslint:disable-next-line:no-inferrable-types
    @Input() callerId: string = 'unknown';
    // tslint:disable-next-line:no-inferrable-types
    @Input() showSubModules: boolean = true;
    private subSystemId = '-1';

    private isSubSystem: boolean;
    private subSystem: SubSystem;
    private modules: Module[];
    private module: Module;

    private skills: Skill[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private moduleService: ModuleService) {
            super();
    }

    ngOnInit(): void {
       // console.log('ngOnInit: ' + this.callerId);
       if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerId = params.get('parentId')
            )
            .subscribe();
        }
        if (this.callerType === 'unknownType') {
            // console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerType = params.get('parentType')
            )
            .subscribe();
        }

        console.log('Skill List: ' + this.callerType);

        switch (this.callerType) {
            case 'subSystem':
                this.subSystemId = this.getPrintableSubSystemId(this.callerId);
                super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);
                this.isSubSystem = true;
                this.subSystemService
                    .getSubSystemSkills(this.subSystemId)
                    .then(
                        response => {
                            this.skills = response;

                            this.subSystemService
                                .getSubSystemById(this.subSystemId)
                                .then(
                                    res => this.subSystem = res
                                );

                            this.subSystemService
                            .getSubSystemModules(this.subSystemId)
                            .then(resp => 
                                {
                                    console.log("resp = " + JSON.stringify(resp));
                                    this.modules = resp;
                                }
                            );
                                    
                        }
                    );
                break;

            case 'module':
                this.subSystemId = this.getPrintableModuleId(this.callerId);
                super.startPrintableModuleName(this.subSystemId, this.moduleService);
                this.isSubSystem = false;
                this.moduleService
                    .getModuleSkills(this.callerId)
                    .then(response => this.skills = response);
                break;
        }
        this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);
    }

    goToSkillDetails(selectedSkill: Skill): void {
        this.router.navigate(
            ['/skillDetail', 'skillList', this.callerId + environment.paramSeparator
                + environment.skillMarker + selectedSkill.uniqueId]
        );
    }

    insertNewSkill(): void {
        const div = document.getElementById('testDiv');
        div.style.display = 'block';

        const button = document.getElementById('ins_button');
        button.style.display = 'none';
    }

    confirmInsert(): void {
        const div = document.getElementById('testDiv');
        div.style.display = 'none';

        const button = document.getElementById('ins_button');
        button.style.display = 'block';

        this.subSystemService
            .addNewSkill(this.callerId, this.skills[0])
            .then();
    }

    goToAvailableRecipes (skill: Skill) {
        this.router.navigate(['skillRecipes', 'skill', this.callerId +
        environment.paramSeparator + environment.skillMarker + skill.uniqueId]);
    }

    goToAddNewRecipeSkill(skill: Skill): void {
        this.router.navigate(['addRecipeSkill', 'skill', this.callerId + environment.paramSeparator 
            + environment.skillMarker + skill.uniqueId]);
    }

    getUrlForSubModules(moduleId: string): string {
        console.log("getUrlForSubModules: " + 'ss>' + this.subSystem.uniqueId + '<m>' + moduleId);
        return 'ss>' + this.subSystem.uniqueId + '<m>' + moduleId;
    }

    goToFullList(): void {
        if (this.isSubSystem) {
            this.router.navigate(['/skills', 'subSystem',
                environment.subSystemMarker + this.subSystem.uniqueId]);
        } else {
            this.router.navigate(['/modules', 'subSystem',
            environment.subSystemMarker + this.subSystem.uniqueId]);
        }
    }
}
