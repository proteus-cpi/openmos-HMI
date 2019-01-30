import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { EquipmentAssessment } from './../Data/equipment-assessment';
import { environment } from './../../../environments/environment';

@Injectable()
export class AssessmentService {

    private headers = new Headers({'Content-type' : 'application/json'});

    private assessmentBaseUrl = environment.cloudUrl + '/equipmentAssessments';

    constructor(private http: Http) { }

    getAssessmentList(): Promise<EquipmentAssessment[]> {
        const url = this.assessmentBaseUrl;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as EquipmentAssessment[])
            ;
    }
    // .catch(this.handleError)
    getAssessments(myTarget : string): Promise<EquipmentAssessment[]> {
        var url = this.assessmentBaseUrl;       
        if (myTarget == 'all')
            url = url;
        if (myTarget == 'system')
            url = url + "/system";
        if (myTarget != 'system' && myTarget != 'all')
        {
            url = url + "/equipment/" + myTarget;
        }
        console.log("getAssessments url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as EquipmentAssessment[])
            ;
    }

    getAssessmentDetail(equipmentAssessmentId: string): Promise<EquipmentAssessment> {
        const url = `${this.assessmentBaseUrl}/${equipmentAssessmentId}`;
        console.log('getAssessmentDetail url -> ' + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as EquipmentAssessment)
            ;
    }

    insertNewAssessment(assessment: EquipmentAssessment): Promise<EquipmentAssessment> {
        const url = this.assessmentBaseUrl;
        return this.http
            .post(url, JSON.stringify(assessment), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as EquipmentAssessment)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.log('Error in assessment service: ' + error);
        return Promise.reject(error.message || error);
    }
    */
}
