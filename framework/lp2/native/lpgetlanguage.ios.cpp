class lpLanguage
{
    public:
    static String lpGetLanguage()
    {
        NSString * language = [[NSLocale preferredLanguages] objectAtIndex:0];
        return String( language );
    }
};

