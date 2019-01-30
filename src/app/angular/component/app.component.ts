import { Component, OnInit, Injector } from '@angular/core';
import { SharedDataService } from '../service/shared.data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: '../component_html/app.component.html',
  styleUrls: ['../component_css/app.component.css']
})

export class AppComponent implements OnInit {
  title = 'OpenMOS HMI';

  public userInfo: string ;
  public editUser: boolean;
  public actualUserinfo: string;

  public dataService: SharedDataService;
  protected serviceCookie: CookieService;

  constructor( injector: Injector ) {
    this.dataService = injector.get(SharedDataService);
    this.serviceCookie = injector.get(CookieService);
    this.dataService.userInfo.subscribe(userInfo => this.actualUserinfo = userInfo );
    
  }

  ngOnInit(): void {
    console.log('App component ngOnInit');
    console.log('this.editUser ' + this.editUser);
    let toEdit = true;
    if (this.userInfo === undefined) {
      console.log('serviceCookie.check userInfo ' + this.serviceCookie.check('userInfo'));
      if (this.serviceCookie.check('userInfo')) {
        this.userInfo = this.serviceCookie.get('userInfo');
        toEdit = false;
      } else {
        this.userInfo = 'Default user';
      }
      console.log('SETTED ' + this.userInfo);
    }
    this.confirmUser();
    this.editUser = toEdit;
  }

  confirmUser() {
    this.editUser = false;
    //Need to save in the data service
    this.dataService.changeUserInfo(this.userInfo);
    this.serviceCookie.set('userInfo', this.userInfo, 365);
  }
}
