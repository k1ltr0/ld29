//
//  GAEngine.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/4/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GAEngine.h"
#import "GASettings.h"
#import "NSString+GAMD5.h"

#import <AdSupport/ASIdentifierManager.h>
#import <UIKit/UIApplication.h>

@interface GAEngine ()


@property (strong, nonatomic) GAReachability *reachability;

- (void)commonInit;
-(NSString *)stringForCategory:(GACategory)category;
-(void) enqueueOperation:(GARequest*) request;
-(void) addRequestToOfflineArchiveMutableSet:(GARequest *)request;
-(void) removeRequestFromOfflineArchiveMutableSet:(GARequest *)request;

-(NSString *)getGUID;


-(void) saveCache;
-(void) freezeOperations;
-(void) checkAndRestoreFrozenOperations;

-(BOOL) isCacheEnabled;

@end

static NSMutableSet *inProgressRequestsMutableSet;
static dispatch_queue_t inProgressRequestsMutableSetAccessQueue;
static NSMutableSet *offlineArchive;

@implementation GAEngine

#pragma mark Initialization

+(void) initialize {
    
    if(!inProgressRequestsMutableSet)
    {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            
            inProgressRequestsMutableSet = [NSMutableSet set];
            offlineArchive = [NSMutableSet set];
            inProgressRequestsMutableSetAccessQueue = dispatch_queue_create("com.inProgressRequestsMutableSetSetAccessQueue", DISPATCH_QUEUE_CONCURRENT);
        });
    }
}

#pragma mark Freezing operations (Called when network connectivity fails)
-(void) freezeOperations {
    if(![self isCacheEnabled]) return;
    
    dispatch_sync(inProgressRequestsMutableSetAccessQueue, ^{
        for(GARequest *request in [inProgressRequestsMutableSet allObjects]) {
            if(![request isFinished])
            {
                [request cancel];
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self addRequestToOfflineArchiveMutableSet:request];
                });
            }
            [inProgressRequestsMutableSet removeObject:request];
        }
    });
}

-(void) checkAndRestoreFrozenOperations {
    if([GASettings isDebugLogEnabled])
        NSLog(@"checkAndRestoreFrozenOperations with request count: %d", [offlineArchive count]);
    
    for(GARequest *request in [offlineArchive allObjects])
    {
        [request start];
        [GAEngine addRequestToInProgressMutableSet:request];
        [self removeRequestFromOfflineArchiveMutableSet:request];
    }
}

-(void)clearEvents
{
    [offlineArchive removeAllObjects];
}


-(BOOL)sendBatch
{
    if([GASettings isBatchRequestsEnabled] && [self isReachable])
    {
        if([GASettings isDebugLogEnabled])
            NSLog(@"sendBatch with request count: %d", [offlineArchive count]);
        
        for(GARequest *request in [offlineArchive allObjects])
        {
            [request start];
            [GAEngine addRequestToInProgressMutableSet:request];
            [self removeRequestFromOfflineArchiveMutableSet:request];
        }
        return YES;
    } else {
        return NO;
    }
}

#pragma mark Cache related

-(NSString*) cacheDirectoryName {
    
    static NSString *cacheDirectoryName = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = paths[0];
        cacheDirectoryName = [documentsDirectory stringByAppendingPathComponent:@"GACache"];
    });
    
    return cacheDirectoryName;
}

-(void) saveCache {
    if([GASettings isDebugLogEnabled])
        NSLog(@"save Offline/Batch Request Archive");
    
    [self saveCacheData:[NSKeyedArchiver archivedDataWithRootObject:offlineArchive]];
    [offlineArchive removeAllObjects];
}

-(void) getCachedArchive
{
    if([GASettings isDebugLogEnabled])
        NSLog(@"load Offline/Batch Request Archive");

    NSString *filePath = [[self cacheDirectoryName] stringByAppendingPathComponent:@"Offline.archive"];
    NSData *data = [NSData dataWithContentsOfFile:filePath];
    if(data)
    {
        offlineArchive = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    }
}

-(void) saveCacheData:(NSData*) data
{
    NSString *filePath = [[self cacheDirectoryName] stringByAppendingPathComponent:@"Offline.archive"];
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [data writeToFile:filePath atomically:YES];
    });
}

