import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'bottom-footer',
    templateUrl: '../component_html/bottom-footer.component.html'
})

export class BottomFooterComponent implements OnInit {
    @Input() whereAmIContext: string = 'n/a';
    @Input() whereAmISubContext: string = 'n/a';
    @Input() whereAmIElement: string = 'n/a';

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void  {
        // alert(this.whereAmIContext);
        // alert(this.whereAmISubContext);
    }
}
