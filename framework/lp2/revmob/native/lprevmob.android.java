import com.revmob.RevMob;
import com.revmob.RevMobAdsListener;
import com.revmob.RevMobTestingMode;
import com.revmob.ads.fullscreen.RevMobFullscreen;
import com.revmob.ads.link.RevMobLink;

class lpRevmobBase extends Object 
{
	RevMob revMob;
	RevMobFullscreen fullscreen;
	RevMobLink link;

	public void Init(String app_id)
	{
		this.revMob = RevMob.start(BBAndroidGame.AndroidGame().GetActivity(), app_id);
	}

	public void CreateAdLink()
	{
		link = this.revMob.createAdLink(BBAndroidGame.AndroidGame().GetActivity(), listener);
	}

	public void LinkOpen()
	{
		link.open();
	}

	public void CreateFullScreen()
	{
		this.fullscreen = revMob.createFullscreen(BBAndroidGame.AndroidGame().GetActivity(), listener);
	}

	public void ShowFullScreen()
	{
		this.fullscreen.show();
	}

	public void SetTestingMode(boolean f, int with_ads)
	{
		if (with_ads == 0) 
		{
			this.revMob.setTestingMode(RevMobTestingMode.WITH_ADS);
		}
		else if(with_ads == 1)
		{
			this.revMob.setTestingMode(RevMobTestingMode.WITHOUT_ADS);
		}
	}

	RevMobAdsListener listener = new RevMobAdsListener()
        {
            
            @Override
            public void onRevMobAdReceived(){}
            
            @Override
            public void onRevMobAdNotReceived(String arg0){}
            
            @Override
            public void onRevMobAdDisplayed()
            {
            	CreateAdLink();
            	CreateFullScreen();
            }
            
            @Override
            public void onRevMobAdDismiss(){}
            
            @Override
            public void onRevMobAdClicked(){}
        };
}

