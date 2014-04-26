//
//  GAIntegrationTests.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 25/11/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GAIntegrationTests.h"

@implementation GAIntegrationTests

- (void)setUp
{
    [super setUp];
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

#pragma mark - Helper Methods

-(NSInteger)responseCodeForRequest:(NSURLRequest *)urlRequest
{
    NSHTTPURLResponse *returnResponse;
    NSError *connectionError;
    [NSURLConnection sendSynchronousRequest:urlRequest
                          returningResponse:&returnResponse
                                      error:&connectionError];
    
    if (connectionError) {
        NSLog(@"Connection returned error: %@", connectionError);
        return 0;
    }
    
    return returnResponse.statusCode;
    
}

@end
