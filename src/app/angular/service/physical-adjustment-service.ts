import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { PhysicalAdjustment } from "../Data/physical-adjustment";
import { environment } from './../../../environments/environment';

@Injectable()
export class PhysicalAdjustmentService {

    private headers = new Headers({'Content-type' : 'application/json'});

    private physicalAdjustmentBaseUrl = environment.cloudUrl + '/physicalAdjustments';

    constructor(private http: Http) { }

    getPhysicalAdjustmentList(): Promise<PhysicalAdjustment[]> {
        const url = this.physicalAdjustmentBaseUrl;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as PhysicalAdjustment[])
            ;
    }
    getPhysicalAdjustments(myTarget : string): Promise<PhysicalAdjustment[]> {
        var url = this.physicalAdjustmentBaseUrl;
        if (myTarget == 'all')
            url = url;
        if (myTarget == 'system')
            url = url + "/system";
        if (myTarget != 'system' && myTarget != 'all')
        {
            url = url + "/equipment/" + myTarget;
        }
        console.log("getPhysicalAdjustments url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as PhysicalAdjustment[])
            ;
    }

}
