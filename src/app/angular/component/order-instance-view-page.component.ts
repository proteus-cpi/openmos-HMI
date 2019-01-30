import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';

import { OrderInstanceService } from '../service/order-instance.service';
import { RecipeExecutionDataService } from "../service/recipe-execution-data.service";

import { OrderInstance } from '../data/order-instance';
import { Recipe } from "../data/recipe";

import { environment } from '../../../environments/environment';

@Component({
    selector: 'order-instance-view-page',
    templateUrl: '../component_html/order-instance-view-page.component.html'
})

export class OrderInstanceViewPageComponent implements OnInit, OnDestroy {
    private repeater;

    private orderInstance: OrderInstance;

    @Input() callerType: string = 'orderInstance';
    @Input() callerId: string = 'unknown';

    @Input() id = 'unknown';
    private showSelector = [true, true, true, true, true];
    private startProduction: any = "";
    private stopProduction: any = "";

    private recipesPerProductInstance: Recipe[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private orderInstanceService: OrderInstanceService,
        private recipeExecutionDataService: RecipeExecutionDataService) { }


    ngOnDestroy(): void {
        //this.repeater.unsuscribe();
    }

    ngOnInit(): void {
        this.initializeData();

        // update data every 5 seconds
        this.repeater = Observable.interval(6000)
            .subscribe(x => {
                console.log('R: ' + x);
                if (document.getElementById('reload-message'))
                    document.getElementById('reload-message').style.display = 'block';
                setTimeout(function() {
                    if (document.getElementById('reload-message'))
                        document.getElementById('reload-message').style.display = 'none';
                }, 1500);
                this.initializeData();
            }
        );
    }

    initializeData(): void {
        if (this.id === 'unknown') {
            this.route.paramMap
                .switchMap(
                (params: ParamMap) =>
                    this.id = params.get('id')
                )
                .subscribe();
        }
        // if (this.callerId === 'unknown') {
        //     this.route.paramMap
        //         .switchMap(
        //         (params: ParamMap) =>
        //             this.callerId = params.get('parentId')
        //         )
        //         .subscribe();
        // }
        // if (this.callerType === 'unknownType') {
        //     this.route.paramMap
        //         .switchMap(
        //         (params: ParamMap) =>
        //             this.callerType = params.get('parentType')
        //         )
        //         .subscribe();
        // }

        console.log('order instance detail: callerId = ' + this.id);

        this.orderInstanceService
            .getDetail(this.id)
            .then(
                response => {
                    this.orderInstance = response;
               }
            );

    }

    changeView(index: number, value: any): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = false;
        }
        this.showSelector[index] = true;
    }

    showAllProperties(): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = true;
        }
    }

    goToProductDetail(productId: string) {
        this.router.navigate(['/productDetail', productId]);
    }

    goToRecipesPerProductInstance(productInstanceId: string) {
        this.router.navigate(['/recipesPerProductInstance', productInstanceId]);
    }

    goToRecipesPerProductInstanceAndInterval(productInstanceId: string,
        startDate: Date,
        endDate: Date) {
        this.router.navigate(['/recipesPerProductInstance', productInstanceId, startDate, endDate]);
    }

    getStartProduction(): any {
        return this.startProduction;
    }
    getStopProduction(): any {
        return this.stopProduction;
    }

    saveStartProduction(start: any) {
        if (start != null && start !== '') {
            if (this.startProduction === '') {
                this.startProduction = start;
            } else {
                if (start < this.startProduction) {
                    this.startProduction = start;
                }
            }
        }
    }

    saveStopProduction(stop: any) {
        if (stop !== null && stop !== '' &&
            stop > this.stopProduction) {
            this.stopProduction = stop;
        }
    }

    getElapsed(start: any, stop: any): any {
        if (stop === null || start === null
            || start === '' || stop === '') {
            return '';
        }

        const exp = stop - start;
        const secs = Math.round(exp / 1000);   // from millisec to sec
        const mins = Math.trunc(secs / 60); // from sec to mins, truncated
        let toRet = mins + "' ";
        const secsRounded = mins * 60;
        const secsRemaining = secs - secsRounded;
        toRet = toRet + secsRemaining + "''";
        return toRet;
    }
}
