
import com.pushbots.push.Pushbots;
import com.loadingplay.MyPushReceiver;
import com.loadingplay.MyApplication;

class lpPushBots
{

    public static void Init(String sender_id, String pushbots_application_id)
    {
        MyApplication.SENDER_ID = sender_id;
        MyApplication.PUSHBOTS_APPLICATION_ID = pushbots_application_id;
        
        MyPushReceiver.setCls(MonkeyGame.class);
        Pushbots.init(BBMonkeyGame.AndroidGame().GetActivity().getApplication(), sender_id, pushbots_application_id);
        Pushbots.getInstance().setMsgReceiver(MyPushReceiver.class);
    }

}



