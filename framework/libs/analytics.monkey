#If TARGET="android" Or TARGET="ios"

Import "native/analytics.${TARGET}.${LANG}"

#If TARGET="android"

#Rem
follow the following tutorial
https://developers.google.com/analytics/devguides/collection/android/v2/
#End

#LIBS+="${CD}/native/analytics.android/libGoogleAnalyticsV2.jar"

#ElseIf TARGET="ios"

#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAI.h"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAITracker.h"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAITrackedViewController.h"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAIDictionaryBuilder.h"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAIFields.h"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAILogger.h"
#LIBS+="${CD}/native/analytics.ios/libGoogleAnalyticsServices.a"

#LIBS+="CoreData.framework"
#LIBS+="SystemConfiguration.framework"
'''#LIBS+="libz.dylib" ''' must be added manually

#Rem
follow the following tutorial
https://developers.google.com/analytics/devguides/collection/ios/v3/
#End


#End

Extern 

Class lpBaseAnalytics
    Method Initialize:Void( trackerId:String )
    Method IsInitialized:Bool()
    Method SendView:Void( viewName:String )
End

Public
#End


Class lpAnalytics 

Private

#If TARGET="android" Or TARGET="ios"
    Global _analytics:lpBaseAnalytics
#End

Public

    Function Initialize:Void( trackerId:String )
        #If TARGET="android" Or TARGET="ios"
            _analytics = New lpBaseAnalytics()
            _analytics.Initialize( trackerId )
        #End 
    End
    
    Function IsInitialized:Bool()
        #If TARGET="android" Or TARGET="ios"
            Return _analytics.IsInitialized( trackerId )
        #Else
            Return False
        #End
    End
    
    Function SendView:Void( viewName:String )
        #If TARGET="android" Or TARGET="ios"
            _analytics.SendView( viewName )
        #End 
    End

End

