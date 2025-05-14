import { LightningElement } from 'lwc';
import getAdminUsers from "@salesforce/apex/EventController.getAdminUsers"
import allRegerstedEvent from "@salesforce/apex/EventController.allRegerstedEvent";

export default class ListRegistrationforadmin extends LightningElement {
    
    admin = false;
    allRegisterdEvent ;
    connectedCallback(){
    getAdminUsers().then((res) => {
        if(res === 'true'){
            this.admin = true;
            console.log('admin=>', this.admin);
            allRegerstedEvent().then((res) => {
                this.allRegisterdEvent = res;
                console.log('Fetched Events:', this.allRegisterdEvent); 
            }).catch((err) => {
                console.error('Error fetching events:', err);
            });

        } else {
            this.admin = false;
        }
    }).catch((err) => {
        console.error('Error fetching admin info:', err);
    });
}


}