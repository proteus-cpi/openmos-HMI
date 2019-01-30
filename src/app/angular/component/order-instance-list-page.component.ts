import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { OrderInstanceService } from '../service/order-instance.service';

import { OrderInstance } from '../Data/order-instance';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'order-instances-list-page',
    templateUrl: '../component_html/order-instance-list-page.component.html'
})

export class OrderInstanceListPageComponent implements OnInit {
    @Input() callerType = 'unknownType';
    @Input() callerId = 'unknown';

    private orderInstances: OrderInstance[];

    constructor (private router: Router,
        private route: ActivatedRoute,
        private orderInstanceService: OrderInstanceService) { }

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

console.log('go! ');

//                this.subSystemId = this.getPrintableModuleId(this.callerId);
//                super.startPrintableModuleName(this.subSystemId, this.moduleService);

                this.orderInstanceService
                    .getList()
                    .then(
                        response => this.orderInstances = response
                    );

    }

    goToOrderInstanceView(selectedOrderInstance: OrderInstance): void {
        this.router.navigate(['/orderInstance', 
        selectedOrderInstance.uniqueId]);
    }

}
