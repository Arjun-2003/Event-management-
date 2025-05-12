import { LightningElement } from 'lwc';
import getEvents from '@salesforce/apex/EventController.getEvents';
export default class EventDashboard extends LightningElement {
    allEvent;
    filterValue ='';
    inputValue = '';
    get options() {
    return [
        { label: 'All', value: '' },
        { label: 'Internal', value: 'Internal' },
        { label: 'External', value: 'External' }
    ];
    }

   timeOption = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true,
    timeZone: 'Asia/Kolkata' 
};

    handleChange(e){
        this.filterValue = e.detail.value;
        getEvents({eventtype:this.filterValue,inputValue:this.inputValue}).then((res)=>{
         this.allEvent = res.map(event => {
        return {
            ...event,
            formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
    });
      }).catch((err)=>{
        console.log('err',err);
      })
    }
    connectedCallback(){
      getEvents({eventtype:''}).then((res)=>{
         this.allEvent = res.map(event => {
        return {
            ...event,
            formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
    });
      }).catch((err)=>{
          console.log('res=>123',err);
      })
    }

    getInputValue(e){
        this.inputValue = e.target.value
        getEvents({eventtype:this.filterValue,inputValue:this.inputValue}).then((res)=>{
         this.allEvent = res.map(event => {
        return {
            ...event,
            formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
    });
      }).catch((err)=>{
        console.log('err',err);
      })
    }
}