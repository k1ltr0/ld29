
//${PACKAGE_BEGIN}
package com.monkeycoder.monkeygame;
//${PACKAGE_END}

//${IMPORTS_BEGIN}
import java.lang.Math;
import java.lang.reflect.Array;
import java.util.Vector;
import java.text.NumberFormat;
import java.text.ParseException;
import java.io.*;
import java.nio.*;
import java.net.*;
import java.util.*;
import java.text.*;
import java.lang.reflect.*;
import android.os.*;
import android.app.*;
import android.media.*;
import android.view.*;
import android.graphics.*;
import android.content.*;
import android.util.*;
import android.hardware.*;
import android.widget.*;
import android.view.inputmethod.*;
import android.content.res.*;
import android.opengl.*;
import javax.microedition.khronos.opengles.GL10;
import javax.microedition.khronos.egl.EGLConfig;
import android.content.res.AssetManager;
import android.content.res.AssetFileDescriptor;
import android.view.WindowManager.LayoutParams;
import android.net.Uri;
//${IMPORTS_END}

class MonkeyConfig{
//${CONFIG_BEGIN}
static final String ADMOB_ANDROID_TEST_DEVICE1="TEST_EMULATOR";
static final String ADMOB_ANDROID_TEST_DEVICE2="ABCDABCDABCDABCDABCDABCDABCDABCD";
static final String ADMOB_ANDROID_TEST_DEVICE3="";
static final String ADMOB_ANDROID_TEST_DEVICE4="";
static final String ADMOB_PUBLISHER_ID="abcdabcdabcdabc";
static final String ANDROID_APP_LABEL="Monkey Game";
static final String ANDROID_APP_PACKAGE="com.monkeycoder.monkeygame";
static final String ANDROID_GAMEPAD_ENABLED="0";
static final String ANDROID_KEY_ALIAS="release-key-alias";
static final String ANDROID_KEY_ALIAS_PASSWORD="password";
static final String ANDROID_KEY_STORE="../../release-key.keystore";
static final String ANDROID_KEY_STORE_PASSWORD="password";
static final String ANDROID_MAINFEST_APPLICATION="\n";
static final String ANDROID_MAINFEST_MAIN="\n";
static final String ANDROID_NATIVE_GL_ENABLED="0";
static final String ANDROID_SCREEN_ORIENTATION="user";
static final String ANDROID_SDK_DIR="/Users/ricardo/adt-bundle-mac/sdk";
static final String ANDROID_SIGN_APP="0";
static final String ANDROID_VERSION_CODE="1";
static final String ANDROID_VERSION_NAME="1.0";
static final String BINARY_FILES="*.bin|*.dat";
static final String BRL_GAMETARGET_IMPLEMENTED="1";
static final String BRL_THREAD_IMPLEMENTED="1";
static final String CD="";
static final String CONFIG="debug";
static final String HOST="macos";
static final String IMAGE_FILES="*.png|*.jpg|*.gif|*.bmp";
static final String LANG="java";
static final String MODPATH=".;/Users/ricardo/svn/monkey/modules/lp2/videoplayer;/Users/ricardo/MonkeyPro73b/modules;/Users/ricardo/MonkeyPro73b/modules_ext;/Users/ricardo/MonkeyPro73b/targets/android/modules";
static final String MOJO_HICOLOR_TEXTURES="1";
static final String MOJO_IMAGE_FILTERING_ENABLED="1";
static final String MONKEYDIR="";
static final String MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
static final String OPENGL_GLES20_ENABLED="0";
static final String SAFEMODE="0";
static final String SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
static final String TARGET="android";
static final String TEXT_FILES="*.txt|*.xml|*.json";
static final String TRANSDIR="";
//${CONFIG_END}
}

//${TRANSCODE_BEGIN}

// Java Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.



class bb_std_lang{

	//***** Error handling *****

	static String errInfo="";
	static Vector errStack=new Vector();
	
	static float D2R=0.017453292519943295f;
	static float R2D=57.29577951308232f;
	
	static NumberFormat numberFormat=NumberFormat.getInstance();
	
	static boolean[] emptyBoolArray=new boolean[0];
	static int[] emptyIntArray=new int[0];
	static float[] emptyFloatArray=new float[0];
	static String[] emptyStringArray=new String[0];
	
	static void pushErr(){
		errStack.addElement( errInfo );
	}
	
	static void popErr(){
		if( errStack.size()==0 ) throw new Error( "STACK ERROR!" );
		errInfo=(String)errStack.remove( errStack.size()-1 );
	}
	
	static String stackTrace(){
		if( errInfo.length()==0 ) return "";
		String str=errInfo+"\n";
		for( int i=errStack.size()-1;i>0;--i ){
			str+=(String)errStack.elementAt(i)+"\n";
		}
		return str;
	}
	
	static int print( String str ){
		System.out.println( str );
		return 0;
	}
	
	static int error( String str ){
		throw new RuntimeException( str );
	}
	
	static String makeError( String err ){
		if( err.length()==0 ) return "";
		return "Monkey Runtime Error : "+err+"\n\n"+stackTrace();
	}
	
	static int debugLog( String str ){
		print( str );
		return 0;
	}
	
	static int debugStop(){
		error( "STOP" );
		return 0;
	}
	
	//***** String stuff *****

	static public String[] stringArray( int n ){
		String[] t=new String[n];
		for( int i=0;i<n;++i ) t[i]="";
		return t;
	}
	
	static String slice( String str,int from ){
		return slice( str,from,str.length() );
	}
	
	static String slice( String str,int from,int term ){
		int len=str.length();
		if( from<0 ){
			from+=len;
			if( from<0 ) from=0;
		}else if( from>len ){
			from=len;
		}
		if( term<0 ){
			term+=len;
		}else if( term>len ){
			term=len;
		}
		if( term>from ) return str.substring( from,term );
		return "";
	}
	
	static public String[] split( String str,String sep ){
		if( sep.length()==0 ){
			String[] bits=new String[str.length()];
			for( int i=0;i<str.length();++i){
				bits[i]=String.valueOf( str.charAt(i) );
			}
			return bits;
		}else{
			int i=0,i2,n=1;
			while( (i2=str.indexOf( sep,i ))!=-1 ){
				++n;
				i=i2+sep.length();
			}
			String[] bits=new String[n];
			i=0;
			for( int j=0;j<n;++j ){
				i2=str.indexOf( sep,i );
				if( i2==-1 ) i2=str.length();
				bits[j]=slice( str,i,i2 );
				i=i2+sep.length();
			}
			return bits;
		}
	}
	
	static public String join( String sep,String[] bits ){
		if( bits.length<2 ) return bits.length==1 ? bits[0] : "";
		StringBuilder buf=new StringBuilder( bits[0] );
		boolean hasSep=sep.length()>0;
		for( int i=1;i<bits.length;++i ){
			if( hasSep ) buf.append( sep );
			buf.append( bits[i] );
		}
		return buf.toString();
	}
	
	static public String replace( String str,String find,String rep ){
		int i=0;
		for(;;){
			i=str.indexOf( find,i );
			if( i==-1 ) return str;
			str=str.substring( 0,i )+rep+str.substring( i+find.length() );
			i+=rep.length();
		}
	}
	
	static public String fromChars( int[] chars ){
		int n=chars.length;
		char[] chrs=new char[n];
		for( int i=0;i<n;++i ){
			chrs[i]=(char)chars[i];
		}
		return new String( chrs,0,n );
	}
	
	static int[] toChars( String str ){
		int[] arr=new int[str.length()];
		for( int i=0;i<str.length();++i ) arr[i]=(int)str.charAt( i );
		return arr;
	}
	
	//***** Array Stuff *****
	
	static Object sliceArray( Object arr,int from ){
		return sliceArray( arr,from,Array.getLength( arr ) );
	}
	
	static Object sliceArray( Object arr,int from,int term ){
		int len=Array.getLength( arr );
		if( from<0 ){
			from+=len;
			if( from<0 ) from=0;
		}else if( from>len ){
			from=len;
		}
		if( term<0 ){
			term+=len;
		}else if( term>len ){
			term=len;
		}
		if( term<from ) term=from;
		int newlen=term-from;
		Object res=Array.newInstance( arr.getClass().getComponentType(),newlen );
		if( newlen>0 ) System.arraycopy( arr,from,res,0,newlen );
		return res;
	}
	
	static Object resizeArray( Object arr,int newlen ){
		int len=Array.getLength( arr );
		Object res=Array.newInstance( arr.getClass().getComponentType(),newlen );
		int n=Math.min( len,newlen );
		if( n>0 ) System.arraycopy( arr,0,res,0,n );
		return res;
	}
	
	static Object[] resizeArrayArray( Object[] arr,int newlen ){
		int i=arr.length;
		arr=(Object[])resizeArray( arr,newlen );
		if( i<newlen ){
			Object empty=Array.newInstance( arr.getClass().getComponentType().getComponentType(),0 );
			while( i<newlen ) arr[i++]=empty;
		}
		return arr;
	}
	
	static String[] resizeStringArray( String[] arr,int newlen ){
		int i=arr.length;
		arr=(String[])resizeArray( arr,newlen );
		while( i<newlen ) arr[i++]="";
		return arr;
	}
	
	static Object concatArrays( Object lhs,Object rhs ){
		int lhslen=Array.getLength( lhs );
		int rhslen=Array.getLength( rhs );
		int len=lhslen+rhslen;
		Object res=Array.newInstance( lhs.getClass().getComponentType(),len );
		if( lhslen>0 ) System.arraycopy( lhs,0,res,0,lhslen );
		if( rhslen>0 ) System.arraycopy( rhs,0,res,lhslen,rhslen );
		return res;
	}
}

class ThrowableObject extends RuntimeException{
	ThrowableObject(){
		super( "Uncaught Monkey Exception" );
	}
}


class BBGameEvent{
	static final int KeyDown=1;
	static final int KeyUp=2;
	static final int KeyChar=3;
	static final int MouseDown=4;
	static final int MouseUp=5;
	static final int MouseMove=6;
	static final int TouchDown=7;
	static final int TouchUp=8;
	static final int TouchMove=9;
	static final int MotionAccel=10;
}

class BBGameDelegate{
	void StartGame(){}
	void SuspendGame(){}
	void ResumeGame(){}
	void UpdateGame(){}
	void RenderGame(){}
	void KeyEvent( int event,int data ){}
	void MouseEvent( int event,int data,float x,float y ){}
	void TouchEvent( int event,int data,float x,float y ){}
	void MotionEvent( int event,int data,float x,float y,float z ){}
	void DiscardGraphics(){}
}

abstract class BBGame{

	protected static BBGame _game;

	protected BBGameDelegate _delegate;
	protected boolean _keyboardEnabled;
	protected int _updateRate;
	protected boolean _debugExs;
	protected boolean _started;
	protected boolean _suspended;
	protected long _startms;
	
	public BBGame(){
		_game=this;
		_debugExs=MonkeyConfig.CONFIG.equals( "debug" );
		_startms=System.currentTimeMillis();
	}
	
	public static BBGame Game(){
		return _game;
	}
	
	public boolean Started(){
		return _started;
	}
	
	public boolean Suspended(){
		return _suspended;
	}

	public void SetDelegate( BBGameDelegate delegate ){
		_delegate=delegate;
	}
	
	public BBGameDelegate Delegate(){
		return _delegate;
	}
	
	public void SetKeyboardEnabled( boolean enabled){
		_keyboardEnabled=enabled;
	}
	
	public boolean KeyboardEnabled(){
		return _keyboardEnabled;
	}

	public void SetUpdateRate( int hertz ){
		_updateRate=hertz;
	}
	
	public int UpdateRate(){
		return _updateRate;
	}

	public int Millisecs(){
		return (int)(System.currentTimeMillis()-_startms);
	}
	
	public void GetDate( int[] date ){
		int n=date.length;
		if( n>0 ){
			Calendar c=Calendar.getInstance();
			date[0]=c.get( Calendar.YEAR );
			if( n>1 ){
				date[1]=c.get( Calendar.MONTH )+1;
				if( n>2 ){
					date[2]=c.get( Calendar.DATE );
					if( n>3 ){
						date[3]=c.get( Calendar.HOUR_OF_DAY );
						if( n>4 ){
							date[4]=c.get( Calendar.MINUTE );
							if( n>5 ){
								date[5]=c.get( Calendar.SECOND );
								if( n>6 ){
									date[6]=c.get( Calendar.MILLISECOND );
								}
							}
						}
					}
				}
			}
		}
	}
	
	public int SaveState( String state ){
		return -1;
	}

	public String LoadState(){
		return "";
	}

	public String LoadString( String path ){
		byte[] bytes=LoadData( path );
		if( bytes!=null ) return loadString( bytes );
		return "";
	}
	
	public boolean PollJoystick( int port,float[] joyx,float[] joyy,float[] joyz,boolean[] buttons ){
		return false;
	}
	
	public void SetMouseVisible( boolean visible ){
	}

	public void OpenUrl( String url ){	
	}
	
	String PathToFilePath( String path ){
		return "";
	}
	
	//***** Java Game *****
	
	public RandomAccessFile OpenFile( String path,String mode ){
		try{
			return new RandomAccessFile( PathToFilePath( path ),mode );
		}catch( IOException ex ){
		}
		return null;
	}
	
	public InputStream OpenInputStream( String path ){
		try{
			if( path.startsWith( "http:" ) || path.startsWith( "https:" ) ){
				URL url=new URL( path );
				URLConnection con=url.openConnection();
				return new BufferedInputStream( con.getInputStream() );
			}
			return new FileInputStream( PathToFilePath( path ) );
		}catch( IOException ex ){
		}
		return null;
	}
	
	byte[] LoadData( String path ){
		try{
			InputStream in=OpenInputStream( path );
			if( in==null ) return null;
			
			ByteArrayOutputStream out=new ByteArrayOutputStream(1024);
			byte[] buf=new byte[4096];
			
			for(;;){
				int n=in.read( buf );
				if( n<0 ) break;
				out.write( buf,0,n );
			}
			in.close();
			return out.toByteArray();
			
		}catch( IOException e ){
		}
		return null;
	}
	
	//***** INTERNAL *****
	
	public void Quit(){
		System.exit( 0 );
	}
	
	public void Die( RuntimeException ex ){
	
		String msg=ex.getMessage();
		if( msg!=null && msg.equals("") ){
			Quit();
			return;
		}
		if( _debugExs ){
			if( msg==null ) msg=ex.toString();
			bb_std_lang.print( "Monkey Runtime Error : "+msg );
			bb_std_lang.print( bb_std_lang.stackTrace() );
		}
		throw ex;
	}

