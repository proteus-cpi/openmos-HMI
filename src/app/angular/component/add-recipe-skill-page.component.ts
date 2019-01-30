import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SkillService } from './../service/skill.service';
import { RecipesService } from '../service/recipe.service';
import { ModuleService } from '../service/module.service';
import { SubSystemService } from '../service/sub-system.service';

import { BaseComponent } from './base.component';
import { Skill } from '../Data/skill';
import { Recipe } from '../Data/recipe';

@Component({
    selector: 'add-skill-recipe-page',
    templateUrl: '../component_html/add-recipe-skill-page.component.html'
})

export class AddRecipeSkillPage extends BaseComponent implements OnInit {
    private callerSkill: Skill;
    private skillsChoices: Skill[];
    private subSystemId: string;

    private callerType = 'unknownType';
    private callerId = 'unknown';

    private showInsertComponent = false;
    private isFromSkill = false;
    private from: string;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private skillService: SkillService,
        private recipeService: RecipesService,
        private moduleService: ModuleService,
        private subSystemService: SubSystemService) {
            super();
        }

    ngOnInit(): void {
        // console.log("test");
        if (this.callerId === 'unknown') {
            // console.log('get id from url');
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }
        if (this.callerType === 'unknownType') {
            // console.log('get type from url');
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
        }

        switch (this.callerType) {
            case 'skill':
                this.skillService
                .getSkillById(this.callerId)
                .then(
                    response => {
                        this.callerSkill = response;
                        this.showInsertComponent = true;
                    }
                );
                this.isFromSkill = true;
                this.from = 'skill';
                break;

            case 'module':
                this.moduleService
                    .getModuleSkills(this.callerId)
                    .then(
                        response => {
                            this.skillsChoices = response;
                        }
                    );
                this.isFromSkill = false;
                this.from = 'module';
                break;

            case 'subSystem':
                this.subSystemId = this.getPrintableSubSystemId(this.callerId);
                super.startPrintableSubSystemName(this.subSystemId, this.subSystemService);
                this.subSystemService
                    .getSubSystemSkills(this.subSystemId)
                    .then(
                        response => {
                            this.skillsChoices = response;
                        }
                    );
                this.isFromSkill = false;
                this.from = 'subSystem';
                break;
        }
        console.log('F: ' + this.from );
    }

    onSelectSkill(): void {
        this.callerId += environment.paramSeparator
            + environment.skillMarker
            + this.callerSkill.uniqueId;
        this.showInsertComponent = true;
    }

    goToSelectSkill(): void {
        this.callerId = this.callerId.substring(0, this.callerId.lastIndexOf(environment.paramSeparator));
        this.showInsertComponent = false;
        this.callerSkill = null;
    }
}
