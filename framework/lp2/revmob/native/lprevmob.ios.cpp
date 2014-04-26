

// .h
class lpRevmobBase;

#import <RevMobAds/RevMobAds.h>

// .cpp
class lpRevmobBase: public Object
{
	private:
		RevMobAds *revMob;
		RevMobFullscreen *fullscreen;
		RevMobAdLink *link;
	public:
		void Init(String app_id);
		void CreateAdLink();
		void LinkOpen();
		void CreateFullScreen();
		void ShowFullScreen();
        void SetTestingMode(bool f, int with_ads);	
};

void lpRevmobBase::Init(String app_id)
{
    revMob = [RevMobAds startSessionWithAppID:app_id.ToNSString()];
}

void lpRevmobBase::CreateAdLink()
{}

void lpRevmobBase::LinkOpen()
{
    [revMob openAdLinkWithDelegate:nil];
}

void lpRevmobBase::CreateFullScreen()
{}

void lpRevmobBase::ShowFullScreen()
{
    fullscreen = [revMob fullscreen];
    [fullscreen loadWithSuccessHandler:^(RevMobFullscreen *fs) {
        [fs showAd];
    } andLoadFailHandler:^(RevMobFullscreen *fs, NSError *error) {
    } onClickHandler:^{
    } onCloseHandler:^{
    }];
}

void lpRevmobBase::SetTestingMode(bool f, int with_ads)
{
    if (f)
    {
        if (with_ads == 0)
        {
            [revMob setTestingMode:RevMobAdsTestingModeWithAds];
        }
        else if (with_ads == 1)
        {
            [revMob setTestingMode:RevMobAdsTestingModeWithoutAds];
        }
    }
    else
    {
        [revMob setTestingMode:RevMobAdsTestingModeOff];
    }
}

