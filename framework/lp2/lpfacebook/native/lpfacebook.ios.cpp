


class lpFacebookBase;

#import <FacebookSDK/FacebookSDK.h>

//.cpp

// header
#pragma mark - facebook user implementation

class lpFacebookUser:public Object
{
public:
    NSMutableDictionary *sessionUser;
    NSMutableArray *friendList;
    Array<lpFacebookUser *> fl;  
    void init( NSMutableDictionary *s );
    void initFriends(NSMutableArray *f );
    String Get( String varname );
    void mark(); // some monkey thing
    Array<lpFacebookUser *> GetFriends();
    lpFacebookUser *GetFriendById(String facebook_id);
};

void lpFacebookUser::init(NSMutableDictionary * s)
{
    this->sessionUser = s;
}

String lpFacebookUser::Get(String varname)
{
    //NSLog ( @"varname : %@", varname.ToNSString());
    @try
    {
        if (!this) 
            return String("");

        NSString *data = [this->sessionUser objectForKey:varname.ToNSString()];
        return String(data);
    }
    @catch (NSException *exception) {
        // the varname doesn't exist into user
    }
    
    return String(@"");

}

void lpFacebookUser::mark()
{
    // some monkey thing
    Object::mark();
}

Array<lpFacebookUser *> lpFacebookUser::GetFriends()
{

    fl = fl.Resize([this->friendList count]);
    
    for (int i = 0; i < [this->friendList count]; i++) {
        fl[i] = new lpFacebookUser();
        fl[i]->init([friendList objectAtIndex:i]);
        //NSLog(@"friend list: %@", friendList);
        //NSLog(@"user me : %@", user);
    }
    
    return  fl;
}

lpFacebookUser *lpFacebookUser::GetFriendById(String facebook_id)
{
    lpFacebookUser *user = NULL;
    
    
    for (int i = 0; i < this->fl.Length(); i++)
    {
        lpFacebookUser *for_user = this->fl[i];

        if ([for_user->Get(String(L"id",2)).ToNSString() isEqualToString:facebook_id.ToNSString()]) {
            user = for_user;
        }
    }

    return user;
}

void lpFacebookUser::initFriends(NSMutableArray *f)
{
    this->friendList = f;
    this->fl = Array<lpFacebookUser *>(0);
}

class lpFacebookBase:public Object
{
public:
    lpFacebookUser *user;
    FBSession *s;
    NSMutableDictionary *sessionUser;
    NSMutableArray *listaAmigos;
    String APP_ID;
    void Login( String permissions );
    void Logout();
    void PostFeed( String name, String caption, String description, String link, String picture, String message );
    void mark(); // some monkey thing
    void Init( String appid );
    lpFacebookUser *Me();
    bool IsOpened();
};

// implement
void lpFacebookBase::Login(String permissions)
{
    NSArray *wper = [NSArray arrayWithObjects:@"publish_actions", nil];
    NSArray *rper = [NSArray arrayWithObject:@"email"];
    
    // setting default appid
    [FBSettings setDefaultAppID:this->APP_ID.ToNSString()];
    
    // creating session
    this->s = [[FBSession alloc] init];
    
    // set as default
    [FBSession setActiveSession:this->s];
    
    // add login behavior
    NSMutableSet *set = [NSMutableSet setWithSet:[FBSettings loggingBehavior]];
    [set addObject:FBLoggingBehaviorAccessTokens];
    
    [FBSettings setLoggingBehavior:set];
    
    
    // loggin with callback
    
    NSLog(@"%@", [FBSettings loggingBehavior]);
    
    FBSessionStateHandler handler =^(FBSession *session, FBSessionState status, NSError *error)
    {
        NSLog(@"Facebook session status changed - %d - Error : %@", status, error);

        // detect if faceboko session is opened
        if (status == FBSessionStateOpen)
        {
            
            // detect the current state and permissions are compatibles with publish action
            if ([session state] == FBSessionStateOpen && ![[session permissions] containsObject:@"publish_actions"])
            {
                [session requestNewPublishPermissions:wper
                                      defaultAudience:FBSessionDefaultAudienceEveryone
                                    completionHandler:^(FBSession *session, NSError *error){
                                        // nothing here
                                    }];
            }
            
        
            [[FBRequest requestForMe] startWithCompletionHandler:^(FBRequestConnection *connection,
                                         NSDictionary<FBGraphUser> *user,
                                         NSError *error) {
                //NSLog(@"user me : %@", user);
                
                if (nil != user.id)
                {
                    [this->sessionUser setObject:user.id forKey:@"id"];
                }
                
                if (nil != user.first_name)
                {
                    [this->sessionUser setObject:user.first_name forKey:@"first_name"];
                }
            }];
            
            
            [[FBRequest requestForMyFriends] startWithCompletionHandler:^(FBRequestConnection *connection, id result, NSError *error) {
                NSDictionary *resultDictionary = (NSDictionary *)result;
                
                NSArray *data = [resultDictionary objectForKey:@"data"];
                
                for (NSDictionary *dic in data) {
                    //NSLog(@"ID:- %@",[dic objectForKey:@"first_name"]);
                    //NSLog(@"amigo : %@", dic);
                    [this->listaAmigos addObject:dic];
                }
            }];
        }
    };

    if (![this->s isOpen])
    {
        @try {
            [FBSession openActiveSessionWithReadPermissions:rper
                                               allowLoginUI:YES
                                          completionHandler:handler];
        }
        @catch (NSException *exception) {
            // nothig here
        }
    }
    else
    {
        @try {
            NSLog(@"lp2 : open session");
            [FBSession openActiveSessionWithAllowLoginUI:YES];
        }
        @catch (NSException *exception) {
            // nothig here
        }
    }
}

