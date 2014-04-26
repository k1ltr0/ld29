
import com.gameanalytics.android.GameAnalytics;

class lpBaseGameAnalytics extends Object {

	private boolean initialized;

	public void Initialize( String gameKey, String secretKey )
    {
    	GameAnalytics.setDebugLogLevel(GameAnalytics.VERBOSE);
        GameAnalytics.initialise(BBAndroidGame.AndroidGame().GetActivity(), secretKey, gameKey );
        GameAnalytics.startSession(BBAndroidGame.AndroidGame().GetActivity());
		
        initialized = true;
    }

    public boolean IsInitialized()
    {
        return this.initialized;
    }

    public void SendView( String viewName )
    {
        GameAnalytics.newDesignEvent( viewName );
    }
    
}