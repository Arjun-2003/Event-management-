public class EventController {
    @AuraEnabled
    public static List<Event__c> getEvents(string eventtype,String inputValue){
        System.debug('eventtype' +''+ eventtype);
        String eventlist =    'select Id,Location__c,Event_Type__c,Name,Event_date__c from Event__c where Id != null';
        if(!String.isBlank(eventtype)){
            eventlist += ' AND Event_Type__c =:eventtype';
        }
        if(!String.isBlank(inputValue)){
            eventlist += ' AND Name LIKE \'' + String.escapeSingleQuotes(inputValue) + '%\'';
        }
       return  Database.Query(eventlist);
    }  
    @AuraEnabled
    public static String checkRegistration(String eventId){
        System.debug('eventId '+eventId);
        Id UserId = userInfo.getUserId();
       
        // hum yha se bhi user ki Id nikal skte hai "UserInfo.getUserId()" se;
        List<Event_Registration__c> EventRegistration = [select Id , Name from Event_Registration__c where 	Event__c =:eventId And 	Attendee__c =:UserId] ;
        if(EventRegistration.size() > 0){
            return 'alreadyRegisterd';
                }else {
                    return 'notRegisterd';
                }
    }
    
   @AuraEnabled(cacheable=true)
    public static List<User> getCurrentUser() {
        Id userId = UserInfo.getUserId();
         System.debug('UserId123 '+UserId);
        return [SELECT Id, Name, Email FROM User WHERE Id = :userId];
    }
    
    @AuraEnabled
    public static void eventRegistration(String Name,String eventId,String userId ){
        try{ 
            Event_Registration__c EventRegis = new Event_Registration__c();
        EventRegis.Attendee__c = userId ;
        EventRegis.Event__c = eventId;
        EventRegis.Name = Name;
        EventRegis.Registered_On__c = System.now();
        Database.insert(EventRegis);
        }catch(Exception err){
            System.debug(err);
        }
    }
    
    
    
}