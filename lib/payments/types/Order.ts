// OrderV1DTO 및 관련 인터페이스

// 주문 타입 열거형
export enum OrderType {
    RECURRING = 'RECURRING',
    ONE_TIME = 'ONE_TIME',
    PAYMENT_METHOD = 'PAYMENT_METHOD',
    RECURRING_INITIAL = 'RECURRING_INITIAL',
    ADD_USAGE = 'ADD_USAGE',
    ADDITIONAL = 'ADDITIONAL',
    ADD_PAYMENT_METHOD = 'ADD_PAYMENT_METHOD'
  }
  
  // 주문 항목 타입 열거형
  export enum OrderItemType {
    SKU = 'SKU',
    TAX = 'TAX',
    SHIPPING = 'SHIPPING',
    DISCOUNT = 'DISCOUNT',
    OFFLINE = 'OFFLINE',
    FEE = 'FEE',
    ADDS = 'ADDS',
    INSTANT = 'INSTANT',
    USAGE = 'USAGE'
  }
  
  // 주문 항목 상태 열거형
  export enum OrderItemStatus {
    CREATED = 'CREATED',
    DEPOSIT_WAITING = 'DEPOSIT_WAITING',
    CANCELLED = 'CANCELLED',
    PAID = 'PAID',
    CANCELLATION_REQUEST = 'CANCELLATION_REQUEST',
    CANCELLATION_REQUEST_CANCELLED = 'CANCELLATION_REQUEST_CANCELLED',
    CANCELLATION_REQUEST_DENIED = 'CANCELLATION_REQUEST_DENIED',
    CANCELLATION_REFUNDING = 'CANCELLATION_REFUNDING',
    CANCELLATION_REFUNDED = 'CANCELLATION_REFUNDED',
    CANCELLATION_REFUNDED_PARTIALLY = 'CANCELLATION_REFUNDED_PARTIALLY',
    ORDER_DELIVERY_PREPARING = 'ORDER_DELIVERY_PREPARING',
    ORDER_DELIVERY_SUSPENDED = 'ORDER_DELIVERY_SUSPENDED',
    ORDER_DELIVERY_ON_THE_WAY = 'ORDER_DELIVERY_ON_THE_WAY',
    ORDER_DELIVERY_COMPLETED = 'ORDER_DELIVERY_COMPLETED',
    EXCHANGE_REQUEST = 'EXCHANGE_REQUEST',
    EXCHANGE_REQUEST_CANCELLED = 'EXCHANGE_REQUEST_CANCELLED',
    EXCHANGE_REQUEST_REJECTED = 'EXCHANGE_REQUEST_REJECTED',
    EXCHANGE_COLLECTION_PREPARING = 'EXCHANGE_COLLECTION_PREPARING',
    EXCHANGE_COLLECTION_ON_THE_WAY = 'EXCHANGE_COLLECTION_ON_THE_WAY',
    EXCHANGE_COLLECTION_COMPLETED = 'EXCHANGE_COLLECTION_COMPLETED',
    EXCHANGE_DELIVERY_PREPARING = 'EXCHANGE_DELIVERY_PREPARING',
    EXCHANGE_DELIVERY_ON_THE_WAY = 'EXCHANGE_DELIVERY_ON_THE_WAY',
    EXCHANGE_DELIVERY_COMPLETED = 'EXCHANGE_DELIVERY_COMPLETED',
    EXCHANGE_REJECT_DELIVERY_PREPARING = 'EXCHANGE_REJECT_DELIVERY_PREPARING',
    EXCHANGE_REJECT_DELIVERY_ON_THE_WAY = 'EXCHANGE_REJECT_DELIVERY_ON_THE_WAY',
    EXCHANGE_REJECT_DELIVERY_COMPLETED = 'EXCHANGE_REJECT_DELIVERY_COMPLETED',
    EXCHANGE_PENDING = 'EXCHANGE_PENDING',
    EXCHANGE_REJECTED = 'EXCHANGE_REJECTED',
    RETURN_REQUEST = 'RETURN_REQUEST',
    RETURN_REQUEST_CANCELLED = 'RETURN_REQUEST_CANCELLED',
    RETURN_REQUEST_REJECTED = 'RETURN_REQUEST_REJECTED',
    RETURN_COLLECTION_PREPARING = 'RETURN_COLLECTION_PREPARING',
    RETURN_COLLECTION_ON_THE_WAY = 'RETURN_COLLECTION_ON_THE_WAY',
    RETURN_COLLECTION_COMPLETED = 'RETURN_COLLECTION_COMPLETED',
    RETURN_REJECT_DELIVERY_PREPARING = 'RETURN_REJECT_DELIVERY_PREPARING',
    RETURN_REJECT_DELIVERY_ON_THE_WAY = 'RETURN_REJECT_DELIVERY_ON_THE_WAY',
    RETURN_REJECT_DELIVERY_COMPLETED = 'RETURN_REJECT_DELIVERY_COMPLETED',
    RETURN_PENDING = 'RETURN_PENDING',
    RETURN_REJECTED = 'RETURN_REJECTED',
    RETURN_REFUNDING = 'RETURN_REFUNDING',
    RETURN_REFUNDED = 'RETURN_REFUNDED',
    RETURN_REFUNDED_PARTIALLY = 'RETURN_REFUNDED_PARTIALLY',
    PAYMENT_FAILURE = 'PAYMENT_FAILURE',
    FINISHED_EXCHANGE_AVAILABLE = 'FINISHED_EXCHANGE_AVAILABLE',
    FINISHED_RETURN_AVAILABLE = 'FINISHED_RETURN_AVAILABLE',
    FINISHED_SUCCESSFULLY = 'FINISHED_SUCCESSFULLY'
  }
  
  // 상품 타입 열거형
  export enum ProductType {
    BOX = 'BOX',
    SOFTWARE = 'SOFTWARE',
    BUNDLE = 'BUNDLE',
    INVOICE = 'INVOICE',
    DRAFT = 'DRAFT'
  }
  
  // 가격 플랜 타입 열거형
  export enum PriceType {
    ONE_TIME = 'ONE_TIME',
    FLAT = 'FLAT',
    UNIT_BASED = 'UNIT_BASED',
    USAGE_BASED = 'USAGE_BASED',
    VOLUME_BASED = 'VOLUME_BASED',
    BUNDLE = 'BUNDLE'
  }
  
  // 청구 방식 타입 열거형
  export enum ClaimMethodType {
    PRE = 'PRE',
    POST = 'POST'
  }
  
  // 주기 단위 열거형
  export enum IntervalUnit {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR'
  }
  
  // 청구 시점 타입 열거형
  export enum WhenToClaimType {
    FIRST_PAYMENT = 'FIRST_PAYMENT',
    DATE = 'DATE'
  }
  
  // 결제 수단 열거형
  export enum PaymentMethod {
    CARD = 'CARD',
    VBANK = 'VBANK',
    BANK = 'BANK',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CELLPHONE = 'CELLPHONE',
    SIMPLE_PAY = 'SIMPLE_PAY',
    CMS = 'CMS',
    CARD_BILL = 'CARD_BILL',
    CELLPHONE_BILL = 'CELLPHONE_BILL',
    CMS_BILL = 'CMS_BILL',
    PAYPAL = 'PAYPAL'
  }
  
  // 결제 게이트웨이 열거형
  export enum PaymentGateway {
    NAVER = 'NAVER',
    DANAL = 'DANAL',
    KAKAO = 'KAKAO',
    KG = 'KG',
    KCP = 'KCP',
    NICE = 'NICE',
    JT = 'JT',
    GOOGLE = 'GOOGLE',
    BANKPAY = 'BANKPAY',
    BLUEWALNUT = 'BLUEWALNUT',
    KSNET = 'KSNET',
    TOSS = 'TOSS',
    EXIMBAY = 'EXIMBAY',
    SETTLE = 'SETTLE',
    DAOUDATA = 'DAOUDATA',
    WELCOME = 'WELCOME',
    NICE_V2 = 'NICE_V2',
    STRIPE = 'STRIPE',
    PAYPLE = 'PAYPLE',
    PAYPLE_GLOBAL = 'PAYPLE_GLOBAL',
    KICC = 'KICC',
    EMPTY = 'EMPTY',
    STEPPAY = 'STEPPAY',
    UNKNOWN = 'UNKNOWN'
  }
  
  // 구독 상태 열거형
  export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    UNPAID = 'UNPAID',
    PENDING_PAUSE = 'PENDING_PAUSE',
    PAUSE = 'PAUSE',
    PENDING_CANCEL = 'PENDING_CANCEL',
    EXPIRED = 'EXPIRED',
    CANCELED = 'CANCELED',
    INCOMPLETE = 'INCOMPLETE',
    QUEUEING = 'QUEUEING'
  }
  
  // 상품 상태 열거형
  export enum ProductStatus {
    SALE = 'SALE',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    UNSOLD = 'UNSOLD',
    WAITING_APPROVAL = 'WAITING_APPROVAL',
    REJECTED = 'REJECTED'
  }
  
  // 옵션 조합 상태 열거형
  export enum OptionCombinationStatus {
    SALE = 'SALE',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    HIDDEN = 'HIDDEN'
  }
  
  // CMS 상태 열거형
  export enum NiceCmsStatus {
    ACCOUNT_PENDING = 'ACCOUNT_PENDING',
    ACCOUNT_FAIL = 'ACCOUNT_FAIL',
    ACCOUNT_SUCCESS = 'ACCOUNT_SUCCESS',
    WITHDRAW_PENDING = 'WITHDRAW_PENDING',
    WITHDRAW_FAIL = 'WITHDRAW_FAIL',
    WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS'
  }
  
  // 주문 메모 타입 열거형
  export enum OrderLogType {
    MANAGER = 'MANAGER',
    V1 = 'V1',
    RENEW = 'RENEW',
    CUSTOMER = 'CUSTOMER',
    SYSTEM = 'SYSTEM',
    PUBLIC = 'PUBLIC'
  }
  
  // CS 기록 액터 열거형
  export enum CSItemActor {
    SYSTEM = 'SYSTEM',
    SELLER = 'SELLER',
    BUYER = 'BUYER'
  }
  
  // CS 기록 카테고리 열거형
  export enum CSItemCategory {
    CANCELLATION = 'CANCELLATION',
    EXCHANGE = 'EXCHANGE',
    RETURN = 'RETURN'
  }
  
  // 주문 인터페이스
  export interface OrderV1DTO {
    id: number;
    orderId: number;
    orderCode: string;
    type: OrderType;
    paidAmount: number;
    leftAmount: number;
    returnedAmount: number;
    items?: OrderItemV1DTO[];
    customer?: OrderCustomerV1DTO;
    paymentDate?: string;
    purchaseDeadline?: string;
    shipping?: ShippingV1DTO;
    createdAt?: string;
    modifiedAt?: string;
    payment?: OrderPaymentV1DTO;
    orderLogs: OrderLogV1DTO[];
    code?: string;
    subscriptions: OrderSubscriptionV1DTO[];
    parentSubscription?: OrderSubscriptionV1DTO;
    invoiceId?: number;
    discountedAmount: number;
    productName: string;
    paymentDueDate?: string;
    idKey?: string;
    relatedOrders: RelatedOrderV1[];
    calculateStartDate?: string;
    calculateEndDate?: string;
    childOrders?: OrderV1DTO[];
    exchangeRate: number;
    region: RegionV1DTO;
    currency: string;
    baseCurrency: string;
  }
  
  // 주문 항목 인터페이스
  export interface OrderItemV1DTO {
    id: number;
    code: string;
    paidAmount: number;
    currency: string;
    quantity: number;
    price?: PriceV1DTO;
    product?: ProductV1DTO;
    type?: OrderItemType;
    status: OrderItemStatus;
    featuredImageUrl?: string;
    selectedProductOptionLabel?: string;
    selectedProductOptionIds: number[];
    createdAt: string;
    canceledDateTime?: string;
    orderItemCode: string;
    modifiedAt: string;
    orderedProductType: ProductType;
    orderedProductName: string;
    orderedPlanName: string;
    discountName?: string;
    relatedOrderItemId?: number;
    priceSetupType?: 'INITIALLY' | 'PERIODIC';
    demoCycle?: DemoCycleDTO;
    usedCount?: number;
    usageFormula?: string;
    deliveryCode?: string;
    histories?: CSItemDTO[];
    unitChangeHistory?: OrderItemUnitChangeHistoryV1DTO[];
    unitCount?: number;
    minimumQuantity: number;
    maximumQuantity?: number;
    parentOrderItemCode?: string;
    relatedSubscriptionItemId?: number;
  }
  
  // 가격 플랜 인터페이스
  export interface PriceV1DTO {
    id: number;
    code: string;
    price: number;
    currencyPrice?: Record<string, number>;
    unit?: string;
    planName?: string;
    planDescription?: string;
    type: PriceType;
    enabledFirstSalePrice: boolean;
    firstSalePrice: number;
    claimMethodType?: ClaimMethodType;
    whenToClaimType?: WhenToClaimType;
    billingDate: number;
    maximumPurchaseQuantity: number;
    membershipExpirationDate: number;
    membershipExpirationDateType?: IntervalUnit;
    setupOption?: PriceSetupOptionV1DTO;
    options: PriceOptionV1DTO[];
    volumes: PriceVolumeV1DTO[];
    additionalBilling?: PriceAdditionalBillingV1DTO;
    recurring?: PriceRecurringV1DTO;
    createdAt?: string;
    modifiedAt?: string;
    plan?: PlanV1DTO;
    firstSale?: FirstSaleV1DTO;
    claim?: ClaimV1DTO;
    basicServing: number;
    bundlePrices: PriceBundleV1DTO[];
    onetimeBundlePrice: number;
    order: number;
  }
  
  // 기본료 정보 인터페이스
  export interface PriceSetupOptionV1DTO {
    id?: number;
    name: string;
    type: 'INITIALLY' | 'PERIODIC';
    price?: number;
    currencyPrice?: Record<string, number>;
    claimMethodType?: ClaimMethodType;
  }
  
  // 가격 플랜 옵션 인터페이스
  export interface PriceOptionV1DTO {
    id: number;
    name?: string;
    productCode?: string;
    type?: 'INITIALLY' | 'PERIODIC';
    price: number;
    priceCode?: string;
    priceName?: string;
    productType?: ProductType;
    recurringDTO?: PriceRecurringV1DTO;
  }
  
  // 구독 주기 정보 인터페이스
  export interface PriceRecurringV1DTO {
    id: number;
    intervalCount: number;
    aggregateUsageType?: 'SUM' | 'LAST_DURING_PERIOD' | 'LAST_EVER' | 'MAX';
    interval?: IntervalUnit;
    usageType?: 'LICENSED' | 'METERED';
  }
  
  // 볼륨 가격 인터페이스
  export interface PriceVolumeV1DTO {
    id: number;
    min: number;
    max: number;
    price: number;
  }
  
  // 추가 과금 정보 인터페이스
  export interface PriceAdditionalBillingV1DTO {
    id: number;
    type: 'USAGE_BASED_WITH_RANGE' | 'USAGE_BASED_WITH_RANGE_AND_FIXED_PRICE';
    ranges: PriceAdditionalBillingRangeV1DTO[];
  }
  
  // 추가 과금 범위 정보 인터페이스
  export interface PriceAdditionalBillingRangeV1DTO {
    id: number;
    until: number;
    price: number;
  }
  
  // 가격 플랜 정보 인터페이스
  export interface PlanV1DTO {
    name: string;
    description: string;
    detailDescription?: string;
    isHiddenFromShop: boolean;
    adminName?: string;
  }
  
  // 첫 구매 할인 정보 인터페이스
  export interface FirstSaleV1DTO {
    enabled: boolean;
    price: number;
    currencyPrice: Record<string, number>;
  }
  
  // 청구 방식 정보 인터페이스
  export interface ClaimV1DTO {
    methodType: ClaimMethodType;
    whenToClaimType: WhenToClaimType;
    billingDate: number;
    provideStartDay?: number;
  }
  
  // 번들 플랜 인터페이스
  export interface PriceBundleV1DTO {
    product: ProductV1DTO;
    price: PriceV1DTO;
  }
  
  // 상품 인터페이스
  export interface ProductV1DTO {
    id: number;
    code: string;
    type?: ProductType;
    status: ProductStatus;
    name?: string;
    subTitle?: string;
    featuredImageUrl?: string;
    imageUrls?: string[];
    description?: string;
    summary?: string;
    reasonOfReject?: string;
    sku?: string;
    quantity?: number;
    combinedProducts: BundleProductV1DTO[];
    optionGroups: ProductOptionGroupV1DTO[];
    useCombination: boolean;
    optionCombinations: OptionCombinationV1DTO[];
    prices: PriceV1DTO[];
    createdAt: string;
    modifiedAt?: string;
    enabledDemo: boolean;
    demoPeriod: number;
    demoPeriodUnit: IntervalUnit;
    categories: ProductCategoryV1DTO[];
    vendorUuid: string;
    productOrder: number;
    isOnetimePurchasable: boolean;
    eventBadge: ProductEventBadgeV1DTO[];
    notice?: string;
    useWidget?: ProductWidgetV1DTO;
    groupId?: number;
    countrySetting?: CountrySettingV1DTO;
    availableRegions?: RegionV1DTO[];
  }
  
  // 번들 상품 정보 인터페이스
  export interface BundleProductV1DTO {
    code?: string;
    type?: ProductType;
    status?: ProductStatus;
    name?: string;
    description?: string;
    options?: ProductOptionGroupV1DTO[];
    prices?: PriceV1DTO[];
    createdAt?: string;
    modifiedAt?: string;
  }
  
  // 상품 옵션 그룹 인터페이스
  export interface ProductOptionGroupV1DTO {
    id: number;
    name: string;
    options: ProductOptionV1DTO[];
    depth?: number;
  }
  
  // 옵션 정보 인터페이스
  export interface ProductOptionV1DTO {
    id: number;
    name: string;
    quantity?: number;
    price: number;
    parent?: number;
  }
  
  // 옵션 조합 인터페이스
  export interface OptionCombinationV1DTO {
    id: number[];
    quantity?: number;
    price?: number;
    status: OptionCombinationStatus;
  }
  
  // 카테고리 인터페이스
  export interface ProductCategoryV1DTO {
    categoryId: number;
    name: string;
  }
  
  // 이벤트 뱃지 인터페이스
  export interface ProductEventBadgeV1DTO {
    event: string;
    startDateTime?: string;
    endDateTime?: string;
  }
  
  // 상품 위젯 사용 여부 인터페이스
  export interface ProductWidgetV1DTO {
    useDemo?: boolean;
    useEventBadge?: boolean;
    useOnetimePurchasable?: boolean;
    useNotice?: boolean;
  }
  
  // 국가 설정 정보 인터페이스
  export interface CountrySettingV1DTO {
    id: number;
    countryCode: string;
    timezoneName: string;
    currencyCode: string;
    isDefault: boolean;
    taxRate: number;
  }
  
  // 판매 국가 정보 인터페이스
  export interface RegionV1DTO {
    code: string;
    currency: string;
    country: string;
    countryCode: string;
    state?: string;
    language?: string;
  }
  
  // 무료체험 정보 인터페이스
  export interface DemoCycleDTO {
    num: number;
    type: IntervalUnit;
  }
  
  // CS 기록 인터페이스
  export interface CSItemDTO {
    actor: CSItemActor;
    category: CSItemCategory;
    status: string;
    reason?: string;
    createdAt: string;
  }
  
  // 계정 수 변동 내역 인터페이스
  export interface OrderItemUnitChangeHistoryV1DTO {
    changedCount: number;
    days: number;
  }
  
  // 결제자 정보 인터페이스
  export interface OrderCustomerV1DTO {
    name?: string;
    email?: string;
    phone?: string;
  }
  
  // 배송지 정보 인터페이스
  export interface ShippingV1DTO {
    name: string;
    phone: string;
    postcode: string;
    address1: string;
    address2: string;
    state?: string;
    city?: string;
    countryCode?: string;
  }
  
  // 결제 정보 인터페이스
  export interface OrderPaymentV1DTO {
    paymentMethod?: PaymentMethod;
    paymentDate?: string;
    amount: number;
    discount: number;
    paymentReturn?: Record<string, any>;
    paymentReceiptUrl?: string;
    paymentGateway?: PaymentGateway;
    cardNumber?: string;
    vbankDTO?: VBankV1DTO;
    niceCmsDTO?: NiceCmsV1DTO;
    customerDTO?: OrderCustomerV1DTO;
    errorCode?: string;
    errorMessage?: string;
  }
  
  // 가상 계좌 정보 인터페이스
  export interface VBankV1DTO {
    bankCode?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankDate: string;
  }
  
  // NICE CMS 정보 인터페이스
  export interface NiceCmsV1DTO {
    corporateManager: string;
    companyName: string;
    companyRegistrationNumber?: string;
    bankCode: string;
    bankAccount: string;
    date: string;
    status: NiceCmsStatus;
    errorReturn?: string;
  }
  
  // 주문 메모 인터페이스
  export interface OrderLogV1DTO {
    id: number;
    type: OrderLogType;
    content: string;
    createdAt: string;
  }
  
  // 주문 관련 구독 정보 인터페이스
  export interface OrderSubscriptionV1DTO {
    id: number;
    status: SubscriptionStatus;
    items: SubscriptionItemV1DTO[];
    price: PriceV1DTO;
    startDate?: string;
    lastPaymentDate?: string;
    nextPaymentDate?: string;
    endDate?: string;
    interval: IntervalUnit;
    intervalCount: number;
    trialEndDate?: string;
  }
  
  // 구독 항목 인터페이스
  export interface SubscriptionItemV1DTO {
    id: number;
    code?: string;
    productName: string;
    productType: ProductType;
    isOnetimePurchasable: boolean;
    featuredImageUrl: string;
    selectedProductOptionLabel?: string;
    selectedProductOptionIds: number[];
    selectedProductOptionPrice: number;
    plan: PlanV1DTO;
    price: number;
    quantity: number;
    isAdditional: boolean;
    keepWhenRenew: boolean;
    hasOptions: boolean;
    maximumPurchaseQuantity?: number;
    productCode?: string;
    priceCode?: string;
    type: OrderItemType;
    claimMethodType: ClaimMethodType;
    priceType: PriceType;
    selectedOptions: number[];
    parentSubscriptionItemCode?: string;
  }
  
  // 관련 주문 인터페이스
  export interface RelatedOrderV1 {
    id: number;
    code: string;
    orderType: OrderType;
    productName: string;
    paidAmount: number;
    items: RelatedOrderItemV1[];
    createdAt: string;
  }
  
  // 관련 주문 항목 인터페이스
  export interface RelatedOrderItemV1 {
    orderItemId: number;
    code: string;
    productName: string;
    plan: PlanV1DTO;
    status: OrderItemStatus;
    amount: number;
    priceType: PriceType;
    parentOrderItemCode?: string;
  }