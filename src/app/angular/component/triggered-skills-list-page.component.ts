import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { TriggeredService } from '../service/triggered-service';

import { TriggeredSkill } from '../Data/triggered_skill';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'triggered-skills-list-page',
    templateUrl: '../component_html/triggered-skills-list-page.component.html'
})

export class TriggeredSkillsListPageComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';
    @Input() skillId = "unknownSkill";
    @Output("onDetail") onDetail: EventEmitter<any> = new EventEmitter();

    private triggeredSkills: TriggeredSkill[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private triggeredService: TriggeredService) { }

    ngOnInit(): void {
        console.log('ngOnInit: ' + this.callerId);
/*        
       if (this.callerId === 'unknown') {
            console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }
        if (this.callerType === 'unknownType') {
            console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
            }
*/    
if (this.skillId === 'unknownSkill') {
    console.log('module @input parameter not found (' + this.skillId + '), go for querystring parameter');
    this.route.paramMap
        .switchMap(
            (params: ParamMap) =>
            this.skillId = params.get('skillId')
        )
        .subscribe();
}


console.log('go! ');

//                this.subSystemId = this.getPrintableModuleId(this.callerId);
//                super.startPrintableModuleName(this.subSystemId, this.moduleService);

                this.triggeredService
                    .getTriggeredSkillsList(this.skillId)
                    .then(
                        response => 
                            {
                                this.triggeredSkills = response;
                                console.log("triggeredSkills retrieved by the service: " + this.triggeredSkills);
                            }
                    );

    }

    goToTriggerSkillView(selectedTriggeredSkill: TriggeredSkill): void {
        // this.router.navigate(['/orderInstance',         selectedOrderInstance.uniqueId]);
        console.log("call for detail for " + JSON.stringify(selectedTriggeredSkill));
        this.onDetail.emit(selectedTriggeredSkill);
    }
}
