import { LightningElement, track } from 'lwc';
import getEvents from '@salesforce/apex/EventController.getEvents';
import getAdminUsers from "@salesforce/apex/EventController.getAdminUsers";
import deleteEvent from "@salesforce/apex/EventController.deleteEvent";
import getEventById from "@salesforce/apex/EventController.getEventById";
import updateEvent from "@salesforce/apex/EventController.updateEvent";
import relatedRecords from "@salesforce/apex/EventController.relatedRecords";
import { subscribe, onError } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteEventRegisterdRecord from '@salesforce/apex/EventController.deleteEventRegisterdRecord';
export default class EventDashboard extends LightningElement {
  allEvent;
  currentSelectedEventId ;
  filterValue = '';
  inputValue = '';
   channelName = '/event/System_Notification__e';
  @track relatedRecoedList = [];
  @track editEvent = {};
  @track showModal = false;

  @track nameinputValue;
  admin;
  @track showcreateform = false;
  eventtypevalue;
  @track showRelatedrecord = false;


  showform(e) {
    this.showcreateform = true
    subscribe(this.channelName, -1, message => {
            const payload = message.data.payload;
            this.dispatchEvent(new ShowToastEvent({
                title: payload.Title__c,
                message: payload.message__c,
            }));
        }).then(response => {
            this.subscription = response;
            console.log('Subscribed:', response.channel);
        });
    
  }

Registerdeventdelete(e){
  let rEventId = e.target.getAttribute('registerdevent');
  deleteEventRegisterdRecord({eventId : rEventId}).then((res)=>{
    if (res == 'deleted') {
      relatedRecords({ eventId: this.currentSelectedEventId })
        .then((res) => {
          if (res.length > 0 && res[0].Event_Registration__r) {
            this.relatedRecoedList = res[0].Event_Registration__r;
            this.showRelatedrecord = true;
          } else {
            this.relatedRecoedList = [];
            this.showRelatedrecord = false;
          }
        })
        .catch((err) => {
          console.log('err=>', err);
        });
    }
  })
  
}


  closeeventform(e) {
    this.showcreateform = false
  }
  eventtype(e) {
    this.eventtypevalue = e.detail.value;
  }
  hendelSuccess(e) {
    alert('Event Created Successfuly');
    this.showcreateform = false;
    getEvents({ eventtype: this.filterValue, inputValue: this.inputValue })
      .then(res => {
        this.allEvent = res.map(evt => ({
          ...evt,
          formattedDate: new Date(evt.Event_Date__c).toLocaleString('en-US', this.timeOption)
        }));
      });
  }
  hendelerr(event) {
    console.error('Error creating record', event.detail);
  }



  // related events code 
  closeRelatiddev(e) {
    this.showRelatedrecord = false;
  }
  showRelatedRegisterdEvent(e) {
    let evntID = e.target.getAttribute('currentevemtid');
    this.currentSelectedEventId = evntID;
    relatedRecords({ eventId: evntID })
    .then((res) => {
      if (res.length > 0 && res[0].Event_Registration__r) {
  this.relatedRecoedList = res[0].Event_Registration__r;
  this.showRelatedrecord = true;
} else {
  this.relatedRecoedList = [];
  this.showRelatedrecord = false;
}
    }).catch((err) => {
      console.log('err=>', err);
    })
  }



  get options() {
    return [
      { label: 'All', value: '' },
      { label: 'Internal', value: 'Internal' },
      { label: 'External', value: 'External' }
    ];
  }

  get typeOptions() {
    return [
      { label: 'Internal', value: 'Internal' },
      { label: 'External', value: 'External' }
    ];
  }


  timeOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    //hour: 'numeric', 
    //minute: 'numeric', 
    //hour12: true,
    // timeZone: 'Asia/Kolkata' 
  };

  handleChange(e) {
    this.filterValue = e.detail.value;
    getEvents({ eventtype: this.filterValue, inputValue: this.inputValue }).then((res) => {
      this.allEvent = res.map(event => {
        return {
          ...event,
          formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
      });
    }).catch((err) => {
      console.log('err', err);
    })
  }
  connectedCallback() {
    getAdminUsers().then((res) => {
      if (res == 'true') {
        this.admin = true
      } else {
        this.admin = false
      }
    }).catch((err) => {
      console.log(err);
    })
    getEvents({ eventtype: '' }).then((res) => {
      this.allEvent = res.map(event => {
        return {
          ...event,
          formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
      });
    }).catch((err) => {
      console.log('res=>123', err);
    })
  }

  getInputValue(e) {
    this.inputValue = e.target.value
    getEvents({ eventtype: this.filterValue, inputValue: this.inputValue }).then((res) => {
      this.allEvent = res.map(event => {
        return {
          ...event,
          formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        };
      });
    }).catch((err) => {
      console.log('err', err);
    })
  }


  deleteEvent(e) {
    const listDiv = e.target.closest('.list');
    let eventId = e.target.getAttribute('eventid')
    deleteEvent({ eventId: eventId }).then((res) => {
      if (res === 'delete') {
        alert('Event delete successfully');
        listDiv.style.display = 'none';
      } else {
        alert('Error not delete');
      }
    })


  }


  editevent(e) {
    let eventId = e.target.getAttribute('eventid');
    getEventById({ eventId: eventId })
      .then(result => {
        console.log('res=>', result);
        this.editEvent = { ...result };
        this.showModal = true;
      })
      .catch(err => {
        console.error(err);
      });
  }




  handleEditChange(e) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    this.editEvent = { ...this.editEvent, [field]: value };
  }
  closeModal() {
    this.showModal = false;
  }



  updateEventInDb() {
    updateEvent({ updatedEvent: this.editEvent })
      .then(() => {
        this.showModal = false;
        return getEvents({ eventtype: this.filterValue, inputValue: this.inputValue });
      })
      .then(result => {
        this.allEvent = result.map(event => ({
          ...event,
          formattedDate: new Date(event.Event_date__c).toLocaleString('en-US', this.timeOption)
        }));
      })
      .catch(error => {
        console.error('Update failed:', error);
      });
  }

}