-(BOOL) isCacheEnabled {
    
    BOOL isDir = NO;
    BOOL isCachingEnabled = [[NSFileManager defaultManager] fileExistsAtPath:[self cacheDirectoryName] isDirectory:&isDir];
    return isCachingEnabled;
}


-(void) useCache {
    
    NSString *cacheDirectory = [self cacheDirectoryName];
    BOOL isDirectory = YES;
    BOOL folderExists = [[NSFileManager defaultManager] fileExistsAtPath:cacheDirectory isDirectory:&isDirectory] && isDirectory;
    
    if (!folderExists)
    {
        NSError *error = nil;
        [[NSFileManager defaultManager] createDirectoryAtPath:cacheDirectory withIntermediateDirectories:YES attributes:nil error:&error];
    }
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(saveCache)
                                                 name:UIApplicationDidReceiveMemoryWarningNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(saveCache)
                                                 name:UIApplicationDidEnterBackgroundNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(saveCache)
                                                 name:UIApplicationWillTerminateNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(getCachedArchive)
                                                 name:UIApplicationWillEnterForegroundNotification
                                               object:nil];
}

-(void) emptyCache {
    NSLog(@"emptyCache");
}


- (id)initWithHGameKey:(NSString *)gameKey
             secretKey:(NSString *)secretKey
                 build:(NSString *)build
{
    self = [super init];
    if (self) {
        _host = @"http://api.gameanalytics.com";
        _apiVersion = @"1";
        _gameKey = gameKey;
        _secretKey = secretKey;
        _build = build;
        
        _userID = [self getUserID];
        _sessionID = [self getGUID];
        [self commonInit];
    }
    return self;
}

- (void)commonInit
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(reachabilityChanged:)
                                                 name:kGAReachabilityChangedNotification
                                               object:nil];
    
    self.reachability = [GAReachability reachabilityWithHostname:@"api.gameanalytics.com"];
    [self.reachability startNotifier];
    [self useCache];
    
    [self logUserDataWithParams:@{
                                  @"platform": @"iOS",
                                    @"device": [UIDevice currentDevice].model,
                                  @"os_major": [[UIDevice currentDevice].systemVersion componentsSeparatedByString:@"."][0],
                                  @"os_minor": [UIDevice currentDevice].systemVersion,
                                    @"ios_id": self.userID,
                               @"sdk_version":@"GA iOS SDK 0.3"
                                  }];
    
}

#pragma mark - Public Instance Methods

-(void)logUserDataWithParams:(NSDictionary *)params
{
    if([GASettings isDebugLogEnabled])
        NSLog(@"logUserDataWithParams called");
    
    NSDictionary *mParams = [self mutableDictionaryFromRequiredFieldsWithEventID:nil params:params];
    if(!mParams) return;
    
    NSURLRequest *urlRequest = [self urlRequestForCategory:GACategoryUser
                                                withParams:mParams];
    
    GARequest *request = [[GARequest alloc] initWithURLRequest:urlRequest];
    [self enqueueOperation:request];
}

-(void)logGameDesignDataEvent:(NSString *)eventID
                   withParams:(NSDictionary *)params
{
    if([GASettings isDebugLogEnabled])
        NSLog(@"logGameDesignDataEvent called");
    NSDictionary *mParams = [self mutableDictionaryFromRequiredFieldsWithEventID:eventID params:params];
    if(!mParams) return;
    
    NSURLRequest *urlRequest = [self urlRequestForCategory:GACategoryDesign
                                                withParams:mParams];
    
    GARequest *request = [[GARequest alloc] initWithURLRequest:urlRequest];
    [self enqueueOperation:request];
}


