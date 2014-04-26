
import com.google.analytics.tracking.android.EasyTracker;
import com.google.analytics.tracking.android.GoogleAnalytics;
import com.google.analytics.tracking.android.Tracker;


class lpBaseAnalytics extends Object
{
    private Tracker mGaTracker;
    private GoogleAnalytics mGaInstance;
    private boolean initialized = false;

    public void Initialize( String trackerId )
    {
        mGaInstance = GoogleAnalytics.getInstance(BBAndroidGame.AndroidGame().GetActivity());
        mGaTracker = mGaInstance.getTracker(trackerId);
        initialized = true;
    }

    public boolean IsInitialized()
    {
        return this.initialized;
    }

    public void SendView( String viewName )
    {
        mGaTracker.sendView(viewName);
    }
}

