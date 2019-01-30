import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { ModuleService } from '../service/module.service';

import { Module } from '../Data/module';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'module-list-page',
    templateUrl: '../component_html/module-list-page.component.html'
})

export class ModuleListPageComponent implements OnInit {
    @Input() callerType: string = "unknownType";    
    @Input() callerId: string = "unknown";

    private modules: Module[];

    private sub: any;

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private moduleService: ModuleService) { }

    ngOnInit(): void{
//
this.sub = this.route.params.subscribe(params => {
    const parentId = params['parentId'];
    const parentType = params['parentType'];
    this.callerId = parentId;
    this.callerType = parentType;
    console.log("sub in page: " + this.callerType);
    console.log("sub in page: " + this.callerId);
  });
//            
        
console.log('ngOnInit module list page: ' + this.callerId);
console.log('ngOnInit module list page: ' + this.callerType);
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
            console.log('ngOnInit module list page: ' + this.callerId);
            console.log('ngOnInit module list page: ' + this.callerType);
                        }
}