-(void)logBusinessDataEvent:(NSString *)eventID
             currencyString:(NSString *)currency
               amountNumber:(NSNumber *)amount
                 withParams:(NSDictionary *)params
{
    if([GASettings isDebugLogEnabled])
        NSLog(@"logBusinessDataEvent called");

    NSDictionary *paramsDict = [self mutableDictionaryFromRequiredFieldsWithEventID:eventID
                                                                             params:params];
    if(!paramsDict) return;
    
    //backward compatibility code start
    if(!currency)
    {
        if(![params objectForKey:@"currency"])
        {
            if([GASettings isDebugLogEnabled])
                NSLog(@"currency is required");
            return;
        } else {
            currency = [params objectForKey:@"currency"];
        }
    }
    
    if(!amount)
    {
        if(![params objectForKey:@"amount"])
        {
            if([GASettings isDebugLogEnabled])
                NSLog(@"amount is required");
            return;
        } else {
            amount = [params objectForKey:@"amount"];
        }
    }
    //backward compatibility code end
    
    NSMutableDictionary *mParams = [NSMutableDictionary dictionaryWithDictionary:paramsDict];
    
    [mParams setObject:currency forKey:@"currency"];
    [mParams setObject:amount forKey:@"amount"];
    
    NSURLRequest *urlRequest = [self urlRequestForCategory:GACategoryBusiness
                                                withParams:mParams];
    
    GARequest *request = [[GARequest alloc] initWithURLRequest:urlRequest];
    [self enqueueOperation:request];
}

-(void)logQualityAssuranceDataEvent:(NSString *)eventID
                         withParams:(NSDictionary *)params
{
    if([GASettings isDebugLogEnabled])
        NSLog(@"logQualityAssuranceDataEvent called");
    NSDictionary *mParams = [self mutableDictionaryFromRequiredFieldsWithEventID:eventID
                                                                          params:params];
    if(!mParams) return;
    
    NSURLRequest *urlRequest = [self urlRequestForCategory:GACategoryQuality
                                                withParams:mParams];
    
    GARequest *request = [[GARequest alloc] initWithURLRequest:urlRequest];
    [self enqueueOperation:request];
}

-(void)updateSessionID
{
    self.sessionID = [self getGUID];
}

#pragma mark -

+(void)addRequestToInProgressMutableSet:(GARequest *)request
{
    dispatch_sync(inProgressRequestsMutableSetAccessQueue, ^{
        [inProgressRequestsMutableSet addObject:request];
    });
}

+(void)removeRequestFromInProgressMutableSet:(GARequest *)request
{
    dispatch_sync(inProgressRequestsMutableSetAccessQueue, ^{
        if ([inProgressRequestsMutableSet containsObject:request])
        {
            [inProgressRequestsMutableSet removeObject:request];
        }
    });
}

-(void)addRequestToOfflineArchiveMutableSet:(GARequest *)request
{
    [offlineArchive addObject:request];
    if([GASettings isDebugLogEnabled])
        NSLog(@"request was added to offline/Batch archive set");
}

-(void)removeRequestFromOfflineArchiveMutableSet:(GARequest *)request
{
    if ([offlineArchive containsObject:request])
    {
        [offlineArchive removeObject:request];
    }
}

#pragma mark - Private Methods

