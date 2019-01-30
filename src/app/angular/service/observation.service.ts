import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { EquipmentObservation } from './../Data/equipment-observation';
import { environment } from './../../../environments/environment';

@Injectable()
export class ObservationService {
    private headers = new Headers({'Content-Type': 'application/json'});

    // private observationBaseUrl = `http://mistique:9993/api/v1/equipmentobservations`;
    private observationBaseUrl = environment.cloudUrl + `/equipmentobservationrel2s`;

    constructor(private http: Http) { }

    getObservationList(): Promise<EquipmentObservation[]> {
        const url = this.observationBaseUrl;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as EquipmentObservation[])
            ;
    }
    getObservations(myTarget : string): Promise<EquipmentObservation[]> {
        var url = this.observationBaseUrl;
/*         if (openmosTarget == 'system')
            url = url + "/system";
        if (openmosTarget != 'system' && openmosTarget != 'all')
            url = url + "/equipment/" + openmosTarget;
 */        
        if (myTarget == 'all')
            url = url;
        if (myTarget == 'system')
            url = url + "/system";
        if (myTarget != 'system' && myTarget != 'all')
        {
            url = url + "/equipment/" + myTarget;
        }
        console.log("getObservations url = " + url);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as EquipmentObservation[])
            ;
    }
    // .catch(this.handleError)

    insertNewObservation(observation: EquipmentObservation): Promise<EquipmentObservation> {
        // console.log('start add obs');
        const url = this.observationBaseUrl;
        return this.http
            .post(url, JSON.stringify(observation), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as EquipmentObservation)
            ;
    }
    // .catch(this.handleError)

    /*
    handleError(error: any): Promise<any> {
        console.log('Error getting observation: ' + error);
        return Promise.reject(error.message || error);
    }
    */
}
