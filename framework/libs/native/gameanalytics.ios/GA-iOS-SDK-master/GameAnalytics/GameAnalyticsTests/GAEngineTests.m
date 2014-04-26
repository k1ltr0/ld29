//
//  GAEngineTests.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 25/11/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GAEngineTests.h"
#import "GAEngine.h"

@implementation GAEngineTests
{
    GAEngine *gaEngine;
}

- (void)setUp
{
    [super setUp];
    gaEngine = [[GAEngine alloc] initWithHGameKey:kGameKey
                                        secretKey:kSecretKey
                                            build:kBuild];
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

-(void)testUserEventGenderField
{
    NSDictionary *params = [gaEngine mutableDictionaryFromRequiredFieldsWithEventID:nil
                                                                             params:@{@"gender": @"M"}];
    NSURLRequest *urlRequest = [gaEngine urlRequestForCategory:GACategoryUser
                                                    withParams:params];
    STAssertEquals(200, [self responseCodeForRequest:urlRequest], @"User Event with Gender field error");
}

-(void)testGameDesignEventIDField
{
    NSDictionary *params = [gaEngine mutableDictionaryFromRequiredFieldsWithEventID:@"SDKTestEvent"
                                                                             params:nil];
    NSURLRequest *urlRequest = [gaEngine urlRequestForCategory:GACategoryUser
                                                    withParams:params];
    STAssertEquals(200, [self responseCodeForRequest:urlRequest], @"Game Design request failed");
}

-(void)testBusinessData
{
    NSDictionary *params = [gaEngine mutableDictionaryFromRequiredFieldsWithEventID:@"SDKTestEvent"
                                                                             params:@{@"currency": @"LTL",
                                                                                      @"amount": @100}];
    NSURLRequest *urlRequest = [gaEngine urlRequestForCategory:GACategoryBusiness
                                                    withParams:params];
    STAssertEquals(200, [self responseCodeForRequest:urlRequest], @"Business Data request failed");
}

-(void)testBusinessDataWithoutCurrencyField
{
    NSDictionary *params = [gaEngine mutableDictionaryFromRequiredFieldsWithEventID:@"SDKTestEvent"
                                                                             params:nil];
    NSURLRequest *urlRequest = [gaEngine urlRequestForCategory:GACategoryBusiness
                                                    withParams:params];
    STAssertEquals(400, [self responseCodeForRequest:urlRequest], @"Game Design request Without required Currency field failed");
}

-(void)testUserDataParams
{
    NSDictionary *params = [gaEngine userDataDictWithGender:@"M"
                                                  birthYear:@1950
                                                friendCount:@1000
                                                   platform:@"iOS"
                                                     device:@"XCodeTestDevice"
                                                    osMajor:@"7"
                                                    osMinor:@"7.0.3"
                                                 sdkVersion:@"0.3"
                                           installPublisher:@"installPublisher"
                                                installSite:@"installSite"
                                            installCampaign:@"installCampaign"
                                             installAdgroup:@"installAdgroup"
                                                  installAd:@"installAd"
                                             installKeyword:@"installKeyword"
                                                      iosID:@"iosID"
                            ];
    
    NSDictionary *mParams = @{@"gender": @"M",
                              @"birth_year": @1950,
                              @"friend_count": @1000,
                              @"platform":@"iOS",
                              @"device": @"XCodeTestDevice",
                              @"os_major":@"7",
                              @"os_minor":@"7.0.3",
                              @"sdk_version":@"0.3",
                              @"install_publisher":@"installPublisher",
                              @"install_site":@"installSite",
                              @"install_campaign":@"installCampaign",
                              @"install_adgroup":@"installAdgroup",
                              @"install_ad":@"installAd",
                              @"install_keyword":@"installKeyword",
                              @"ios_id":@"iosID"
                              };
    
    STAssertEqualObjects(params, mParams, @"userDataDictWithGender returns NSDictionary with wrong keys/values");
}

-(void)testUserDataParamsSmall
{
    NSDictionary *params = [gaEngine userDataDictWithGender:@"M"
                                                  birthYear:@1950
                                                friendCount:@1000
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
                                                      iosID:nil
                            ];
    
    NSDictionary *mParams = @{@"gender": @"M",
                              @"birth_year": @1950,
                              @"friend_count": @1000
                              };
    
    STAssertEqualObjects(params, mParams, @"userDataDictWithGender returns NSDictionary with wrong keys/values");
}

-(void)testGameDesignParams
{
    NSDictionary *params = [gaEngine gameDesignDataDictWithValue:@100
                                                            area:@"Area"
                                                               x:@1
                                                               y:@2
                                                               z:@3
                            ];
    
    NSDictionary *mParams = @{@"value": @100,
                              @"area": @"Area",
                              @"x": @1,
                              @"y": @2,
                              @"z": @3
                              };
    
    STAssertEqualObjects(params, mParams, @"gameDesignDataDictWithValue returns NSDictionary with wrong keys/values");
}

-(void)testGameDesignParamsValue
{
    NSDictionary *params = [gaEngine gameDesignDataDictWithValue:@100
                                                            area:nil
                                                               x:nil
                                                               y:nil
                                                               z:nil
                            ];
    
    NSDictionary *mParams = @{@"value": @100};
    
    STAssertEqualObjects(params, mParams, @"gameDesignDataDictWithValue returns NSDictionary with wrong keys/values");
}

-(void)testBusinessDataParams
{
    NSDictionary *params = [gaEngine businessDataDictWithArea:@"Area"
                                                            x:@1
                                                            y:@2
                                                            z:@3
                            ];
    
    NSDictionary *mParams = @{@"area": @"Area",
                              @"x": @1,
                              @"y": @2,
                              @"z": @3
                              };
    
    STAssertEqualObjects(params, mParams, @"businessDataDictWithArea returns NSDictionary with wrong keys/values");
}

-(void)testQualityAssuranceParams
{
    NSDictionary *params = [gaEngine qADataDictWithMessage:@"Message text"
                                                      area:@"Area"
                                                         x:@1
                                                         y:@2
                                                         z:@3
                            ];
    
    NSDictionary *mParams = @{@"message": @"Message text",
                              @"area": @"Area",
                              @"x": @1,
                              @"y": @2,
                              @"z": @3
                              };
    
    STAssertEqualObjects(params, mParams, @"qADataDictWithMessage returns NSDictionary with wrong keys/values");
}


-(void)testQualityAssuranceParamsMessage
{
    NSDictionary *params = [gaEngine qADataDictWithMessage:@"Message text"
                                                      area:nil
                                                         x:nil
                                                         y:nil
                                                         z:nil
                            ];
    
    NSDictionary *mParams = @{@"message": @"Message text"};
    
    STAssertEqualObjects(params, mParams, @"qADataDictWithMessage returns NSDictionary with wrong keys/values");
}


@end
