//
//  GAIntegrationTests.h
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 25/11/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import <SenTestingKit/SenTestingKit.h>

#define kGameKey    @"__CHANGE_ME__"
#define kSecretKey  @"__CHANGE_ME__"
#define kBuild      @"__CHANGE_ME__"

@interface GAIntegrationTests : SenTestCase


-(NSInteger)responseCodeForRequest:(NSURLRequest *)urlRequest;


@end
