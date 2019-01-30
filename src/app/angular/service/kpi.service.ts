import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { KPI } from "../Data/kpi";

@Injectable()
export class KPIService{    
    /* Public headers to resolve CORS problem */
    /*private headers = new Headers(
        {'Access-Control-Allow-Header' : 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin' : '*'}
    );*/
    
	public kpis: KPI[];

    constructor(private http: Http) { }

    getKPIAsXml(): Promise<KPI[]>{
        const kpiUrl = `http://192.168.10.96:8084/openMOSServices/KpiController/getKpiListXml`;
        
        return this.http
            .get(kpiUrl)
            .toPromise()
            .catch(this.handleError);
    } 

    getKPIsFromWeb(): Promise<KPI[]>{
        const kpiUrl = `http://192.168.56.1:8084/openMOSServices/KpiController/getKpiListJson`;
        return this.http
                .get(kpiUrl)
                //.do(response => console.error("JSON: ", response.json()))
                .toPromise()
                .then(response => response.json() as KPI[])
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Si è verificato un errore', error);
        return Promise.reject(error.message || error);
    }
}