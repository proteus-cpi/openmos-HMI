import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SkillService } from '../service/skill.service';

import { Skill } from '../Data/skill';
import { Module } from '../Data/module';
import { environment } from '../../../environments/environment';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'skill-view',
    templateUrl: '../component_html/skill-view.component.html'
})

export class SkillViewComponent implements OnInit {
    @Input() skillId: string;

    /* parameter, kpis, controls, module */
    private showSelector = [false, false, false, false];
    private selectedSkill: Skill;
    private values: any;

    constructor(private skillService: SkillService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.initializeSkillData();
    }

    initializeSkillData(): void {
        if (this.skillId != null && this.skillId.length !== 0) {
            console.debug('uso parametro');
            this.skillService
                .getSkillById(this.skillId)
                .then(response => this.selectedSkill = response);
        } else {
            console.debug('uso url');
            this.route.paramMap
                .switchMap((params: ParamMap) =>
                    this.skillService.getSkillById(params.get('id'))
            )
            .subscribe(skill => this.selectedSkill = skill);
        }
    }

    goToRecipes(): void {
        // this.router.navigate(['/recipes', this.selectedSkill.uniqueId]);
        this.router.navigate(['/recipes', 'cpad', this.selectedSkill.uniqueId]);
    }

    changeView(index: number, value: any): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = false;
        }
        this.values = value;
        this.fetchData(index);
        this.showSelector[index] = true;
    }

    fetchData(index: number) {
        switch (index) {
            case 0:
                this.values = this.selectedSkill.parameters;
                break;

            case 1:
                this.values = this.selectedSkill.kpis;
                break;

            case 2:
                this.values = null;
                break;

            case 3:
                this.skillService
                    .getSkillById(this.selectedSkill.uniqueId)
                    .then(response => this.values = response);
                break;

            default:
                break;
        }
    }
}
