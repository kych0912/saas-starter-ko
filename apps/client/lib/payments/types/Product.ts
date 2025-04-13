// 상품 타입 열거형
export enum ProductType {
    BOX = "BOX",
    SOFTWARE = "SOFTWARE",
    BUNDLE = "BUNDLE",
    INVOICE = "INVOICE",
    DRAFT = "DRAFT"
  }
  
  // 상품 상태 열거형
  export enum ProductStatus {
    SALE = "SALE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    UNSOLD = "UNSOLD",
    WAITING_APPROVAL = "WAITING_APPROVAL",
    REJECTED = "REJECTED"
  }
  
  // 체험 기간 단위 열거형
  export enum DemoPeriodUnit {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
  }
  
  // 옵션 조합 상태 열거형
  export enum OptionCombinationStatus {
    SALE = "SALE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    HIDDEN = "HIDDEN"
  }
  
  // 가격 플랜 타입 열거형
  export enum PriceType {
    ONE_TIME = "ONE_TIME",
    FLAT = "FLAT",
    UNIT_BASED = "UNIT_BASED",
    USAGE_BASED = "USAGE_BASED",
    VOLUME_BASED = "VOLUME_BASED",
    BUNDLE = "BUNDLE"
  }
  
  // 청구 방식 타입 열거형
  export enum ClaimMethodType {
    PRE = "PRE",
    POST = "POST"
  }
  
  // 청구 시점 타입 열거형
  export enum WhenToClaimType {
    FIRST_PAYMENT = "FIRST_PAYMENT",
    DATE = "DATE"
  }
  
  // 추가 과금 타입 열거형
  export enum AdditionalBillingType {
    USAGE_BASED_WITH_RANGE = "USAGE_BASED_WITH_RANGE",
    USAGE_BASED_WITH_RANGE_AND_FIXED_PRICE = "USAGE_BASED_WITH_RANGE_AND_FIXED_PRICE"
  }
  
  // 주기 단위 열거형
  export enum IntervalUnit {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
  }
  
  // 지역 코드 열거형
  export enum RegionCode {
    AD = "AD",
    AE = "AE",
    AF = "AF",
    // ... (긴 열거형은 생략)
    ZA = "ZA",
    ZM = "ZM",
    ZW = "ZW"
  }
  
  // 번들 상품 정보 인터페이스
  export interface BundleProductDTO {
    /** 상품 코드 */
    code?: string;
    /** 상품 타입 */
    type?: ProductType;
    /** 상품 상태 */
    status?: ProductStatus;
    /** 상품 이름 */
    name?: string;
    /** 상품 설명 */
    description?: string;
    /** 상품 옵션 목록 */
    options?: ProductOptionGroupDTO[];
    /** 상품 가격플랜 목록 */
    prices?: ProductPricedto[];
    /** 생성된 시점 */
    createdAt?: string;
    /** 수정된 시점 */
    modifiedAt?: string;
  }
  
  // 상품 옵션 인터페이스
  export interface ProductOptionDTO {
    /** 옵션 번호 */
    id: number;
    /** 옵션 이름 */
    name: string;
    /** 수량 */
    quantity?: number;
    /** 가격 */
    price: number;
    parent?: number;
  }
  
  // 상품 옵션 그룹 인터페이스
  export interface ProductOptionGroupDTO {
    /** 옵션 그룹 번호 */
    id: number;
    /** 옵션 그룹 이름 */
    name: string;
    options: ProductOptionDTO[];
    depth?: number;
  }
  
  // 가격 주기 인터페이스
  export interface PriceRecurringDTO {
    /** 주기 정보 번호 */
    id: number;
    /** 주기 */
    intervalCount: number;
    /** @deprecated */
    aggregateUsageType?: "SUM" | "LAST_DURING_PERIOD" | "LAST_EVER" | "MAX";
    /** 주기 단위 */
    interval?: IntervalUnit;
    /** @deprecated */
    usageType?: "LICENSED" | "METERED";
  }
  
  // 추가 과금 범위 인터페이스
  export interface PriceAdditionalBillingRangeDTO {
    /** 추가 과금 범위 번호 */
    id: number;
    /** 범위가 어디까지인지 */
    until: number;
    /** 범위에 적용되는 금액 */
    price: number;
  }
  
  // 추가 과금 인터페이스
  export interface PriceAdditionalBillingDTO {
    /** 추가 과금 번호 */
    id: number;
    /** 추가 과금 타입 */
    type: AdditionalBillingType;
    /** 추가 과금 범위 정보 */
    ranges: PriceAdditionalBillingRangeDTO[];
  }
  
  // 기본료 인터페이스
  export interface PriceSetupOptionDTO {
    /** 기본료 번호 */
    id: number;
    /** 기본료 이름 */
    name?: string;
    /** 기본료 타입 */
    type?: "INITIALLY" | "PERIODIC";
    /** 기본료 금액 */
    price: number;
    /** 통화별 기본료 금액 */
    currencyPrice: Record<string, number>;
    /** 기본료가 선불인지 후불인지 여부 */
    claimMethodType: ClaimMethodType;
  }
  
  // 가격 플랜 옵션 인터페이스
  export interface PriceOptionDTO {
    /** 옵션 번호 */
    id: number;
    /** 옵션 이름 */
    name?: string;
    /** 연관 상품 코드 */
    productCode?: string;
    /** 옵션 타입 */
    type?: "INITIALLY" | "PERIODIC";
    /** 가격 */
    price: number;
    /** 연관 가격플랜 코드 */
    priceCode?: string;
    /** 연관 가격플랜 이름 */
    priceName?: string;
    /** 연관 상품 타입 */
    productType?: ProductType;
    recurringDTO?: PriceRecurringDTO;
  }
  
  // 가격 볼륨 인터페이스
  /** @deprecated */
  export interface PriceVolumeDTO {
    id: number;
    min: number;
    max: number;
    price: number;
  }
  
  // 가격 플랜 인터페이스
  export interface Plan {
    /** 플랜 이름 */
    name: string;
    /** 플랜 설명 */
    description: string;
    /** 자세히 보기 */
    detailDescription?: string;
    /** 플랜 사용 여부 (기본값: false) */
    isHiddenFromShop?: boolean;
    /** 어드민 플랜 이름 */
    adminName?: string;
  }
  
  // 첫 구매 할인 인터페이스
  export interface FirstSaleDTO {
    enabled?: boolean;
    price?: number;
    currencyPrice?: Record<string, number>;
  }
  
  // 청구 방식 인터페이스
  export interface Claim {
    /** 선불인지 후불인지 여부 (기본값: PRE) */
    methodType?: ClaimMethodType;
    /** 후불인 경우, 언제 결제되는지 (기본값: FIRST_PAYMENT) */
    whenToClaimType?: WhenToClaimType;
    /** 후불일 때 결제되는 날짜를 지정한 경우, 지정된 날짜 (기본값: 1) */
    billingDate?: number;
    /** 서비스 제공기간 시작일 */
    provideStartDay?: number;
  }
  
  // 옵션 조합 인터페이스
  export interface OptionCombinationDTO {
    id: number[];
    quantity?: number;
    price?: number;
    status: OptionCombinationStatus;
  }
  
  // 카테고리 인터페이스
  export interface ProductCategoryDTO {
    categoryId: number;
    name: string;
  }
  
  // 이벤트 뱃지 인터페이스
  export interface ProductEventBadge {
    event: string;
    /** 시작 시점 */
    startDateTime?: string;
    /** 끝 시점 */
    endDateTime?: string;
  }
  
  // 상품 위젯 사용 여부 인터페이스
  export interface ProductWidgetDTO {
    useDemo?: boolean;
    useEventBadge?: boolean;
    useOnetimePurchasable?: boolean;
    useNotice?: boolean;
  }
  
  // 국가 설정 정보 인터페이스
  export interface CountrySettingDTO {
    id: number;
    countryCode: string;
    timezoneName: string;
    currencyCode: string;
    isDefault: boolean;
    taxRate: number;
  }
  
  // 번들 플랜 상품 구성 인터페이스
  export interface PriceBundleDTO {
    product: ProductProductDTO;
    price: ProductPricedto;
  }
  
  // 가격 플랜 정보 인터페이스
  export interface ProductPricedto {
    /** 가격 플랜 아이디 */
    id: number;
    /** 가격 플랜 코드 */
    code: string;
    /** 가격 */
    price: number;
    /** 통화별 가격 */
    currencyPrice: Record<string, number>;
    /** 단위 */
    unit?: string;
    /** 플랜명 @deprecated */
    planName?: string;
    /** 플랜 설명 @deprecated */
    planDescription?: string;
    /** 플랜 타입 */
    type: PriceType;
    /** 첫 구매 할인 적용 여부 @deprecated */
    enabledFirstSalePrice: boolean;
    /** 첫 구매 할인시 적용되는 할인 금액 @deprecated */
    firstSalePrice: number;
    /** 선불인지 후불인지 여부 */
    claimMethodType?: ClaimMethodType;
    /** 후불인 경우, 언제 결제되는지 */
    whenToClaimType?: WhenToClaimType;
    /** 후불일 때 결제되는 날짜를 지정한 경우, 지정된 날짜 */
    billingDate: number;
    /** 최대 구매가능 수량 */
    maximumPurchaseQuantity: number;
    /** 구독 만기 기간 */
    membershipExpirationDate: number;
    /** 구독 만기 기간 단위 */
    membershipExpirationDateType?: DemoPeriodUnit;
    setupOption?: PriceSetupOptionDTO;
    /** 옵션 정보 */
    options: PriceOptionDTO[];
    /** @deprecated */
    volumes: PriceVolumeDTO[];
    additionalBilling?: PriceAdditionalBillingDTO;
    recurring?: PriceRecurringDTO;
    /** 생성된 시점 */
    createdAt?: string;
    /** 수정된 시점 */
    modifiedAt?: string;
    plan?: Plan;
    firstSale?: FirstSaleDTO;
    claim?: Claim;
    /** 기본 제공량 - 계정/사용량 기반 요금 사용시 */
    basicServing: number;
    /** 번들 플랜 - 번들 상품 구성 */
    bundlePrices: PriceBundleDTO[];
    /** 번들 플랜 - 단건 상품 금액 */
    onetimeBundlePrice: number;
    /** 통화별 번들 플랜 - 단건 상품 금액 */
    currencyOnetimeBundlePrice: Record<string, number>;
    /** 우선 순위 */
    order: number;
  }
  
  // 상품 상세 정보 인터페이스
  export interface ProductProductDTO {
    /** 상품 아이디 */
    id: number;
    /** 상품 코드 */
    code: string;
    /** 상품 타입 */
    type?: ProductType;
    /** 상품 상태 */
    status: ProductStatus;
    /** 상품 이름 */
    name?: string;
    /** 부제목 */
    subTitle?: string;
    /** 상품 대표 이미지 URL */
    featuredImageUrl?: string;
    /** 상품 이미지 URL */
    imageUrls?: string[];
    /** 상품 설명 */
    description?: string;
    /** 상품 요약 */
    summary?: string;
    /** 상품 승인 거절 사유 */
    reasonOfReject?: string;
    /** SKU */
    sku?: string;
    /** 재고 수량 */
    quantity?: number;
    /** 번들 상품 정보 */
    combinedProducts: BundleProductDTO[];
    /** 옵션 그룹 정보 */
    optionGroups: ProductOptionGroupDTO[];
    /** 조합형 옵션 사용 여부 */
    useCombination: boolean;
    /** 옵션 조합 */
    optionCombinations: OptionCombinationDTO[];
    /** 가격 플랜 목록 */
    prices: ProductPricedto[];
    /** 생성 시점 */
    createdAt: string;
    /** 수정 시점 */
    modifiedAt?: string;
    /** 체험기간 활성화 여부 */
    enabledDemo: boolean;
    /** 체험 기간 */
    demoPeriod: number;
    /** 체험 기간 단위 */
    demoPeriodUnit: DemoPeriodUnit;
    /** 카테고리 */
    categories: ProductCategoryDTO[];
    /** 가맹점 UUID */
    vendorUuid: string;
    /** 순서 */
    productOrder: number;
    /** 활성 구독 제한 */
    isOnetimePurchasable: boolean;
    /** 이벤트 뱃지 */
    eventBadge: ProductEventBadge[];
    /** 유의 사항 */
    notice?: string;
    useWidget?: ProductWidgetDTO;
    /** 그룹 ID */
    groupId?: number;
    countrySetting?: CountrySettingDTO;
    /** 판매 가능 국가(region) */
    availableRegions?: RegionCode[];
    /** 공유 벤더 목록 */
    shared?: string[];
  }