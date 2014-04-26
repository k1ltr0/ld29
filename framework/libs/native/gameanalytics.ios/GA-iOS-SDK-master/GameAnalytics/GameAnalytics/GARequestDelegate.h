//
//  GARequestDelegate.h
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/12/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import <Foundation/Foundation.h>

@class GARequest;

@protocol GARequestDelegate <NSObject>

- (void) removeFromInProgressQueue:(GARequest *)request;

@end
