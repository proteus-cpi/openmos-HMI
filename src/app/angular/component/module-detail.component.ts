import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { SubSystemService } from '../service/sub-system.service';
import { ModuleService } from '../service/module.service';

import { SubSystem } from '../Data/sub-system';
import { Module } from '../Data/module';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'module-detail',
    templateUrl: '../component_html/module-detail.component.html'
})

export class ModuleDetailComponent implements OnInit {
    @Input() private moduleId: string = '-1';
    private selectedModule: Module;
    private mymodule: Module;
    @Input() callerType: string = 'module';
    @Input() callerId: string = 'unknown';

constructor(private cpdService: SubSystemService,
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService) { }

    ngOnInit(): void {
        // console.log('ngOnInit module detail component : ' + this.callerId);
        // console.log('ngOnInit module detail component: ' + this.callerType);
        if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('moduleId')
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
        console.log('ngOnInit module detail component : ' + this.callerId);
        console.log('ngOnInit module detail component: ' + this.callerType);

        console.log(this.callerId);
        console.log(this.callerType);

        this.moduleService
            .getModuleById(this.callerId)
            .then(module => this.selectedModule = module);

        // console.log('module = ' + this.selectedModule);
    }
}
