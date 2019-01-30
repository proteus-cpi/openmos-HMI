import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { ProcessAssessment } from './../Data/process-assessment';
import { environment } from './../../../environments/environment';

@Injectable()
export class ProcessAssessmentService {

    private headers = new Headers({'Content-type' : 'application/json'});

    private assessmentBaseUrl = environment.cloudUrl + '/processAssessments';

    constructor(private http: Http) { }

    getProcessAssessmentList(): Promise<ProcessAssessment[]> {
        const url = this.assessmentBaseUrl;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ProcessAssessment[])
            ;
    }
    
    getProcessAssessmentsForSkill(myTarget : string): Promise<ProcessAssessment[]> {
        console.log("getProcessAssessmentsForSkill url = " + url);
        var url = this.assessmentBaseUrl;
       
        url = url + "/skill/" + myTarget;
        console.log("getProcessAssessmentsForSkill url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ProcessAssessment[])
            ;
    }
    getProcessAssessmentsForRecipe(myTarget : string): Promise<ProcessAssessment[]> {
        console.log("getProcessAssessmentsForRecipe url = " + url);
        var url = this.assessmentBaseUrl;
       
        url = url + "/recipe/" + myTarget;
        console.log("getProcessAssessmentsForRecipe url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ProcessAssessment[])
            ;
    }
    getProcessAssessmentsForAll(myTarget : string): Promise<ProcessAssessment[]> {
        console.log("getProcessAssessmentsForAll url = " + url);
        var url = this.assessmentBaseUrl;
        console.log("getProcessAssessmentsForAll url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as ProcessAssessment[])
            ;
    }

    getProcessAssessments(myContext: string, myTarget : string): Promise<ProcessAssessment[]> {
        console.log("getProcessAssessments myContext = " + myContext);
        console.log("getProcessAssessments myTarget = " + myTarget);
        console.log("getProcessAssessments url = " + url);
        var url = this.assessmentBaseUrl;

        if (myContext == 'skillDetail')
            return this.getProcessAssessmentsForSkill(myTarget);
        else if (myContext == 'skillRecipeView')
            return this.getProcessAssessmentsForRecipe(myTarget);       
        else
            return this.getProcessAssessmentsForAll(myTarget);
    }

    insertNewProcessAssessment(assessment: ProcessAssessment): Promise<ProcessAssessment> {
        const url = this.assessmentBaseUrl;
        return this.http
            .post(url, JSON.stringify(assessment), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as ProcessAssessment)
            ;
    } 
}
