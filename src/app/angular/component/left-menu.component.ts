import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'left-menu',
    templateUrl: '../component_html/left-menu.component.html'
})

export class LeftMenuComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void{
    }

    
}