

import android.view.WindowManager.LayoutParams;
import android.net.Uri;
import android.content.pm.ActivityInfo;

class NativePlayer
{
    RelativeLayout content_layout;
    RelativeLayout video_layout;
    VideoView video_view;
    
    int screen_width = -1;
    int screen_height= -1;
    
    int virtual_width = -1;
    int virtual_height= -1;
    
    int x;
    int y;
    int w;
    int h;

    int old_x;
    int old_y;
    int old_w;
    int old_h;

    boolean rotated = false;
    
    public NativePlayer()
    {
        // getting content layout
        this.content_layout = (RelativeLayout) BBAndroidGame.AndroidGame().GetActivity().findViewById(R.id.mainLayout);
        
        // initialize video components
        video_layout = (RelativeLayout) BBAndroidGame.AndroidGame().GetActivity().findViewById(R.id.VideoLayout);
        video_view = (VideoView) BBAndroidGame.AndroidGame().GetActivity().findViewById(R.id.videoView1);
        
        // screen resolution
        Display display = BBAndroidGame.AndroidGame().GetActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        
        // screen resolution
        this.screen_width = size.x;
        this.screen_height= size.y;
        
        this.RefreshLayout();
    }
    
    private void RefreshLayout()
    {
        Log.d("position", "recalcPosition");
        
        video_layout.postInvalidate();
        video_view.postInvalidate();
        content_layout.postInvalidate();
        
        if (Looper.getMainLooper().getThread() == Thread.currentThread())
        {
            Log.d("position", "ui thread");
        }
        
    }
    
	public void SetVirtualResolution(int w, int h)
	{
	    this.virtual_width = w;
	    this.virtual_height = h;
	    
	    this.w = w;
	    this.h = h;
	    
	    this.recalcPosition();
	}

	public void SetPosition(int x, int y, int w, int h)
	{
        
        this.old_x = this.x;
        this.old_y = this.y;

        this.x = x;
        this.y = y;
        
        this.SetWidth(w);
        this.SetHeight(h);
        
        this.recalcPosition();
	}

	public void SetPosition(int x, int y)
	{
	    this.SetPosition(x, y, this.w, this.h);
	}

	public void SetWidth(int w)
	{
		this.old_w = this.w;
	    this.w = w;
	    
	    this.recalcPosition();
	}

	public void SetHeight(int h)
	{   
		this.old_h = this.h;
	    this.h = h;
	    
	    this.recalcPosition();
	}

	public void Show()
	{
	    video_layout.setVisibility(RelativeLayout.VISIBLE);
	    video_view.setVisibility(RelativeLayout.VISIBLE);
	    
	    this.RefreshLayout();
	}

	public void Hide()
	{
	    video_layout.setVisibility(RelativeLayout.GONE);
	    video_view.setVisibility(RelativeLayout.GONE);
	    
	    if (video_view.isPlaying())
	        video_view.stopPlayback();
	    
	    this.RefreshLayout();
	}

	public void Play()
	{
	    try
        {
	        // playing video
	        video_view.requestFocus();
	        video_view.start();
	        
	        this.RefreshLayout();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
	}

	public void Pause()
	{
	    try
	    {
	        video_view.pause();
	    }
	    catch(Exception e)
	    {
	        e.printStackTrace();
	    }
	}

	public void Stop()
	{
	    try
        {
            video_view.stopPlayback();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
	}

	public void SetUrl(String url)
	{
	    //String uriPath = "rtsp://192.168.0.3:554/user=admin&password=1&channel=1&stream=0.sdp?real_stream--rtp-caching=100";
	    if (video_view.isPlaying())
	    {
	        video_view.stopPlayback();
	    }
	    
        Uri uri = Uri.parse(url);
        video_view.setVideoURI(uri);
	}

	public void Rotate(int angle)
	{
		// rotate screen
	    if (angle >= 90){
	        BBAndroidGame.AndroidGame().GetActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
	        this.SetPosition(0, 0, this.virtual_height, this.virtual_width);

	        rotated = true;
	    }
	    else if (angle == 0) {
            BBAndroidGame.AndroidGame().GetActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            this.SetPosition(this.old_x, this.old_y, this.old_w, this.old_h);

            rotated = false;
        }
	}
	
	private void recalcPosition()
	{
	    int x = this.x;
	    int y = this.y;
	    int w = this.w;
	    int h = this.h;
	    
	    float vpx = ((float) this.screen_width) / ((float) this.virtual_width);
	    float vpy = ((float) this.screen_height) / ((float) this.virtual_height);
	    
	    // recalc x and width if the virtual resolution is setted 
	    if (this.virtual_width > -1)
	    {
	        x = (int) (this.x * vpx);
	        w = (int) (this.w * vpx);
	    }
	    
        // recalc y and height if the virtual resolution is setted
	    if (this.virtual_height > -1)
	    {
	        y = (int) (this.y * vpy);
	        h = (int) (this.h * vpy);
	    }
	    
	    video_layout.getLayoutParams().width = w;
	    video_layout.getLayoutParams().height = h;
	    ((RelativeLayout.LayoutParams)video_layout.getLayoutParams()).leftMargin = x;
	    ((RelativeLayout.LayoutParams)video_layout.getLayoutParams()).topMargin = y;

        this.RefreshLayout();

	}

	public boolean IsRotated()
	{
		return rotated;
	}

	public boolean IsPlaying()
	{
		return video_view.isPlaying();
	}
	
}




