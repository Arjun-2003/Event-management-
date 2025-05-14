import { LightningElement, api,track } from "lwc";
//import UserId from "@salesforce/user/Id"; // get current login user ;
import checkRegistration from "@salesforce/apex/EventController.checkRegistration";
import getCurrentUser from "@salesforce/apex/EventController.getCurrentUser";
import eventRegistration from "@salesforce/apex/EventController.eventRegistration";
import cancelRegistration from "@salesforce/apex/EventController.cancelRegistration";
import allRegisterdAurCancelEvents from "@salesforce/apex/EventController.allRegisterdAurCancelEvents";
export default class EventRegistrationLWC extends LightningElement {
 @api recordId;
 @track dataload = false;
 userInfo;
  @track register;
  @track allRegisterdEvent;
  connectedCallback() {
  allRegisterdAurCancelEvents().then((res)=>{
    console.log('res=>',res);
    this.allRegisterdEvent = res;
    console.log('this.allRegisterdEvent',this.allRegisterdEvent);
  })
  checkRegistration({ eventId: this.recordId}).then((res)=>{
     if (!res) {
            this.dataload = true
        }
        if ( res === 'alreadyRegisterd') {
             this.dataload = false
            this.register = true
        }else{
            this.register = false
        }
    });
    getCurrentUser().then((res)=>{
        this.userInfo = res
    }).catch((err)=>{
        console.log('err',err);
    })
 }
 showform(e){
 
    this.userInfo[0].Name;
   eventRegistration({
    Name: this.userInfo[0].Name,
    eventId: this.recordId,
    userId: this.userInfo[0].Id
})
.then((res) => {
     if (!res) {
            this.dataload = true
        }
    if(res == 'success') {
         this.dataload = false
        alert('Registration Successful');
        this.register = true;
    allRegisterdAurCancelEvents().then((res)=>{
         if (!res) {
            this.dataload = true
        }
         this.dataload = false
    this.allRegisterdEvent = res;
    console.log('this.allRegisterdEvent',this.allRegisterdEvent);
  })
    } else {
        alert('Registration Failed Already registerd');
    }
})
.catch((err) => {
    console.error('Error in Registration:', err);
    alert('Registration Unsuccessful');
});  
 }

cancelRegistrationEvent(e){

   cancelRegistration({Name: this.userInfo[0].Name,
    eventId: this.recordId,
    userId: this.userInfo[0].Id}).then((res) => {
        if (!res) {
            this.dataload = true
        }
    if(res === 'success') {
        this.dataload = false
        alert('Cancel Successful');
        this.register = false;
        allRegisterdAurCancelEvents().then((res)=>{
    console.log('res=>',res);
    this.allRegisterdEvent = res;
    //console.log('this.allRegisterdEvent',this.allRegisterdEvent);
  })
    } else {
        alert('Cancel Failed');
    }
})
.catch((err) => {
    console.error('Error in Cancel:', err);
    alert('Cancel Unsuccessful');
});
}
}