-(NSString *)getUserID
{
    NSString *userID = [GASettings getCustomUserID];
    if(userID)
    {
        return userID;
    } else {
        if (!NSClassFromString(@"ASIdentifierManager"))
        {
            return [GAOpenUDID value];//use OpenUDID before iOS6
            
        } else { //iOS6+
            
            if([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled])
            {
                return [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
            } else {
                return [GAOpenUDID value];
            }
        }
    }
    
    return nil;
}

-(void) enqueueOperation:(GARequest*) request
{
    if([GASettings isBatchRequestsEnabled])
    {
        [self addRequestToOfflineArchiveMutableSet:request];
    } else {
        if([self isReachable])
        {
            //Check if using romaming
            if([self.reachability currentReachabilityStatus] == ReachableViaWWAN && ![GASettings canSubmitWhileRoaming])
            {
                //Add request to offline archive if submit while roaming is disabled
                [self addRequestToOfflineArchiveMutableSet:request];
            } else {
                [request start];
                [GAEngine addRequestToInProgressMutableSet:request];
            }
        } else if([GASettings isArchiveDataEnabled]) {
            [self addRequestToOfflineArchiveMutableSet:request];
        }
    }
}

-(NSString *)stringForCategory:(GACategory)category
{
    NSString *categoryString;
    
    switch (category) {
        case GACategoryDesign:
            categoryString = @"design";
            break;
        case GACategoryQuality:
            categoryString = @"quality";
            break;
        case GACategoryBusiness:
            categoryString = @"business";
            break;
        case GACategoryUser:
            categoryString = @"user";
            break;
    }
    
    return categoryString;
}


-(NSDictionary *) mutableDictionaryFromRequiredFieldsWithEventID:(NSString *)eventID
                                                          params:(NSDictionary *)params
{
    
    /*
     Make sure userID is not nil. Try to get the value if it is.
     
     Could be nil if the app is running in the background, before the user has unlocked the device
     the first time after the device has been restarted. If the value is nil, wait and get the value again later.
     */
    if(!self.userID)
    {
        _userID = [self getUserID];
        if(!self.userID) return nil;
    }
    
    NSMutableDictionary *mutableParams;
    if(params)
    {
        mutableParams= [params mutableCopy];
    } else {
        mutableParams = [[NSMutableDictionary alloc] init];
    }
    
    if(eventID)
    {
        [mutableParams setObject:eventID forKey:@"event_id"];
    }
    
    //required params:
    [mutableParams setObject:self.userID forKey:@"user_id"];
    [mutableParams setObject:self.sessionID forKey:@"session_id"];
    [mutableParams setObject:self.build forKey:@"build"];
    
    return [mutableParams copy];
}

-(NSURLRequest *)urlRequestForCategory:(GACategory)category
                            withParams:(NSDictionary *)params
{
    NSMutableURLRequest *mutableRequest;
    NSString *urlString = [NSString stringWithFormat:@"%@/%@/%@/%@", self.host, self.apiVersion, self.gameKey, [self stringForCategory:category]];
    
    //NSLog(@"urlString: %@", urlString);
    
    mutableRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]
                                             cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                         timeoutInterval:30];//30sec. timeout
    
    [mutableRequest setHTTPMethod:@"POST"];
    
    NSError *jsonError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params
                                                       options:kNilOptions
                                                         error:&jsonError];
    if(jsonError) {
        NSLog(@"JSON error: %@", jsonError.localizedDescription);
    }
    
    NSString* jsonDataString = [[NSString alloc] initWithData:jsonData encoding:NSASCIIStringEncoding];
    jsonDataString = [NSString stringWithFormat:@"[%@]", jsonDataString];
    
    NSString *authorizationHeader = [[NSString stringWithFormat:@"%@%@", jsonDataString, self.secretKey] md5];
    
    [mutableRequest setValue:authorizationHeader forHTTPHeaderField:@"Authorization"];
    
    [mutableRequest setHTTPBody:[jsonDataString dataUsingEncoding:NSUTF8StringEncoding]];
    
    return [mutableRequest copy];
}

-(NSDictionary *)userDataDictWithGender:(NSString *)gender
                              birthYear:(NSNumber *)birthYear
                            friendCount:(NSNumber *)friendCount
                               platform:(NSString *)platform
                                 device:(NSString *)device
                                osMajor:(NSString *)osMajor
                                osMinor:(NSString *)osMinor
                             sdkVersion:(NSString *)sdkVersion
                       installPublisher:(NSString *)installPublisher
                            installSite:(NSString *)installSite
                        installCampaign:(NSString *)installCampaign
                         installAdgroup:(NSString *)installAdgroup
                              installAd:(NSString *)installAd
                         installKeyword:(NSString *)installKeyword
                                  iosID:(NSString *)iosID
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    if (gender) {
        params[@"gender"] = gender;
    }
    if (birthYear) {
        params[@"birth_year"] = birthYear;
    }
    if (friendCount) {
        params[@"friend_count"] = friendCount;
    }
    if (platform) {
        params[@"platform"] = platform;
    }
    if (device) {
        params[@"device"] = device;
    }
    if (osMajor) {
        params[@"os_major"] = osMajor;
    }
    if (osMinor) {
        params[@"os_minor"] = osMinor;
    }
    if (sdkVersion) {
        params[@"sdk_version"] = sdkVersion;
    }
    if (installPublisher) {
        params[@"install_publisher"] = installPublisher;
    }
    if (installSite) {
        params[@"install_site"] = installSite;
    }
    if (installCampaign) {
        params[@"install_campaign"] = installCampaign;
    }
    if (installAdgroup) {
        params[@"install_adgroup"] = installAdgroup;
    }
    if (installAd) {
        params[@"install_ad"] = installAd;
    }
    if (installKeyword) {
        params[@"install_keyword"] = installKeyword;
    }
    if (iosID) {
        params[@"ios_id"] = iosID;
    }
    
    return [params copy];
}

