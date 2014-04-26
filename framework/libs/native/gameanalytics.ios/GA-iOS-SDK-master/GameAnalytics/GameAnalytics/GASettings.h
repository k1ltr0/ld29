//
//  GASettings.h
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/7/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GASettings : NSObject

+ (NSString *)getCustomUserID;
+ (void)setCustomUserID:(NSString *)udid;

+ (BOOL)isDebugLogEnabled;
+ (void)setDebugLogEnabled:(BOOL)value;

+ (BOOL)isArchiveDataEnabled;
+ (void)setArchiveDataEnabled:(BOOL)value;

+ (NSInteger)getArchiveDataLimit;
+ (void)setArchiveDataLimit:(NSInteger)limit;

+ (BOOL)isBatchRequestsEnabled;
+ (void)setBatchRequestsEnabled:(BOOL)value;


+ (BOOL)canSubmitWhileRoaming;
+ (void)setSubmitWhileRoaming:(BOOL)value;

+ (BOOL)canSubmitSystemInfo;
+ (void)setSubmitSystemInfo:(BOOL)value;

@end
