//
//  GameAnalyticsTests.m
//  GameAnalyticsTests
//
//  Created by Aleksandras Smirnovas on 2/2/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GAMD5Tests.h"
#import "NSString+GAMD5.h"

@implementation GAMD5Tests

- (void)setUp
{
    [super setUp];
    
    // Set-up code here.
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

- (void)testMD5
{
    STAssertTrue([[@"test" md5] isEqualToString:@"098f6bcd4621d373cade4e832627b4f6"], @"MD5 enctyption test");
}

@end
