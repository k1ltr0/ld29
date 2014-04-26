#import <StoreKit/StoreKit.h>


class Iap;

// ios code for implementing the skproductrequest delegate and sk paymentTransactions observer

@interface PaymentObserver:NSObject <SKProductsRequestDelegate, SKPaymentTransactionObserver>

-(void)initWithIap:(Iap *) iap;

@end

@implementation PaymentObserver

-(void) initWithIap:(Iap *)iap
{}

#pragma - mark SKProductsRequestDelegate implementation
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSLog(@"estea llelgaaa");
}

#pragma - mark Payment
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
}

@end

// prototyping class
class Iap:
    public Object
{
private:
    
    PaymentObserver *observer;
    
public:
    Iap(); // constructor
    ~Iap(); // destructor
    void RequestProductsList( String productIdentifier );
    void RequestPayment();
};

Iap::Iap()
{
    this->observer = [PaymentObserver alloc];
    [this->observer initWithIap:this];
}

Iap::~Iap()
{
    [this->observer release];
}

void Iap::RequestProductsList( String productIdentifier )
{
    SKProductsRequest *request = [[SKProductsRequest alloc] initWithProductIdentifiers:[NSSet setWithObject:@"com.loadingplay.IapTest.p1"]];
    request.delegate = this->observer;
    
    [request start];
}

void Iap::RequestPayment()
{
}

