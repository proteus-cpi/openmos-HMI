import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from './../service/product.service';
import { OrderService } from './../service/order.service';
import { T42AdviceService } from "./../service/t-42-advice.service";

import { Product } from './../Data/product';
import { Order } from './../Data/order';
import { OrderLine } from './../Data/order-line';
import { T42Product } from './../Data/t-42-product';

import { BaseComponent } from './base.component';
import { environment } from './../../../environments/environment';
import { T42Message } from '../Data/t-42-message';


@Component({
    selector: 'new-order-component',
    templateUrl: '../component_html/add-new-order-page.component.html'
})

export class AddNewOrderPageComponent extends BaseComponent implements OnInit {
    private requiredFieldMessage = 'This field is required';
    private errorsId = ['error-name', 'error-description', 'error-priority'];

    private priorityLabel = environment.orderPriorityPossibility;

    private products: Product[];

    private showForm = true;
    private showError = false;
    private errorMessage: string;
    
    private t42AdviceMessage : string  = "";
    private t42Messages : T42Message[];
    // private t42Message : T42Message;

    private orderToInsert = new Order();
    private orderLines: OrderLine[];

    constructor(private orderService: OrderService,
        private productService: ProductService,
        private t42AdviceService : T42AdviceService,
        private router: Router) {
            super();
    }

    ngOnInit() {
        this.loadProductsList();
        this.startOrderData();
        /*this.orderToInsert.uniqueId = super.generateRandomId('order');
        this.orderLines = new Array<OrderLine>(1);
        this.orderLines[0] = new OrderLine();*/
    }

    startOrderData(): void {
        this.orderToInsert.uniqueId = super.generateRandomId('order');
        this.orderLines = new Array<OrderLine>(1);
        this.orderLines[0] = new OrderLine();
    }

    loadProductsList(): void {
        this.productService
            .getProductsList()
            .then(
                response =>
                this.products = response
            );
    }

    addNewLine(): void {
        this.orderLines.push(new OrderLine());
        if (this.showError) {
            this.showError = false;
        }
    }

    removeLine(index: number): void {
        this.orderLines.splice(index, 1);
        if (this.orderLines.length === 0) {
            this.errorMessage = 'Insert at least one product';
            this.showError = true;
        }
    }

    insertOrder(): void {
        this.showError = false;
        this.errorMessage = null;
        
        console.log("insert order");
        if (!this.isFormEmpty()) {
            console.log("form ok");

            this.completeOrderLines();
            console.log("form ok 2");
            this.orderToInsert.orderLines = this.orderLines;
            console.log("form ok 3");

            this.orderService
            .insertNewOrder(this.orderToInsert)
            .then(
                () => {
                    console.log("service called ok");
                this.showForm = false;
            }
            )
            .catch(
                () => {
                    console.log("service called KO");
                    this.errorMessage = 'Something went wrong!';
                    this.showError = true;
                }
            );
        } else {
            this.errorMessage = 'Complete all the required fields';
            this.showError = true;
        }
    }

    completeOrderLines(): void {
        this.orderLines.forEach((element, index) => {
            element.orderId = this.orderToInsert.uniqueId;
            element.uniqueId = 'orderLineId' + index;
        });
    }

    isFormEmpty(): boolean {
        return this.checkEmptyFields() || this.isTableEmpty();
    }

    checkEmptyFields(): boolean {
        let result = false;
        let i = 0;
        while (i < this.errorsId.length && !result) {
            result = document.getElementById(this.errorsId[i]) !== null;
            i++;
        }
        return result;
    }

    isTableEmpty(): boolean {
        let empty = false;
        let i = 0;
        while (i < this.orderLines.length && !empty) {
            empty = this.controlIfIsUndefined(this.orderLines[i].productId)
                || this.controlIfIsUndefined(this.orderLines[i].quantity);
            i++;
        }
        return empty;
    }

    insertNewOrder(): void {
        this.showError = false;
        this.showForm = true;

        this.orderToInsert = new Order();
        this.orderLines = new Array<OrderLine>(1);
        this.orderLines[0] = new OrderLine();
        this.startOrderData();
    }

    getT42Advices(): void {
        this.showError = false;
        this.errorMessage = null;
        this.t42AdviceMessage = null;
        this.t42Messages = null;
        // this.t42Message = null;

        if (!this.isFormEmpty()) {
            this.completeOrderLines();
            this.orderToInsert.orderLines = this.orderLines;

            var tmpProducts = new Array<T42Product>(this.orderLines.length);
            this.orderLines.forEach((element, index) => {
                console.log("current order line = " + JSON.stringify(element) );

                var t42Product = new T42Product();
                t42Product.uniqueId = element.productId;

                this.products.forEach((currentProduct, currentProductIndex) => {
                    if (currentProduct.uniqueId === element.productId)
                    {
                        t42Product.name = currentProduct.name;
                    }
                });

                tmpProducts[index] = t42Product;    // element.productId;
            });
            /*
            var tmpProducts : Product[] = new Array<Product>(this.orderLines.length);
            this.orderLines.forEach((element, index) => {
                var tmpProduct : Product = new Product();
                tmpProduct.uniqueId = element.productId;
                tmpProducts[index] = tmpProduct;
            });
            */
    
            // TODO invoke t42 service
            // alert("TODO invoke t42 service: " +  JSON.stringify(tmpProducts));

            this.t42AdviceService.getT42Advice(tmpProducts)
            .then
                (response => {
                    // this.showForm = false;
                    // this.t42AdviceMessage = response;
                    this.t42Messages = response;
                    console.log("response : " + response);
                    // console.log("this.t42AdviceMessage = " + this.t42AdviceMessage);
                    console.log("this.t42Messages = " + this.t42Messages);
                    //alert(this.t42AdviceMessage);
                }
            )
            .catch(
                () => {
                    this.errorMessage = 'T4.2 advice service is not responding.';
                    this.showError = true;
                    console.log("this.errorMessage = " + this.errorMessage);
                }
            );

        } else {
            this.errorMessage = 'Complete all the required fields';
            this.showError = true;
        }

        
//        this.showError = false;
//        this.showForm = true;
    }

    goToSystemOverview(): void {
        this.router.navigate(['/subSystems']);
    }

    gotoOrderInstancesList(): void {
        this.router.navigate(['/orderInstances']);
    }

    private controlIfIsUndefined(value: any): boolean {
        return typeof value === 'undefined';
    }
}
