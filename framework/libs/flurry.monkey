Private

#if TARGET="ios" Or TARGET="android"
Import "native/flurry.${TARGET}.${LANG}"

Extern
#if TARGET="ios"

    #LIBS+="${CD}/native/Flurry.ios/Flurry.h"
    #LIBS+="${CD}/native/Flurry.ios/libFlurry.a"

    #LIBS+="SystemConfiguration.framework"

    Class Flurry="lpFlurry"
        Function Init:Void(apiKey$)="Init"
        Function Stop:Void()="Stop"
        Function LogEvent:Void(eventName$)="LogEvent"
        Function LogEventTimed:Void(eventName$)="LogEventTimed"
        Function EndTimedEvent:Void(eventName$)="EndTimedEvent"
    End
#elseif TARGET="android"

    ''' adding imports
    #LIBS+="${CD}/native/FlurryAgent.jar"

    #ANDROID_MANIFEST_MAIN+="
    <uses-permission android:name=~qandroid.permission.ACCESS_COARSE_LOCATION~q />
    <uses-permission android:name=~qandroid.permission.ACCESS_FINE_LOCATION~q />"

    Class Flurry
        Function Init:Void(apiKey$)="Init"
        Function Stop:Void()="Stop"
        Function LogEvent:Void(eventName$)="LogEvent"
        Function LogEventTimed:Void(eventName$)="LogEventTimed"
        Function EndTimedEvent:Void(eventName$)="EndTimedEvent"
    End
#end

#else
Public
Class Flurry
    Function Init:Void(apiKey$)
        Print "Flurry Init"
    End
    
    Function Stop:Void()
        Print "Flurry Stop"
    End

    Function LogEvent:Void(eventName$)
        Print "Log: " + eventName
    End

    Function LogEventTimed:Void(eventName$)
        Print "Start Timed Event: " + eventName
    End

    Function EndTimedEvent:Void(eventName$)
        Print "End Timed Event: " + eventName
    End
End
#end