import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { environment } from './../../../environments/environment';

@Injectable()
export class FileUploadService {
    private headers = new Headers({
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        });

    constructor(private http: Http) { }

    uploadFile(fileToUpload: File): Promise<boolean> {
        const url = environment.apiUrl + `/uploadedfiles`;

        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return this.http
            .post(url, formData)
            .toPromise()
            .then(() => true)
            ;
    }
    // .catch(this.handleError)

    /*
    private handleError(error: any): any {
        console.error('ERRORE UPLOAD FILE', error);
        return false;
    }
    */
}
