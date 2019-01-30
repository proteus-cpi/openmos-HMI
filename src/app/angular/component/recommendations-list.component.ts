import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';

import { RecommendationService } from "../service/recommendation.service";
import { SubSystemService } from "../service/sub-system.service";

import { environment } from '../../../environments/environment';
import { BaseComponent  } from './base.component';
import { Recommendation } from "../Data/recommendation";
import { SubSystem } from "../Data/sub-system";
import { SubSystemStage } from "../Data/sub-system-stage";

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'recommendations-list',
    templateUrl: '../component_html/recommendations-list.component.html'
})

export class RecommendationsListComponent extends BaseComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';
    @Input() currentSubSystemsList: SubSystem[];

    private repeater;

    private recommendations: Recommendation[];

    constructor (private router: Router,
        private route: ActivatedRoute,       
        private recommendationService: RecommendationService,
        private subSystemService: SubSystemService) {
            super();
    }

    ngOnInit(): void {
        this.updateData();

        this.repeater = Observable.interval(10000)
            .subscribe(x => {
//                console.log('RR: ' + x);
                this.updateData();
            }
        );

    }

    goToRecommendationDetails(selectedRecommendation: Recommendation): void {
        this.router.navigate(
            ['/recommendationDetail', selectedRecommendation.uniqueId]
        );
    }

    updateData(): void {
//        console.log("this.currentSubSystemsList: " + JSON.stringify(this.currentSubSystemsList));
        /*
       console.log('ngOnInit: ' + this.callerId);
       if (this.callerId === 'unknown') {
            // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerId = params.get('parentId')
            )
            .subscribe();
        }
        console.log('ngOnInit: ' + this.callerType);
        if (this.callerType === 'unknownType') {
            // console.log('module @input parameter not found (' + this.callerType + '), go for querystring parameter');
            this.route.paramMap
            .switchMap(
                (params: ParamMap) =>
                this.callerType = params.get('parentType')
            )
            .subscribe();
        }

        console.log('Recommendations List callerTpe: ' + this.callerType);
        */

        this.recommendationService
            .getRecommendationsList()
            .then(
                response => {
//                    console.log("recommendations: " + JSON.stringify(response));
                    this.recommendations = response;

                    var r : any;
                    if (this.recommendations && this.recommendations.length > 0 && 
                        this.currentSubSystemsList && this.currentSubSystemsList.length > 0)
                    {
                        for (r in this.recommendations)
                        {
//                            console.log("r corrente : " + r);

                            for (var css = 0; css < this.currentSubSystemsList.length; css++)
                            {
                                if (this.currentSubSystemsList[css].uniqueId == this.recommendations[r].subSystemId)
                                {
                                    this.recommendations[r].subSystemName = this.currentSubSystemsList[css].name;
                                    if (this.currentSubSystemsList[css].stage == "Ramp_Up")
                                        this.recommendations[r].isInRampup = true; 
                                    else
                                        this.recommendations[r].isInRampup = false;
                                    break;
                                }
                            }
/*
                            if (sessionStorage.getItem(this.recommendations[r].subSystemId) != null) {
                                // console.log('BREADCRUMB ' + i + ' : is SS -> name in session: ' + sessionStorage.getItem(elemId));
                                this.recommendations[r].subSystemName = sessionStorage.getItem(this.recommendations[r].subSystemId);
                            }
        
                            this.subSystemService
                            .getSubSystemStage(this.recommendations[r].subSystemId)
                            .then(
                                response => {
                                    console.log("subsystem stage: " + JSON.stringify(response));

                                    var s : SubSystemStage;
                                    s = response;

                                    console.log("ss stage = " + s.stage);
                                    if (s.stage == "Ramp_Up")
                                        this.recommendations[r].isInRampup = true; 
                            });   
*/
                            /*
                            this.subSystemService
                            .getSubSystemById(this.recommendations[r].subSystemId)
                            .then(
                                response => {
                                    console.log("subsystem: " + JSON.stringify(response));

                                    var s : SubSystem;
                                    s = response;

                                    console.log("s.name = " + s.name);
                                    this.recommendations[r].subSystemName = s.name;
                            });   
*/                                     
                        }
                    }

                }
            );
            
        
        // this.callerTypeToBePrinted = this.getPrintableCallerType(this.callerType);
    }
}
