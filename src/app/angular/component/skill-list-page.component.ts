import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';

import { Skill } from '../Data/skill';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'skill-list-page',
    templateUrl: '../component_html/skill-list-page.component.html'
})

export class SkillListPageComponent implements OnInit{
    @Input() callerType: string = "unknownType";    
    @Input() callerId: string = "unknown";

    private skills: Skill[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService) { }

    ngOnInit(): void{
        console.log("ngOnInit: " + this.callerId);
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
    }
/*
    goToSkillDetails(selectedSkill: Skill): void{
        this.router.navigate(['/skill', selectedSkill.uniqueId]);
    }
*/    
}