//
//  GameAnalytics.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/2/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GameAnalytics.h"
#import "GAEngine.h"
#import "GASettings.h"

@interface GameAnalytics ()

@end

@implementation GameAnalytics

static GAEngine *_gaEngine;

+(GAEngine *)gaEngine
{
    return _gaEngine;
}

+ (void)setGameKey:(NSString *)gameKey
         secretKey:(NSString *)secretKey
             build:(NSString *)build
{
    _gaEngine = [[GAEngine alloc] initWithHGameKey:gameKey
                                         secretKey:secretKey
                                             build:build];
}

+ (void)logUserDataWithParams:(NSDictionary *)params
{
    [self.gaEngine logUserDataWithParams:params];
}

+ (void)logUserDataWithGender:(NSString *)gender
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
    NSDictionary *params = [self.gaEngine userDataDictWithGender:gender
                                                       birthYear:birthYear
                                                     friendCount:friendCount
                                                        platform:platform
                                                          device:device
                                                         osMajor:osMajor
                                                         osMinor:osMinor
                                                      sdkVersion:sdkVersion
                                                installPublisher:installPublisher
                                                     installSite:installSite
                                                 installCampaign:installCampaign
                                                  installAdgroup:installAdgroup
                                                       installAd:installAd
                                                  installKeyword:installKeyword
                                                           iosID:iosID];
    [self.gaEngine logUserDataWithParams:params];
}

+ (void)logUserDataWithGender:(NSString *)gender
                    birthYear:(NSNumber *)birthYear
                  friendCount:(NSNumber *)friendCount
{
    [GameAnalytics logUserDataWithGender:gender
                               birthYear:birthYear
                             friendCount:friendCount
                                platform:nil
                                  device:nil
                                 osMajor:nil
                                 osMinor:nil
                              sdkVersion:nil
                        installPublisher:nil
                             installSite:nil
                         installCampaign:nil
                          installAdgroup:nil
                               installAd:nil
                          installKeyword:nil
                                   iosID:nil];
}

+ (void)logGameDesignDataEvent:(NSString *)eventID
                    withParams:(NSDictionary *)params
{
    [self.gaEngine logGameDesignDataEvent:eventID
                               withParams:params];
}

+ (void)logGameDesignDataEvent:(NSString *)eventID
                         value:(NSNumber *)value
                          area:(NSString *)area
                             x:(NSNumber *)x
                             y:(NSNumber *)y
                             z:(NSNumber *)z
{
    NSDictionary *params = [self.gaEngine gameDesignDataDictWithValue:value
                                                                 area:area
                                                                    x:x
                                                                    y:y
                                                                    z:z];
    [self.gaEngine logGameDesignDataEvent:eventID
                               withParams:params];
}

+ (void)logGameDesignDataEvent:(NSString *)eventID
                         value:(NSNumber *)value
{
    [GameAnalytics logGameDesignDataEvent:eventID
                                    value:value
                                     area:nil
                                        x:nil
                                        y:nil
                                        z:nil];
}

+ (void)logGameDesignDataEvent:(NSString *)eventID
{
    [GameAnalytics logGameDesignDataEvent:eventID
                                    value:nil
                                     area:nil
                                        x:nil
                                        y:nil
                                        z:nil];
}


//DEPRECATED_ATTRIBUTE
+ (void)logBusinessDataEvent:(NSString *)eventID
                  withParams:(NSDictionary *)params
{
    [self.gaEngine logBusinessDataEvent:eventID
                         currencyString:nil
                           amountNumber:nil
                             withParams:params];
}

+ (void)logBusinessDataEvent:(NSString *)eventID
              currencyString:(NSString *)currency
                amountNumber:(NSNumber *)amount
                  withParams:(NSDictionary *)params
{
    [self.gaEngine logBusinessDataEvent:eventID
                         currencyString:currency
                           amountNumber:amount
                             withParams:params];
}

+ (void)logBusinessDataEvent:(NSString *)eventID
              currencyString:(NSString *)currency
                amountNumber:(NSNumber *)amount
                        area:(NSString *)area
                           x:(NSNumber *)x
                           y:(NSNumber *)y
                           z:(NSNumber *)z
{
    
    NSDictionary *params = [self.gaEngine businessDataDictWithArea:area
                                                                 x:x
                                                                 y:y
                                                                 z:z];
    [self.gaEngine logBusinessDataEvent:eventID
                         currencyString:currency
                           amountNumber:amount
                             withParams:params];
}

+ (void)logBusinessDataEvent:(NSString *)eventID
              currencyString:(NSString *)currency
                amountNumber:(NSNumber *)amount
{
    [GameAnalytics logBusinessDataEvent:eventID
                         currencyString:currency
                           amountNumber:amount
                                   area:nil
                                      x:nil
                                      y:nil
                                      z:nil];
}

+ (void)logQualityAssuranceDataEvent:(NSString *)eventID
                          withParams:(NSDictionary *)params
{
    [self.gaEngine logQualityAssuranceDataEvent:eventID
                                     withParams:params];
}

+ (void)logQualityAssuranceDataEvent:(NSString *)eventID
                             message:(NSString *)message
                                area:(NSString *)area
                                   x:(NSNumber *)x
                                   y:(NSNumber *)y
                                   z:(NSNumber *)z
{
    NSDictionary *params = [self.gaEngine qADataDictWithMessage:message
                                                           area:area
                                                              x:x
                                                              y:y
                                                              z:z];
    [self.gaEngine logQualityAssuranceDataEvent:eventID
                                     withParams:params];
}

+ (void)logQualityAssuranceDataEvent:(NSString *)eventID
                             message:(NSString *)message
{
    [GameAnalytics logQualityAssuranceDataEvent:eventID
                                        message:message
                                           area:nil
                                              x:nil
                                              y:nil
                                              z:nil];
}

+ (void)updateSessionID
{
    [self.gaEngine updateSessionID];
}


#pragma mark - Custom options

+ (void)setCustomUserID:(NSString *)userID
{
    [GASettings setCustomUserID:userID];
}

+ (NSString *)getUserID
{
    return [self.gaEngine getUserID];
}

+ (void)setDebugLogEnabled:(BOOL)value
{
    [GASettings setDebugLogEnabled:value];
}

+ (void)setArchiveDataEnabled:(BOOL)value
{
    [GASettings setArchiveDataEnabled:value];
}

+ (void)setArchiveDataLimit:(NSInteger)limit
{
    [GASettings setArchiveDataLimit:limit];
}

+ (void)clearEvents
{
    [self.gaEngine clearEvents];
}

+ (void)setBatchRequestsEnabled:(BOOL)value
{
    [GASettings setBatchRequestsEnabled:value];
}

+ (BOOL)sendBatch
{
    return [self.gaEngine sendBatch];
}

+ (void)setSubmitWhileRoaming:(BOOL)value
{
    [GASettings setSubmitWhileRoaming:value];
}

@end
