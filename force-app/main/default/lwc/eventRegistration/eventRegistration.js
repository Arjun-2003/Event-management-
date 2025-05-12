import { LightningElement,api } from 'lwc';
import deleteEventRegistrationRecord from "@salesforce/apex/EventController.deleteEventRegistrationRecord";
import allRegisterdAurCancelEvents from "@salesforce/apex/EventController.allRegisterdAurCancelEvents";
export default class EventRegistration extends LightningElement {
   @api name;
   @api date;
   @api  eventregid;
   @api location;
    cancelBtn(e){
        let  eventId = e.target.attributes[1].value;
        let parentEl = e.target.parentElement;
        deleteEventRegistrationRecord({recordId:eventId}).then((res)=>{
            if (res == 'delete successfully') {
                alert('delete successfully')
                parentEl.style.display = 'none';
            }else{
                 alert('some Error');
            }
        })

        
        
    }
}