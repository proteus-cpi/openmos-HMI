import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { ExecutionTable } from '../Data/execution-table';
import { ExecutionTableRowHelper } from '../Data/execution-table-row-helper';
import { environment } from '../../../environments/environment';

@Injectable()
export class ExecutionTableService {
    private headers = new Headers({'Content-Type': 'application/json'});

    // http://host:porta/api/v1/executionTables
    // private executionTableBaseUrl = `http://192.168.15.1:9995/api/v1/executiontables/`;
    private executionTableBaseUrl = environment.apiUrl + `/executiontables/`;

    constructor(private http: Http) { }

    getExecutionTableById(id: string): Promise<ExecutionTable> {
        /* http://host:porta/api/v1/executionTables/{id} */
        const url = `${this.executionTableBaseUrl}${id}`;
        console.log('getExecutionTableById url: ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ExecutionTable)
            ;
    }
    // .catch(this.handleError)

    updateExecutionTable(componentId: string, executionTable: ExecutionTable): Promise<ExecutionTable> {
        // http://host:porta/api/v1/executionTables/{id}
        const url = `${this.executionTableBaseUrl}${componentId}`;
        // console.log(JSON.stringify(executionTable));
        console.log('updateExecutionTable url: ' + url);
        return this.http
            .put(url, JSON.stringify(executionTable, this.replacer), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as ExecutionTable)
            ;
    }
    // .catch(this.handleError)

    addNewRow(componentId: string, rowHelper: ExecutionTableRowHelper): Promise<ExecutionTable> {
        // http://host:porta/api/v1/executionTables/{id}/newRow
        const url = `${this.executionTableBaseUrl}${componentId}/newRow`;
        console.log("row to be added before post: " + JSON.stringify(rowHelper));
        console.log('addNewRow url: ' + url);
        return this.http
            .post(url, JSON.stringify(rowHelper, this.replacer), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as ExecutionTable)
            ;
    }
    // .catch(this.handleError)

    deleteRow(subSystemId: string, rowId: string): Promise<ExecutionTable> {
        // http://host:porta/api/v1/executionTables/{tableId}/rows/{rowId}
        const url = `${this.executionTableBaseUrl}${subSystemId}/rows/${rowId}`;
        console.log('deleteRow url: ' + url);
        return this.http
            .delete(url, null)
            .toPromise()
            .then(response => response.json() as ExecutionTable)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA EXECUTION TABLE: ', error);
        return Promise.reject(error.message || error);
    }
    */

    // This method removes extra-attributes present on rows object
    // to avoid error due to conversion from JSON to Java Object on REST
    private replacer(key, value) {
        if (key === 'avaibleNextRecipe') {
            return undefined;
        } else if (key === 'productDetailObject') {
            return undefined;
        } else if (key === 'productInstanceDetailObject') {
            return undefined;
        } else if (key === 'recipeDetailObject') {
            return undefined;
        } else if (key === 'nextRecipeObject') {
            return undefined;
        } else {
            return value;
        }
    }
}
