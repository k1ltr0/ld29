package com.loadingplay;

import android.app.Application;
import android.util.Log;

import com.loadingplay.pushbotssample.MonkeyGame;
import com.pushbots.push.Pushbots;

public class MyApplication extends Application
{
    public static String SENDER_ID = "";
    public static String PUSHBOTS_APPLICATION_ID = "";
    
    @Override
    public void onCreate()
    {
        MyPushReceiver.setCls(MonkeyGame.class);
        Pushbots.init(this, SENDER_ID, PUSHBOTS_APPLICATION_ID);
        Pushbots.getInstance().setMsgReceiver(MyPushReceiver.class);
        Log.d("loadingplay", "lllegaaaaa");
        super.onCreate();
    }
}
