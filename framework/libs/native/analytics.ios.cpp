


#import "GAI.h"
#import "GAITracker.h"
#import "GAITrackedViewController.h"
#import "GAIDictionaryBuilder.h"
#import "GAIFields.h"
#import "GAILogger.h"


class lpBaseAnalytics:public Object
{
private:
    id<GAITracker> tracker;
    
public:
    
    void Initialize(String trackerId)
    {
        [GAI sharedInstance].trackUncaughtExceptions = YES;
        [GAI sharedInstance].dispatchInterval = 20;
        [[[GAI sharedInstance] logger] setLogLevel:kGAILogLevelVerbose];
        tracker = [[GAI sharedInstance] trackerWithTrackingId:trackerId.ToNSString()];
    }
    
    bool IsInitialized()
    {
        
        if (tracker != NULL) {
            return true;
        }
        return false;
    }
    
    void SendView(String viewName)
    {
        NSDictionary *params = [NSDictionary dictionaryWithObjectsAndKeys:
                                @"appview", kGAIHitType, viewName.ToNSString(), kGAIScreenName, nil];
        [tracker send:params];
    }
};




