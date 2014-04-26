//
//  GAViewController.h
//  GA iOS SDK Demo
//
//  Created by Aleksandras Smirnovas on 23/11/13.
//  Copyright (c) 2013 coder.lt. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface GAViewController : UIViewController

@property (nonatomic, weak) IBOutlet UIButton *toggleLogButton;

-(IBAction)logUserData:(id)sender;
-(IBAction)logBusinessData:(id)sender;
-(IBAction)logGameDesingData:(id)sender;
-(IBAction)logQAData:(id)sender;

-(IBAction)toggleDebugLog:(id)sender;

@end
