public class EventRegistraionHandler {
    public static void EventRegistraionBeforeInsert(List<Event_Registration__c> eventRegObj){
       List<Event_Registration__c> existingRegs = [SELECT Event__c, Attendee__c FROM Event_Registration__c];

        Map<Id,Event_Registration__c> alreadyRegisterdUserIdAndEventId = new Map<Id,Event_Registration__c>();
        
        for(Event_Registration__c  existingRecordList: existingRegs){
            alreadyRegisterdUserIdAndEventId.put(existingRecordList.Event__c,existingRecordList);
         }
        
        Map<Id,Event__c> eventObjDetails = new Map<Id,Event__c>();
        
        Set<Id> EventIds = new Set<Id>();
        
        for(Event_Registration__c currentEventRegObj : eventRegObj){
            EventIds.add(currentEventRegObj.Event__c);
            if(currentEventRegObj.Event__c != null && currentEventRegObj.Attendee__c != null){
                currentEventRegObj.Registered_On__c = system.now();
                if(alreadyRegisterdUserIdAndEventId.containsKey(currentEventRegObj.Event__c)){
                   Event_Registration__c eventRegisterdUser = alreadyRegisterdUserIdAndEventId.get(currentEventRegObj.Event__c);
                       if(eventRegisterdUser.Attendee__c == currentEventRegObj.Attendee__c){
                           currentEventRegObj.addError('Already registered ');
                       }
                }
            }
        }
        
        for(Event__c eventObj: [select Id,Max_Attendees__c,Current_Attendees__c from Event__c where Id IN:EventIds ]){
             eventObjDetails.put(eventobj.Id,eventObj);
        }
        
        for(Event_Registration__c currentEventRegObj : eventRegObj){
            if(eventObjDetails.containsKey(currentEventRegObj.Event__c)){
              Event__c eventObj =   eventObjDetails.get(currentEventRegObj.Event__c);
                system.debug('happy'+eventObj);
                if(eventObj.Current_Attendees__c >= eventObj.Max_Attendees__c){
                   currentEventRegObj.addError('Event is full ❁´◡`❁');
                }       
            }
        }
        
        
        
    }       
}