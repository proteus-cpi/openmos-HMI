import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';

import 'rxjs/add/operator/switchMap';

import { ExecutionTableService } from '../service/execution-table.service';
import { SubSystemService } from '../service/sub-system.service';

import { ExecutionTable } from '../Data/execution-table';
import { ExecutionTableRow } from '../Data/execution-table-row';
import { ExecutionTableRowHelper } from '../Data/execution-table-row-helper';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'execution-table-page',
    templateUrl: '../component_html/execution-table-page.component.html'
})

export class ExecutionTablePageComponent implements OnInit {
    // @Input() executionTableId: string = '-1';
    @Input() callerType: string = 'unknownType';
    @Input() callerId: string = 'unknown';

    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    executionTableRowHelper: ExecutionTableRowHelper;
    executionTable: ExecutionTable;
    executionTableRows: ExecutionTableRow[];

    isEditing: boolean = false;
    addRow: boolean;

    newRowIndex: number;

    constructor (private router: Router,
        private route: ActivatedRoute,
        private subSystemService: SubSystemService,
        private executionTableService: ExecutionTableService) { }

        ngOnInit(): void {
            // console.log('ngOnInit: ' + this.callerId);
            if (this.callerId === 'unknown') {
                // console.log('module @input parameter not found (' + this.callerId + '), go for querystring parameter');
                this.route.paramMap
                .switchMap(
                    (params: ParamMap) =>
                    this.callerId = params.get('parentId')
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
            // console.log('parentId: ' + this.callerId);
            // console.log('parentType: ' + this.callerType);
        }
}
