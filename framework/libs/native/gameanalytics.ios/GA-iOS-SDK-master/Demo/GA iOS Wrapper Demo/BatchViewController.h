//
//  BatchViewController.h
//  GA iOS Wrapper Demo
//
//  Created by Aleksandras Smirnovas on 3/6/13.
//  Copyright (c) 2013 Aleksandras Smirnovas. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface BatchViewController : UIViewController

@property (nonatomic, weak) IBOutlet UIButton *toggleLogButton;

-(IBAction)logUserData:(id)sender;
-(IBAction)logBusinessData:(id)sender;
-(IBAction)logGameDesingData:(id)sender;
-(IBAction)logQAData:(id)sender;

-(IBAction)toggleDebugLog:(id)sender;

-(IBAction)batchSend:(id)sender;

@end
