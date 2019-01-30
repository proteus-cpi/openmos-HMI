import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SubSystemService } from '../service/sub-system.service';

import { SubSystem } from '../Data/sub-system';
import { environment } from '../../../environments/environment';
import { BaseComponent } from './base.component';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'object-pretty-printer',
    templateUrl: '../component_html/object-pretty-printer.component.html'
})

export class ObjectPrettyPritterComponent extends BaseComponent implements OnInit {
    @Input() objectToPrint: any = null;
    @Input() objectIdentifier: any = null;
    private prettyJson = '';

    constructor(private subSystemService: SubSystemService,
        private router: Router) {
            super();
        }

    ngOnInit(): void {
        // Id on an html element must not contain whitespace and
        // character like: :, *, /
        this.objectIdentifier = this.objectIdentifier.replace(/[\s]/g, '');
        this.objectIdentifier = this.objectIdentifier.replace(/:/g, '');
        // console.log(this.objectIdentifier);

        this.formatObjectDetail(this.objectToPrint);
    }

    formatObjectDetail(object: any): void {
        // alert(JSON.stringify(subSystem));
        this.prettyJson = JSON.stringify(object, null, '    ');
        // console.log('----------------------------------');
        // console.log(this.prettyJson);
    }
}
