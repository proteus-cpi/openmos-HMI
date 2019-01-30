import { Component, OnInit } from '@angular/core';
import * as XmlParser from 'xml2js';

import { KPI } from '../Data/kpi';
import { KPIService } from '../service/kpi.service'; 

import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: '../component_html/kpi.module.html'
})

export class KpiComponent implements OnInit {
  private parser = new XmlParser.Parser();
  title = 'OpenMos HMI';
  
  kpis: KPI[];
  kpis2: KPI[];
  kpisX: KPI[];

  constructor(
    private kpiService: KPIService
  ) {}

  ngOnInit(): void{
    this.getKpis();
  }

  getKpis(): void{
    this.kpiService.getKPIsFromWeb().then(res =>this.kpis = res);
    this.kpiService.getKPIAsXml()
        .then(response => {
              var c;
              this.parser.parseString(response["_body"], function (err, result) {
              var x = JSON.stringify(result);
              x = x.substring(22, x.length - 2);
              x = x.replace( /\[/gi , '');
              x = x.replace(/\]/gi, '');
              x = '[' + x + ']';
              //console.error("RES: ", x);
              //console.error("JSON2", JSON.parse(x) as Kpi[]);
              c = JSON.parse(x) as KPI[];						
            });
          //console.error("C: ", c);
          this.kpisX = c;
          }                   
        )   
  }
}