void lpFacebookBase::Logout()
{
    [[FBSession activeSession] closeAndClearTokenInformation];
    [this->sessionUser removeAllObjects];
}

void lpFacebookBase::PostFeed( String name, String caption, String description, String link, String picture, String message )
{
    if ( nil != [[FBSession activeSession] accessTokenData] )
    {
        NSString *urlString = [NSString stringWithFormat:@"https://graph.facebook.com/me/feed?access_token=%@", [[FBSession activeSession] accessTokenData]];
        NSLog(@"url:%@", urlString);
        
        //NSString *postString = [[NSString alloc] initWithFormat:@"message=%@",caption.ToNSString()];
        NSString *postString = [[NSString alloc] initWithFormat:@"name=%@",name.ToNSString()];
        postString = [postString stringByAppendingFormat:@"&caption=%@", caption.ToNSString()];
        postString = [postString stringByAppendingFormat:@"&description=%@", description.ToNSString()];
        postString = [postString stringByAppendingFormat:@"&link=%@", link.ToNSString()];
        postString = [postString stringByAppendingFormat:@"&picture=%@", picture.ToNSString()];
        postString = [postString stringByAppendingFormat:@"&message=%@", message.ToNSString()];
        // Package the string in an NSData object
        NSData *requestData = [postString dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
        
        NSString *postLength = [NSString stringWithFormat:@"%d", [requestData length]];
        
        // Create the URL request
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL: [NSURL URLWithString:urlString]];  // create the URL request
        [request setHTTPMethod: @"POST"];   // you're sending POST data
        [request setHTTPBody: requestData];  // apply the post data to be sent
        [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
        [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
        
        // Call the URL
        [NSURLConnection sendAsynchronousRequest:request queue:[[NSOperationQueue alloc] init] completionHandler:^(NSURLResponse * response, NSData * data, NSError *error){
            NSLog(@"return: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        }];

    }
}

void lpFacebookBase::mark()
{
    // some monkey thing
    Object::mark();
}


void lpFacebookBase::Init( String appid )
{
    // instantiate friend list
    this->listaAmigos = [[NSMutableArray alloc] init];
    
    // initialize
    this->APP_ID = appid;

    this->sessionUser = [[NSMutableDictionary alloc] init];

    this->user = new lpFacebookUser();
    this->user->init(this->sessionUser);
    this->user->initFriends(this->listaAmigos);
}

lpFacebookUser* lpFacebookBase::Me()
{
    
    BOOL isEmpty = ([this->user->sessionUser count] == 0);
    
    if (this->user != nil && [this->user->friendList count] > 0 && !isEmpty) {
        return this->user;
    } else {
        return nil;
    }
    
}


bool lpFacebookBase::IsOpened()
{
    lpFacebookUser *_usuario = this->Me();
    
    if([[FBSession activeSession] isOpen] && [FBSession activeSession] != nil && _usuario != nil){
        return YES;
    } else {
        return NO;
    }

}


