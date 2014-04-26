import com.facebook.FacebookRequestError;
import com.facebook.HttpMethod;
import com.facebook.LoggingBehavior;
import com.facebook.Request;
import com.facebook.RequestAsyncTask;
import com.facebook.Response;
import com.facebook.Session;
import com.facebook.SessionState;
import com.facebook.Settings;
import com.facebook.model.GraphUser;
import com.facebook.Session.OpenRequest;
import com.facebook.Request.GraphUserListCallback;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast

class lpFacebookUser extends Object
{
    HashMap<String, String> sessionUser = new HashMap<String, String>();
    ArrayList<lpFacebookUser> listaAmigos = new ArrayList<lpFacebookUser>();
    
    public void init( HashMap<String, String> s )
    {
        this.sessionUser = s;
    }
    
    
    public void initFriends( ArrayList<lpFacebookUser> l){
    	this.listaAmigos = l;
    }
    
    public lpFacebookUser GetFriendById(String id) {

		try {

			lpFacebookUser usuario = new lpFacebookUser();

			for (lpFacebookUser user : listaAmigos) {
				if (user.Get("id").equals(id)) {
					usuario = user;
				}
			}
			return usuario;
		} catch (Exception e) {
		}
		return null;
	}
    
    
    public lpFacebookUser[] GetFriends(){
           
        lpFacebookUser[] idAmigos = new lpFacebookUser[listaAmigos.size()];
        
        int i = 0;
        for (lpFacebookUser user : listaAmigos)
        {
            idAmigos[i] = user;
            i++;
        }
    
        return idAmigos;
    }
    
    
    public String Get(String varname) {
		try {
			if (sessionUser.containsKey(varname)) {
				return sessionUser.get(varname);
			}

			else {
				return "";
			}
		} catch (Exception e) {
			Log.d("lp2", "error al obtener variable en sessionUser: " + e.getMessage().toString());
		}
		return "";
	}
}

class lpFacebookBase extends Object
{   
	lpFacebookUser user;
    Session session = Session.getActiveSession();
    HashMap<String, String> sessionUser = new HashMap<String,String>();
    ArrayList<lpFacebookUser> listaAmigos = new ArrayList<lpFacebookUser>();
    String APP_ID;
    
    
    private class FacebookActivityDelegate extends ActivityDelegate
    {
        @Override
        public void onActivityResult(int requestCode, int resultCode, Intent data)
        {
            super.onActivityResult(requestCode, resultCode, data);
            
            try{
            	Log.d("lp2", "onActivityResult");
            	Session.getActiveSession().onActivityResult(BBAndroidGame.AndroidGame().GetActivity(), requestCode, resultCode, data);
            } catch(Exception e){
            	e.printStackTrace();
            }
        }
    }
    
    public void Init( String appid )
    {
        this.APP_ID = appid;
        
        ActivityDelegate delegate = new FacebookActivityDelegate();
        BBAndroidGame.AndroidGame().AddActivityDelegate(delegate);
        
        user = new lpFacebookUser();
        user.init(sessionUser);
        user.initFriends(listaAmigos);
    }
	
