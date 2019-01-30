import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { CyberPhysicalDescription } from '../Data/cyber-physical-description';
import { Recipe } from '../Data/recipe';
import { Equipment } from '../Data/equipment';
import { Skill } from '../Data/skill';

@Injectable()
export class EquipmentService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    /* http://host:porta/api/v1/cpads */
    private baseUrl = `http://192.168.10.96:9995/api/v1/equipments`;
    /*
    getCPADList(): Promise<CyberPhysicalDescription[]>{
        return this.http
                .get(this.baseUrl)
                .toPromise()
                .then(response => response.json() as CyberPhysicalDescription[])
                .catch(this.handleError);
    }
    */
    getEquipmentById(equipmentId: string): Promise<Equipment> {
        /* http://host:porta/api/v1/cpads/{cpadId} */
        const url = `${this.baseUrl}/${equipmentId}`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Equipment)
            ;
    }
    // .catch(this.handleError)

    getEquipmentSkills(equipmentId: string): Promise<Skill[]> {
        /* http://host:porta/api/v1/equipments/{equipmentId}/skills */
        const url = `${this.baseUrl}/${equipmentId}/skills`;
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json() as Skill[])
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): Promise<any> {
        console.error('ERRORE LETTURA EQUIPMENT: ', error);
        return Promise.reject(error.message || error);
    }
    */
}
