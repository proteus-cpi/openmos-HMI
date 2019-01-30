import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { FileUploadService } from './../service/file-upload.service';

@Component({
    selector: 'add-new-component-page',
    templateUrl: '../component_html/add-new-product-page.component.html'
})

export class AddNewProductPageComponent implements OnInit {

    ngOnInit(): void { }
}
