import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Location} from '@angular/common';

import { ModuleService } from "../service/module.service";
import { Module } from "../Data/module";

import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';

import { BreadcrumbElement } from '../Data/breadcrumb-element';

@Component({
    selector: 'breadcrumbs',
    templateUrl: '../component_html/breadcrumbs.component.html',
    // providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})

export class BreadcrumbsComponent implements OnInit {
    @Input() callerType: string;
    @Input() callerId: string;
    @Input() actualObject: any;
    private myTree: string[];
    private myElem: string[];
    elems: BreadcrumbElement[] = [];
    // private location: Location;

    private currentModule: Module;

    constructor(private router: Router,
        private route: ActivatedRoute ,
        private location: Location,
        private moduleService: ModuleService) {
        // this.location = location;
    }

    ngOnInit(): void {
        // console.log('actual Object: ' + JSON.stringify(this.actualObject.name));
        // console.log('breadc callerType = ' + this.callerType);
        console.log('BREADCRUMBS callerId = ' + this.callerId);

        // console.log('BREADCRUMB CALLER NAME: ' + sessionStorage.getItem(environment.lastComponentNameTag));

        if (this.callerId != null) {
            if (this.callerId.indexOf(environment.paramSeparator) !== -1) {
                this.myTree = this.callerId.split(environment.paramSeparator);
            } else {
                this.myTree = [this.callerId];
            }

            // this.elems = new BreadcrumbElement[this.myTree.length];
            let previousPath = '';
            // for (let i = 0; i < this.myTree.length - 1; i++) {
            for (let i = 0; i < this.myTree.length; i++) {
                this.myElem = this.myTree[i].split(environment.paramValueSeparator);
                let elemType = this.myElem[0];
                let elemId = this.myElem[1];

                console.log('BREADCRUMB ' + i + ' elemType = ' + elemType);
                console.log('BREADCRUMB '  + i + ' elemId = ' + elemId);

                if (previousPath.length > 0) {
                    previousPath = previousPath + environment.paramSeparator + this.myTree[i];
                } else {
                    previousPath = '' + this.myTree[i];
                }
                let be = new BreadcrumbElement();
                be.name = elemId;
                be.objectId = elemId;
                if (elemType === environment.subSystemMarkerPrefix) {
                    be.path = '/subSystem/' + previousPath;
                    if (sessionStorage.getItem(elemId) != null) {
                        // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                        be.name = sessionStorage.getItem(elemId);
                    }
                } else if (elemType === environment.moduleMarkerPrefix) {
                    be.path = '/module/' + previousPath;

                    console.log("be path for module: " + previousPath);

                    // could get module name from a service
                    this.moduleService.getModuleById(previousPath).then(
                        resp => {
                            this.currentModule = resp;
                            console.log(this.currentModule) || JSON;
                            if (this.currentModule
                                && this.currentModule != null) {
                                    be.name = this.currentModule.name;
                            }
                        }
                    );
                        
                } else if (elemType === environment.skillMarkerPrefix) {
                    // console.log('BREADCRUMB: '  + i + ' is SKILL: With id ' + elemId);
                    be.path = '/skillDetail/' + this.callerType + '/' + previousPath;
                    // be.path = '/skillDetail/' + previousPath;
                }

                if (this.actualObject === undefined)
                    console.log("this.actualObject is undefined");
                if (this.actualObject === null)
                    console.log("this.actualObject is null");

                if (i === this.myTree.length - 1) {
                    if (this.actualObject !== undefined
                        && this.actualObject !== null) {
                        // console.log('this.actualObject: ' + this.actualObject);
                        // console.log('LAST BC OBJ - get Name From Actual Obj');
                        console.log('this.actualObject.name:  ' + this.actualObject.name);
                        console.log('this.actualObject.uniqueId:  ' + this.actualObject.uniqueId);
                        be.objectId = this.actualObject.uniqueId;
                        be.name = this.actualObject.name;
                    }
                }
                this.elems.push(be);
            }

            // console.log(this.elems);
            if (this.checkMissingName()) {
                // console.log('Missing some component name on breadcrumbs');
                this.getNameFromSession();
            }

            sessionStorage.setItem('PrevBreadCrumb', JSON.stringify(this.elems));
        }
    }

    checkMissingName(): boolean {
        let res = false;
        this.elems.forEach(element => {
            if (element.name === element.objectId) {
                // console.log('n: ' + element.name + ' , Id: ' + element.objectId);
                res = true;
            }
        });
        return res;
    }

    getNameFromSession(): void {
        this.elems.forEach(element => {
            if (element.name === element.objectId) {
                // console.log('Missing name get it from session');
                const prevBreadcrumbs = JSON.parse(sessionStorage.getItem('PrevBreadCrumb')) as BreadcrumbElement[];
                if (prevBreadcrumbs !== null) {
                    prevBreadcrumbs.forEach(bce => {
                        if (bce.objectId === element.objectId) {
                            // console.log('Found obj from preBreadcrumb: ' + bce.name);
                            element.name = bce.name;
                        }
                    });
                }
            }
        });
    }

    goBackBack(): void {
        console.log('bc - back');
        console.log(this.location);
            this.location.back();
    }

    gotoUrlOLD(url: string): void {
        console.log('bc - gotourl: ' + url);
            this.router.navigateByUrl(url);
    }

    gotoUrl(url: string, anchor: string): void {
        console.log('bc - gotourl: ' + url + '#' + anchor);
            this.router.navigateByUrl(url + '#' + anchor);
    }
}