-(NSDictionary *)gameDesignDataDictWithValue:(NSNumber *)value
                                        area:(NSString *)area
                                           x:(NSNumber *)x
                                           y:(NSNumber *)y
                                           z:(NSNumber *)z
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    if (value) {
        params[@"value"] = value;
    }
    if (area) {
        params[@"area"] = area;
    }
    if (x) {
        params[@"x"] = x;
    }
    if (y) {
        params[@"y"] = y;
    }
    if (z) {
        params[@"z"] = z;
    }

    return [params copy];
}

-(NSDictionary *)businessDataDictWithArea:(NSString *)area
                                        x:(NSNumber *)x
                                        y:(NSNumber *)y
                                        z:(NSNumber *)z
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    if (area) {
        params[@"area"] = area;
    }
    if (x) {
        params[@"x"] = x;
    }
    if (y) {
        params[@"y"] = y;
    }
    if (z) {
        params[@"z"] = z;
    }
    return [params copy];
}

-(NSDictionary *)qADataDictWithMessage:(NSString *)message
                                  area:(NSString *)area
                                     x:(NSNumber *)x
                                     y:(NSNumber *)y
                                     z:(NSNumber *)z
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    if (message) {
        params[@"message"] = message;
    }
    if (area) {
        params[@"area"] = area;
    }
    if (x) {
        params[@"x"] = x;
    }
    if (y) {
        params[@"y"] = y;
    }
    if (z) {
        params[@"z"] = z;
    }
    return [params copy];
}


/*
 https://developer.apple.com/library/mac/#documentation/CoreFoundation/Reference/CFUUIDRef/Reference/reference.html
 */
-(NSString *)getGUID
{
    CFUUIDRef newUniqueId = CFUUIDCreate(kCFAllocatorDefault);
    NSString * uuidString = (__bridge_transfer NSString*)CFUUIDCreateString(kCFAllocatorDefault, newUniqueId);
    CFRelease(newUniqueId);
    
    return uuidString;
}

#pragma mark -

#pragma mark Reachability related

-(void) reachabilityChanged:(NSNotification*) notification
{
    if([self.reachability currentReachabilityStatus] == ReachableViaWiFi)
    {
        if([GASettings isDebugLogEnabled])
            NSLog(@"reachabilityChanged: Server api.gameanalytics.com is reachable via Wifi");
        if(![GASettings isBatchRequestsEnabled])//don't send single requests if Batch Requests is enabled
        {
            [self checkAndRestoreFrozenOperations];
        }
    }
    else if([self.reachability currentReachabilityStatus] == ReachableViaWWAN)
    {
        if([GASettings isDebugLogEnabled])
            NSLog(@"reachabilityChanged: Server api.gameanalytics.com is reachable only via cellular data");

        if(![GASettings isBatchRequestsEnabled])//don't send single requests if Batch Requests is enabled
        {
            [self checkAndRestoreFrozenOperations];
        }
    }
    else if([self.reachability currentReachabilityStatus] == NotReachable)
    {
        if([GASettings isDebugLogEnabled])
            NSLog(@"reachabilityChanged: Server api.gameanalytics.com is not reachable");
        [self freezeOperations];
    }
}

-(BOOL) isReachable
{
    
    return ([self.reachability currentReachabilityStatus] != NotReachable);
}

#pragma mark Memory Mangement

-(void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:kGAReachabilityChangedNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIApplicationDidReceiveMemoryWarningNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIApplicationDidEnterBackgroundNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIApplicationWillTerminateNotification
                                                  object:nil];
}

+(void) dealloc
{
    dispatch_release(inProgressRequestsMutableSetAccessQueue);
}

#pragma mark GARequestDelegate

- (void) removeFromInProgressQueue:(GARequest *)request
{
    [GAEngine removeRequestFromInProgressMutableSet:request];
}

@end