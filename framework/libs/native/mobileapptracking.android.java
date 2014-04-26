


import com.mobileapptracker.*;

class lpBaseMobileAppTracking extends Object {

	public MobileAppTracker mobileAppTracker = null;
	
	public boolean initialized = false;
	
	public void Initialize( String advertiserId, String conversionKey )
    {
        mobileAppTracker = new MobileAppTracker(BBAndroidGame.AndroidGame().GetActivity(), advertiserId, conversionKey);
        mobileAppTracker.setDebugMode(true);
        initialized = true;
    }
    
    public boolean IsInitialized()
    {
    	return initialized;
    }
    
    public void TrackInstall()
    {
    	mobileAppTracker.trackInstall();
    }
    
    public void SendView( String viewName, Float value, String currency)
    {
        mobileAppTracker.trackAction(viewName, value, currency);
    }

}
	
	
	