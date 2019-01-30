import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { FileUploadService } from './../service/file-upload.service';

@Component({
    selector: 'add-new-component',
    templateUrl: '../component_html/add-new-product.component.html'
})

export class AddNewProductComponent implements OnInit {
    @Input() showGoToProductList: boolean;
    private loaderContainerId = 'loader-container';

    private showForm = true;
    private showFileError = false;
    private buttonDisabled = true;
    private fileToUpload: File;

    private acceptedType = ['aml', 'xml'];

    constructor(private fileUploadService: FileUploadService,
        private router: Router) { }

    ngOnInit(): void {
        console.log(this.showGoToProductList);
     }

    onFileChange(event): void {
        this.showFileError = false;
        this.fileToUpload = event.target.files[0];
        // console.log(this.fileToUpload.name);

        this.checkFileExtension();
    }

    checkFileExtension(): void {
        const fileName = this.fileToUpload.name;
        const nameSplit = fileName.split('.');
        const fileExtension = nameSplit[nameSplit.length - 1];

        this.showFileError = !(this.searchExtension(fileExtension));
        // console.log('Ex: ' + fileExtension);
        // console.log(this.searchExtension(fileExtension));
        this.buttonDisabled = this.showFileError;
    }

    searchExtension(extension: string): boolean {
        for (let i = 0; i < this.acceptedType.length; i++) {
            if (this.acceptedType[i] === extension) {
                return true;
            }
        }
        return false;
    }

    submitForm(): void {
        if (!(this.showFileError)) {
            //// Try add loading message
            // console.log('start upload');
            this.buttonDisabled = true;
            // document.getElementById('loading-label').style.display = 'inline-block';
            if (document.getElementById(this.loaderContainerId) !== null) {
                document.getElementById(this.loaderContainerId).style.display = 'inline-block';
            }
            ////

            this.fileUploadService
                .uploadFile(this.fileToUpload)
                .then(
                    response => {
                        // console.log('getting response');
                        if (response) {
                            // console.log('success');
                            this.showForm = false;
                        } else {
                            console.log('error');
                        }
                    }
                );
        }
    }

    newInsert(): void {
        this.showForm = true;
        this.showFileError = false;
        this.buttonDisabled = true;
    }

    goToSystemOverview(): void {
        this.router.navigate(['subSystem']);
    }

    goToProductsList(): void {
        this.router.navigate(['products']);
    }
}
