
import com.appsflyer.AppsFlyerLib;

class lpAppsFlyer extends Object
{
    public static void SendTracking( String appid )
    {
        AppsFlyerLib.sendTracking(BBAndroidGame.AndroidGame().GetActivity(),appid);
    }
}


