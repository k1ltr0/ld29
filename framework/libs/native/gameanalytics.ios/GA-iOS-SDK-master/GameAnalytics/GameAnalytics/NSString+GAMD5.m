//
//  NSString+md5.m
//  GameAnalytics
//
//  Created by Aleksandras Smirnovas on 2/2/13.
//  Copyright (c) iOSDeveloperTips.com. All rights reserved.
//

#import "NSString+GAMD5.h"
#import <CommonCrypto/CommonDigest.h>

@implementation NSString (GAMD5)

- (NSString *) md5
{
	// Create pointer to the string as UTF8
    const char *ptr = [self UTF8String];
    
 	// Create byte array of unsigned chars
    unsigned char md5Buffer[CC_MD5_DIGEST_LENGTH];
    
	// Create 16 bytes MD5 hash value, store in buffer
    CC_MD5(ptr, strlen(ptr), md5Buffer);
    
	// Convert unsigned char buffer to NSString of hex values
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
		[output appendFormat:@"%02x",md5Buffer[i]];
    
    return output;
}

@end
