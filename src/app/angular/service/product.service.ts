import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { SubSystem } from '../Data/sub-system';
import { Recipe } from '../Data/recipe';
import { Skill } from '../Data/skill';
import { Product } from '../Data/product';
import { SkillRequirement } from '../Data/skill-requirement';
import { Part } from '../Data/part';
import { environment } from '../../../environments/environment';
import { ProductInstance } from '../Data/product-instance';

@Injectable()
export class ProductService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private products: Product[];
    private promiseProducts: Promise<Product[]>;

    constructor(private http: Http) { }

    // private baseUrl = `http://192.168.15.1:9995/api/v1/products`;
    private baseUrl = environment.apiUrl + `/products`;

    getProductsList(): Promise<Product[]> {
        return this.http
                .get(this.baseUrl)
                .toPromise()
                .then(response => response.json() as Product[])
                ;
    }
    // .catch(this.handleError)

    getProductsInstancesList(): Promise<ProductInstance[]> {
        const url = `${environment.cloudUrl}/orderinstances/notyetproduced`;
        return this.http
                .get(url)
                .toPromise()
                .then(response => response.json() as ProductInstance[])
                ;
    } // .catch(this.handleError)

    getProductById(productId: string): Promise<Product> {
        /* http://host:porta/api/v1/products/{productId} */
        const url = `${this.baseUrl}/${productId}`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Product)
            ;
    } // .catch(this.handleError)

    getProductParts(productId: string): Promise<Part[]> {
        /* http://host:porta/api/v1/products/{productId}/components */
        const url = `${this.baseUrl}/${productId}/parts`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Part[])
            ;
    } // .catch(this.handleError)

    getProductSkillRequirements(productId: string): Promise<SkillRequirement[]>{
        /* http://host:porta/api/v1/products/{productId}/skillrequirements */
        const url = `${this.baseUrl}/${productId}/skillrequirements`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as SkillRequirement[])
            ;
    } // .catch(this.handleError)

    deleteProduct(productId: string): Promise<boolean> {
        const url = `${this.baseUrl}/${productId}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(response => response.json() as boolean);
    }
    
    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA PRODUCT: ', error);
        return Promise.reject(error.message || error);
    }
    */
}
