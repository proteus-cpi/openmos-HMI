import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';

import { RecipeExecutionDataService } from './../service/recipe-execution-data.service';

import { SeriesObject } from './../Data/series-object';
import { RecipeExecutionData } from './../Data/recipe-execution-data';
import { DataGraphMapper } from './../Data/data-graph-mapper';
import { KPISetting } from './../Data/kpi-setting';

@Component({
    selector: 'recipe-execution-data-graph',
    templateUrl: './../component_html/recipe-execution-graph.component.html'
})
export class RecipeExecutionDataGraphComponent implements OnInit, OnDestroy {

    // tslint:disable-next-line:no-inferrable-types
    @Input() recipeId: string = 'unknown';
    @Input() functionName: string = 'recipe_execution_data_history';
    @Input() productInstanceId: string = 'unknown';

    possibleKpiName: string[];

    graphType = ['Table', 'Line charts', 'Histogram'];
    showDivs = [false, false, false];
    selectedGraphType: string;

    selectedKpiName: string;

    to: Date = new Date();
    from: Date = new Date();

    recipesData: RecipeExecutionData[];
    graphData: DataGraphMapper[];
    histogramData: any[];
    dataToShow = null;

    view: any[] = [1100, 650];

    // graph options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Date';
    showYAxisLabel = true;
    yAxisLabel = 'Seconds';
    autoscale = true;
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private repeater;
    private repeaterCounter = 10;

