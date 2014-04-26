//
//  GARequestTest.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/2/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GARequestTest.h"
#import "OCMock.h"
#import "GARequest.h"

@interface GARequest (UnitTestAdditions)

-(NSURLConnection *)urlConnectionForURLRequest:(NSURLRequest *)request;
-(id)initWithURLRequest:(NSURLRequest *)urlRequest;

@end

@implementation GARequestTest

-(void)testURLConnectionStart
{
    NSURLRequest *dummyURLRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com"]];
    GARequest *requestUnderTest = [[GARequest alloc] initWithURLRequest:dummyURLRequest];
    
    //create a mock connection
    //"nice" mock so that other methods can be invoked on it, too
    id mockConnection = [OCMockObject niceMockForClass:[NSURLConnection class]];
    //tell it to expect the start method to be called
    [[mockConnection expect] start];
    
    id partialRequestMock = (GARequest *)[OCMockObject partialMockForObject:requestUnderTest];
    [[[partialRequestMock stub] andReturn:mockConnection] urlConnectionForURLRequest:OCMOCK_ANY];
    
    [partialRequestMock start];
    
    [mockConnection verify];
}

@end
