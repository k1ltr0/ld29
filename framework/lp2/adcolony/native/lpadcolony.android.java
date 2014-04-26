import com.jirbo.adcolony.*;
import android.content.pm.ActivityInfo;


class lpAdColonyBase 
implements AdColonyAdListener, AdColonyV4VCListener, AdColonyAdAvailabilityListener
{
	private String[] zone_id;
	private ArrayList<String> available_zone;

	public void Init(String app_id, String[] zone_id)
	{
		// set the video for vitual currency
		this.zone_id = zone_id;
		this.available_zone = new ArrayList<String>();

		// Configure AdColony with params
		AdColony.configure(BBAndroidGame.AndroidGame().GetActivity(), "version:1.0,store:google", app_id, zone_id);
		// version - arbitrary application version
		// store   - google or amazon

		// Disable rotation if not on a tablet-sized device (note: not
		// necessary to use AdColony).
		//if ( !AdColony.isTablet() )
		//{
		//	BBAndroidGame.AndroidGame().GetActivity().setRequestedOrientation( ActivityInfo.SCREEN_ORIENTATION_PORTRAIT );
		//}

		// Notify this object about confirmed virtual currency.
		AdColony.addV4VCListener( this );

		// Notify this object about ad availability changes.
		AdColony.addAdAvailabilityListener( this );
		
		// initiialize delegate
		lpAdColonyDelegate delegate = new lpAdColonyDelegate();
		BBAndroidGame.AndroidGame().AddActivityDelegate(delegate);
	}

	public boolean IsAvailable(String zone_id)
	{
	    if (available_zone.contains(zone_id))
	    {
	        return true;
	    }
	    
		return false;
	}
	
	public void ShowV4VC(String zone_id)
	{
	    if (this.IsAvailable(zone_id))
        {
	        AdColonyV4VCAd v4vc_ad = new AdColonyV4VCAd( zone_id ).withListener( this ).withConfirmationDialog().withResultsDialog();
            v4vc_ad.show();
        }
	}
	
	public void ShowVideo(String zone_id)
	{
	    if (this.IsAvailable(zone_id))
        {
            AdColonyVideoAd ad = new AdColonyVideoAd( zone_id ).withListener( this );
            ad.show();
        }
	}

	// implementing adcolony ads listener
	@Override
	public void onAdColonyAdAttemptFinished(AdColonyAd arg0)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void onAdColonyAdStarted(AdColonyAd arg0)
	{
		// TODO Auto-generated method stub
	}

	// implementing v4vcr
	@Override
	public void onAdColonyV4VCReward(AdColonyV4VCReward arg0)
	{
		// TODO Auto-generated method stub
	}

	// implementing avalaibility listener
	@Override
	public void onAdColonyAdAvailabilityChange(boolean available, String zone_id)
	{
		if (available)
		{
		    available_zone.add(zone_id);
		}
	}
}


class lpAdColonyDelegate extends ActivityDelegate
{
    @Override
    public void onPause()
    {
        AdColony.pause();
        super.onPause();
    }
    
    @Override
    public void onResume()
    {
        AdColony.resume(BBAndroidGame.AndroidGame().GetActivity());
        super.onResume();
    }
}



