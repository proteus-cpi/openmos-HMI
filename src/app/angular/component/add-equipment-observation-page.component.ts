import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'add-equipment-observation-page',
    templateUrl: '../component_html/add-equipment-observation-page.component.html'
})

export class AddEquipmentObservationPageComponent implements OnInit {
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';

    constructor (private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        console.log('ngOnInit: ' + this.callerId);
        if (this.callerId === 'unknown') {
                console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
                this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
                    // this.callerId = params.get('id')
                )
                .subscribe();
                this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerType = params.get('parentType')
                )
                .subscribe();
            }
    }

}
