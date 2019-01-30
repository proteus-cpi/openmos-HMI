import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'not-found',
    templateUrl: '../component_html/not-found-page.component.html'
})

export class NotFoundComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

}