    public void Login(String permissions)
    {
        final String p = permissions;
        
        Session session = new Session.Builder(BBAndroidGame.AndroidGame().GetActivity().getBaseContext()).setApplicationId(this.APP_ID).build();
        //Session session = new Session(BBMonkeyGame.AndroidGame().GetActivity());
        Session.setActiveSession(session);


        Settings.addLoggingBehavior(LoggingBehavior.INCLUDE_ACCESS_TOKENS);

        Session.StatusCallback statusCallback = new Session.StatusCallback() {
            @Override
            public void call(Session session, SessionState state, Exception exception) {
            	
            	String message = "Facebook session status changed - " + session.getState() + " - Exception: " + exception;
            	Log.w("lp2", message);
            	
                if (session.isOpened()) {
                	//String message = "Facebook session status changed - " + session.getState() + " - Exception: " + exception;
                	//Log.w("lp2", message);
                	
                    List<String> permisos = session.getPermissions();
                	
                	for (int i = 0; i < permisos.size(); i++) {  
                		String permiso = permisos.get(i);  
                		Log.d("lp2","permiso:" + permiso);  
                	} 
                	
                	
                    if(session.getState() == SessionState.OPENED && !permisos.contains("publish_actions")){
                		session.requestNewPublishPermissions(new Session.NewPermissionsRequest(BBMonkeyGame.AndroidGame().GetActivity(), Arrays.asList(p.split(","))));
                	}
                	
                	
                	Request.executeMeRequestAsync(session,
							new Request.GraphUserCallback() {
								public void onCompleted(GraphUser user,
										Response response) {
									if (user != null) {
										try {
											sessionUser.put("id", user.getId());
											sessionUser.put("username",	user.getName());
											sessionUser.put("email", user.getProperty("email").toString());
											if(user.getFirstName().length() > 10){
												sessionUser.put("first_name", user.getFirstName().substring(0, 9) + "...");
											}else{
												sessionUser.put("first_name", user.getFirstName());
											}
											Log.d("lp2", "id facebook: " + sessionUser.get("id"));

										} catch (Exception e) {
											e.printStackTrace();
										}

									}
								}
							});

					Request friendRequest = Request.newMyFriendsRequest(
							session, new GraphUserListCallback() {
								@Override
								public void onCompleted(List<GraphUser> users,
										Response response) {
									if (users != null) {
										for (GraphUser user : users) {
											HashMap<String, String> usuario = new HashMap<String, String>();
											usuario.put("id", user.getId());
											if(user.getFirstName().length() > 10){
												usuario.put("first_name", user.getFirstName().substring(0, 9) + "...");
											}else{
												usuario.put("first_name", user.getFirstName());
											}
											lpFacebookUser fbUser = new lpFacebookUser();
											fbUser.init(usuario);
											listaAmigos.add(fbUser);
										}

									}

								}
							});
					Bundle params = new Bundle();
					params.putString("fields", "id,first_name");
					friendRequest.setParameters(params);
					friendRequest.executeAsync();
                }
            }
        };

        if (!session.isOpened() && !session.isClosed() && session.getState() != SessionState.OPENING) {
        	Log.d("lp2","cerrado");
        	OpenRequest openRequest = new Session.OpenRequest(BBMonkeyGame.AndroidGame().GetActivity());
        	openRequest.setPermissions(Arrays.asList("email"));
        	openRequest.setCallback(statusCallback);
            session.openForRead(openRequest);
        } else {
        	Log.d("lp2","open session");
            Session.openActiveSession(BBMonkeyGame.AndroidGame().GetActivity(), true, statusCallback);
        }
          
    }

    public void Logout()
    {
        Session.getActiveSession().closeAndClearTokenInformation();
        this.sessionUser.clear();
    }
    
    
    public void PostFeed(String name, String caption, String description, String link, String picture, String message)
    {
    	//Log.d("lp2","access token: " + Session.getActiveSession().getAccessToken());
    	
    	Request.Callback callback= new Request.Callback() {
            public void onCompleted(Response response) {
            	
            	Log.d("lp2", "error repsonse: " + response.getError().toString());
            	
            	JSONObject graphResponse = response.getGraphObject().getInnerJSONObject();
	            String postId = null;
	            try {
	            	postId = graphResponse.getString("id");
	            } catch (JSONException e) {
	                Log.i("lp2","JSON error "+ e.getMessage());
	            }
	            FacebookRequestError error = response.getError();
	            if (error != null) {
	            	Toast.makeText(BBMonkeyGame.AndroidGame().GetActivity().getApplicationContext(),error.getErrorMessage(),Toast.LENGTH_SHORT).show();
	            } else {
	                Toast.makeText(BBMonkeyGame.AndroidGame().GetActivity().getApplicationContext(),postId,Toast.LENGTH_LONG).show();
	            }
            }
        };
        
        if(Session.getActiveSession() != null){
    	
	    	Bundle params = new Bundle();
	    	
	        params.putString("name", name);
	        params.putString("caption", caption);
	        params.putString("description", description);
	        params.putString("link", link);
	        params.putString("picture", picture);
	        params.putString("message", message);
	        
	    	Request request = new Request(Session.getActiveSession(), "me/feed", params, HttpMethod.POST);//, callback);
	    	RequestAsyncTask task = new RequestAsyncTask(request);
	        task.execute();
        }
    }
    
    public lpFacebookUser Me()
    {
    	if(user!=null&&!user.listaAmigos.isEmpty()&&!user.sessionUser.isEmpty()){
    		return user;
    	} else {
    		return null;
    	}
    	
    }
    
    public boolean IsOpened()
    {
    	Session session = Session.getActiveSession();
	    if (session != null && session.isOpened()&&this.Me()!=null) {
	        return true;
	    } else {
	        return false;
	    }
    }
}
