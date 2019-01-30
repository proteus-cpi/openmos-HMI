import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SubSystemService } from './../service/sub-system.service';
import { ModuleService } from './../service/module.service';
import { environment } from '../../../environments/environment';

@Component({
    templateUrl: '../component_html/base.component.html',
    providers: [SubSystemService]
})

export class BaseComponent  {

    public subSystemNameToPrint: string;

    public callerIdToBePrinted: string = "";
    public callerTypeToBePrinted: string = "";

    getPrintableSubSystemId(callerId: string) {
        var myElem;
        var subSystemId;

        if (callerId.indexOf(environment.paramSeparator) != -1)
            myElem = callerId.split(environment.paramSeparator);
        else
            myElem = [callerId];
        console.log("getPrintableSubSystemId: " + myElem);
        var myFirstElem = myElem[0].split(environment.paramValueSeparator);
        console.log("getPrintableSubSystemId: " + myFirstElem[0]);
        if (myFirstElem[0] == environment.subSystemMarkerPrefix)
            subSystemId = myFirstElem[1];
        else
            subSystemId = "";


        return subSystemId;
    }

    startPrintableSubSystemName(subSystemId: string, subSystemService: SubSystemService): void {
        if (sessionStorage.getItem(subSystemId) !== null) {
            // console.log('Found SS name in session');
            this.subSystemNameToPrint = sessionStorage.getItem(subSystemId);
        } else {
           // console.log('Call service to get SS name');
            subSystemService
                .getSubSystemById(subSystemId)
                .then(
                        response => {
                            this.subSystemNameToPrint = response.name;
                            sessionStorage.setItem(response.uniqueId, response.name);
                        }
                    );
        }
    }

    startPrintableModuleName(moduleId: string, moduleService: ModuleService): void {
        if (sessionStorage.getItem(moduleId) !== null) {
            this.subSystemNameToPrint = sessionStorage.getItem(moduleId);
        } else {
            moduleService
                .getModuleById(moduleId)
                .then(
                    response => {
                        this.subSystemNameToPrint = response.name;
                        sessionStorage.setItem(response.uniqueId, response.name);
                    }
                );
        }
    }

    getPrintableModuleId(callerId: string) {
        var myElem;
        var moduleId;

        if (callerId.indexOf(environment.paramSeparator) != -1)
            myElem = callerId.split(environment.paramSeparator);
        else
            myElem = [callerId];

        console.log("getPrintableModuleId: " + myElem);
        var myLastElem = myElem[myElem.length - 1].split(environment.paramValueSeparator);
        console.log("getPrintableModuleId: " + myLastElem[0]);
        if (myLastElem[0] == environment.moduleMarkerPrefix)
            moduleId = myLastElem[1];
        else
            moduleId = "";
      
        return moduleId;
    }

    getPrintableSkillId(callerId: string) {
        var myElem;
        var skillId;

        if (callerId.indexOf(environment.paramSeparator) != -1)
            myElem = callerId.split(environment.paramSeparator);
        else
            myElem = [callerId];
        
        console.log("getPrintableSkillId: " + myElem);
        var myLastElem = myElem[myElem.length - 1].split(environment.paramValueSeparator);
        console.log("getPrintableSkillId: " + myLastElem[0]);
        if (myLastElem[0] == environment.skillMarkerPrefix)
            skillId = myLastElem[1];
        else
            skillId = "";
      
        return skillId;
    }

    getPrintableRecipeId(callerId: string) {
        var myElem;
        var recipeId;

        if (callerId.indexOf(environment.paramSeparator) != -1)
            myElem = callerId.split(environment.paramSeparator);
        else
            myElem = [callerId];
        
        console.log("getPrintableRecipeId: " + myElem);
        var myLastElem = myElem[myElem.length - 1].split(environment.paramValueSeparator);
        console.log("getPrintableRecipeId: " + myLastElem[0]);
        if (myLastElem[0] == environment.recipeMarkerPrefix)
            recipeId = myLastElem[1];
        else
            recipeId = "";
      
        return recipeId;
    }

    getPrintableCallerType(callerType: string) {
        return callerType.toLowerCase();
    }

    generateRandomId(component: string): string {
        return component
            + new Date().getTime().toString()
            +  '_'
            + (Math.floor(Math.random() * 3 + 1)).toString();
    }

}
