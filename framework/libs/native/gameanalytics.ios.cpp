




#import "GameAnalytics.h"

class lpBaseGameAnalytics:public Object
{

private:
    BOOL initialized = NO;
 
public:
    
    void Initialize(String gameKey, String secretKey)
    {                
        [GameAnalytics setGameKey:gameKey.ToNSString() secretKey:secretKey.ToNSString() build:@"1"];
        initialized = YES;
    }
    
    bool IsInitialized()
    {
        
        if (initialized == YES) {
            return true;
        }
        return false;
    }
    
    void SendView(String viewName)
    {
       [GameAnalytics logGameDesignDataEvent:viewName.ToNSString()];
    }
};




