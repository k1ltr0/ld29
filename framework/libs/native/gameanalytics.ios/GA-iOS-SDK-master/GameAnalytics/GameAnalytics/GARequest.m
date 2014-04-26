//
//  GARequest.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/4/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import "GARequest.h"
#import "GASettings.h"

@interface GARequest ()
{
    NSURLConnection *urlConnection;
}

@property (strong, nonatomic) NSURLRequest *request;
@property (nonatomic, readonly) GARequestStatus state;

-(void)setState:(GARequestStatus)state;

@end

@implementation GARequest

#pragma mark - Public Methods

-(id)initWithURLRequest:(NSURLRequest *)urlRequest
{
    if((self = [super init])) {
        _request = urlRequest;
        _state = GARequestStatusNotStarted;
    }
    return self;
}

-(void)start
{
    if (self.state != GARequestStatusNotStarted && self.state != GARequestStatusCancelled)
    {
        NSLog(@"Attempt to start existing request. Ignoring.");
        return;
    }
    
    urlConnection = [[NSURLConnection alloc] initWithRequest:self.request
                                                    delegate:self
                                            startImmediately:NO];
    
    [urlConnection scheduleInRunLoop:[NSRunLoop mainRunLoop]
                             forMode:NSDefaultRunLoopMode];
    
    [urlConnection start];
    
    [self setState:GARequestStatusStarted];
    
}

-(BOOL)isFinished
{
    if(self.state == GARequestStatusCompleted || self.state == GARequestStatusFailed  || self.state == GARequestStatusCancelled)
    {
        return YES;
    }
    else
    {
        return NO;
    }
}


-(void)cancel
{
    [urlConnection cancel];
    [self setState:GARequestStatusCancelled];
}

-(void)setState:(GARequestStatus)state
{
    [self willChangeValueForKey:@"state"];
    _state = state;
    [self didChangeValueForKey:@"state"];
    
    if (state == GARequestStatusStarted)
    {
        //[self addSelfToActiveRequestsSet];
    }
    else if (state == GARequestStatusCompleted || state == GARequestStatusFailed  || state == GARequestStatusCancelled)
    {   
        if(self.delegate && [self.delegate respondsToSelector:@selector(removeFromInProgressQueue:)])
        {
            [self.delegate removeFromInProgressQueue:self];
        }
        
        urlConnection = nil;
    }
}

#pragma mark - NSCoding

- (id)initWithCoder:(NSCoder *)decoder
{
    NSURLRequest *request = [decoder decodeObjectForKey:@"request"];
    
    self = [self initWithURLRequest:request];
    if (!self) {
        return nil;
    }
    return self;
}

- (void)encodeWithCoder:(NSCoder *)encoder
{
    [encoder encodeObject:self.request forKey:@"request"];
}

#pragma mark - NSCopying

- (id)copyWithZone:(NSZone *)zone
{
    GARequest *object = [(GARequest *)[[self class] allocWithZone:zone] initWithURLRequest:self.request];
    
    return object;
}

-(void) dealloc {
    if(urlConnection)
    {
        [urlConnection cancel];
        urlConnection = nil;
    }
}

#pragma mark -

#pragma mark - NSURLConnectionDelegate

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    
    if([GASettings isDebugLogEnabled])
        NSLog(@"GARequest to %@ failed with error: %@", self.request.URL, error.localizedDescription);
    
    [self setState:GARequestStatusFailed];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
    
    if (httpResponse.statusCode != 202)//Accepted
    {
        if([GASettings isDebugLogEnabled])
            NSLog(@"GARequest finished with repsonse code: %d", httpResponse.statusCode);
        
        [urlConnection cancel];
        [self setState:GARequestStatusFailed];
        
    } else if([GASettings isDebugLogEnabled]) {
        NSLog(@"GARequest finished succesefuly");
    }
}

//No reason to read data
/*
 - (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
 }
 */


- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    
    [self setState:GARequestStatusCompleted];
}

@end