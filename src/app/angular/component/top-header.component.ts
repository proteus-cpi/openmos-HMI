import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'top-header',
    templateUrl: '../component_html/top-header.component.html'
})

export class TopHeaderComponent implements OnInit{

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void  { 
    }


}