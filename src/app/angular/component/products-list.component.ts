import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSystemService } from '../service/sub-system.service';
import { ProductService } from '../service/product.service';

import { SubSystem } from '../Data/sub-system';
import { Product } from '../Data/product';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'products',
    templateUrl: '../component_html/products-list.component.html'
})

export class ProductsListComponent implements OnInit {

    private products: Product[];
    private selectedProduct: Product;

    constructor(private productService: ProductService,
        private router: Router) { }

    ngOnInit(): void {
        this.getProductsList();
    }

    getProductsList(): void {
        this.productService.getProductsList()
            .then(response => this.products = response);
    }

    onSelectProduct(product: Product): void {
        this.selectedProduct = product;
    }

    goToProductDetail(product: Product) {
        this.router.navigate(['/productDetail', product.uniqueId]);
    }

    createOrder() {
        this.router.navigate(['/addNewOrder']);
    }

    goToComponentsList(product: Product): void {
        this.router.navigate(['/componentsList', product.uniqueId]);
    }

    goToSkillRequirementsList(product: Product): void {
        this.router.navigate(['skillRequirementsList', product.uniqueId]);
    }

    addNewProduct(): void {
        this.router.navigate(['/addNewProduct']);
    }

    deleteProduct(product: Product): void {
        let deletionEsit;
        this.productService
            .deleteProduct(product.uniqueId)
            .then(response => {
                deletionEsit = response;
                // console.log('E: ' + deletionEsit);
                if (deletionEsit) {
                    // if deletion success reload list
                    this.getProductsList();
                } else {
                    // TODO: if deletion fail make segnalation to user
                }
            }
        );

    }
}
