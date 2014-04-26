


#import "MobileAppTracker.h"


class lpBaseMobileAppTracking:public Object
{
   
public:
    
    void Initialize(String advertiserId, String conversionKey)
    {
        NSString * const MAT_ADVERTISER_ID = advertiserId.ToNSString();
        NSString * const MAT_CONVERSION_KEY = conversionKey.ToNSString();
        
		[[MobileAppTracker sharedManager] startTrackerWithMATAdvertiserId:MAT_ADVERTISER_ID MATConversionKey:MAT_CONVERSION_KEY];
		
		NSUUID *ifa = [[ASIdentifierManager sharedManager] advertisingIdentifier];
		[[MobileAppTracker sharedManager] setAppleAdvertisingIdentifier:ifa];
    }
    
    bool IsInitialized()
    {
        
        if (tracker != NULL) {
            return true;
        }
        return false;
    }
    
    void TrackInstall()
    {
    	[[MobileAppTracker sharedManager] trackInstall];
    }
    
    void SendView( String viewName, float value = 0.0f, String currency = "USD")
    {
        [[MobileAppTracker sharedManager] trackActionForEventIdOrName:viewName.ToNSString() eventIsId:NO revenueAmount:value currencyCode:currency.ToNSString()];
    }
};




