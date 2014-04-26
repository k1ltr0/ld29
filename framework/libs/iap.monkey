Import "native/iap.${TARGET}.${LANG}"

#If TARGET="ios"

#LIBS+="StoreKit.framework"

#End


Extern

Class Iap
    Method RequestProductsList:Void( productIdentifier:String )
    Method RequestPayment:Void()
End
