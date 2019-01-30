import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ProductService } from '../service/product.service';

import { Skill } from '../Data/skill';
import { Module } from '../Data/module';
import { Product } from '../Data/product';

import { environment } from '../../../environments/environment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'product-view-page',
    templateUrl: '../component_html/product-view-page.component.html'
})

export class ProductViewPageComponent implements OnInit {
    @Input() callerType: string = 'product';
    @Input() callerId: string = 'unknown';

    @Input() productId: string = '-1';

    /* parts, skillRequirements */
    private showSelector = [true, true];
    private selectedProduct: Product;
    private values: any;

    constructor(private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.initializeProductData();
    }

    initializeProductData(): void {
        if (this.callerId !== null && this.callerId !== 'unknown') {
            console.debug('uso parametro');
        } else {
            console.debug('uso url');
            this.route.paramMap
                .switchMap((params: ParamMap) =>
                    this.callerId = params.get('parentId')
                )
                .subscribe();
        }

        var elems = this.callerId.split(environment.paramSeparator);
        var productElem = elems[elems.length - 1];
        var productElem2 = productElem.split(environment.paramValueSeparator);
        this.productId = productElem2[1];   // this.callerId;

        this.productService
            .getProductById(this.callerId)
            .then(response => {
                this.selectedProduct = response;
                console.log(this.selectedProduct.skillRequirements.length);
                }
            );
    }

    changeView(index: number, value: any): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = false;
        }
        this.values = value;
        this.fetchData(index);
        this.showSelector[index] = true;
    }

    fetchData(index: number) {
        switch (index) {
            case 0:
                this.values = this.selectedProduct.parts;
                break;

            case 1:
                this.values = this.selectedProduct.skillRequirements;
                break;

            default:
                break;
        }
    }

    showAllProperties(): void {
        for (let i = 0; i < this.showSelector.length; i++) {
            this.showSelector[i] = true;
        }
    }
}