	void StartGame(){
	
		if( _started ) return;
		_started=true;
		
		try{
			synchronized( _delegate ){
				_delegate.StartGame();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void SuspendGame(){
	
		if( !_started || _suspended ) return;
		_suspended=true;
		
		try{
			synchronized( _delegate ){
				_delegate.SuspendGame();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void ResumeGame(){

		if( !_started || !_suspended ) return;
		_suspended=false;
		
		try{
			synchronized( _delegate ){
				_delegate.ResumeGame();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void UpdateGame(){

		if( !_started || _suspended ) return;

		try{
			synchronized( _delegate ){
				_delegate.UpdateGame();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void RenderGame(){
	
		if( !_started ) return;
		
		try{
			synchronized( _delegate ){
				_delegate.RenderGame();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void KeyEvent( int event,int data ){

		if( !_started ) return;
	
		try{
			synchronized( _delegate ){
				_delegate.KeyEvent( event,data );
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void MouseEvent( int event,int data,float x,float y ){

		if( !_started ) return;
		
		try{
			synchronized( _delegate ){
				_delegate.MouseEvent( event,data,x,y );
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void TouchEvent( int event,int data,float x,float y ){

		if( !_started ) return;
		
		try{
			synchronized( _delegate ){
				_delegate.TouchEvent( event,data,x,y );
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void MotionEvent( int event,int data,float x,float y,float z ){

		if( !_started ) return;
		
		try{
			synchronized( _delegate ){
				_delegate.MotionEvent( event,data,x,y,z );
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	void DiscardGraphics(){

		if( !_started ) return;
		
		try{
			synchronized( _delegate ){
				_delegate.DiscardGraphics();
			}
		}catch( RuntimeException ex ){
			Die( ex );
		}
	}
	
	//***** Private *****
	
	private String toString( byte[] buf ){
		int n=buf.length;
		char tmp[]=new char[n];
		for( int i=0;i<n;++i ){
			tmp[i]=(char)(buf[i] & 0xff);
		}
		return new String( tmp );
	}
	
	private String loadString( byte[] buf ){
	
		int n=buf.length;
		StringBuilder out=new StringBuilder();
		
		int t0=n>0 ? buf[0] & 0xff : -1;
		int t1=n>1 ? buf[1] & 0xff : -1;
		
		if( t0==0xfe && t1==0xff ){
			int i=2;
			while( i<n-1 ){
				int x=buf[i++] & 0xff;
				int y=buf[i++] & 0xff;
				out.append( (char)((x<<8)|y) ); 
			}
		}else if( t0==0xff && t1==0xfe ){
			int i=2;
			while( i<n-1 ){
				int x=buf[i++] & 0xff;
				int y=buf[i++] & 0xff;
				out.append( (char)((y<<8)|x) ); 
			}
		}else{
			int t2=n>2 ? buf[2] & 0xff : -1;
			int i=(t0==0xef && t1==0xbb && t2==0xbf) ? 3 : 0;
			boolean fail=false;
			while( i<n ){
				int c=buf[i++] & 0xff;
				if( (c & 0x80)!=0 ){
					if( (c & 0xe0)==0xc0 ){
						if( i>=n || (buf[i] & 0xc0)!=0x80 ){
							fail=true;
							break;
						}
						c=((c & 0x1f)<<6) | (buf[i] & 0x3f);
						i+=1;
					}else if( (c & 0xf0)==0xe0 ){
						if( i+1>=n || (buf[i] & 0xc0)!=0x80 || (buf[i+1] & 0xc0)!=0x80 ){
							fail=true;
							break;
						}
						c=((c & 0x0f)<<12) | ((buf[i] & 0x3f)<<6) | (buf[i+1] & 0x3f);
						i+=2;
					}else{
						fail=true;
						break;
					}
				}
				out.append( (char)c );
			}
			if( fail ){
				return toString( buf );
			}
		}
		return out.toString();
	}
}



class ActivityDelegate{
	public void onStart(){
	}
	public void onRestart(){
	}
	public void onResume(){
	}
	public void onPause(){
	}
	public void onStop(){
	}
	public void onDestroy(){
	}
	public void onActivityResult( int requestCode,int resultCode,Intent data ){
	}
}

class BBAndroidGame extends BBGame implements GLSurfaceView.Renderer,SensorEventListener{

	static BBAndroidGame _androidGame;
	
	Activity _activity;
	GameView _view;
	
	List<ActivityDelegate> _activityDelegates=new LinkedList<ActivityDelegate>();
	
	int _reqCode;
	
	Display _display;

	GameTimer _timer;
	
	boolean _canRender;
	
	float[] _joyx=new float[2];
	float[] _joyy=new float[2];
	float[] _joyz=new float[2];
	boolean[] _buttons=new boolean[32];
	
	public BBAndroidGame( Activity activity,GameView view ){
		_androidGame=this;

		_activity=activity;
		_view=view;
		
		_display=_activity.getWindowManager().getDefaultDisplay();
		
		System.setOut( new PrintStream( new LogTool() ) );
	}
	
	public static BBAndroidGame AndroidGame(){

		return _androidGame;
	}
	
	//***** LogTool ******	

	static class LogTool extends OutputStream{
	
		ByteArrayOutputStream out=new ByteArrayOutputStream();
		
		@Override
		public void write( int b ) throws IOException{
			if( b==(int)'\n' ){
				Log.i( "[Monkey]",new String( this.out.toByteArray() ) );
				this.out=new ByteArrayOutputStream();
			}else{
				this.out.write(b);
			}
		}
	}
	
	//***** Timing *****
	
	static class GameTimer implements Runnable{
	
		long nextUpdate;
		long updatePeriod;
		boolean cancelled;
	
		public GameTimer( int fps ){
			updatePeriod=1000000000/fps;
			nextUpdate=System.nanoTime();
			_androidGame._view.postDelayed( this,updatePeriod/1000000 );
		}
	
		public void cancel(){
			cancelled=true;
		}
		
		public void run(){
			if( cancelled ) return;
			
			int updates;
			for( updates=0;updates<4;++updates ){
				nextUpdate+=updatePeriod;
				
				_androidGame.UpdateGame();
				if( cancelled ) return;
				
				if( nextUpdate-System.nanoTime()>0 ) break;
			}
			
			_androidGame._view.requestRender();
			
			if( cancelled ) return;
			
			if( updates==4 ){
				nextUpdate=System.nanoTime();
				_androidGame._view.postDelayed( this,0 );
			}else{
				long delay=nextUpdate-System.nanoTime();
				_androidGame._view.postDelayed( this,delay>0 ? delay/1000000 : 0 );
			}
		}
	}
	
	void ValidateUpdateTimer(){
		if( _timer!=null ){
			_timer.cancel();
			_timer=null;
		}
		if( _updateRate!=0 && !_suspended ){
			_timer=new GameTimer( _updateRate );
		}
	}
	
	//***** GameView *****
	
	public static class GameView extends GLSurfaceView{
	
		Object args1[]=new Object[1];
		float[] _touchX=new float[32];
		float[] _touchY=new float[32];

		boolean _useMulti;
		Method _getPointerCount,_getPointerId,_getX,_getY;
		
		boolean _useGamepad;
		Method _getSource,_getAxisValue;

		void init(){
		
			//get multi-touch methods
			try{
				Class cls=Class.forName( "android.view.MotionEvent" );
				Class intClass[]=new Class[]{ Integer.TYPE };
				_getPointerCount=cls.getMethod( "getPointerCount" );
				_getPointerId=cls.getMethod( "getPointerId",intClass );
				_getX=cls.getMethod( "getX",intClass );
				_getY=cls.getMethod( "getY",intClass );
				_useMulti=true;
			}catch( Exception ex ){
			}
			
			if( MonkeyConfig.ANDROID_GAMEPAD_ENABLED.equals( "1" ) ){
				try{
					//get gamepad methods
					Class cls=Class.forName( "android.view.MotionEvent" );
					Class intClass[]=new Class[]{ Integer.TYPE };
					_getSource=cls.getMethod( "getSource" );
					_getAxisValue=cls.getMethod( "getAxisValue",intClass );
					_useGamepad=true;
				}catch( Exception ex ){
				}
			}
		}

		public GameView( Context context ){
			super( context );
			init();
		}
		
		public GameView( Context context,AttributeSet attrs ){
			super( context,attrs );
			init();
		}
		
		//View event handling
	
		public boolean dispatchKeyEventPreIme( KeyEvent event ){

			//New! Experimental gamepad support...
			//
			if( _useGamepad ){
				int button=-1;
				switch( event.getKeyCode() ){
				case 96: button=0;break;	//A
				case 97: button=1;break;	//B
				case 99: button=2;break;	//X
				case 100:button=3;break;	//Y
				case 102:button=4;break;	//LB
				case 103:button=5;break;	//RB
				case 108:button=7;break;	//START
				}
				if( button!=-1 ){
					_androidGame._buttons[button]=(event.getAction()==KeyEvent.ACTION_DOWN);
					return true;
				}
			}
			
			if( !_androidGame._keyboardEnabled ) return false;
			
			//Convert back button to ESC is soft keyboard mode...
			//
			if( _androidGame._keyboardEnabled ){
				if( event.getKeyCode()==KeyEvent.KEYCODE_BACK ){
					if( event.getAction()==KeyEvent.ACTION_DOWN ){
						_androidGame.KeyEvent( BBGameEvent.KeyChar,27 );
					}
					return true;
				}
			}
			return false;
		}
		
		public boolean onKeyDown( int key,KeyEvent event ){
		
			int vkey=-1;
			switch( event.getKeyCode() ){
			case KeyEvent.KEYCODE_MENU:vkey=0x1a1;break;
			case KeyEvent.KEYCODE_SEARCH:vkey=0x1a3;break;
			}
			if( vkey!=-1 ){
				_androidGame.KeyEvent( BBGameEvent.KeyDown,vkey );
				_androidGame.KeyEvent( BBGameEvent.KeyUp,vkey );
				return true;
			}
			
			if( !_androidGame._keyboardEnabled ) return false;
			
			if( event.getKeyCode()==KeyEvent.KEYCODE_DEL ){
				_androidGame.KeyEvent( BBGameEvent.KeyChar,8 );
			}else{
				int chr=event.getUnicodeChar();
				if( chr!=0 ){
					_androidGame.KeyEvent( BBGameEvent.KeyChar,chr==10 ? 13 : chr );
				}
			}
			return true;
		}
		
		public boolean onKeyMultiple( int keyCode,int repeatCount,KeyEvent event ){
			if( !_androidGame._keyboardEnabled ) return false;
		
			String str=event.getCharacters();
			for( int i=0;i<str.length();++i ){
				int chr=str.charAt( i );
				if( chr!=0 ){
					_androidGame.KeyEvent( BBGameEvent.KeyChar,chr==10 ? 13 : chr );
				}
			}
			return true;
		}
		
		public boolean onTouchEvent( MotionEvent event ){
		
			if( !_useMulti ){
				//mono-touch version...
				//
				switch( event.getAction() ){
				case MotionEvent.ACTION_DOWN:
					_androidGame.TouchEvent( BBGameEvent.TouchDown,0,event.getX(),event.getY() );
					break;
				case MotionEvent.ACTION_UP:
					_androidGame.TouchEvent( BBGameEvent.TouchUp,0,event.getX(),event.getY() );
					break;
				case MotionEvent.ACTION_MOVE:
					_androidGame.TouchEvent( BBGameEvent.TouchMove,0,event.getX(),event.getY() );
					break;
				}
				return true;
			}
	
			try{
	
				//multi-touch version...
				//
				final int ACTION_DOWN=0;
				final int ACTION_UP=1;
				final int ACTION_POINTER_DOWN=5;
				final int ACTION_POINTER_UP=6;
				final int ACTION_POINTER_INDEX_SHIFT=8;
				final int ACTION_MASK=255;
				
				int index=-1;
				int action=event.getAction();
				int masked=action & ACTION_MASK;
				
				if( masked==ACTION_DOWN || masked==ACTION_POINTER_DOWN || masked==ACTION_UP || masked==ACTION_POINTER_UP ){
	
					index=action>>ACTION_POINTER_INDEX_SHIFT;
					
					args1[0]=Integer.valueOf( index );
					int pid=((Integer)_getPointerId.invoke( event,args1 )).intValue();
	
					float x=_touchX[pid]=((Float)_getX.invoke( event,args1 )).floatValue();
					float y=_touchY[pid]=((Float)_getY.invoke( event,args1 )).floatValue();
					
					if( masked==ACTION_DOWN || masked==ACTION_POINTER_DOWN ){
						_androidGame.TouchEvent( BBGameEvent.TouchDown,pid,x,y );
					}else{
						_androidGame.TouchEvent( BBGameEvent.TouchUp,pid,x,y );
					}
				}
	
				int pointerCount=((Integer)_getPointerCount.invoke( event )).intValue();
			
				for( int i=0;i<pointerCount;++i ){
					if( i==index ) continue;
	
					args1[0]=Integer.valueOf( i );
					int pid=((Integer)_getPointerId.invoke( event,args1 )).intValue();
	
					float x=((Float)_getX.invoke( event,args1 )).floatValue();
					float y=((Float)_getY.invoke( event,args1 )).floatValue();
	
					if( x!=_touchX[pid] || y!=_touchY[pid] ){
						_touchX[pid]=x;
						_touchY[pid]=y;
						_androidGame.TouchEvent( BBGameEvent.TouchMove,pid,x,y );
					}
				}
			}catch( Exception e ){
			}
	
			return true;
		}
		
		//New! Dodgy gamepad support...
		public boolean onGenericMotionEvent( MotionEvent event ){
		
			if( !_useGamepad ) return false;
			
			try{
				int source=((Integer)_getSource.invoke( event )).intValue();

				if( (source&16)==0 ) return false;
			
				BBAndroidGame g=_androidGame;
			
				args1[0]=Integer.valueOf( 0  );g._joyx[0]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				args1[0]=Integer.valueOf( 1  );g._joyy[0]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				args1[0]=Integer.valueOf( 17 );g._joyz[0]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				
				args1[0]=Integer.valueOf( 11 );g._joyx[1]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				args1[0]=Integer.valueOf( 14 );g._joyy[1]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				args1[0]=Integer.valueOf( 18 );g._joyz[1]=((Float)_getAxisValue.invoke( event,args1 )).floatValue();
				
				return true;
				
			}catch( Exception ex ){
			}

			return false;
		}
	}
	
	//***** BBGame ******
	
	public void SetKeyboardEnabled( boolean enabled ){
		super.SetKeyboardEnabled( enabled );

		InputMethodManager mgr=(InputMethodManager)_activity.getSystemService( Context.INPUT_METHOD_SERVICE );
		
		if( _keyboardEnabled ){
			// Hack for someone's phone...My LG or Samsung don't need it...
			mgr.hideSoftInputFromWindow( _view.getWindowToken(),0 );
			mgr.showSoftInput( _view,0 );		//0 is 'magic'! InputMethodManager.SHOW_IMPLICIT does weird things...
		}else{
			mgr.hideSoftInputFromWindow( _view.getWindowToken(),0 );
		}
	}
	
	public void SetUpdateRate( int hertz ){
		super.SetUpdateRate( hertz );
		ValidateUpdateTimer();
	}	

	public int SaveState( String state ){
		SharedPreferences prefs=_activity.getPreferences( 0 );
		SharedPreferences.Editor editor=prefs.edit();
		editor.putString( ".monkeystate",state );
		editor.commit();
		return 1;
	}
	
	public String LoadState(){
		SharedPreferences prefs=_activity.getPreferences( 0 );
		String state=prefs.getString( ".monkeystate","" );
		if( state.equals( "" ) ) state=prefs.getString( "gxtkAppState","" );
		return state;
	}
	
	static public String LoadState_V66b(){
		SharedPreferences prefs=_androidGame._activity.getPreferences( 0 );
		return prefs.getString( "gxtkAppState","" );
	}
	
	static public void SaveState_V66b( String state ){
		SharedPreferences prefs=_androidGame._activity.getPreferences( 0 );
		SharedPreferences.Editor editor=prefs.edit();
		editor.putString( "gxtkAppState",state );
		editor.commit();
	}
	
	public boolean PollJoystick( int port,float[] joyx,float[] joyy,float[] joyz,boolean[] buttons ){
		if( port!=0 ) return false;
		joyx[0]=_joyx[0];joyy[0]=_joyy[0];joyz[0]=_joyz[0];
		joyx[1]=_joyx[1];joyy[1]=_joyy[1];joyz[1]=_joyz[1];
		for( int i=0;i<32;++i ) buttons[i]=_buttons[i];
		return true;
	}
	
	public void OpenUrl( String url ){
		Intent browserIntent=new Intent( Intent.ACTION_VIEW,android.net.Uri.parse( url ) );
		_activity.startActivity( browserIntent );
	}
	
	String PathToFilePath( String path ){
		if( !path.startsWith( "monkey://" ) ){
			return path;
		}else if( path.startsWith( "monkey://internal/" ) ){
			File f=_activity.getFilesDir();
			if( f!=null ) return f+"/"+path.substring(18);
		}else if( path.startsWith( "monkey://external/" ) ){
//			File f=_activity.getExternalFilesDir(null);
			File f=Environment.getExternalStorageDirectory();
			if( f!=null ) return f+"/"+path.substring(18);
		}
		return "";
	}

	String PathToAssetPath( String path ){
		if( path.startsWith( "monkey://data/" ) ) return "monkey/"+path.substring(14);
		return "";
	}

	public InputStream OpenInputStream( String path ){
		if( !path.startsWith( "monkey://data/" ) ) return super.OpenInputStream( path );
		try{
			return _activity.getAssets().open( PathToAssetPath( path ) );
		}catch( IOException ex ){
		}
		return null;
	}

	public Activity GetActivity(){
		return _activity;
	}

	public GameView GetGameView(){
		return _view;
	}
	
	public void AddActivityDelegate( ActivityDelegate delegate ){
		if( _activityDelegates.contains( delegate ) ) return;
		_activityDelegates.add( delegate );
	}
	
	public int AllocateActivityResultRequestCode(){
		return ++_reqCode;
	}
	
	public void RemoveActivityDelegate( ActivityDelegate delegate ){
		_activityDelegates.remove( delegate );
	}

	public Bitmap LoadBitmap( String path ){
		try{
			InputStream in=OpenInputStream( path );
			if( in==null ) return null;

			BitmapFactory.Options opts=new BitmapFactory.Options();
			opts.inPreferredConfig=Bitmap.Config.ARGB_8888;
			opts.inPurgeable=true;

			Bitmap bitmap=BitmapFactory.decodeStream( in,null,opts );
			in.close();
			
			return bitmap;
		}catch( IOException e ){
		}
		return null;
	}

	public int LoadSound( String path,SoundPool pool ){
		try{
			if( path.startsWith( "monkey://data/" ) ){
				return pool.load( _activity.getAssets().openFd( PathToAssetPath( path ) ),1 );
			}else{
				return pool.load( PathToFilePath( path ),1 );
			}
		}catch( IOException ex ){
		}
		return 0;
	}
	
	public MediaPlayer OpenMedia( String path ){
		try{
			MediaPlayer mp;
			
			if( path.startsWith( "monkey://data/" ) ){
				AssetFileDescriptor fd=_activity.getAssets().openFd( PathToAssetPath( path ) );
				mp=new MediaPlayer();
				mp.setDataSource( fd.getFileDescriptor(),fd.getStartOffset(),fd.getLength() );
				mp.prepare();
				fd.close();
			}else{
				mp=new MediaPlayer();
				mp.setDataSource( PathToFilePath( path ) );
				mp.prepare();
			}
			return mp;
			
		}catch( IOException ex ){
		}
		return null;
	}
	
	//***** INTERNAL *****
	
	public void SuspendGame(){
		super.SuspendGame();
		ValidateUpdateTimer();
		_canRender=false;
	}
	
	public void ResumeGame(){
		super.ResumeGame();
		ValidateUpdateTimer();
	}

	public void UpdateGame(){
		//
		//Ok, this isn't very polite - if keyboard enabled, we just thrash showSoftInput.
		//
		//But showSoftInput doesn't seem to be too reliable - esp. after onResume - and I haven't found a way to
		//determine if keyboard is showing, so what can yer do...
		//
		if( _keyboardEnabled ){
			InputMethodManager mgr=(InputMethodManager)_activity.getSystemService( Context.INPUT_METHOD_SERVICE );
			mgr.showSoftInput( _view,0 );		//0 is 'magic'! InputMethodManager.SHOW_IMPLICIT does weird things...
		}
		super.UpdateGame();
	}
	
	public void Run(){

		//touch input handling	
		SensorManager sensorManager=(SensorManager)_activity.getSystemService( Context.SENSOR_SERVICE );
		List<Sensor> sensorList=sensorManager.getSensorList( Sensor.TYPE_ACCELEROMETER );
		Iterator<Sensor> it=sensorList.iterator();
		if( it.hasNext() ){
			Sensor sensor=it.next();
			sensorManager.registerListener( this,sensor,SensorManager.SENSOR_DELAY_GAME );
		}
		
		//audio volume control
		_activity.setVolumeControlStream( AudioManager.STREAM_MUSIC );

		//GL version
		if( MonkeyConfig.OPENGL_GLES20_ENABLED.equals( "1" ) ){
			//
			//_view.setEGLContextClientVersion( 2 );	//API 8 only!
			//
			try{
				Class clas=_view.getClass();
				Class parms[]=new Class[]{ Integer.TYPE };
				Method setVersion=clas.getMethod( "setEGLContextClientVersion",parms );
				Object args[]=new Object[1];
				args[0]=Integer.valueOf( 2 );
				setVersion.invoke( _view,args );
			}catch( Exception ex ){
			}
		}

		_view.setRenderer( this );
		_view.setRenderMode( GLSurfaceView.RENDERMODE_WHEN_DIRTY );
		_view.setFocusableInTouchMode( true );
		_view.requestFocus();
		_view.requestRender();
	}
	
	//***** GLSurfaceView.Renderer *****

	public void onDrawFrame( GL10 gl ){
		if( !_canRender ) return;
		
		if( !Started() ) StartGame();
		
		RenderGame();
	}
	
	public void onSurfaceChanged( GL10 gl,int width,int height ){
	}
	
	public void onSurfaceCreated( GL10 gl,EGLConfig config ){
		_canRender=true;
		DiscardGraphics();
	}
	
	//***** SensorEventListener *****
	
	public void onAccuracyChanged( Sensor sensor,int accuracy ){
	}
	
	public void onSensorChanged( SensorEvent event ){
		Sensor sensor=event.sensor;
		float x,y,z;
		switch( sensor.getType() ){
		case Sensor.TYPE_ORIENTATION:
			break;
		case Sensor.TYPE_ACCELEROMETER:
//			switch( _display.getRotation() ){
			switch( _display.getOrientation() ){	//deprecated in API 8, but we support 3...
			case Surface.ROTATION_0:
				x=event.values[0]/-9.81f;
				y=event.values[1]/9.81f;
				break;
			case Surface.ROTATION_90:
				x=event.values[1]/9.81f;
				y=event.values[0]/9.81f;
				break;
			case Surface.ROTATION_180:
				x=event.values[0]/9.81f;
				y=event.values[1]/-9.81f;
				break;
			case Surface.ROTATION_270:
				x=event.values[1]/-9.81f;
				y=event.values[0]/-9.81f;
				break;
			default:
				x=event.values[0]/-9.81f;
				y=event.values[1]/9.81f;
				break;
			}
			z=event.values[2]/-9.81f;
			MotionEvent( BBGameEvent.MotionAccel,-1,x,y,z );
			break;
		}
	}
}

class AndroidGame extends Activity{

	BBAndroidGame _game;
	
	GameView _view;
	
	//***** GameView *****

	public static class GameView extends BBAndroidGame.GameView{

		public GameView( Context context ){
			super( context );
		}
		
		public GameView( Context context,AttributeSet attrs ){
			super( context,attrs );
		}
	}
	
	//***** Activity *****
	public void onWindowFocusChanged( boolean hasFocus ){
		if( hasFocus ){
			_view.onResume();
			_game.ResumeGame();
		}else{
			_game.SuspendGame();
			_view.onPause();
		}
	}

	@Override
	public void onBackPressed(){
		//deprecating this!
		_game.KeyEvent( BBGameEvent.KeyDown,27 );
		_game.KeyEvent( BBGameEvent.KeyUp,27 );
		
		//new KEY_BACK value...
		_game.KeyEvent( BBGameEvent.KeyDown,0x1a0 );
		_game.KeyEvent( BBGameEvent.KeyUp,0x1a0 );
	}

	@Override
	public void onStart(){
		super.onResume();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onStart();
		}
	}
	
	@Override
	public void onRestart(){
		super.onResume();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onRestart();
		}
	}
	
	@Override
	public void onResume(){
		super.onResume();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onResume();
		}
	}
	
	@Override 
	public void onPause(){
		super.onPause();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onPause();
		}
	}

	@Override
	public void onStop(){
		super.onResume();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onStop();
		}
	}
	
	@Override
	protected void onDestroy(){
		super.onDestroy();
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onDestroy();
		}
	}
	
	@Override
	protected void onActivityResult( int requestCode,int resultCode,Intent data ){
		for( ActivityDelegate delegate : _game._activityDelegates ){
			delegate.onActivityResult( requestCode,resultCode,data );
		}
	}
}


class BBMonkeyGame extends BBAndroidGame{

	public BBMonkeyGame( AndroidGame game,AndroidGame.GameView view ){
		super( game,view );
	}
}

public class MonkeyGame extends AndroidGame{

	public static class GameView extends AndroidGame.GameView{

		public GameView( Context context ){
			super( context );
		}
		
		public GameView( Context context,AttributeSet attrs ){
			super( context,attrs );
		}
	}
	
	@Override
	public void onCreate( Bundle savedInstanceState ){
		super.onCreate( savedInstanceState );
		
		setContentView( R.layout.main );
		
		_view=(GameView)findViewById( R.id.gameView );
		
		_game=new BBMonkeyGame( this,_view );
		
		try{
				
			bb_.bbInit();
			bb_.bbMain();
			
		}catch( RuntimeException ex ){

			_game.Die( ex );

			finish();
		}

		if( _game.Delegate()==null ) finish();
		
		_game.Run();
	}
};

// Android mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.






class gxtkGraphics{

	static class RenderOp{
		int type,count,alpha;
		gxtkSurface surf;
	};

	static final int MAX_VERTICES=65536/20;
	static final int MAX_RENDEROPS=MAX_VERTICES/2;
	static final int MAX_QUAD_INDICES=MAX_VERTICES/4*6;
	
	static int seq=1;
	
	BBAndroidGame game;
	
	boolean gles20;
	int width,height;
	
	float alpha;
	float r,g,b;
	int colorARGB;
	int blend;
	float ix,iy,jx,jy,tx,ty;
	boolean tformed;
	
	RenderOp renderOps[]=new RenderOp[MAX_RENDEROPS];
	RenderOp rop,nullRop;
	int nextOp,vcount;

	float[] vertices=new float[MAX_VERTICES*4];	//x,y,u,v
	int[] colors=new int[MAX_VERTICES];	//rgba
	int vp,cp;
	
	FloatBuffer vbuffer;
	IntBuffer cbuffer;
	int vbo,vbo_seq,ibo;
	
	gxtkGraphics(){
	
		game=BBAndroidGame.AndroidGame();
		
		width=game.GetGameView().getWidth();
		height=game.GetGameView().getHeight();
		
		gles20=MonkeyConfig.OPENGL_GLES20_ENABLED.equals( "1" );
		if( gles20 ) return;
	
		for( int i=0;i<MAX_RENDEROPS;++i ){
			renderOps[i]=new RenderOp();
		}
		nullRop=new RenderOp();
		nullRop.type=-1;

		vbuffer=FloatBuffer.wrap( vertices,0,MAX_VERTICES*4 );
		cbuffer=IntBuffer.wrap( colors,0,MAX_VERTICES );
	}
	
	void Reset(){
		rop=nullRop;
		nextOp=0;
		vcount=0;
	}

	void Flush(){
		if( vcount==0 ) return;
	
		GLES11.glBufferData( GLES11.GL_ARRAY_BUFFER,vcount*20,null,GLES11.GL_DYNAMIC_DRAW );
		GLES11.glBufferSubData( GLES11.GL_ARRAY_BUFFER,0,vcount*16,vbuffer );
		GLES11.glBufferSubData( GLES11.GL_ARRAY_BUFFER,vcount*16,vcount*4,cbuffer );
		GLES11.glColorPointer( 4,GLES11.GL_UNSIGNED_BYTE,0,vcount*16 );

		GLES11.glDisable( GLES11.GL_TEXTURE_2D );
		GLES11.glDisable( GLES11.GL_BLEND );

		int index=0;
		boolean blendon=false;
		gxtkSurface surf=null;

		for( int i=0;i<nextOp;++i ){

			RenderOp op=renderOps[i];
			
			if( op.surf!=null ){
				if( op.surf!=surf ){
					if( surf==null ) GLES11.glEnable( GLES11.GL_TEXTURE_2D );
					surf=op.surf;
//					GLES11.glDisable( GLES11.GL_TEXTURE_2D );	//?!?
					surf.Bind();
//					GLES11.glEnable( GLES11.GL_TEXTURE_2D );	//?!?
				}
			}else{
				if( surf!=null ){
					GLES11.glDisable( GLES11.GL_TEXTURE_2D );
					surf=null;
				}
			}
			
			//should just have another blend mode...
			if( blend==1 || (op.alpha>>>24)!=0xff || (op.surf!=null && op.surf.hasAlpha) ){
				if( !blendon ){
					GLES11.glEnable( GLES11.GL_BLEND );
					blendon=true;
				}
			}else{
				if( blendon ){
					GLES11.glDisable( GLES11.GL_BLEND );
					blendon=false;
				}
			}
			
			switch( op.type ){
			case 1:
				GLES11.glDrawArrays( GLES11.GL_POINTS,index,op.count );
				break;
			case 2:
				GLES11.glDrawArrays( GLES11.GL_LINES,index,op.count );
				break;
			case 3:
				GLES11.glDrawArrays( GLES11.GL_TRIANGLES,index,op.count );
				break;
			case 4:
				GLES11.glDrawElements( GLES11.GL_TRIANGLES,op.count/4*6,GLES11.GL_UNSIGNED_SHORT,(index/4*6+(index&3)*MAX_QUAD_INDICES)*2 );
				break;
			default:
				for( int j=0;j<op.count;j+=op.type ){
					GLES11.glDrawArrays( GLES11.GL_TRIANGLE_FAN,index+j,op.type );
				}
			}
			
			index+=op.count;
		}
		
		Reset();
	}
	
	void Begin( int type,int count,gxtkSurface surf ){
		if( vcount+count>MAX_VERTICES ){
			Flush();
		}
		if( type!=rop.type || surf!=rop.surf ){
			if( nextOp==MAX_RENDEROPS ) Flush();
			rop=renderOps[nextOp];
			nextOp+=1;
			rop.type=type;
			rop.surf=surf;
			rop.count=0;
			rop.alpha=~0;
		}
		rop.alpha&=colorARGB;
		rop.count+=count;
		vp=vcount*4;
		cp=vcount;
		vcount+=count;
	}

	//***** GXTK API *****

	int Width(){
		return width;
	}
	
	int Height(){
		return height;
	}
	
	int BeginRender(){

		width=game.GetGameView().getWidth();
		height=game.GetGameView().getHeight();
		
		if( gles20 ) return 0;
		
		if( vbo_seq!=seq ){

			vbo_seq=seq;
			
			int[] bufs=new int[2];
			GLES11.glGenBuffers( 2,bufs,0 );
			vbo=bufs[0];
			ibo=bufs[1];
			
			GLES11.glBindBuffer( GLES11.GL_ARRAY_BUFFER,vbo );
			GLES11.glBufferData( GLES11.GL_ARRAY_BUFFER,MAX_VERTICES*20,null,GLES11.GL_DYNAMIC_DRAW );
			
			short[] idxs=new short[MAX_QUAD_INDICES*4];
			for( int j=0;j<4;++j ){
				int k=j*MAX_QUAD_INDICES;
				for( int i=0;i<MAX_QUAD_INDICES/6;++i ){
					idxs[i*6+k+0]=(short)(i*4+j);
					idxs[i*6+k+1]=(short)(i*4+j+1);
					idxs[i*6+k+2]=(short)(i*4+j+2);
					idxs[i*6+k+3]=(short)(i*4+j);
					idxs[i*6+k+4]=(short)(i*4+j+2);
					idxs[i*6+k+5]=(short)(i*4+j+3);
				}
			}
			ShortBuffer ibuffer=ShortBuffer.wrap( idxs,0,idxs.length );
			GLES11.glBindBuffer( GLES11.GL_ELEMENT_ARRAY_BUFFER,ibo );
			GLES11.glBufferData( GLES11.GL_ELEMENT_ARRAY_BUFFER,idxs.length*2,ibuffer,GLES11.GL_STATIC_DRAW );
		}
		
		GLES11.glViewport( 0,0,Width(),Height() );
		
		GLES11.glMatrixMode( GLES11.GL_PROJECTION );
		GLES11.glLoadIdentity();
		GLES11.glOrthof( 0,Width(),Height(),0,-1,1 );
		
		GLES11.glMatrixMode( GLES11.GL_MODELVIEW );
		GLES11.glLoadIdentity();
		
		GLES11.glEnable( GLES11.GL_BLEND );
		GLES11.glBlendFunc( GLES11.GL_ONE,GLES11.GL_ONE_MINUS_SRC_ALPHA );

		GLES11.glBindBuffer( GLES11.GL_ARRAY_BUFFER,vbo );
		GLES11.glBindBuffer( GLES11.GL_ELEMENT_ARRAY_BUFFER,ibo );
		GLES11.glEnableClientState( GLES11.GL_VERTEX_ARRAY );
		GLES11.glEnableClientState( GLES11.GL_TEXTURE_COORD_ARRAY );
		GLES11.glEnableClientState( GLES11.GL_COLOR_ARRAY );
		GLES11.glVertexPointer( 2,GLES11.GL_FLOAT,16,0 );
		GLES11.glTexCoordPointer( 2,GLES11.GL_FLOAT,16,8 );
		GLES11.glColorPointer( 4,GLES11.GL_UNSIGNED_BYTE,0,MAX_VERTICES*16 );

		Reset();
		
		return 1;
	}
	
	void EndRender(){
		if( gles20 ) return;
		Flush();
	}
	
	gxtkSurface LoadSurface__UNSAFE__( gxtkSurface surface,String path ){
		Bitmap bitmap=game.LoadBitmap( path );
		if( bitmap==null ) return null;
		surface.SetBitmap( bitmap );
		return surface;
	}
	
	gxtkSurface LoadSurface( String path ){
		return LoadSurface__UNSAFE__( new gxtkSurface(),path );
	}
	
	gxtkSurface CreateSurface( int width,int height ){
		Bitmap bitmap=Bitmap.createBitmap( width,height,Bitmap.Config.ARGB_8888 );
		if( bitmap!=null ) return new gxtkSurface( bitmap );
		return null;
	}
	
	void DiscardGraphics(){
		gxtkSurface.discarded.clear();
		seq+=1;
	}

	int SetAlpha( float alpha ){
		this.alpha=alpha;
		int a=(int)(alpha*255);
		colorARGB=(a<<24) | ((int)(b*alpha)<<16) | ((int)(g*alpha)<<8) | (int)(r*alpha);
		return 0;
	}

	int SetColor( float r,float g,float b ){
		this.r=r;
		this.g=g;
		this.b=b;
		int a=(int)(alpha*255);
		colorARGB=(a<<24) | ((int)(b*alpha)<<16) | ((int)(g*alpha)<<8) | (int)(r*alpha);
		return 0;
	}
	
	int SetBlend( int blend ){
		if( blend==this.blend ) return 0;
		
		Flush();
		
		this.blend=blend;
		
		switch( blend ){
		case 1:
			GLES11.glBlendFunc( GLES11.GL_ONE,GLES11.GL_ONE );
			break;
		default:
			GLES11.glBlendFunc( GLES11.GL_ONE,GLES11.GL_ONE_MINUS_SRC_ALPHA );
		}
		return 0;
	}
	
	int SetScissor( int x,int y,int w,int h ){
		Flush();
		
		if( x!=0 || y!=0 || w!=Width() || h!=Height() ){
			GLES11.glEnable( GLES11.GL_SCISSOR_TEST );
			y=Height()-y-h;
			GLES11.glScissor( x,y,w,h );
		}else{
			GLES11.glDisable( GLES11.GL_SCISSOR_TEST );
		}
		return 0;
	}
	
	int SetMatrix( float ix,float iy,float jx,float jy,float tx,float ty ){
	
		tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
		this.ix=ix;
		this.iy=iy;
		this.jx=jx;
		this.jy=jy;
		this.tx=tx;
		this.ty=ty;
		
		return 0;
	}
	
	int Cls( float r,float g,float b ){
		Reset();
		
		GLES11.glClearColor( r/255.0f,g/255.0f,b/255.0f,1 );
		GLES11.glClear( GLES11.GL_COLOR_BUFFER_BIT|GLES11.GL_DEPTH_BUFFER_BIT );
		
		return 0;
	}
	
	int DrawPoint( float x,float y ){
	
		if( tformed ){
			float px=x;
			x=px * ix + y * jx + tx;
			y=px * iy + y * jy + ty;
		}
		
		Begin( 1,1,null );
		
		vertices[vp]=x;vertices[vp+1]=y;
		
		colors[cp]=colorARGB;
		
		return 0;
	}
	
	int DrawRect( float x,float y,float w,float h ){
	
		float x0=x,x1=x+w,x2=x+w,x3=x;
		float y0=y,y1=y,y2=y+h,y3=y+h;
		
		if( tformed ){
			float tx0=x0,tx1=x1,tx2=x2,tx3=x3;
			x0=tx0 * ix + y0 * jx + tx;
			y0=tx0 * iy + y0 * jy + ty;
			x1=tx1 * ix + y1 * jx + tx;
			y1=tx1 * iy + y1 * jy + ty;
			x2=tx2 * ix + y2 * jx + tx;
			y2=tx2 * iy + y2 * jy + ty;
			x3=tx3 * ix + y3 * jx + tx;
			y3=tx3 * iy + y3 * jy + ty;
		}

		Begin( 4,4,null );
		
		vertices[vp]=x0;vertices[vp+1]=y0;
		vertices[vp+4]=x1;vertices[vp+5]=y1;
		vertices[vp+8]=x2;vertices[vp+9]=y2;
		vertices[vp+12]=x3;vertices[vp+13]=y3;
		
		colors[cp]=colors[cp+1]=colors[cp+2]=colors[cp+3]=colorARGB;

		return 0;
	}
	
	int DrawLine( float x0,float y0,float x1,float y1 ){
		
		if( tformed ){
			float tx0=x0,tx1=x1;
			x0=tx0 * ix + y0 * jx + tx;
			y0=tx0 * iy + y0 * jy + ty;
			x1=tx1 * ix + y1 * jx + tx;
			y1=tx1 * iy + y1 * jy + ty;
		}

		Begin( 2,2,null );

		vertices[vp]=x0;vertices[vp+1]=y0;
		vertices[vp+4]=x1;vertices[vp+5]=y1;

		colors[cp]=colors[cp+1]=colorARGB;

		return 0;
 	}

	int DrawOval( float x,float y,float w,float h ){

		float xr=w/2.0f;
		float yr=h/2.0f;

		int n;	
		if( tformed ){
			float xx=xr*ix,xy=xr*iy,xd=(float)Math.sqrt(xx*xx+xy*xy);
			float yx=yr*jx,yy=yr*jy,yd=(float)Math.sqrt(yx*yx+yy*yy);
			n=(int)( xd+yd );
		}else{
			n=(int)( Math.abs(xr)+Math.abs(yr) );
		}

		if( n>MAX_VERTICES ){
			n=MAX_VERTICES;
		}else if( n<12 ){
			n=12;
		}else{
			n&=~3;
		}
		
		x+=xr;
		y+=yr;
		
		Begin( n,n,null );
		
		for( int i=0;i<n;++i ){
			float th=i * 6.28318531f / n;
			float x0=(float)(x+Math.cos(th)*xr);
			float y0=(float)(y+Math.sin(th)*yr);
			if( tformed ){
				float tx0=x0;
				x0=tx0 * ix + y0 * jx + tx;
				y0=tx0 * iy + y0 * jy + ty;
			}
			vertices[vp]=x0;
			vertices[vp+1]=y0;
			colors[cp]=colorARGB;
			vp+=4;
			cp+=1;
		}
		
		return 0;
	}
	
	int DrawPoly( float[] verts ){
		if( verts.length<6 || verts.length>MAX_VERTICES*2 ) return 0;

		Begin( verts.length/2,verts.length/2,null );		
		
		if( tformed ){
			for( int i=0;i<verts.length;i+=2 ){
				vertices[vp  ]=verts[i] * ix + verts[i+1] * jx + tx;
				vertices[vp+1]=verts[i] * iy + verts[i+1] * jy + ty;
				colors[cp]=colorARGB;
				vp+=4;
				cp+=1;
			}
		}else{
			for( int i=0;i<verts.length;i+=2 ){
				vertices[vp  ]=verts[i];
				vertices[vp+1]=verts[i+1];
				colors[cp]=colorARGB;
				vp+=4;
				cp+=1;
			}
		}
		
		return 0;
	}
	
	int DrawPoly2( float[] verts,gxtkSurface surface,int srcx,int srcy ){
	
		int n=verts.length/4;
		if( n<1 || n>MAX_VERTICES ) return 0;
		
		Begin( n,n,surface );
		
		for( int i=0;i<n;++i ){
			int j=i*4;
			if( tformed ){
				vertices[vp  ]=verts[j] * ix + verts[j+1] * jx + tx;
				vertices[vp+1]=verts[j] * iy + verts[j+1] * jy + ty;
			}else{
				vertices[vp  ]=verts[j];
				vertices[vp+1]=verts[j+1];
			}
			vertices[vp+2]=(srcx+verts[j+2])*surface.uscale;
			vertices[vp+3]=(srcy+verts[j+3])*surface.vscale;
			colors[cp]=colorARGB;
			vp+=4;
			cp+=1;
		}
		
		return 0;
	}
	
	int DrawSurface( gxtkSurface surface,float x,float y ){
	
		float w=surface.width;
		float h=surface.height;
		float u0=0,u1=w*surface.uscale;
		float v0=0,v1=h*surface.vscale;
		
		float x0=x,x1=x+w,x2=x+w,x3=x;
		float y0=y,y1=y,y2=y+h,y3=y+h;
		
		if( tformed ){
			float tx0=x0,tx1=x1,tx2=x2,tx3=x3;
			x0=tx0 * ix + y0 * jx + tx;
			y0=tx0 * iy + y0 * jy + ty;
			x1=tx1 * ix + y1 * jx + tx;
			y1=tx1 * iy + y1 * jy + ty;
			x2=tx2 * ix + y2 * jx + tx;
			y2=tx2 * iy + y2 * jy + ty;
			x3=tx3 * ix + y3 * jx + tx;
			y3=tx3 * iy + y3 * jy + ty;
		}
	
		Begin( 4,4,surface );
		
		vertices[vp]=x0;vertices[vp+1]=y0;vertices[vp+2]=u0;vertices[vp+3]=v0;
		vertices[vp+4]=x1;vertices[vp+5]=y1;vertices[vp+6]=u1;vertices[vp+7]=v0;
		vertices[vp+8]=x2;vertices[vp+9]=y2;vertices[vp+10]=u1;vertices[vp+11]=v1;
		vertices[vp+12]=x3;vertices[vp+13]=y3;vertices[vp+14]=u0;vertices[vp+15]=v1;

		colors[cp]=colors[cp+1]=colors[cp+2]=colors[cp+3]=colorARGB;

		return 0;
	}
	
	int DrawSurface2( gxtkSurface surface,float x,float y,int srcx,int srcy,int srcw,int srch ){
	
		float w=srcw;
		float h=srch;
		float u0=srcx*surface.uscale,u1=(srcx+srcw)*surface.uscale;
		float v0=srcy*surface.vscale,v1=(srcy+srch)*surface.vscale;
		
		float x0=x,x1=x+w,x2=x+w,x3=x;
		float y0=y,y1=y,y2=y+h,y3=y+h;
		
		if( tformed ){
			float tx0=x0,tx1=x1,tx2=x2,tx3=x3;
			x0=tx0 * ix + y0 * jx + tx;
			y0=tx0 * iy + y0 * jy + ty;
			x1=tx1 * ix + y1 * jx + tx;
			y1=tx1 * iy + y1 * jy + ty;
			x2=tx2 * ix + y2 * jx + tx;
			y2=tx2 * iy + y2 * jy + ty;
			x3=tx3 * ix + y3 * jx + tx;
			y3=tx3 * iy + y3 * jy + ty;
		}

		Begin( 4,4,surface );
		
		vertices[vp]=x0;vertices[vp+1]=y0;vertices[vp+2]=u0;vertices[vp+3]=v0;
		vertices[vp+4]=x1;vertices[vp+5]=y1;vertices[vp+6]=u1;vertices[vp+7]=v0;
		vertices[vp+8]=x2;vertices[vp+9]=y2;vertices[vp+10]=u1;vertices[vp+11]=v1;
		vertices[vp+12]=x3;vertices[vp+13]=y3;vertices[vp+14]=u0;vertices[vp+15]=v1;

		colors[cp]=colors[cp+1]=colors[cp+2]=colors[cp+3]=colorARGB;

		return 0;
	}
	
	int ReadPixels( int[] pixels,int x,int y,int width,int height,int offset,int pitch ){
	
		Flush();
		
		int[] texels=new int[width*height];
		IntBuffer buf=IntBuffer.wrap( texels );

		GLES11.glReadPixels( x,Height()-y-height,width,height,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_BYTE,buf );

		int i=0;
		for( int py=height-1;py>=0;--py ){
			int j=offset+py*pitch;
			for( int px=0;px<width;++px ){
				int p=texels[i++];
				//RGBA -> BGRA, Big Endian!
				pixels[j++]=(p&0xff000000)|((p<<16)&0xff0000)|(p&0xff00)|((p>>16)&0xff);
			}
		}
	
		return 0;
	}

	int WritePixels2( gxtkSurface surface,int[] pixels,int x,int y,int width,int height,int offset,int pitch ){
	
		Flush();
	
		surface.bitmap.setPixels( pixels,offset,pitch,x,y,width,height );
		
		surface.Invalidate();
	
		return 0;
	}
	
}

class gxtkSurface{

	Bitmap bitmap;
	
	int width,height;
	int twidth,theight;
	float uscale,vscale;
	boolean hasAlpha;
	int texId,seq;

	static Vector discarded=new Vector();
	
	gxtkSurface(){
	}
	
	gxtkSurface( Bitmap bitmap ){
		SetBitmap( bitmap );
	}
	
	void SetBitmap( Bitmap bitmap ){
		this.bitmap=bitmap;
		width=bitmap.getWidth();
		height=bitmap.getHeight();
		hasAlpha=bitmap.hasAlpha();
		twidth=Pow2Size( width );
		theight=Pow2Size( height );
		uscale=1.0f/(float)twidth;
		vscale=1.0f/(float)theight;
	}

	protected void finalize(){
		Discard();
	}
	
	int Pow2Size( int n ){
		int i=1;
		while( i<n ) i*=2;
		return i;
	}
	
	static void FlushDiscarded(){
		int n=discarded.size();
		if( n==0 ) return;
		int[] texs=new int[n];
		for( int i=0;i<n;++i ){
			texs[i]=((Integer)discarded.elementAt(i)).intValue();
		}
		GLES11.glDeleteTextures( n,texs,0 );
		discarded.clear();
	}
	
	void Invalidate(){
		if( texId!=0 ){
			if( seq==gxtkGraphics.seq ) discarded.add( Integer.valueOf( texId ) );
			texId=0;
		}
	}
	
	void Bind(){
	
		if( texId!=0 && seq==gxtkGraphics.seq ){
			GLES11.glBindTexture( GLES11.GL_TEXTURE_2D,texId );
			return;
		}
        
        if( bitmap==null ) throw new Error( "Attempt to use discarded image" );
		
		FlushDiscarded();

		int[] texs=new int[1];
		GLES11.glGenTextures( 1,texs,0 );
		texId=texs[0];
		if( texId==0 ) throw new Error( "glGenTextures failed" );
		seq=gxtkGraphics.seq;
		
		GLES11.glBindTexture( GLES11.GL_TEXTURE_2D,texId );
		
		if( MonkeyConfig.MOJO_IMAGE_FILTERING_ENABLED.equals( "1" ) ){
			GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_MAG_FILTER,GLES11.GL_LINEAR );
			GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_MIN_FILTER,GLES11.GL_LINEAR );
		}else{
			GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_MAG_FILTER,GLES11.GL_NEAREST );
			GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_MIN_FILTER,GLES11.GL_NEAREST );
		}

		GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_WRAP_S,GLES11.GL_CLAMP_TO_EDGE );
		GLES11.glTexParameteri( GLES11.GL_TEXTURE_2D,GLES11.GL_TEXTURE_WRAP_T,GLES11.GL_CLAMP_TO_EDGE );
		
		int pwidth=(width==twidth) ? width : width+1;
		int pheight=(height==theight) ? height : height+1;

		int sz=pwidth*pheight;
		int[] pixels=new int[sz];
		bitmap.getPixels( pixels,0,pwidth,0,0,width,height );
		
		//pad edges for non pow-2 images - not sexy!
		if( width!=pwidth ){
			for( int y=0;y<height;++y ){
				pixels[y*pwidth+width]=pixels[y*pwidth+width-1];
			}
		}
		if( height!=pheight ){
			for( int x=0;x<width;++x ){
				pixels[height*pwidth+x]=pixels[height*pwidth+x-pwidth];
			}
		}
		if( width!=pwidth && height!=pheight ){
			pixels[height*pwidth+width]=pixels[height*pwidth+width-pwidth-1];
		}
		
		GLES11.glPixelStorei( GLES11.GL_UNPACK_ALIGNMENT,1 );
		
		boolean hicolor_textures=MonkeyConfig.MOJO_HICOLOR_TEXTURES.equals( "1" );
		
		if( hicolor_textures && hasAlpha ){

			//RGBA8888...
			ByteBuffer buf=ByteBuffer.allocate( sz*4 );
			buf.order( ByteOrder.BIG_ENDIAN );

			for( int i=0;i<sz;++i ){
				int p=pixels[i];
				int a=(p>>24) & 255;
				int r=((p>>16) & 255)*a/255;
				int g=((p>>8) & 255)*a/255;
				int b=(p & 255)*a/255;
				buf.putInt( (r<<24)|(g<<16)|(b<<8)|a );
			}
			buf.position( 0 );
			GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGBA,twidth,theight,0,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_BYTE,null );
			GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_BYTE,buf );

		}else if( hicolor_textures && !hasAlpha ){
		
			//RGB888...
			ByteBuffer buf=ByteBuffer.allocate( sz*3 );
			buf.order( ByteOrder.BIG_ENDIAN );
			
			for( int i=0;i<sz;++i ){
				int p=pixels[i];
				int r=(p>>16) & 255;
				int g=(p>>8) & 255;
				int b=p & 255;
				buf.put( (byte)r );
				buf.put( (byte)g );
				buf.put( (byte)b );
			}
			buf.position( 0 );
			GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGB,twidth,theight,0,GLES11.GL_RGB,GLES11.GL_UNSIGNED_BYTE,null );
			GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGB,GLES11.GL_UNSIGNED_BYTE,buf );
			
		}else if( !hicolor_textures && hasAlpha ){

			//16 bit RGBA...
			ByteBuffer buf=ByteBuffer.allocate( sz*2 );
			buf.order( ByteOrder.LITTLE_ENDIAN );
			
			//do we need 4 bit alpha?
			boolean a4=false;
			for( int i=0;i<sz;++i ){
				int a=(pixels[i]>>28) & 15;
				if( a!=0 && a!=15 ){
					a4=true;
					break;
				}
			}
			if( a4 ){
				//RGBA4444...
				for( int i=0;i<sz;++i ){
					int p=pixels[i];
					int a=(p>>28) & 15;
					int r=((p>>20) & 15)*a/15;
					int g=((p>>12) & 15)*a/15;
					int b=((p>> 4) & 15)*a/15;
					buf.putShort( (short)( (r<<12)|(g<<8)|(b<<4)|a ) );
				}
				buf.position( 0 );
				GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGBA,twidth,theight,0,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_SHORT_4_4_4_4,null );
				GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_SHORT_4_4_4_4,buf );
			}else{
				//RGBA5551...
				for( int i=0;i<sz;++i ){
					int p=pixels[i];
					int a=(p>>31) & 1;
					int r=((p>>19) & 31)*a;
					int g=((p>>11) & 31)*a;
					int b=((p>> 3) & 31)*a;
					buf.putShort( (short)( (r<<11)|(g<<6)|(b<<1)|a ) );
				}
				buf.position( 0 );
				GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGBA,twidth,theight,0,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_SHORT_5_5_5_1,null );
				GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_SHORT_5_5_5_1,buf );
			}
		}else if( !hicolor_textures && !hasAlpha ){
		
			ByteBuffer buf=ByteBuffer.allocate( sz*2 );
			buf.order( ByteOrder.LITTLE_ENDIAN );
			
			//RGB565...
			for( int i=0;i<sz;++i ){
				int p=pixels[i];
				int r=(p>>19) & 31;
				int g=(p>>10) & 63;
				int b=(p>> 3) & 31;
				buf.putShort( (short)( (r<<11)|(g<<5)|b ) );
			}
			buf.position( 0 );
			GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGB,twidth,theight,0,GLES11.GL_RGB,GLES11.GL_UNSIGNED_SHORT_5_6_5,null );
			GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGB,GLES11.GL_UNSIGNED_SHORT_5_6_5,buf );
		}
/*		
		if( hasAlpha ){
			//RGBA8888...		
			for( int i=0;i<sz;++i ){
				int p=pixels[i];
				int a=(p>>24) & 255;
				int r=((p>>16) & 255)*a/255;
				int g=((p>>8) & 255)*a/255;
				int b=(p & 255)*a/255;
				pixels[i]=(a<<24)|(b<<16)|(g<<8)|r;
			}
			IntBuffer buf=IntBuffer.wrap( pixels );
			GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGBA,twidth,theight,0,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_BYTE,null );
			GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGBA,GLES11.GL_UNSIGNED_BYTE,buf );
			
		}else{
			//RGB888...
			byte[] data=new byte[sz*3];
			for( int i=0;i<sz;++i ){
				int p=pixels[i];
				int r=(p>>16) & 255;
				int g=(p>>8) & 255;
				int b=p & 255;
				data[i*3+0]=(byte)r;
				data[i*3+1]=(byte)g;
				data[i*3+2]=(byte)b;
			}
			ByteBuffer buf=ByteBuffer.wrap( data );
			GLES11.glTexImage2D( GLES11.GL_TEXTURE_2D,0,GLES11.GL_RGB,twidth,theight,0,GLES11.GL_RGB,GLES11.GL_UNSIGNED_BYTE,null );
			GLES11.glTexSubImage2D( GLES11.GL_TEXTURE_2D,0,0,0,pwidth,pheight,GLES11.GL_RGB,GLES11.GL_UNSIGNED_BYTE,buf );
		}
*/		
	}
	
	//***** GXTK API *****
	
	int Discard(){
		Invalidate();
		bitmap=null;
		return 0;
	}

	int Width(){
		return width;
	}
	
	int Height(){
		return height;
	}

	int Loaded(){
		return 1;
	}
	
	boolean OnUnsafeLoadComplete(){
		return true;
	}
	
}

class gxtkAudio{

	static class gxtkChannel{
		int stream;		//SoundPool stream ID, 0=none
		float volume=1;
		float rate=1;
		float pan;
		int state;
	};
	
	BBAndroidGame game;
	SoundPool pool;
	MediaPlayer music;
	float musicVolume=1;
	int musicState=0;
	
	gxtkChannel[] channels=new gxtkChannel[32];
	
	gxtkAudio(){
		game=BBAndroidGame.AndroidGame();
		pool=new SoundPool( 32,AudioManager.STREAM_MUSIC,0 );
		for( int i=0;i<32;++i ){
			channels[i]=new gxtkChannel();
		}
	}
	
	void OnDestroy(){
		for( int i=0;i<32;++i ){
			if( channels[i].state!=0 ) pool.stop( channels[i].stream );
		}
		pool.release();
		pool=null;
	}
	
	//***** GXTK API *****
	int Suspend(){
		if( musicState==1 ) music.pause();
		for( int i=0;i<32;++i ){
			if( channels[i].state==1 ) pool.pause( channels[i].stream );
		}
		return 0;
	}
	
	int Resume(){
		if( musicState==1 ) music.start();
		for( int i=0;i<32;++i ){
			if( channels[i].state==1 ) pool.resume( channels[i].stream );
		}
		return 0;
	}
	

	gxtkSample LoadSample__UNSAFE__( gxtkSample sample,String path ){
		gxtkSample.FlushDiscarded( pool );
		int sound=game.LoadSound( path,pool );
		if( sound==0 ) return null;
		sample.SetSound( sound );
		return sample;
	}
	
	gxtkSample LoadSample( String path ){
		return LoadSample__UNSAFE__( new gxtkSample(),path );
	}
	
	int PlaySample( gxtkSample sample,int channel,int flags ){
		gxtkChannel chan=channels[channel];
		if( chan.stream!=0 ) pool.stop( chan.stream );
		float rv=(chan.pan * .5f + .5f) * chan.volume;
		float lv=chan.volume-rv;
		int loops=(flags&1)!=0 ? -1 : 0;

		//chan.stream=pool.play( sample.sound,lv,rv,0,loops,chan.rate );
		//chan.state=1;
		//return 0;
		
		//Ugly as hell, but seems to work for now...pauses 10 secs max...
		for( int i=0;i<100;++i ){
			chan.stream=pool.play( sample.sound,lv,rv,0,loops,chan.rate );
			if( chan.stream!=0 ){
				chan.state=1;
				return 0;
			}
//			throw new Error( "PlaySample failed to play sound" );
			try{
				Thread.sleep( 100 );
			}catch( java.lang.InterruptedException ex ){
			}
		}
		throw new Error( "PlaySample failed to play sound" );
	}
	
	int StopChannel( int channel ){
		gxtkChannel chan=channels[channel];
		if( chan.state!=0 ){
			pool.stop( chan.stream );
			chan.state=0;
		}
		return 0;
	}
	
	int PauseChannel( int channel ){
		gxtkChannel chan=channels[channel];
		if( chan.state==1 ){
			pool.pause( chan.stream );
			chan.state=2;
		}
		return 0;
	}
	
	int ResumeChannel( int channel ){
		gxtkChannel chan=channels[channel];
		if( chan.state==2 ){
			pool.resume( chan.stream );
			chan.state=1;
		}
		return 0;
	}
	
	int ChannelState( int channel ){
		return -1;
	}
	
	int SetVolume( int channel,float volume ){
		gxtkChannel chan=channels[channel];
		chan.volume=volume;
		if( chan.stream!=0 ){
			float rv=(chan.pan * .5f + .5f) * chan.volume;
			float lv=chan.volume-rv;
			pool.setVolume( chan.stream,lv,rv );
		}
		return 0;
	}
	
	int SetPan( int channel,float pan ){
		gxtkChannel chan=channels[channel];
		chan.pan=pan;
		if( chan.stream!=0 ){
			float rv=(chan.pan * .5f + .5f) * chan.volume;
			float lv=chan.volume-rv;
			pool.setVolume( chan.stream,lv,rv );
		}
		return 0;
	}

	int SetRate( int channel,float rate ){
		gxtkChannel chan=channels[channel];
		chan.rate=rate;
		if( chan.stream!=0 ){
			pool.setRate( chan.stream,chan.rate );
		}
		return 0;
	}
	
	int PlayMusic( String path,int flags ){
		StopMusic();
		music=game.OpenMedia( path );
		if( music==null ) return -1;
		music.setLooping( (flags&1)!=0 );
		music.setVolume( musicVolume,musicVolume );
		music.start();
		musicState=1;
		return 0;
	}
	
	int StopMusic(){
		if( musicState!=0 ){
			music.stop();
			music.release();
			musicState=0;
			music=null;
		}
		return 0;
	}
	
	int PauseMusic(){
		if( musicState==1 && music.isPlaying() ){
			music.pause();
			musicState=2;
		}
		return 0;
	}
	
	int ResumeMusic(){
		if( musicState==2 ){
			music.start();
			musicState=1;
		}
		return 0;
	}
	
	int MusicState(){
		if( musicState==1 && !music.isPlaying() ) musicState=0;
		return musicState;
	}
	
	int SetMusicVolume( float volume ){
		if( musicState!=0 ) music.setVolume( volume,volume );
		musicVolume=volume;
		return 0;
	}	
}

class gxtkSample{

	int sound;
	
	static Vector discarded=new Vector();
	
	gxtkSample(){
	}
	
	gxtkSample( int sound ){
		this.sound=sound;
	}
	
	void SetSound( int sound ){
		this.sound=sound;
	}
	
	protected void finalize(){
		Discard();
	}
	
	static void FlushDiscarded( SoundPool pool ){
		int n=discarded.size();
		if( n==0 ) return;
		Vector out=new Vector();
		for( int i=0;i<n;++i ){
			Integer val=(Integer)discarded.elementAt(i);
			if( pool.unload( val.intValue() ) ){
//				bb_std_lang.print( "unload OK!" );
			}else{
//				bb_std_lang.print( "unload failed!" );
				out.add( val );
			}
		}
		discarded=out;
//		bb_std_lang.print( "undiscarded="+out.size() );
	}

	//***** GXTK API *****
	
	int Discard(){
		if( sound!=0 ){
			discarded.add( Integer.valueOf( sound ) );
			sound=0;
		}
		return 0;
	}
}

class BBThread implements Runnable{

	Object _result;
	boolean _running;
	Thread _thread;
	
	boolean IsRunning(){
		return _running;
	}
	
	void Start(){
		if( _running ) return;
		_result=null;
		_running=true;
		_thread=new Thread( this );
		_thread.start();
	}
	
	void SetResult( Object result ){
		_result=result;
	}
	
	Object Result(){
		return _result;
	}
	
	void Wait(){
		while( _running ){
			try{
				_thread.join();
			}catch( InterruptedException ex ){
			}
		}
	}
	
	void Run__UNSAFE__(){
	}

	public void run(){
		Run__UNSAFE__();
		_running=false;
	}
}


class lpLanguage
{
    public static String lpGetLanguage()
    {
        return Locale.getDefault().getLanguage();
    }
}





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
    
    public NativePlayer()
    {
        // getting content layout
        this.content_layout = (RelativeLayout) BBAndroidGame.AndroidGame().GetActivity().findViewById(R.id.mainLayout);
        
        // initialize video components
        this.video_layout = new RelativeLayout(BBAndroidGame.AndroidGame().GetActivity());
        video_layout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        video_view = new VideoView(BBAndroidGame.AndroidGame().GetActivity());
        
        // adding layout params class
        video_view.setLayoutParams(new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // adding view to the layout
        video_layout.addView(video_view);
        content_layout.addView(video_layout);
        
        // screen resolution
        Display display = BBAndroidGame.AndroidGame().GetActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        
        // screen resolution
        this.screen_width = size.x;
        this.screen_height= size.y;
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
	    this.w = w;
	    
	    this.recalcPosition();
	}

	public void SetHeight(int h)
	{   
	    this.h = h;
	    
	    this.recalcPosition();
	}

	public void Show()
	{
	    video_layout.setVisibility(RelativeLayout.VISIBLE);
	}

	public void Hide()
	{
	    video_layout.setVisibility(RelativeLayout.GONE);
	    
	    if (video_view.isPlaying())
	        video_view.stopPlayback();
	}

	public void Play()
	{
	    try
        {
	        // playing video
	        video_view.requestFocus();
	        video_view.start();
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
	    
	    ((RelativeLayout.LayoutParams)video_layout.getLayoutParams()).leftMargin = x;
        ((RelativeLayout.LayoutParams)video_layout.getLayoutParams()).topMargin = y;
        video_layout.getLayoutParams().width = w;
        video_layout.getLayoutParams().height= h;
	}
}




class c_App extends Object{
	public final c_App m_App_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<110>";
		if((bb_app.g__app)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<110>";
			bb_std_lang.error("App has already been created");
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<111>";
		bb_app.g__app=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<112>";
		bb_app.g__delegate=(new c_GameDelegate()).m_GameDelegate_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<113>";
		bb_app.g__game.SetDelegate(bb_app.g__delegate);
		bb_std_lang.popErr();
		return this;
	}
	public int p_OnCreate(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public int p_OnSuspend(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_OnResume(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public int p_OnUpdate(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public int p_OnLoading(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public int p_OnRender(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_OnClose(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<135>";
		bb_app.g_EndApp();
		bb_std_lang.popErr();
		return 0;
	}
	public int p_OnBack(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<139>";
		p_OnClose();
		bb_std_lang.popErr();
		return 0;
	}
}
interface c_iDrawable{
	public void p_Create();
	public void p_Update(int t_delta);
	public void p_Render();
}
abstract class c_lpSceneMngr extends c_App implements c_iDrawable{
	public final c_lpSceneMngr m_lpSceneMngr_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<18>";
		super.m_App_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<18>";
		bb_std_lang.popErr();
		return this;
	}
	static c_lpSceneMngr m__instance;
	c_lpTween m__loadingTween=null;
	c_lpCamera m__currentCamera=null;
	public void p_Create(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	c_lpScene m__currentScene=null;
	public final void p_PostCreate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<257>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<257>";
		c_Enumerator t_=m__currentScene.p_GetChildren().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<257>";
		while(t_.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<257>";
			c_iDrawable t_l=t_.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<258>";
			t_l.p_Create();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<261>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<261>";
		c_Enumerator t_2=m__currentScene.p_GetGui().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<261>";
		while(t_2.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<261>";
			c_iDrawable t_l2=t_2.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<262>";
			t_l2.p_Create();
		}
		bb_std_lang.popErr();
	}
	public final int p_OnCreate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<39>";
		m__instance=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<40>";
		m__loadingTween=c_lpTween.m_CreateLinear(0.0f,1.0f,300.0f);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<41>";
		c_lpCamera t_defCamera=(new c_lpCamera()).m_lpCamera_new(0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()),0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<42>";
		this.m__currentCamera=t_defCamera;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<44>";
		this.p_Create();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<46>";
		if(m__currentScene==null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<47>";
			bb_std_lang.error("Debes crear una escena, implementa 'Method GetScene:lpScene(id:Int)'");
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<50>";
		if(0>=m__currentScene.p_GetCameras().p_Length2()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<52>";
			m__currentScene.p_AddCamera(t_defCamera);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<55>";
		if(m__currentScene.p_AutoCreate()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<56>";
			this.p_PostCreate();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<60>";
		bb_std_lang.popErr();
		return 0;
	}
	int m__timeLastUpdate=0;
	int m__deltaTime=0;
	int m__loadingState=bb_lpscenemngr.g_LONENTERLOADING;
	boolean m__showPopup=false;
	c_lpPopup m__currentPopup=null;
	public final void p_Update(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final int p_OnUpdate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<64>";
		m__deltaTime=bb_app.g_Millisecs()-m__timeLastUpdate;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<65>";
		m__timeLastUpdate=bb_app.g_Millisecs();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<67>";
		if(m__loadingState==bb_lpscenemngr.g_LONLOADING){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<68>";
			m__currentScene.p_SetLoadingState(m__currentScene.p_Loading(m__deltaTime));
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<71>";
		if(m__loadingState==bb_lpscenemngr.g_LONPLAYING){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<74>";
			if(m__showPopup){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<75>";
				m__currentPopup.p_Update(m__deltaTime);
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<77>";
				m__currentScene.p_Update(m__deltaTime);
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<78>";
				this.p_Update(m__deltaTime);
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<81>";
			bb_asyncevent.g_UpdateAsyncEvents();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<85>";
		bb_lpresources.g_lpResetValues();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<87>";
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_OnLoading(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<94>";
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_OnSuspend(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<98>";
		m__currentScene.p_Suspend();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<100>";
		bb_std_lang.popErr();
		return 0;
	}
	c_lpColor m__clsColor=c_lpColor.m_Black();
	public final void p_Render(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final int p_OnRender(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<104>";
		bb_graphics.g_Cls(m__clsColor.m_r,m__clsColor.m_g,m__clsColor.m_b);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<109>";
		if(m__loadingState==bb_lpscenemngr.g_LONENTERLOADING){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<111>";
			if(!m__loadingTween.p_IsRunning()){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<112>";
				m__loadingTween.p_Start();
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<115>";
			m__loadingTween.p_Update2();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<116>";
			bb_graphics.g_SetAlpha(m__loadingTween.p_GetCurrentValue());
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<117>";
			m__currentScene.p_LoadingRender();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<119>";
			if(m__loadingTween.p_GetCurrentValue()==1.0f){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<120>";
				m__loadingState=bb_lpscenemngr.g_LONLOADING;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<123>";
			bb_std_lang.popErr();
			return 0;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<127>";
		if(m__loadingState==bb_lpscenemngr.g_LONLOADING){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<129>";
			if(m__currentScene.p_GetLoadingState()<=0){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<130>";
				m__loadingState=bb_lpscenemngr.g_LONENTERSCENE;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<131>";
				m__loadingTween.p_SetValues(1.0f,0.0f);
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<134>";
			bb_lpresources.g_lpLoadToVideoMemory();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<135>";
			m__currentScene.p_LoadingRender();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<137>";
			bb_std_lang.popErr();
			return 0;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<140>";
		if(m__loadingState==bb_lpscenemngr.g_LONENTERSCENE){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<142>";
			if(!m__loadingTween.p_IsRunning()){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<143>";
				m__loadingTween.p_Start();
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<146>";
			m__loadingTween.p_Update2();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<147>";
			bb_graphics.g_SetAlpha(m__loadingTween.p_GetCurrentValue());
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<148>";
			m__currentScene.p_LoadingRender();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<150>";
			if(m__loadingTween.p_GetCurrentValue()==0.0f){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<151>";
				m__loadingState=bb_lpscenemngr.g_LONPLAYING;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<154>";
			bb_std_lang.popErr();
			return 0;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<161>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<161>";
		c_Enumerator2 t_=m__currentScene.p_GetCameras().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<161>";
		while(t_.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<161>";
			c_lpCamera t_c=t_.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<162>";
			bb_graphics.g_PushMatrix();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<164>";
			m__currentCamera=t_c;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<166>";
			if(t_c.m_Position.m_Width!=t_c.m_ViewPort.m_Width || t_c.m_Position.m_Height!=t_c.m_ViewPort.m_Height){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<171>";
				bb_graphics.g_Scale(t_c.m_Position.m_Width/t_c.m_ViewPort.m_Width,t_c.m_Position.m_Height/t_c.m_ViewPort.m_Height);
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<175>";
				bb_graphics.g_Translate(-(t_c.m_ViewPort.m_X*bb_graphics.g_GetMatrix()[0]-t_c.m_Position.m_X)/bb_graphics.g_GetMatrix()[0],-(t_c.m_ViewPort.m_Y*bb_graphics.g_GetMatrix()[3]-t_c.m_Position.m_Y)/bb_graphics.g_GetMatrix()[3]);
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<179>";
				bb_graphics.g_Translate(-(t_c.m_ViewPort.m_X-t_c.m_Position.m_X)/bb_graphics.g_GetMatrix()[0],-(t_c.m_ViewPort.m_Y-t_c.m_Position.m_Y)/bb_graphics.g_GetMatrix()[3]);
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<182>";
			bb_graphics.g_SetScissor(t_c.m_Position.m_X,t_c.m_Position.m_Y,t_c.m_Position.m_Width,t_c.m_Position.m_Height);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<184>";
			m__currentScene.p_Render();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<185>";
			this.p_Render();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<187>";
			bb_graphics.g_PopMatrix();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<190>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<190>";
		c_Enumerator t_2=m__currentScene.p_GetGui().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<190>";
		while(t_2.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<190>";
			c_iDrawable t_gui=t_2.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<191>";
			bb_graphics.g_PushMatrix();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<192>";
			bb_graphics.g_SetScissor(0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()));
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<193>";
			t_gui.p_Render();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<194>";
			bb_graphics.g_PopMatrix();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<198>";
		if(m__showPopup){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<199>";
			bb_graphics.g_PushMatrix();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<200>";
			bb_graphics.g_SetAlpha(m__currentPopup.p_GetBakgroundAlpha());
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<201>";
			bb_graphics.g_SetColor(0.0f,0.0f,0.0f);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<202>";
			bb_graphics.g_DrawRect(0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()*3),(float)(bb_graphics.g_DeviceHeight())/bb_graphics.g_GetMatrix()[3]);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<203>";
			bb_graphics.g_SetColor(255.0f,255.0f,255.0f);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<204>";
			bb_graphics.g_SetAlpha(1.0f);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<205>";
			m__currentPopup.p_Render();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<206>";
			bb_graphics.g_PopMatrix();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<210>";
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_OnBack(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<274>";
		bb_std_lang.popErr();
		return 0;
	}
	int m__lastSceneId=0;
	public abstract c_lpScene p_GetScene(int t_id);
	public final void p_SetScene(int t_id){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<221>";
		if(m__lastSceneId!=t_id){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<223>";
			bb_lpresources.g_lpFreeMemory();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<226>";
		m__lastSceneId=t_id;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<228>";
		m__loadingState=bb_lpscenemngr.g_LONENTERLOADING;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<229>";
		m__loadingTween.p_SetValues(0.0f,1.0f);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<230>";
		m__loadingTween.p_Start();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<232>";
		m__currentScene=p_GetScene(t_id);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<234>";
		c_lpCamera t_defCamera=(new c_lpCamera()).m_lpCamera_new(0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()),0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<235>";
		this.m__currentCamera=t_defCamera;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<237>";
		m__currentScene.p_Create();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<239>";
		if(0>=m__currentScene.p_GetCameras().p_Length2()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscenemngr.monkey<241>";
			m__currentScene.p_AddCamera(t_defCamera);
		}
		bb_std_lang.popErr();
	}
}
class c_Manager extends c_lpSceneMngr{
	public final c_Manager m_Manager_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<33>";
		super.m_lpSceneMngr_new();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<33>";
		bb_std_lang.popErr();
		return this;
	}
	public final void p_Create(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<36>";
		this.p_SetScene(0);
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<37>";
		bb_app.g_SetUpdateRate(60);
		bb_std_lang.popErr();
	}
	public final c_lpScene p_GetScene(int t_id){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<41>";
		c_lpScene t_=((new c_SampleScene()).m_SampleScene_new());
		bb_std_lang.popErr();
		return t_;
	}
}
class c_GameDelegate extends BBGameDelegate{
	public final c_GameDelegate m_GameDelegate_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<30>";
		bb_std_lang.popErr();
		return this;
	}
	gxtkGraphics m__graphics=null;
	gxtkAudio m__audio=null;
	c_InputDevice m__input=null;
	public final void StartGame(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<39>";
		m__graphics=(new gxtkGraphics());
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<40>";
		bb_graphics.g_SetGraphicsDevice(m__graphics);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<41>";
		bb_graphics.g_SetFont(null,32);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<43>";
		m__audio=(new gxtkAudio());
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<44>";
		bb_audio.g_SetAudioDevice(m__audio);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<46>";
		m__input=(new c_InputDevice()).m_InputDevice_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<47>";
		bb_input.g_SetInputDevice(m__input);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<49>";
		bb_app.g__app.p_OnCreate();
		bb_std_lang.popErr();
	}
	public final void SuspendGame(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<53>";
		bb_app.g__app.p_OnSuspend();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<54>";
		m__audio.Suspend();
		bb_std_lang.popErr();
	}
	public final void ResumeGame(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<58>";
		m__audio.Resume();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<59>";
		bb_app.g__app.p_OnResume();
		bb_std_lang.popErr();
	}
	public final void UpdateGame(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<63>";
		m__input.p_BeginUpdate();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<64>";
		bb_app.g__app.p_OnUpdate();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<65>";
		m__input.p_EndUpdate();
		bb_std_lang.popErr();
	}
	public final void RenderGame(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<69>";
		int t_mode=m__graphics.BeginRender();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<70>";
		if((t_mode)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<70>";
			bb_graphics.g_BeginRender();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<71>";
		if(t_mode==2){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<71>";
			bb_app.g__app.p_OnLoading();
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<71>";
			bb_app.g__app.p_OnRender();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<72>";
		if((t_mode)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<72>";
			bb_graphics.g_EndRender();
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<73>";
		m__graphics.EndRender();
		bb_std_lang.popErr();
	}
	public final void KeyEvent(int t_event,int t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<77>";
		m__input.p_KeyEvent(t_event,t_data);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<78>";
		if(t_event!=1){
			bb_std_lang.popErr();
			return;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<79>";
		int t_1=t_data;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<80>";
		if(t_1==432){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<81>";
			bb_app.g__app.p_OnClose();
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<82>";
			if(t_1==416){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<83>";
				bb_app.g__app.p_OnBack();
			}
		}
		bb_std_lang.popErr();
	}
	public final void MouseEvent(int t_event,int t_data,float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<88>";
		m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
		bb_std_lang.popErr();
	}
	public final void TouchEvent(int t_event,int t_data,float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<92>";
		m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
		bb_std_lang.popErr();
	}
	public final void MotionEvent(int t_event,int t_data,float t_x,float t_y,float t_z){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<96>";
		m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
		bb_std_lang.popErr();
	}
	public final void DiscardGraphics(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<100>";
		m__graphics.DiscardGraphics();
		bb_std_lang.popErr();
	}
}
class c_Image extends Object{
	static int m_DefaultFlags;
	public final c_Image m_Image_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<65>";
		bb_std_lang.popErr();
		return this;
	}
	gxtkSurface m_surface=null;
	int m_width=0;
	int m_height=0;
	c_Frame[] m_frames=new c_Frame[0];
	int m_flags=0;
	float m_tx=.0f;
	float m_ty=.0f;
	public final int p_SetHandle(float t_tx,float t_ty){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<109>";
		this.m_tx=t_tx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<110>";
		this.m_ty=t_ty;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<111>";
		this.m_flags=this.m_flags&-2;
		bb_std_lang.popErr();
		return 0;
	}
	public final int p_ApplyFlags(int t_iflags){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<184>";
		m_flags=t_iflags;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<186>";
		if((m_flags&2)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
			c_Frame[] t_=m_frames;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
			int t_2=0;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
			while(t_2<t_.length){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
				c_Frame t_f=t_[t_2];
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<187>";
				t_2=t_2+1;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<188>";
				t_f.m_x+=1;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<190>";
			m_width-=2;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<193>";
		if((m_flags&4)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
			c_Frame[] t_3=m_frames;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
			int t_4=0;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
			while(t_4<t_3.length){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
				c_Frame t_f2=t_3[t_4];
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<194>";
				t_4=t_4+1;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<195>";
				t_f2.m_y+=1;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<197>";
			m_height-=2;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<200>";
		if((m_flags&1)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<201>";
			p_SetHandle((float)(m_width)/2.0f,(float)(m_height)/2.0f);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<204>";
		if(m_frames.length==1 && m_frames[0].m_x==0 && m_frames[0].m_y==0 && m_width==m_surface.Width() && m_height==m_surface.Height()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<205>";
			m_flags|=65536;
		}
		bb_std_lang.popErr();
		return 0;
	}
	public final c_Image p_Init(gxtkSurface t_surf,int t_nframes,int t_iflags){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<142>";
		m_surface=t_surf;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<144>";
		m_width=m_surface.Width()/t_nframes;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<145>";
		m_height=m_surface.Height();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<147>";
		m_frames=new c_Frame[t_nframes];
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<148>";
		for(int t_i=0;t_i<t_nframes;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<149>";
			m_frames[t_i]=(new c_Frame()).m_Frame_new(t_i*m_width,0);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<152>";
		p_ApplyFlags(t_iflags);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<153>";
		bb_std_lang.popErr();
		return this;
	}
	c_Image m_source=null;
	public final c_Image p_Grab(int t_x,int t_y,int t_iwidth,int t_iheight,int t_nframes,int t_iflags,c_Image t_source){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<157>";
		this.m_source=t_source;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<158>";
		m_surface=t_source.m_surface;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<160>";
		m_width=t_iwidth;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<161>";
		m_height=t_iheight;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<163>";
		m_frames=new c_Frame[t_nframes];
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<165>";
		int t_ix=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<165>";
		int t_iy=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<167>";
		for(int t_i=0;t_i<t_nframes;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<168>";
			if(t_ix+m_width>t_source.m_width){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<169>";
				t_ix=0;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<170>";
				t_iy+=m_height;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<172>";
			if(t_ix+m_width>t_source.m_width || t_iy+m_height>t_source.m_height){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<173>";
				bb_std_lang.error("Image frame outside surface");
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<175>";
			m_frames[t_i]=(new c_Frame()).m_Frame_new(t_ix+t_source.m_frames[0].m_x,t_iy+t_source.m_frames[0].m_y);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<176>";
			t_ix+=m_width;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<179>";
		p_ApplyFlags(t_iflags);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<180>";
		bb_std_lang.popErr();
		return this;
	}
	public final c_Image p_GrabImage(int t_x,int t_y,int t_width,int t_height,int t_frames,int t_flags){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<104>";
		if(this.m_frames.length!=1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<104>";
			bb_std_lang.popErr();
			return null;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<105>";
		c_Image t_=((new c_Image()).m_Image_new()).p_Grab(t_x,t_y,t_width,t_height,t_frames,t_flags,this);
		bb_std_lang.popErr();
		return t_;
	}
	public final int p_Discard(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<115>";
		if(((m_surface)!=null) && !((m_source)!=null)){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<116>";
			m_surface.Discard();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<117>";
			m_surface=null;
		}
		bb_std_lang.popErr();
		return 0;
	}
}
class c_GraphicsContext extends Object{
	public final c_GraphicsContext m_GraphicsContext_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<24>";
		bb_std_lang.popErr();
		return this;
	}
	c_Image m_defaultFont=null;
	c_Image m_font=null;
	int m_firstChar=0;
	int m_matrixSp=0;
	float m_ix=1.0f;
	float m_iy=.0f;
	float m_jx=.0f;
	float m_jy=1.0f;
	float m_tx=.0f;
	float m_ty=.0f;
	int m_tformed=0;
	int m_matDirty=0;
	float m_color_r=.0f;
	float m_color_g=.0f;
	float m_color_b=.0f;
	float m_alpha=.0f;
	int m_blend=0;
	float m_scissor_x=.0f;
	float m_scissor_y=.0f;
	float m_scissor_width=.0f;
	float m_scissor_height=.0f;
	public final int p_Validate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<35>";
		if((m_matDirty)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<36>";
			bb_graphics.g_renderDevice.SetMatrix(bb_graphics.g_context.m_ix,bb_graphics.g_context.m_iy,bb_graphics.g_context.m_jx,bb_graphics.g_context.m_jy,bb_graphics.g_context.m_tx,bb_graphics.g_context.m_ty);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<37>";
			m_matDirty=0;
		}
		bb_std_lang.popErr();
		return 0;
	}
	float[] m_matrixStack=new float[192];
}
class c_Frame extends Object{
	int m_x=0;
	int m_y=0;
	public final c_Frame m_Frame_new(int t_x,int t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<18>";
		this.m_x=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<19>";
		this.m_y=t_y;
		bb_std_lang.popErr();
		return this;
	}
	public final c_Frame m_Frame_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<13>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_InputDevice extends Object{
	c_JoyState[] m__joyStates=new c_JoyState[4];
	public final c_InputDevice m_InputDevice_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<22>";
		for(int t_i=0;t_i<4;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<23>";
			m__joyStates[t_i]=(new c_JoyState()).m_JoyState_new();
		}
		bb_std_lang.popErr();
		return this;
	}
	boolean[] m__keyDown=new boolean[512];
	int m__keyHitPut=0;
	int[] m__keyHitQueue=new int[33];
	int[] m__keyHit=new int[512];
	public final void p_PutKeyHit(int t_key){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<233>";
		if(m__keyHitPut==m__keyHitQueue.length){
			bb_std_lang.popErr();
			return;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<234>";
		m__keyHit[t_key]+=1;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<235>";
		m__keyHitQueue[m__keyHitPut]=t_key;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<236>";
		m__keyHitPut+=1;
		bb_std_lang.popErr();
	}
	public final void p_BeginUpdate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<185>";
		for(int t_i=0;t_i<4;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<186>";
			c_JoyState t_state=m__joyStates[t_i];
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<187>";
			if(!BBGame.Game().PollJoystick(t_i,t_state.m_joyx,t_state.m_joyy,t_state.m_joyz,t_state.m_buttons)){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<187>";
				break;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<188>";
			for(int t_j=0;t_j<32;t_j=t_j+1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<189>";
				int t_key=256+t_i*32+t_j;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<190>";
				if(t_state.m_buttons[t_j]){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<191>";
					if(!m__keyDown[t_key]){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<192>";
						m__keyDown[t_key]=true;
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<193>";
						p_PutKeyHit(t_key);
					}
				}else{
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<196>";
					m__keyDown[t_key]=false;
				}
			}
		}
		bb_std_lang.popErr();
	}
	int m__charGet=0;
	int m__charPut=0;
	public final void p_EndUpdate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<203>";
		for(int t_i=0;t_i<m__keyHitPut;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<204>";
			m__keyHit[m__keyHitQueue[t_i]]=0;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<206>";
		m__keyHitPut=0;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<207>";
		m__charGet=0;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<208>";
		m__charPut=0;
		bb_std_lang.popErr();
	}
	int[] m__charQueue=new int[32];
	public final void p_KeyEvent(int t_event,int t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<107>";
		int t_1=t_event;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<108>";
		if(t_1==1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<109>";
			if(!m__keyDown[t_data]){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<110>";
				m__keyDown[t_data]=true;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<111>";
				p_PutKeyHit(t_data);
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<112>";
				if(t_data==1){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<113>";
					m__keyDown[384]=true;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<114>";
					p_PutKeyHit(384);
				}else{
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<115>";
					if(t_data==384){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<116>";
						m__keyDown[1]=true;
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<117>";
						p_PutKeyHit(1);
					}
				}
			}
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<120>";
			if(t_1==2){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<121>";
				if(m__keyDown[t_data]){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<122>";
					m__keyDown[t_data]=false;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<123>";
					if(t_data==1){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<124>";
						m__keyDown[384]=false;
					}else{
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<125>";
						if(t_data==384){
							bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<126>";
							m__keyDown[1]=false;
						}
					}
				}
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<129>";
				if(t_1==3){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<130>";
					if(m__charPut<m__charQueue.length){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<131>";
						m__charQueue[m__charPut]=t_data;
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<132>";
						m__charPut+=1;
					}
				}
			}
		}
		bb_std_lang.popErr();
	}
	float m__mouseX=.0f;
	float m__mouseY=.0f;
	float[] m__touchX=new float[32];
	float[] m__touchY=new float[32];
	public final void p_MouseEvent(int t_event,int t_data,float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<138>";
		int t_2=t_event;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<139>";
		if(t_2==4){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<140>";
			p_KeyEvent(1,1+t_data);
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<141>";
			if(t_2==5){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<142>";
				p_KeyEvent(2,1+t_data);
				bb_std_lang.popErr();
				return;
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<144>";
				if(t_2==6){
				}else{
					bb_std_lang.popErr();
					return;
				}
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<148>";
		m__mouseX=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<149>";
		m__mouseY=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<150>";
		m__touchX[0]=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<151>";
		m__touchY[0]=t_y;
		bb_std_lang.popErr();
	}
	public final void p_TouchEvent(int t_event,int t_data,float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<155>";
		int t_3=t_event;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<156>";
		if(t_3==7){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<157>";
			p_KeyEvent(1,384+t_data);
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<158>";
			if(t_3==8){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<159>";
				p_KeyEvent(2,384+t_data);
				bb_std_lang.popErr();
				return;
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<161>";
				if(t_3==9){
				}else{
					bb_std_lang.popErr();
					return;
				}
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<165>";
		m__touchX[t_data]=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<166>";
		m__touchY[t_data]=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<167>";
		if(t_data==0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<168>";
			m__mouseX=t_x;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<169>";
			m__mouseY=t_y;
		}
		bb_std_lang.popErr();
	}
	float m__accelX=.0f;
	float m__accelY=.0f;
	float m__accelZ=.0f;
	public final void p_MotionEvent(int t_event,int t_data,float t_x,float t_y,float t_z){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<174>";
		int t_4=t_event;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<175>";
		if(t_4==10){
		}else{
			bb_std_lang.popErr();
			return;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<179>";
		m__accelX=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<180>";
		m__accelY=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<181>";
		m__accelZ=t_z;
		bb_std_lang.popErr();
	}
}
class c_JoyState extends Object{
	public final c_JoyState m_JoyState_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/inputdevice.monkey<10>";
		bb_std_lang.popErr();
		return this;
	}
	float[] m_joyx=new float[2];
	float[] m_joyy=new float[2];
	float[] m_joyz=new float[2];
	boolean[] m_buttons=new boolean[32];
}
class c_BBGameEvent extends Object{
}
class c_lpTween extends Object{
	int m__function=0;
	float m__initialValue=0.0f;
	float m__currentValue=0.0f;
	float m__endValue=0.0f;
	float m__time=0.0f;
	int m__easing=0;
	public final c_lpTween m_lpTween_new(int t_funct,float t_initValue,float t_endValue,float t_time,int t_easing){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<46>";
		m__function=t_funct;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<47>";
		m__initialValue=t_initValue;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<48>";
		m__currentValue=t_initValue;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<49>";
		m__endValue=t_endValue;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<50>";
		m__time=t_time;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<51>";
		m__easing=t_easing;
		bb_std_lang.popErr();
		return this;
	}
	public final c_lpTween m_lpTween_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<3>";
		bb_std_lang.popErr();
		return this;
	}
	public static c_lpTween m_CreateLinear(float t_initValue,float t_endValue,float t_time){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<30>";
		c_lpTween t_=(new c_lpTween()).m_lpTween_new(0,t_initValue,t_endValue,t_time,0);
		bb_std_lang.popErr();
		return t_;
	}
	boolean m__running=false;
	public final boolean p_IsRunning(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<170>";
		bb_std_lang.popErr();
		return m__running;
	}
	float m__beginTime=0.0f;
	public final void p_Start(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<59>";
		this.m__beginTime=(float)(bb_app.g_Millisecs());
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<60>";
		this.m__running=true;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<61>";
		this.m__currentValue=m__initialValue;
		bb_std_lang.popErr();
	}
	public final void p_LinearUpdate(float t_t,float t_b,float t_c,float t_d){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<109>";
		m__currentValue=t_c*t_t/t_d+t_b;
		bb_std_lang.popErr();
	}
	public final void p_QuadUpdate(int t_easing,float t_t,float t_b,float t_c,float t_d){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<113>";
		int t_2=t_easing;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<114>";
		if(t_2==0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<115>";
			t_t/=t_d;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<116>";
			m__currentValue=t_c*t_t*t_t+t_b;
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<117>";
			if(t_2==1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<118>";
				t_t/=t_d;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<119>";
				m__currentValue=-t_c*t_t*(t_t-2.0f)+t_b;
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<120>";
				if(t_2==2){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<121>";
					t_t/=t_d/2.0f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<122>";
					if(t_t<1.0f){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<122>";
						m__currentValue=t_c/2.0f*t_t*t_t+t_b;
					}
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<123>";
					t_t=t_t-1.0f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<124>";
					m__currentValue=-t_c/2.0f*(t_t*(t_t-2.0f)-1.0f)+t_b;
				}
			}
		}
		bb_std_lang.popErr();
	}
	public final void p_CubicUpdate(int t_easing,float t_t,float t_b,float t_c,float t_d){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<130>";
		int t_3=t_easing;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<131>";
		if(t_3==0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<132>";
			t_t/=t_d;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<133>";
			m__currentValue=t_c*t_t*t_t*t_t+t_b;
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<134>";
			if(t_3==1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<135>";
				t_t/=t_d;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<136>";
				t_t=t_t-1.0f;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<137>";
				m__currentValue=t_c*(t_t*t_t*t_t+1.0f)+t_b;
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<138>";
				if(t_3==2){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<139>";
					t_t/=t_d/2.0f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<140>";
					if(t_t<1.0f){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<140>";
						m__currentValue=t_c/2.0f*t_t*t_t*t_t+t_b;
					}
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<141>";
					t_t=t_t-2.0f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<142>";
					m__currentValue=t_c/2.0f*(t_t*t_t*t_t+2.0f)+t_b;
				}
			}
		}
		bb_std_lang.popErr();
	}
	public final void p_BackUpdate(int t_easing,float t_t,float t_b,float t_c,float t_d){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<147>";
		int t_4=t_easing;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<148>";
		if(t_4==0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<149>";
			float t_s=1.70158f;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<150>";
			t_t/=t_d;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<151>";
			m__currentValue=t_c*t_t*t_t*((t_s+1.0f)*t_t-t_s)+t_b;
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<152>";
			if(t_4==1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<153>";
				float t_s2=1.70158f;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<154>";
				t_t=t_t/t_d-1.0f;
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<155>";
				m__currentValue=t_c*(t_t*t_t*((t_s2+1.0f)*t_t+t_s2)+1.0f)+t_b;
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<156>";
				if(t_4==2){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<157>";
					float t_s3=1.70158f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<158>";
					t_s3*=1.525f;
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<159>";
					if(t_t<1.0f){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<160>";
						t_t/=t_d/2.0f;
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<161>";
						m__currentValue=t_c/2.0f*(t_t*t_t*((t_s3+1.0f)*t_t-t_s3))+t_b;
					}else{
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<163>";
						t_t=t_t-2.0f;
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<164>";
						m__currentValue=t_c/2.0f*(t_t*t_t*((t_s3+1.0f)*t_t+t_s3)+2.0f)+t_b;
					}
				}
			}
		}
		bb_std_lang.popErr();
	}
	public final void p_Update2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<84>";
		float t_currentTime=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<86>";
		if(this.m__running){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<88>";
			t_currentTime=(float)(bb_app.g_Millisecs())-this.m__beginTime;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<90>";
			int t_1=m__function;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<91>";
			if(t_1==0){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<92>";
				this.p_LinearUpdate(t_currentTime,this.m__initialValue,m__endValue-m__initialValue,this.m__time);
			}else{
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<93>";
				if(t_1==1){
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<94>";
					this.p_QuadUpdate(m__easing,t_currentTime,this.m__initialValue,m__endValue-m__initialValue,this.m__time);
				}else{
					bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<95>";
					if(t_1==2){
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<96>";
						this.p_CubicUpdate(m__easing,t_currentTime,this.m__initialValue,m__endValue-m__initialValue,this.m__time);
					}else{
						bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<97>";
						if(t_1==3){
							bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<98>";
							this.p_BackUpdate(m__easing,t_currentTime,this.m__initialValue,m__endValue-m__initialValue,this.m__time);
						}
					}
				}
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<102>";
		if(t_currentTime>=m__time){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<103>";
			m__currentValue=m__endValue;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<104>";
			this.m__running=false;
		}
		bb_std_lang.popErr();
	}
	public final float p_GetCurrentValue(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<174>";
		bb_std_lang.popErr();
		return m__currentValue;
	}
	public final void p_SetInitialValue(float t_v){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<65>";
		this.m__initialValue=t_v;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<66>";
		this.m__currentValue=t_v;
		bb_std_lang.popErr();
	}
	public final void p_SetEndValue(float t_v){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<70>";
		this.m__endValue=t_v;
		bb_std_lang.popErr();
	}
	public final void p_SetValues(float t_v1,float t_v2){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<74>";
		this.p_SetInitialValue(t_v1);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lptween.monkey<75>";
		this.p_SetEndValue(t_v2);
		bb_std_lang.popErr();
	}
}
class c_lpCamera extends Object implements c_iDrawable{
	c_lpRectangle m_Position=null;
	c_lpRectangle m_ViewPort=null;
	c_lpRectangle m__firstViewPort=null;
	public final void p__init(float t_px,float t_py,float t_pw,float t_ph,float t_vx,float t_vy,float t_vw,float t_vh){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcamera.monkey<15>";
		this.m_Position=(new c_lpRectangle()).m_lpRectangle_new2(t_px,t_py,t_pw,t_ph);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcamera.monkey<16>";
		this.m_ViewPort=(new c_lpRectangle()).m_lpRectangle_new2(t_vx,t_vy,t_vw,t_vh);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcamera.monkey<17>";
		this.m__firstViewPort=(new c_lpRectangle()).m_lpRectangle_new2(t_vx,t_vy,t_vw,t_vh);
		bb_std_lang.popErr();
	}
	public final c_lpCamera m_lpCamera_new(float t_px,float t_py,float t_pw,float t_ph,float t_vx,float t_vy,float t_vw,float t_vh){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcamera.monkey<26>";
		this.p__init(t_px,t_py,t_pw,t_ph,t_vx,t_vy,t_vw,t_vh);
		bb_std_lang.popErr();
		return this;
	}
	public final void p_Create(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final void p_Render(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final void p_Update(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
}
class c_lpRectangle extends Object{
	float m_X=.0f;
	float m_Y=.0f;
	float m_Width=.0f;
	float m_Height=.0f;
	public final c_lpRectangle m_lpRectangle_new(boolean t_avoidpoly){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<30>";
		this.m_X=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<31>";
		this.m_Y=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<32>";
		this.m_Width=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<33>";
		this.m_Height=0.0f;
		bb_std_lang.popErr();
		return this;
	}
	c_Vector2 m_pos=(new c_Vector2()).m_Vector2_new2();
	float m_Radius=.0f;
	c_lpPoly m__poly=null;
	public final c_lpRectangle m_lpRectangle_new2(float t_x,float t_y,float t_width,float t_height){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<38>";
		this.m_X=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<39>";
		this.m_Y=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<40>";
		this.m_Width=t_width;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<41>";
		this.m_Height=t_height;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<43>";
		this.m_pos=c_Vector2.m_Zero();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<44>";
		this.m_Radius=this.m_Width/2.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<46>";
		this.m__poly=(new c_lpPoly()).m_lpPoly_new3(new float[]{0.0f,0.0f,0.0f,0.0f,0.0f,0.0f,0.0f,0.0f});
		bb_std_lang.popErr();
		return this;
	}
	public final c_lpRectangle m_lpRectangle_new3(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<21>";
		this.m_X=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<22>";
		this.m_Y=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<23>";
		this.m_Width=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<24>";
		this.m_Height=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lprectangle.monkey<26>";
		this.m__poly=(new c_lpPoly()).m_lpPoly_new3(new float[]{0.0f,0.0f,0.0f,0.0f,0.0f,0.0f,0.0f,0.0f});
		bb_std_lang.popErr();
		return this;
	}
}
class c_lpPoly extends Object{
	c_Stack m__vertices=null;
	public final c_lpPoly m_lpPoly_new(int[] t_vertices){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<42>";
		float[] t_v=new float[t_vertices.length];
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<44>";
		for(int t_i=0;t_i<t_vertices.length;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<45>";
			t_v[t_i]=(float)(t_vertices[t_i]);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<48>";
		this.p__init2(t_v);
		bb_std_lang.popErr();
		return this;
	}
	public final c_lpPoly m_lpPoly_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<13>";
		bb_std_lang.popErr();
		return this;
	}
	c_lpRectangle m_aabb=null;
	public final void p__init2(float[] t_vertices){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<20>";
		if(t_vertices.length % 2!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<21>";
			bb_std_lang.error("lpoly.new: vertices:int[] no puede ser impar");
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<24>";
		m__vertices=(new c_Stack()).m_Stack_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<26>";
		for(int t_i=0;t_i<t_vertices.length;t_i=t_i+2){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<27>";
			m__vertices.p_Push((new c_Vector2()).m_Vector2_new(t_vertices[t_i],t_vertices[t_i+1]));
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<30>";
		m_aabb=(new c_lpRectangle()).m_lpRectangle_new(false);
		bb_std_lang.popErr();
	}
	public final c_lpPoly m_lpPoly_new3(float[] t_vertices){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppoly.monkey<38>";
		this.p__init2(t_vertices);
		bb_std_lang.popErr();
		return this;
	}
}
class c_Vector2 extends Object{
	float m_X=.0f;
	float m_Y=.0f;
	public final c_Vector2 m_Vector2_new(float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/vector2.monkey<11>";
		this.m_X=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/vector2.monkey<12>";
		this.m_Y=t_y;
		bb_std_lang.popErr();
		return this;
	}
	public final c_Vector2 m_Vector2_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/vector2.monkey<4>";
		bb_std_lang.popErr();
		return this;
	}
	public static c_Vector2 m_Zero(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/vector2.monkey<75>";
		c_Vector2 t_=(new c_Vector2()).m_Vector2_new(0.0f,0.0f);
		bb_std_lang.popErr();
		return t_;
	}
}
class c_Stack extends Object{
	public final c_Stack m_Stack_new(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return this;
	}
	c_Vector2[] m_data=new c_Vector2[0];
	int m_length=0;
	public final c_Stack m_Stack_new2(c_Vector2[] t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<13>";
		this.m_data=((c_Vector2[])bb_std_lang.sliceArray(t_data,0));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<14>";
		this.m_length=t_data.length;
		bb_std_lang.popErr();
		return this;
	}
	public final void p_Push(c_Vector2 t_value){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<67>";
		if(m_length==m_data.length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<68>";
			m_data=(c_Vector2[])bb_std_lang.resizeArray(m_data,m_length*2+10);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<70>";
		m_data[m_length]=t_value;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<71>";
		m_length+=1;
		bb_std_lang.popErr();
	}
	public final void p_Push2(c_Vector2[] t_values,int t_offset,int t_count){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<79>";
		for(int t_i=0;t_i<t_count;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<80>";
			p_Push(t_values[t_offset+t_i]);
		}
		bb_std_lang.popErr();
	}
	public final void p_Push3(c_Vector2[] t_values,int t_offset){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<75>";
		p_Push2(t_values,t_offset,t_values.length-t_offset);
		bb_std_lang.popErr();
	}
}
class c_lpScene extends Object implements c_iDrawable{
	c_Stack2 m__cameras=(new c_Stack2()).m_Stack_new();
	public final c_Stack2 p_GetCameras(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<79>";
		bb_std_lang.popErr();
		return m__cameras;
	}
	public final void p_AddCamera(c_lpCamera t_camera){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<75>";
		m__cameras.p_Push4(t_camera);
		bb_std_lang.popErr();
	}
	boolean m__autocreate=false;
	public final boolean p_AutoCreate(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<29>";
		bb_std_lang.popErr();
		return m__autocreate;
	}
	c_List m__children=(new c_List()).m_List_new();
	public final c_List p_GetChildren(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<83>";
		bb_std_lang.popErr();
		return m__children;
	}
	c_List m__gui=(new c_List()).m_List_new();
	public final c_List p_GetGui(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<87>";
		bb_std_lang.popErr();
		return m__gui;
	}
	public int p_Loading(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<60>";
		bb_std_lang.popErr();
		return 0;
	}
	int m__loadingState=1;
	public final void p_SetLoadingState(int t_state){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<71>";
		this.m__loadingState=t_state;
		bb_std_lang.popErr();
	}
	boolean m__pause=false;
	boolean m__pausegui=false;
	public void p_Update(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<37>";
		if(!m__pause){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<38>";
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<38>";
			c_Enumerator t_=this.m__children.p_ObjectEnumerator();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<38>";
			while(t_.p_HasNext()){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<38>";
				c_iDrawable t_layer=t_.p_NextObject();
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<39>";
				t_layer.p_Update(t_delta);
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<43>";
		if(!m__pausegui){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<44>";
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<44>";
			c_Enumerator t_2=this.m__gui.p_ObjectEnumerator();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<44>";
			while(t_2.p_HasNext()){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<44>";
				c_iDrawable t_gui=t_2.p_NextObject();
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<45>";
				t_gui.p_Update(t_delta);
			}
		}
		bb_std_lang.popErr();
	}
	public final void p_Suspend(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final void p_LoadingRender(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final int p_GetLoadingState(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<67>";
		bb_std_lang.popErr();
		return m__loadingState;
	}
	public final void p_Render(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<50>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<50>";
		c_Enumerator t_=this.m__children.p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<50>";
		while(t_.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<50>";
			c_iDrawable t_layer=t_.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<51>";
			t_layer.p_Render();
		}
		bb_std_lang.popErr();
	}
	public final void p_Create(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public final c_lpScene m_lpScene_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpscene.monkey<6>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_Stack2 extends Object{
	public final c_Stack2 m_Stack_new(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return this;
	}
	c_lpCamera[] m_data=new c_lpCamera[0];
	int m_length=0;
	public final c_Stack2 m_Stack_new2(c_lpCamera[] t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<13>";
		this.m_data=((c_lpCamera[])bb_std_lang.sliceArray(t_data,0));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<14>";
		this.m_length=t_data.length;
		bb_std_lang.popErr();
		return this;
	}
	static c_lpCamera m_NIL;
	public final void p_Length(int t_newlength){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<41>";
		if(t_newlength<m_length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<42>";
			for(int t_i=t_newlength;t_i<m_length;t_i=t_i+1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<43>";
				m_data[t_i]=m_NIL;
			}
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<45>";
			if(t_newlength>m_data.length){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<46>";
				m_data=(c_lpCamera[])bb_std_lang.resizeArray(m_data,bb_math.g_Max(m_length*2+10,t_newlength));
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<48>";
		m_length=t_newlength;
		bb_std_lang.popErr();
	}
	public final int p_Length2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<52>";
		bb_std_lang.popErr();
		return m_length;
	}
	public final void p_Push4(c_lpCamera t_value){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<67>";
		if(m_length==m_data.length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<68>";
			m_data=(c_lpCamera[])bb_std_lang.resizeArray(m_data,m_length*2+10);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<70>";
		m_data[m_length]=t_value;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<71>";
		m_length+=1;
		bb_std_lang.popErr();
	}
	public final void p_Push5(c_lpCamera[] t_values,int t_offset,int t_count){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<79>";
		for(int t_i=0;t_i<t_count;t_i=t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<80>";
			p_Push4(t_values[t_offset+t_i]);
		}
		bb_std_lang.popErr();
	}
	public final void p_Push6(c_lpCamera[] t_values,int t_offset){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<75>";
		p_Push5(t_values,t_offset,t_values.length-t_offset);
		bb_std_lang.popErr();
	}
	public final c_Enumerator2 p_ObjectEnumerator(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<184>";
		c_Enumerator2 t_=(new c_Enumerator2()).m_Enumerator_new(this);
		bb_std_lang.popErr();
		return t_;
	}
}
class c_List extends Object{
	public final c_List m_List_new(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return this;
	}
	c_Node m__head=((new c_HeadNode()).m_HeadNode_new());
	public final c_Node p_AddLast(c_iDrawable t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<106>";
		c_Node t_=(new c_Node()).m_Node_new(m__head,m__head.m__pred,t_data);
		bb_std_lang.popErr();
		return t_;
	}
	public final c_List m_List_new2(c_iDrawable[] t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
		c_iDrawable[] t_=t_data;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
		int t_2=0;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
		while(t_2<t_.length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
			c_iDrawable t_t=t_[t_2];
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<13>";
			t_2=t_2+1;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<14>";
			p_AddLast(t_t);
		}
		bb_std_lang.popErr();
		return this;
	}
	public final c_Enumerator p_ObjectEnumerator(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<184>";
		c_Enumerator t_=(new c_Enumerator()).m_Enumerator_new(this);
		bb_std_lang.popErr();
		return t_;
	}
}
class c_Node extends Object{
	c_Node m__succ=null;
	c_Node m__pred=null;
	c_iDrawable m__data=null;
	public final c_Node m_Node_new(c_Node t_succ,c_Node t_pred,c_iDrawable t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<259>";
		m__succ=t_succ;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<260>";
		m__pred=t_pred;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<261>";
		m__succ.m__pred=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<262>";
		m__pred.m__succ=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<263>";
		m__data=t_data;
		bb_std_lang.popErr();
		return this;
	}
	public final c_Node m_Node_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<256>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_HeadNode extends c_Node{
	public final c_HeadNode m_HeadNode_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<308>";
		super.m_Node_new2();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<309>";
		m__succ=(this);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<310>";
		m__pred=(this);
		bb_std_lang.popErr();
		return this;
	}
}
class c_Enumerator extends Object{
	c_List m__list=null;
	c_Node m__curr=null;
	public final c_Enumerator m_Enumerator_new(c_List t_list){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<324>";
		m__list=t_list;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<325>";
		m__curr=t_list.m__head.m__succ;
		bb_std_lang.popErr();
		return this;
	}
	public final c_Enumerator m_Enumerator_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<321>";
		bb_std_lang.popErr();
		return this;
	}
	public final boolean p_HasNext(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<329>";
		while(m__curr.m__succ.m__pred!=m__curr){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<330>";
			m__curr=m__curr.m__succ;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<332>";
		boolean t_=m__curr!=m__list.m__head;
		bb_std_lang.popErr();
		return t_;
	}
	public final c_iDrawable p_NextObject(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<336>";
		c_iDrawable t_data=m__curr.m__data;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<337>";
		m__curr=m__curr.m__succ;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/list.monkey<338>";
		bb_std_lang.popErr();
		return t_data;
	}
}
abstract class c_lpPopup extends Object implements c_iDrawable{
	public abstract void p_Update(int t_delta);
	float m_backgroundAlpha=0.5f;
	public final float p_GetBakgroundAlpha(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lppopup.monkey<39>";
		bb_std_lang.popErr();
		return this.m_backgroundAlpha;
	}
	public abstract void p_Render();
	public abstract void p_Create();
}
interface c_IAsyncEventSource{
	public void p_UpdateAsyncEvents();
}
class c_Stack3 extends Object{
	public final c_Stack3 m_Stack_new(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
		return this;
	}
	c_IAsyncEventSource[] m_data=new c_IAsyncEventSource[0];
	int m_length=0;
	public final c_Stack3 m_Stack_new2(c_IAsyncEventSource[] t_data){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<13>";
		this.m_data=((c_IAsyncEventSource[])bb_std_lang.sliceArray(t_data,0));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<14>";
		this.m_length=t_data.length;
		bb_std_lang.popErr();
		return this;
	}
	static c_IAsyncEventSource m_NIL;
	public final void p_Length(int t_newlength){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<41>";
		if(t_newlength<m_length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<42>";
			for(int t_i=t_newlength;t_i<m_length;t_i=t_i+1){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<43>";
				m_data[t_i]=m_NIL;
			}
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<45>";
			if(t_newlength>m_data.length){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<46>";
				m_data=(c_IAsyncEventSource[])bb_std_lang.resizeArray(m_data,bb_math.g_Max(m_length*2+10,t_newlength));
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<48>";
		m_length=t_newlength;
		bb_std_lang.popErr();
	}
	public final int p_Length2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<52>";
		bb_std_lang.popErr();
		return m_length;
	}
	public final c_IAsyncEventSource p_Get(int t_index){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<100>";
		c_IAsyncEventSource t_=m_data[t_index];
		bb_std_lang.popErr();
		return t_;
	}
}
class c_lpColor extends Object{
	float m_r=.0f;
	float m_g=.0f;
	float m_b=.0f;
	public final c_lpColor m_lpColor_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<11>";
		this.m_r=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<12>";
		this.m_g=0.0f;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<13>";
		this.m_b=0.0f;
		bb_std_lang.popErr();
		return this;
	}
	public final c_lpColor m_lpColor_new2(float t_r,float t_g,float t_b){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<18>";
		this.m_r=t_r;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<19>";
		this.m_g=t_g;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<20>";
		this.m_b=t_b;
		bb_std_lang.popErr();
		return this;
	}
	public static c_lpColor m_Black(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpcolor.monkey<45>";
		c_lpColor t_=(new c_lpColor()).m_lpColor_new();
		bb_std_lang.popErr();
		return t_;
	}
}
class c_lpResources extends Object{
	c_StringMap m_images=null;
	c_StringMap m_pimages=null;
	c_StringMap2 m_sounds=null;
	c_StringMap3 m_translations=null;
	public final c_lpResources m_lpResources_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<50>";
		m_images=(new c_StringMap()).m_StringMap_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<51>";
		m_pimages=(new c_StringMap()).m_StringMap_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<52>";
		m_sounds=(new c_StringMap2()).m_StringMap_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<53>";
		m_translations=(new c_StringMap3()).m_StringMap_new();
		bb_std_lang.popErr();
		return this;
	}
	static c_lpResources m__instance;
	public static c_lpResources m_GetInstance(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<67>";
		bb_std_lang.popErr();
		return m__instance;
	}
}
abstract class c_Map extends Object{
	public final c_Map m_Map_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<7>";
		bb_std_lang.popErr();
		return this;
	}
	public final c_MapValues p_Values(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<117>";
		c_MapValues t_=(new c_MapValues()).m_MapValues_new(this);
		bb_std_lang.popErr();
		return t_;
	}
	c_Node2 m_root=null;
	public final c_Node2 p_FirstNode(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<137>";
		if(!((m_root)!=null)){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<137>";
			bb_std_lang.popErr();
			return null;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<139>";
		c_Node2 t_node=m_root;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<140>";
		while((t_node.m_left)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<141>";
			t_node=t_node.m_left;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<143>";
		bb_std_lang.popErr();
		return t_node;
	}
	public final int p_Clear(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<13>";
		m_root=null;
		bb_std_lang.popErr();
		return 0;
	}
}
class c_StringMap extends c_Map{
	public final c_StringMap m_StringMap_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		super.m_Map_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_Sound extends Object{
	gxtkSample m_sample=null;
	public final int p_Discard(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/audio.monkey<32>";
		if((m_sample)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/audio.monkey<33>";
			m_sample.Discard();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/audio.monkey<34>";
			m_sample=null;
		}
		bb_std_lang.popErr();
		return 0;
	}
}
abstract class c_Map2 extends Object{
	public final c_Map2 m_Map_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<7>";
		bb_std_lang.popErr();
		return this;
	}
	public final c_MapValues2 p_Values(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<117>";
		c_MapValues2 t_=(new c_MapValues2()).m_MapValues_new(this);
		bb_std_lang.popErr();
		return t_;
	}
	c_Node3 m_root=null;
	public final c_Node3 p_FirstNode(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<137>";
		if(!((m_root)!=null)){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<137>";
			bb_std_lang.popErr();
			return null;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<139>";
		c_Node3 t_node=m_root;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<140>";
		while((t_node.m_left)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<141>";
			t_node=t_node.m_left;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<143>";
		bb_std_lang.popErr();
		return t_node;
	}
	public final int p_Clear(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<13>";
		m_root=null;
		bb_std_lang.popErr();
		return 0;
	}
}
class c_StringMap2 extends c_Map2{
	public final c_StringMap2 m_StringMap_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		super.m_Map_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		bb_std_lang.popErr();
		return this;
	}
}
abstract class c_Map3 extends Object{
	public final c_Map3 m_Map_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<7>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_StringMap3 extends c_Map3{
	public final c_StringMap3 m_StringMap_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		super.m_Map_new();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<551>";
		bb_std_lang.popErr();
		return this;
	}
}
class c_MapValues extends Object{
	c_Map m_map=null;
	public final c_MapValues m_MapValues_new(c_Map t_map){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<519>";
		this.m_map=t_map;
		bb_std_lang.popErr();
		return this;
	}
	public final c_MapValues m_MapValues_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<516>";
		bb_std_lang.popErr();
		return this;
	}
	public final c_ValueEnumerator p_ObjectEnumerator(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<523>";
		c_ValueEnumerator t_=(new c_ValueEnumerator()).m_ValueEnumerator_new(m_map.p_FirstNode());
		bb_std_lang.popErr();
		return t_;
	}
}
class c_ValueEnumerator extends Object{
	c_Node2 m_node=null;
	public final c_ValueEnumerator m_ValueEnumerator_new(c_Node2 t_node){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<481>";
		this.m_node=t_node;
		bb_std_lang.popErr();
		return this;
	}
	public final c_ValueEnumerator m_ValueEnumerator_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<478>";
		bb_std_lang.popErr();
		return this;
	}
	public final boolean p_HasNext(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<485>";
		boolean t_=m_node!=null;
		bb_std_lang.popErr();
		return t_;
	}
	public final c_Image p_NextObject(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<489>";
		c_Node2 t_t=m_node;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<490>";
		m_node=m_node.p_NextNode();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<491>";
		bb_std_lang.popErr();
		return t_t.m_value;
	}
}
class c_Node2 extends Object{
	c_Node2 m_left=null;
	c_Node2 m_right=null;
	c_Node2 m_parent=null;
	public final c_Node2 p_NextNode(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<385>";
		c_Node2 t_node=null;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<386>";
		if((m_right)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<387>";
			t_node=m_right;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<388>";
			while((t_node.m_left)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<389>";
				t_node=t_node.m_left;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<391>";
			bb_std_lang.popErr();
			return t_node;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<393>";
		t_node=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<394>";
		c_Node2 t_parent=this.m_parent;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<395>";
		while(((t_parent)!=null) && t_node==t_parent.m_right){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<396>";
			t_node=t_parent;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<397>";
			t_parent=t_parent.m_parent;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<399>";
		bb_std_lang.popErr();
		return t_parent;
	}
	c_Image m_value=null;
}
class c_Enumerator2 extends Object{
	c_Stack2 m_stack=null;
	public final c_Enumerator2 m_Enumerator_new(c_Stack2 t_stack){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<255>";
		this.m_stack=t_stack;
		bb_std_lang.popErr();
		return this;
	}
	public final c_Enumerator2 m_Enumerator_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<252>";
		bb_std_lang.popErr();
		return this;
	}
	int m_index=0;
	public final boolean p_HasNext(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<259>";
		boolean t_=m_index<m_stack.p_Length2();
		bb_std_lang.popErr();
		return t_;
	}
	public final c_lpCamera p_NextObject(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<263>";
		m_index+=1;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/stack.monkey<264>";
		c_lpCamera t_=m_stack.m_data[m_index-1];
		bb_std_lang.popErr();
		return t_;
	}
}
class c_MapValues2 extends Object{
	c_Map2 m_map=null;
	public final c_MapValues2 m_MapValues_new(c_Map2 t_map){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<519>";
		this.m_map=t_map;
		bb_std_lang.popErr();
		return this;
	}
	public final c_MapValues2 m_MapValues_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<516>";
		bb_std_lang.popErr();
		return this;
	}
	public final c_ValueEnumerator2 p_ObjectEnumerator(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<523>";
		c_ValueEnumerator2 t_=(new c_ValueEnumerator2()).m_ValueEnumerator_new(m_map.p_FirstNode());
		bb_std_lang.popErr();
		return t_;
	}
}
class c_ValueEnumerator2 extends Object{
	c_Node3 m_node=null;
	public final c_ValueEnumerator2 m_ValueEnumerator_new(c_Node3 t_node){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<481>";
		this.m_node=t_node;
		bb_std_lang.popErr();
		return this;
	}
	public final c_ValueEnumerator2 m_ValueEnumerator_new2(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<478>";
		bb_std_lang.popErr();
		return this;
	}
	public final boolean p_HasNext(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<485>";
		boolean t_=m_node!=null;
		bb_std_lang.popErr();
		return t_;
	}
	public final c_Sound p_NextObject(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<489>";
		c_Node3 t_t=m_node;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<490>";
		m_node=m_node.p_NextNode();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<491>";
		bb_std_lang.popErr();
		return t_t.m_value;
	}
}
class c_Node3 extends Object{
	c_Node3 m_left=null;
	c_Node3 m_right=null;
	c_Node3 m_parent=null;
	public final c_Node3 p_NextNode(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<385>";
		c_Node3 t_node=null;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<386>";
		if((m_right)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<387>";
			t_node=m_right;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<388>";
			while((t_node.m_left)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<389>";
				t_node=t_node.m_left;
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<391>";
			bb_std_lang.popErr();
			return t_node;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<393>";
		t_node=this;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<394>";
		c_Node3 t_parent=this.m_parent;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<395>";
		while(((t_parent)!=null) && t_node==t_parent.m_right){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<396>";
			t_node=t_parent;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<397>";
			t_parent=t_parent.m_parent;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/map.monkey<399>";
		bb_std_lang.popErr();
		return t_parent;
	}
	c_Sound m_value=null;
}
class c_SampleScene extends c_lpScene{
	public final c_SampleScene m_SampleScene_new(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<6>";
		super.m_lpScene_new();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<6>";
		bb_std_lang.popErr();
		return this;
	}
	int m_loading_step=0;
	NativePlayer m_video_player=null;
	public final int p_Loading(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<13>";
		if(m_loading_step==0){
			bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<14>";
			this.m_video_player=(new NativePlayer());
			bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<15>";
			this.m_video_player.SetVirtualResolution(640,960);
			bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<16>";
			this.m_video_player.SetPosition(100,400,500,500);
			bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<18>";
			this.m_video_player.SetUrl("rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov");
			bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<19>";
			this.m_video_player.Play();
		}
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<22>";
		m_loading_step-=1;
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<24>";
		bb_std_lang.popErr();
		return m_loading_step;
	}
	public final void p_Update(int t_delta){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
}
class bb_asyncevent{
	static c_IAsyncEventSource g__current;
	static c_Stack3 g__sources;
	public static int g_UpdateAsyncEvents(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<24>";
		if((bb_asyncevent.g__current)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<24>";
			bb_std_lang.popErr();
			return 0;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<25>";
		int t_i=0;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<26>";
		while(t_i<bb_asyncevent.g__sources.p_Length2()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<27>";
			bb_asyncevent.g__current=bb_asyncevent.g__sources.p_Get(t_i);
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<28>";
			bb_asyncevent.g__current.p_UpdateAsyncEvents();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<29>";
			if((bb_asyncevent.g__current)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<29>";
				t_i+=1;
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/brl/asyncevent.monkey<31>";
		bb_asyncevent.g__current=null;
		bb_std_lang.popErr();
		return 0;
	}
}
class bb_gametarget{
}
class bb_thread{
}
class bb_app{
	static c_App g__app;
	static c_GameDelegate g__delegate;
	static BBGame g__game;
	public static int g_EndApp(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<192>";
		bb_std_lang.error("");
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Millisecs(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<166>";
		int t_=bb_app.g__game.Millisecs();
		bb_std_lang.popErr();
		return t_;
	}
	static int g__updateRate;
	public static int g_SetUpdateRate(int t_hertz){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<157>";
		bb_app.g__updateRate=t_hertz;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/app.monkey<158>";
		bb_app.g__game.SetUpdateRate(t_hertz);
		bb_std_lang.popErr();
		return 0;
	}
}
class bb_asyncimageloader{
}
class bb_asyncloaders{
}
class bb_asyncsoundloader{
}
class bb_audio{
	static gxtkAudio g_device;
	public static int g_SetAudioDevice(gxtkAudio t_dev){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/audio.monkey<18>";
		bb_audio.g_device=t_dev;
		bb_std_lang.popErr();
		return 0;
	}
}
class bb_audiodevice{
}
class bb_data{
	public static String g_FixDataPath(String t_path){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<3>";
		int t_i=t_path.indexOf(":/",0);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<4>";
		if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<4>";
			bb_std_lang.popErr();
			return t_path;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<5>";
		if(t_path.startsWith("./") || t_path.startsWith("/")){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<5>";
			bb_std_lang.popErr();
			return t_path;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/data.monkey<6>";
		String t_="monkey://data/"+t_path;
		bb_std_lang.popErr();
		return t_;
	}
}
class bb_graphics{
	static gxtkGraphics g_device;
	public static int g_SetGraphicsDevice(gxtkGraphics t_dev){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<58>";
		bb_graphics.g_device=t_dev;
		bb_std_lang.popErr();
		return 0;
	}
	static c_GraphicsContext g_context;
	public static c_Image g_LoadImage(String t_path,int t_frameCount,int t_flags){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<234>";
		gxtkSurface t_surf=bb_graphics.g_device.LoadSurface(bb_data.g_FixDataPath(t_path));
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<235>";
		if((t_surf)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<235>";
			c_Image t_=((new c_Image()).m_Image_new()).p_Init(t_surf,t_frameCount,t_flags);
			bb_std_lang.popErr();
			return t_;
		}
		bb_std_lang.popErr();
		return null;
	}
	public static c_Image g_LoadImage2(String t_path,int t_frameWidth,int t_frameHeight,int t_frameCount,int t_flags){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<239>";
		c_Image t_atlas=bb_graphics.g_LoadImage(t_path,1,0);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<240>";
		if((t_atlas)!=null){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<240>";
			c_Image t_=t_atlas.p_GrabImage(0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
			bb_std_lang.popErr();
			return t_;
		}
		bb_std_lang.popErr();
		return null;
	}
	public static int g_SetFont(c_Image t_font,int t_firstChar){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<541>";
		if(!((t_font)!=null)){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<542>";
			if(!((bb_graphics.g_context.m_defaultFont)!=null)){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<543>";
				bb_graphics.g_context.m_defaultFont=bb_graphics.g_LoadImage("mojo_font.png",96,2);
			}
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<545>";
			t_font=bb_graphics.g_context.m_defaultFont;
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<546>";
			t_firstChar=32;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<548>";
		bb_graphics.g_context.m_font=t_font;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<549>";
		bb_graphics.g_context.m_firstChar=t_firstChar;
		bb_std_lang.popErr();
		return 0;
	}
	static gxtkGraphics g_renderDevice;
	public static int g_SetMatrix(float t_ix,float t_iy,float t_jx,float t_jy,float t_tx,float t_ty){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<307>";
		bb_graphics.g_context.m_ix=t_ix;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<308>";
		bb_graphics.g_context.m_iy=t_iy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<309>";
		bb_graphics.g_context.m_jx=t_jx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<310>";
		bb_graphics.g_context.m_jy=t_jy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<311>";
		bb_graphics.g_context.m_tx=t_tx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<312>";
		bb_graphics.g_context.m_ty=t_ty;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<313>";
		bb_graphics.g_context.m_tformed=((t_ix!=1.0f || t_iy!=0.0f || t_jx!=0.0f || t_jy!=1.0f || t_tx!=0.0f || t_ty!=0.0f)?1:0);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<314>";
		bb_graphics.g_context.m_matDirty=1;
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_SetMatrix2(float[] t_m){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<303>";
		bb_graphics.g_SetMatrix(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_SetColor(float t_r,float t_g,float t_b){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<249>";
		bb_graphics.g_context.m_color_r=t_r;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<250>";
		bb_graphics.g_context.m_color_g=t_g;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<251>";
		bb_graphics.g_context.m_color_b=t_b;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<252>";
		bb_graphics.g_renderDevice.SetColor(t_r,t_g,t_b);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_SetAlpha(float t_alpha){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<266>";
		bb_graphics.g_context.m_alpha=t_alpha;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<267>";
		bb_graphics.g_renderDevice.SetAlpha(t_alpha);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_SetBlend(int t_blend){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<275>";
		bb_graphics.g_context.m_blend=t_blend;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<276>";
		bb_graphics.g_renderDevice.SetBlend(t_blend);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_DeviceWidth(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<226>";
		int t_=bb_graphics.g_device.Width();
		bb_std_lang.popErr();
		return t_;
	}
	public static int g_DeviceHeight(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<230>";
		int t_=bb_graphics.g_device.Height();
		bb_std_lang.popErr();
		return t_;
	}
	public static int g_SetScissor(float t_x,float t_y,float t_width,float t_height){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<284>";
		bb_graphics.g_context.m_scissor_x=t_x;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<285>";
		bb_graphics.g_context.m_scissor_y=t_y;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<286>";
		bb_graphics.g_context.m_scissor_width=t_width;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<287>";
		bb_graphics.g_context.m_scissor_height=t_height;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<288>";
		bb_graphics.g_renderDevice.SetScissor((int)(t_x),(int)(t_y),(int)(t_width),(int)(t_height));
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_BeginRender(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<212>";
		bb_graphics.g_renderDevice=bb_graphics.g_device;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<213>";
		bb_graphics.g_context.m_matrixSp=0;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<214>";
		bb_graphics.g_SetMatrix(1.0f,0.0f,0.0f,1.0f,0.0f,0.0f);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<215>";
		bb_graphics.g_SetColor(255.0f,255.0f,255.0f);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<216>";
		bb_graphics.g_SetAlpha(1.0f);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<217>";
		bb_graphics.g_SetBlend(0);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<218>";
		bb_graphics.g_SetScissor(0.0f,0.0f,(float)(bb_graphics.g_DeviceWidth()),(float)(bb_graphics.g_DeviceHeight()));
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_EndRender(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<222>";
		bb_graphics.g_renderDevice=null;
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_DebugRenderDevice(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<48>";
		if(!((bb_graphics.g_renderDevice)!=null)){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<48>";
			bb_std_lang.error("Rendering operations can only be performed inside OnRender");
		}
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Cls(float t_r,float t_g,float t_b){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<372>";
		bb_graphics.g_DebugRenderDevice();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<374>";
		bb_graphics.g_renderDevice.Cls(t_r,t_g,t_b);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_DrawImage(c_Image t_image,float t_x,float t_y,int t_frame){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<445>";
		bb_graphics.g_DebugRenderDevice();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<446>";
		if(t_frame<0 || t_frame>=t_image.m_frames.length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<446>";
			bb_std_lang.error("Invalid image frame");
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<449>";
		c_Frame t_f=t_image.m_frames[t_frame];
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<451>";
		bb_graphics.g_context.p_Validate();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<453>";
		if((t_image.m_flags&65536)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<454>";
			bb_graphics.g_renderDevice.DrawSurface(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty);
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<456>";
			bb_graphics.g_renderDevice.DrawSurface2(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
		}
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_PushMatrix(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<328>";
		int t_sp=bb_graphics.g_context.m_matrixSp;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<329>";
		bb_graphics.g_context.m_matrixStack[t_sp+0]=bb_graphics.g_context.m_ix;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<330>";
		bb_graphics.g_context.m_matrixStack[t_sp+1]=bb_graphics.g_context.m_iy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<331>";
		bb_graphics.g_context.m_matrixStack[t_sp+2]=bb_graphics.g_context.m_jx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<332>";
		bb_graphics.g_context.m_matrixStack[t_sp+3]=bb_graphics.g_context.m_jy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<333>";
		bb_graphics.g_context.m_matrixStack[t_sp+4]=bb_graphics.g_context.m_tx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<334>";
		bb_graphics.g_context.m_matrixStack[t_sp+5]=bb_graphics.g_context.m_ty;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<335>";
		bb_graphics.g_context.m_matrixSp=t_sp+6;
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Transform(float t_ix,float t_iy,float t_jx,float t_jy,float t_tx,float t_ty){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<349>";
		float t_ix2=t_ix*bb_graphics.g_context.m_ix+t_iy*bb_graphics.g_context.m_jx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<350>";
		float t_iy2=t_ix*bb_graphics.g_context.m_iy+t_iy*bb_graphics.g_context.m_jy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<351>";
		float t_jx2=t_jx*bb_graphics.g_context.m_ix+t_jy*bb_graphics.g_context.m_jx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<352>";
		float t_jy2=t_jx*bb_graphics.g_context.m_iy+t_jy*bb_graphics.g_context.m_jy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<353>";
		float t_tx2=t_tx*bb_graphics.g_context.m_ix+t_ty*bb_graphics.g_context.m_jx+bb_graphics.g_context.m_tx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<354>";
		float t_ty2=t_tx*bb_graphics.g_context.m_iy+t_ty*bb_graphics.g_context.m_jy+bb_graphics.g_context.m_ty;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<355>";
		bb_graphics.g_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Transform2(float[] t_m){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<345>";
		bb_graphics.g_Transform(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Translate(float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<359>";
		bb_graphics.g_Transform(1.0f,0.0f,0.0f,1.0f,t_x,t_y);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Rotate(float t_angle){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<367>";
		bb_graphics.g_Transform((float)Math.cos((t_angle)*bb_std_lang.D2R),-(float)Math.sin((t_angle)*bb_std_lang.D2R),(float)Math.sin((t_angle)*bb_std_lang.D2R),(float)Math.cos((t_angle)*bb_std_lang.D2R),0.0f,0.0f);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_Scale(float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<363>";
		bb_graphics.g_Transform(t_x,0.0f,0.0f,t_y,0.0f,0.0f);
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_PopMatrix(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<339>";
		int t_sp=bb_graphics.g_context.m_matrixSp-6;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<340>";
		bb_graphics.g_SetMatrix(bb_graphics.g_context.m_matrixStack[t_sp+0],bb_graphics.g_context.m_matrixStack[t_sp+1],bb_graphics.g_context.m_matrixStack[t_sp+2],bb_graphics.g_context.m_matrixStack[t_sp+3],bb_graphics.g_context.m_matrixStack[t_sp+4],bb_graphics.g_context.m_matrixStack[t_sp+5]);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<341>";
		bb_graphics.g_context.m_matrixSp=t_sp;
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_DrawImage2(c_Image t_image,float t_x,float t_y,float t_rotation,float t_scaleX,float t_scaleY,int t_frame){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<463>";
		bb_graphics.g_DebugRenderDevice();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<464>";
		if(t_frame<0 || t_frame>=t_image.m_frames.length){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<464>";
			bb_std_lang.error("Invalid image frame");
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<467>";
		c_Frame t_f=t_image.m_frames[t_frame];
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<469>";
		bb_graphics.g_PushMatrix();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<471>";
		bb_graphics.g_Translate(t_x,t_y);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<472>";
		bb_graphics.g_Rotate(t_rotation);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<473>";
		bb_graphics.g_Scale(t_scaleX,t_scaleY);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<475>";
		bb_graphics.g_Translate(-t_image.m_tx,-t_image.m_ty);
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<477>";
		bb_graphics.g_context.p_Validate();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<479>";
		if((t_image.m_flags&65536)!=0){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<480>";
			bb_graphics.g_renderDevice.DrawSurface(t_image.m_surface,0.0f,0.0f);
		}else{
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<482>";
			bb_graphics.g_renderDevice.DrawSurface2(t_image.m_surface,0.0f,0.0f,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<485>";
		bb_graphics.g_PopMatrix();
		bb_std_lang.popErr();
		return 0;
	}
	public static float[] g_GetMatrix(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<318>";
		float[] t_=new float[]{bb_graphics.g_context.m_ix,bb_graphics.g_context.m_iy,bb_graphics.g_context.m_jx,bb_graphics.g_context.m_jy,bb_graphics.g_context.m_tx,bb_graphics.g_context.m_ty};
		bb_std_lang.popErr();
		return t_;
	}
	public static int g_GetMatrix2(float[] t_matrix){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<322>";
		t_matrix[0]=bb_graphics.g_context.m_ix;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<322>";
		t_matrix[1]=bb_graphics.g_context.m_iy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<323>";
		t_matrix[2]=bb_graphics.g_context.m_jx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<323>";
		t_matrix[3]=bb_graphics.g_context.m_jy;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<324>";
		t_matrix[4]=bb_graphics.g_context.m_tx;
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<324>";
		t_matrix[5]=bb_graphics.g_context.m_ty;
		bb_std_lang.popErr();
		return 0;
	}
	public static int g_DrawRect(float t_x,float t_y,float t_w,float t_h){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<387>";
		bb_graphics.g_DebugRenderDevice();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<389>";
		bb_graphics.g_context.p_Validate();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/graphics.monkey<390>";
		bb_graphics.g_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
		bb_std_lang.popErr();
		return 0;
	}
}
class bb_graphicsdevice{
}
class bb_input{
	static c_InputDevice g_device;
	public static int g_SetInputDevice(c_InputDevice t_dev){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/mojo/input.monkey<18>";
		bb_input.g_device=t_dev;
		bb_std_lang.popErr();
		return 0;
	}
}
class bb_inputdevice{
}
class bb_keycodes{
}
class bb_mojo{
}
class bb_boxes{
}
class bb_lang{
}
class bb_list{
}
class bb_map{
}
class bb_math{
	public static int g_Max(int t_x,int t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<56>";
		if(t_x>t_y){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<56>";
			bb_std_lang.popErr();
			return t_x;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<57>";
		bb_std_lang.popErr();
		return t_y;
	}
	public static float g_Max2(float t_x,float t_y){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<83>";
		if(t_x>t_y){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<83>";
			bb_std_lang.popErr();
			return t_x;
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules/monkey/math.monkey<84>";
		bb_std_lang.popErr();
		return t_y;
	}
}
class bb_monkey{
}
class bb_random{
}
class bb_set{
}
class bb_stack{
}
class bb_angelfont{
}
class bb_char{
}
class bb_kernpair{
}
class bb_color{
}
class bb_idrawable{
}
class bb_json{
}
class bb_jsondata{
}
class bb_tokeniser{
}
class bb_lpcamera{
}
class bb_lpcolor{
}
class bb_lphudbutton{
}
class bb_lpimage{
}
class bb_lppoly{
}
class bb_lppopup{
}
class bb_lprectangle{
}
class bb_lpresources{
	public static void g_lpResetValues(){
		bb_std_lang.pushErr();
		bb_std_lang.popErr();
	}
	public static void g_lpLoadToVideoMemory(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<112>";
		c_lpResources t_r=c_lpResources.m_GetInstance();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<114>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<114>";
		c_ValueEnumerator t_=t_r.m_images.p_Values().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<114>";
		while(t_.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<114>";
			c_Image t_i=t_.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<115>";
			if((t_i)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<116>";
				bb_graphics.g_DrawImage(t_i,0.0f,0.0f,0);
			}
		}
		bb_std_lang.popErr();
	}
	public static void g_lpFreeMemory(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<138>";
		c_lpResources t_r=c_lpResources.m_GetInstance();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<140>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<140>";
		c_ValueEnumerator t_=t_r.m_images.p_Values().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<140>";
		while(t_.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<140>";
			c_Image t_i=t_.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<141>";
			if((t_i)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<142>";
				t_i.p_Discard();
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<146>";
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<146>";
		c_ValueEnumerator2 t_2=t_r.m_sounds.p_Values().p_ObjectEnumerator();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<146>";
		while(t_2.p_HasNext()){
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<146>";
			c_Sound t_i2=t_2.p_NextObject();
			bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<147>";
			if((t_i2)!=null){
				bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<148>";
				t_i2.p_Discard();
			}
		}
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<153>";
		t_r.m_images.p_Clear();
		bb_std_lang.errInfo="/Users/ricardo/MonkeyPro73b/modules_ext/lp2/lpresources.monkey<154>";
		t_r.m_sounds.p_Clear();
		bb_std_lang.popErr();
	}
}
class bb_lpscene{
}
class bb_lpscenemngr{
	static int g_LONENTERLOADING;
	static int g_LONLOADING;
	static int g_LONPLAYING;
	static int g_LONENTERSCENE;
}
class bb_lptween{
}
class bb_vector2{
}
class bb_nativeplayer{
}
class bb_monkeytarget{
}
class bb_{
	public static int bbMain(){
		bb_std_lang.pushErr();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<49>";
		(new c_Manager()).m_Manager_new();
		bb_std_lang.errInfo="/Users/ricardo/svn/monkey/modules/lp2/videoplayer/videoplayersample.monkey<50>";
		bb_std_lang.popErr();
		return 0;
	}
	public static int bbInit(){
		bb_app.g__app=null;
		bb_app.g__delegate=null;
		bb_app.g__game=BBGame.Game();
		bb_graphics.g_device=null;
		bb_graphics.g_context=(new c_GraphicsContext()).m_GraphicsContext_new();
		c_Image.m_DefaultFlags=0;
		bb_audio.g_device=null;
		bb_input.g_device=null;
		bb_graphics.g_renderDevice=null;
		c_lpSceneMngr.m__instance=null;
		c_Stack2.m_NIL=null;
		bb_lpscenemngr.g_LONENTERLOADING=0;
		bb_lpscenemngr.g_LONLOADING=1;
		bb_lpscenemngr.g_LONPLAYING=3;
		bb_asyncevent.g__current=null;
		bb_asyncevent.g__sources=(new c_Stack3()).m_Stack_new();
		c_Stack3.m_NIL=null;
		bb_lpscenemngr.g_LONENTERSCENE=2;
		c_lpResources.m__instance=(new c_lpResources()).m_lpResources_new();
		bb_app.g__updateRate=0;
		return 0;
	}
}
//${TRANSCODE_END}
