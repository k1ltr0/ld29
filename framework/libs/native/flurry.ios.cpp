#import "Flurry.h"

class lpFlurry
{
public:
    static void uncaughtExceptionHandler(NSException *exception)
    {
        [Flurry logError:@"Uncaught Exception" message:@"Crash!" exception:exception];
    }

    void static Init(String apiKey)
    {
        //printf("%s\n", __func__);
        NSSetUncaughtExceptionHandler(&lpFlurry::uncaughtExceptionHandler);
        [Flurry startSession:apiKey.ToNSString()];
        [Flurry setSessionReportsOnCloseEnabled:YES];
        [Flurry setSessionReportsOnPauseEnabled:YES];
    }

    void static Stop ( )
    {
        // nothing here
    }

    void static LogEvent(String eventName)
    {
        //printf( "%s: %s\n", __func__, eventName.ToCString<char>() );
        [Flurry logEvent:eventName.ToNSString()];
    }

    void static LogEventTimed(String eventName)
    {
        //printf( "%s: %s\n", __func__, eventName.ToCString<char>() );
        [Flurry logEvent:eventName.ToNSString() timed:YES];
    }

    void static EndTimedEvent(String eventName)
    {
        //printf( "%s: %s\n", __func__, eventName.ToCString<char>() );
        [Flurry endTimedEvent:eventName.ToNSString() withParameters:nil];
    }
};