package com.loadingplay;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.pushbots.push.Pushbots;

public class MyPushReceiver extends BroadcastReceiver
{
    private static Class<?> cls; 
    
    @Override
    public void onReceive(Context context, Intent intent)
    {
        String action = intent.getAction();

        if (action.equals(Pushbots.MSG_OPENED))
        {
            Intent launch = new Intent(Intent.ACTION_MAIN);
            launch.setClass(Pushbots.getInstance().appContext, MyPushReceiver.cls);
            launch.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            Pushbots.getInstance().appContext.startActivity(launch);
        }
    }
    
    public static void setCls(Class<?> cls)
    {
        MyPushReceiver.cls = cls;
    }
    
    public static Class<?> getCls()
    {
        return MyPushReceiver.cls;
    }
}