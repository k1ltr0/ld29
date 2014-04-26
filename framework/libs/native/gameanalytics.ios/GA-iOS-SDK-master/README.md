#[GameAnalytics REST API](http://support.gameanalytics.com/forums/21598176-The-REST-API) wrapper for iOS


The GameAnalytics API iOS Wrapper is designed to send game event data to the GameAnalytics service for processing and visualization. By collecting data from players playing your game you will be able to identify bugs and balance issues, track purchases, and determine how the players really play your game.

The code for the GameAnalytics API iOS Wrapper is open source - feel free to create your own fork, or use the code to develop your own wrapper.

## GameAnalytics Full Documentation

You can find the [full documentation](http://support.gameanalytics.com/forums) on the Game Analytics website for wrappers, RESTful API, as well as information about how to collect useful data for your game.

## GameAnalytics Website

The GameAnalytics website can be found [here](http://www.gameanalytics.com/).
To start using the iOS API Wrapper you will have to create an account on the website and add your game.


##Requirements

- iOS 5 or later
- ARC
- XCode 4.4 is required for auto-synthesis.

##Installation

The best and easiest way is to use [CocoaPods](http://cocoapods.org).
[CocoaPods](http://cocoapods.org) is the best way to manage library dependencies in Objective-C projects.
See the ["Getting Started"](http://cocoapods.org/#get_started) guide for more information.

If you haven't already, you need to install [CocoaPods](http://cocoapods.org).
In a terminal, type the following commands:

	$ sudo gem install cocoapods
	$ pod setup
	
With CocoaPods installed create a file called Podfile next to your project with the following contents:

```ruby
platform :ios, '5.0'

pod "GA-iOS-SDK"
```

If you already have a Podfile, just add `pod "GA-iOS-SDK"` to the end of it.
Type pod install into your terminal.
An Xcode Workspace file will be generated next to your project — use it instead of xcodeproj.

### Alternatives
Not using CocoaPods? Here is alterative method.

1. Download latest version of GamesAnalytics iOS Wrapper binaries.
	The archive should contain these files:

	*`GameAnalytics.h`: The required header file containing methods for Games Analytics.*
	
	*`libGameAnalytics.a`: The required static library for Games Analytics.*
	
	Alternatively, you can use source code and build it yourself. 
	In case you already have the older version of the binaries, remove them from your project.

2. Click on your project's Frameworks > Add Files to "Your project name".

	![Add Files to](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/addfiles.png)
	
	Find and select the folder that contains the file named `libGameAnalytics.a`.
	The checkbox "Copy items into destination folder (if needed)" must be checked.
	Choose "Create groups for any added folders" and click Add.  
	
	![Select folder](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/selectfolder.png)
	
	The files `GameAnalytics.h` and `libGameAnalytics.a` should now be in your project.
	
	![Files added](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/filesadded.png)

3. Select your project, target and choose "Build Phases" tab.
	Expand the "Link Binary With Libraries" group and check if it contains `libGameAnalytic.a` library.
	
	![Link Binary With Libraries](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/linkbinary.png)
	
	In case it is not present there, drag and drop the library from your Project Navigator to the "Link Binary With Libraries" group.

4. In the "Link Binary With Libraries" group click the "+" to add new framework.
	Find the `SystemConfiguration.framework` in the list and click Add.
	
	![Add framework](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/addframework.png)
	
	`SystemConfiguration.framework` now should be listed under the "Link Binary With Libraries" group.
	
	![SystemConfiguration.framework](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/systemconfig.png)
	
	This is required for Reachability to manage network operations efficiently.
	
	Find the `AdSupport.framework` in the list and click Add.
	
	`AdSupport.framework` also should be listed under the "Link Binary With Libraries" group.
	
	This is required to get advertising Identifier on iOS6+.

5. Select your project, target and choose "Build Settings" tab.
	Under "Linking" group click on "Other Linker Flags" and add `-ObjC` flag. 
	
	![ObjC flag](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/objc.png)
	
6. In your project's build settings, find "Header Search Paths" and add $(SRCROOT) and check the box indicating a recurisve search.
	If the path to your project contains spaces, you must put $(SRCROOT) (as other custom search paths) in quotes.

	![SRCROOT](https://github.com/GameAnalytics/GA-iOS-SDK/raw/master/Screenshots/srcroot.png)

##Usage

Add the following line into your pre-compiled header file (`<projectname>_Prefix.pch`) 

    #import "GameAnalytics.h"
    
when using CocoaPods add following line instead
    
    #import <GA-iOS-SDK/GameAnalytics.h>

In your application delegate's `application:didFinishLaunchingWithOptions:` method, add the following line to set your Game keys and Secret keys:

    [GameAnalytics setGameKey:@"__CHANGE_ME__" secretKey:@"__CHANGE_ME__" build:@"__CHANGE_ME__"];

Go to [GameAnalytic](http://www.gameanalytics.com) to register your game and get the game- and secret-key.

There are four different types of events to log: user, design, business, quality.
Each of these categories have different purposes, accept different values, and have certain required fields. 
Check the [full documentation](http://support.gameanalytics.com/forums) for more details. 
Add these method calls to your code to register every occurrence of the events.

###User data

Used to tracking demographic information about individual users (players). 
Log User data examples:

    [GameAnalytics logUserDataWithParams:@{@"gender" : @"M", @"birth_year" : @1981, @"friend_count" : @100}];
    
    [GameAnalytics logUserDataWithGender:@"M"
                               birthYear:@1981
                             friendCount:@100];
    
    [GameAnalytics logUserDataWithGender:@"M"
                               birthYear:@1981
                             friendCount:@100
                                platform:@"platform"
                                  device:@"device"
                                 osMajor:@"osMajor"
                                 osMinor:@"osMinor"
                              sdkVersion:@"sdkVersion"
                        installPublisher:@"installPublisher"
                             installSite:@"installSite"
                         installCampaign:@"installCampaign"
                          installAdgroup:@"installAdgroup"
                               installAd:@"installAd"
                          installKeyword:@"installKeyword"
                                   iosID:@"iosID"];



###Game design data

Used to tracking game design events, for example level completion time.
Log Game design data examples:

    [GameAnalytics logGameDesignDataEvent:@"PickedUpAmmo:Shotgun"
    						   withParams:@{@"area" : @"Level 1", @"x" : @1.0f, @"y" : @1.0f, @"z" : @1.0f, @"value" : @1.0f}];
    						   
    [GameAnalytics logGameDesignDataEvent:@"PickedUpAmmo:Shotgun"
                                    value:@1.0f
                                     area:@"Level 1"
                                        x:@1.0f
                                        y:@2.0f
                                        z:@3.0f];
                                        
    [GameAnalytics logGameDesignDataEvent:@"PickedUpAmmo:Shotgun"
                                    value:@1.0f];
                                    
    [GameAnalytics logGameDesignDataEvent:@"PickedUpAmmo:Shotgun"];

###Business data

Used to track business related events, such as purchases of virtual items.
Log Business data examples:

    [GameAnalytics logBusinessDataEvent:@"PurchaseWeapon:Shotgun"
              currencyString:@"LTL"
                amountNumber:@1000
                  withParams:@{@"area" : @"Level 1", @"x" : @1.0f, @"y" : @1.0f, @"z" : @1.0f}];
                  
    [GameAnalytics logBusinessDataEvent:@"PurchaseWeapon:Shotgun"
                         currencyString:@"LTL"
                           amountNumber:@100
                                   area:@"Level1"
                                      x:@1.0f
                                      y:@1.5f
                                      z:@2.5f];
                                      
    [GameAnalytics logBusinessDataEvent:@"PurchaseWeapon:Shotgun"
                         currencyString:@"LTL"
                           amountNumber:@100];

###Quality Assurance data

Used to tracking events related to quality assurance, such as crashes, system specifications, etc.
Log Quality Assurance data examples:

    [GameAnalytics logQualityAssuranceDataEvent:@"Exceptaion:NullReferenceException"
    								 withParams:@{ @"area" : @"Level 1", @"x" : @1.0f, @"y" : @1.0f, @"z" : @1.0f, @"message" : @"at Infragistics.Windows.Internal.TileManager.ItemRowColumnSizeInfo.."}];
    								 
    [GameAnalytics logQualityAssuranceDataEvent:@"Exceptaion:NullReferenceException"
                                        message:@"at Infragistics.Windows.Internal.TileManager.ItemRowColumnSizeInfo.."
                                           area:@"area"
                                              x:@1
                                              y:@2
                                              z:@3];
                                              
    [GameAnalytics logQualityAssuranceDataEvent:@"Exceptaion:NullReferenceException"
                                        message:@"at Infragistics.Windows.Internal.TileManager.ItemRowColumnSizeInfo.."];

###Update session ID

To update the session ID when you need to start a new session use the following method:     

    [GameAnalytics updateSessionID];
    
    
###Optional Settings

####Set custom user ID

Set custom user ID, if you don't want to use default OpenUDID.

	+ (void)setCustomUserID:(NSString *)udid;
	
####Get user ID

	+ (NSString *)getUserID;

####Enable debug logs to console

Enabling this option will cause the GameAnalytics wrapper to print additional debug information, such as the status of each submit to the server.
The default setting for this method is NO.

	+ (void)setDebugLogEnabled:(BOOL)value;

####Archive data

If enabled data will be archived when an internet connection is not available.
The number of events to be archived is limited.
The next time an internet connection is available any archived data will be sent.
The default setting for this method is NO.

	+ (void)setArchiveDataEnabled:(BOOL)value;
	
####Clear all pending events.

Use this method to clear all pending events when archive Data for offline usage is enabled.

	+ (void)clearEvents;
	
####Batch requests

Batching allows you to pass several log requests in a single HTTP request.
Call `[GameAnalytics sendBatch];` to send data.
The default setting for this method is NO.

	+ (void)setBatchRequestsEnabled:(BOOL)value;
	
####Submit While Roaming

If enabled, data will be submitted to the GameAnalytics servers
while the mobile device is roaming (internet connection via carrier data network).
The default setting for this method is NO (enabled).

	+ (void)setSubmitWhileRoaming:(BOOL)value;
	
## License

[MIT](http://opensource.org/licenses/MIT)
