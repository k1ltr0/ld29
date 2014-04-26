#If TARGET="android" Or TARGET="ios"

Import "native/gameanalytics.${TARGET}.${LANG}"

#If TARGET="android"

#Rem
follow the following tutorial
http://support.gameanalytics.com/hc/en-us/articles/200842066-Android-quickstart-guide
#End

#LIBS+="${CD}/native/gameanalytics.android/game-analytics-wrapper-v1.11.jar"
#LIBS+="${CD}/native/gameanalytics.android/gson-2.2.2.jar"

#Elseif TARGET="ios"

#LIBS+="${CD}/native/gameanalytics.ios/GA-iOS-SDK-master/Binary Distribution/libGameAnalytics/libGameAnalytics.a"
#LIBS+="${CD}/native/gameanalytics.ios/GA-iOS-SDK-master/Binary Distribution/libGameAnalytics/GameAnalytics.h"

#LIBS+="SystemConfiguration.framework"
#LIBS+="AdSupport.framework"
'''#LIBS+="libz.dylib" ''' must be added manually

#Rem
follow the following tutorial
http://support.gameanalytics.com/hc/en-us/articles/200842056-iOS-quickstart-guide
#End


#End

Extern 

Class lpBaseGameAnalytics
    Method Initialize:Void( trackerId:String, secretKey:String )
    Method IsInitialized:Bool()
    Method SendView:Void( viewName:String )
End

Public
#End


Class lpGameAnalytics 

Private

#If TARGET="android" Or TARGET="ios"
    Global _analytics:lpBaseGameAnalytics
#End

Public

    Function Initialize:Void( trackerId:String, secretKey:String )
        #If TARGET="android" Or TARGET="ios"
            _analytics = New lpBaseGameAnalytics()
            _analytics.Initialize( trackerId, secretKey )
        #End 
    End
    
    Function IsInitialized:Bool()
        #If TARGET="android" Or TARGET="ios"
            Return _analytics.IsInitialized( )
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

