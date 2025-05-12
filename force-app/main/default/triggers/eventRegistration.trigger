trigger eventRegistration on Event_Registration__c (before insert) {
    if(Trigger.isBefore){
        if(Trigger.isInsert){
            EventRegistraionHandler.EventRegistraionBeforeInsert(Trigger.new);
        }    
    }
    
}