import {
    Injectable, EventEmitter,
    Input, Output
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService {

    private userInfoSource = new BehaviorSubject<string>(null);
    public userInfo = this.userInfoSource.asObservable();

    private systemStatusSource = new BehaviorSubject<string>(null);
    public systemStatus = this.systemStatusSource.asObservable();

    constructor() {
        console.log('shared data service started');
    }

    /** change value for userInfo */
    changeUserInfo(userInfo: string) {
        console.log('userInfo => userInfo: ' + userInfo);
        this.userInfoSource.next(userInfo);
    }

    /** change value for systemStatus */
    changeSystemStatus(systemStatus: string) {
        console.log('systemStatus => systemStatus: ' + systemStatus);
        this.systemStatusSource.next(systemStatus);
    }


}