    constructor(private service: RecipeExecutionDataService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnDestroy(): void {
        if (this.repeater) {
            this.repeater.unsubscribe();
        }
    }

    ngOnInit(): void {
        console.log("functionName = " + this.functionName);

        if (this.functionName == "recipe_execution_data_history")
        {
            // console.log('recipeId before: ' + this.recipeId);
            if (this.recipeId === 'unknown') {
                this.route.paramMap
                    .switchMap(
                    (params: ParamMap) =>
                        this.recipeId = params.get('recipeId')
                    )
                    .subscribe();
            }

            console.log('recipeId: ' + this.recipeId);

            this.service
                .getKpiName(this.recipeId)
                .then(
                    response => {
                        this.possibleKpiName = response;
                        // console.log(response);
                    }
                );

            this.from.setHours(0, 0, 0, 0);
            this.to.setHours(23, 59, 0, 0);
        }
        else         if (this.functionName == "trg_recipe")
        {
            // console.log('recipeId before: ' + this.recipeId);
            if (this.recipeId === 'unknown') {
                this.route.paramMap
                    .switchMap(
                    (params: ParamMap) =>
                        this.recipeId = params.get('recipeId')
                    )
                    .subscribe();
            }
            console.log('recipeId: ' + this.recipeId);
            if (this.productInstanceId === 'unknown') {
                this.route.paramMap
                    .switchMap(
                    (params: ParamMap) =>
                        this.productInstanceId = params.get('productInstanceId')
                    )
                    .subscribe();
            }
            console.log('productInstanceId: ' + this.productInstanceId);

            this.askForTriggerData();
            this.repeatCallForTrigger();

            this.from.setHours(0, 0, 0, 0);
            this.to.setHours(23, 59, 0, 0);
        }

    }

    repeatCallForTrigger(): void {
        this.repeater = Observable.interval(5000)
        .subscribe(x => {
            console.log("Repeat: " + this.repeaterCounter);
            if (this.repeaterCounter >= 0) {
                this.repeaterCounter--;
                this.askForTriggerData();
            } else {
                this.repeater.unsubscribe();
            }      
        });
    }

    askForTriggerData(): void {
        this.service
            .getKpisForProductAndRecipe(this.productInstanceId, this.recipeId)
            .then(
                response => {
                    this.possibleKpiName = response;
                    this.repeaterCounter = this.possibleKpiName.length > 0 ? -2 : this.repeaterCounter;
                }
            );
    }    

    drawGraph(): void {
        if (this.recipesData !== undefined
            && this.recipesData !== null) {
            this.graphData = new Array<DataGraphMapper>(1);
            this.graphData[0] = new DataGraphMapper();
            this.graphData[0].name = 'recipe';
            this.graphData[0].series = new Array<SeriesObject>();

            this.histogramData = new Array<SeriesObject>();

            this.recipesData.forEach(element => {
                const series = new SeriesObject();

                // const dateAsNumber = JSON.parse(element.registered.toString()) as number;
                const date = new Date(JSON.parse(element.registered.toString()) as number);
                series.name = date.getUTCDate() + '/' + (date.getMonth() + 1)
                    + ' - ' + date.toLocaleTimeString();

                element.kpiSettings.forEach(kpiSett => {
                    if (kpiSett.name === this.selectedKpiName) {
                        this.yAxisLabel = kpiSett.unit;
                        series.value = kpiSett.value;
                        this.graphData[0].series.push(series);
                        this.histogramData.push(series);
                    }
                });
            });

            // this.dataToShow = '[' + JSON.stringify(this.graphData) + ']';
        }
    }

    getData(): void {
        this.service
            .getExecutionDataBetweenDates(this.dateAsString(this.from),
            this.dateAsString(this.to),
            this.recipeId,
            this.selectedKpiName)
            .then(
            response => {
                this.recipesData = response;
                console.log(response.length);

                response.forEach(ele => {
                    if (ele.kpiSettings.length === 2) {
                        console.log('AAa');
                    }
                });

                this.drawGraph();
            }
            );
    }

    getDataForProductAndRecipe(): void {
/*
        this.service
            .getExecutionDataBetweenDates(this.dateAsString(this.from),
            this.dateAsString(this.to),
            this.recipeId,
            this.selectedKpiName)
*/
        this.service
            .getExecutionDataForProductAndRecipeAndKpi(this.productInstanceId, 
                this.recipeId,
                this.selectedKpiName)
            .then(
            response => {
                this.recipesData = response;
                console.log(response.length);

                /*
                response.forEach(ele => {
                    if (ele.kpiSettings.length === 2) {
                        console.log('AAa');
                    }
                });
                */

                this.drawGraph();
            }
            );
    }

    selectGraph(type): void {
        // console.log(type);
        switch (type) {
            case this.graphType[0]:
                this.showDivs = [true, false, false];
                break;

            case this.graphType[1]:
                this.showDivs = [false, true, false];
                break;

            case this.graphType[2]:
                this.showDivs = [false, false, true];
                break;
        }
    }

    getKpiByType(recipeData: RecipeExecutionData): KPISetting {
        // console.log(recipeData);
        let ret = null;
        let x = 0;
        recipeData.kpiSettings.forEach(kpiSett => {
            // console.log(kpiSett);
            if (kpiSett.name === this.selectedKpiName) {
                // console.log('return');
                ret = kpiSett;
                x++;
            }
        });
        // console.log('n of: ' + x);
        return ret;
    }

    parseDate(dateAsString: string): Date {
        if (dateAsString !== null) {
            /*console.log(dateAsString);
            const date = new Date(dateAsString);
            console.log(date.getHours() + ' -> ' + date.getHours().toString().length);
            console.log(date.getMinutes() + ' -> '
              + date.getMinutes().toString().length);*/
            return new Date(dateAsString);
        }
        return new Date();
    }

    dateAsString(date: Date): string {
        const hours = date.getHours().toString();
        const minutes = date.getMinutes().toString();

        /*console.log(''
        + date.getUTCFullYear()
        + (date.getUTCMonth() + 1)
        + date.getUTCDate()
        + this.getTime(hours)
        + this.getTime(minutes)
        + '00000');
        */
/*
        return ''
            + date.getUTCFullYear()
            + (date.getUTCMonth() + 1)
            + date.getUTCDate()
            + this.getTime(hours)
            + this.getTime(minutes)
            + '00000';
*/
        return ''
            + date.getUTCFullYear()
            + this.getTime('' + (date.getUTCMonth() + 1))
            + this.getTime('' + date.getUTCDate())
            + this.getTime(hours)
            + this.getTime(minutes)
            + '00000';
    }

    getTime(time: string): string {
        return time.length < 2 ? '0' + time : time;
    }

    goToRecipesPerProductInstance(productInstanceId: string) {
        this.router.navigate(['/recipesPerProductInstance', productInstanceId]);
    }

}
