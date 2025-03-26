/**
 * Order item types
 */
enum OrderItemType {
    SKU = 'SKU',         // 재고관리 상품
    TAX = 'TAX',         // 세금
    SHIPPING = 'SHIPPING', // 배송비
    DISCOUNT = 'DISCOUNT', // 할인
    OFFLINE = 'OFFLINE',   // POS 연동
    FEE = 'FEE',         // 기타 요금(도입비, 기본료 등)
    ADDS = 'ADDS'        // 아이템 추가/삭제 시 정산용 추가값
  }
  
  /**
   * Claim method types
   */
  enum ClaimMethodType {
    PRE = 'PRE',   // 선불
    POST = 'POST'  // 후불
  }
  
  /**
   * Price types
   */
  enum PriceType {
    ONE_TIME = 'ONE_TIME',       // 단건 상품, 1회성 구매
    FLAT = 'FLAT',               // 구독, 정액제 템플릿
    UNIT_BASED = 'UNIT_BASED',   // 건당 과금 템플릿
    USAGE_BASED = 'USAGE_BASED', // 사용량 기반
    BUNDLE = 'BUNDLE'            // 번들 가격 플랜
  }
  
  /**
   * Subscription item interface
   */
export interface SubscriptionItem {
    /** 구독 항목 번호 */
    subscriptionItemId: number;
    
    /** 상품명 */
    productName: string;
    
    /** 이미지 URL (선택적) */
    featuredImageUrl?: string;
    
    /** 선택한 옵션 번호 목록 (선택적) */
    selectedProductOptionIdsList?: number[];
    
    /** 가격 */
    priceDecimal: number;
    
    /** 수량 */
    quantityInt: number;
    
    /** 추가 구매 상품인지 여부 */
    isAdditionalBoolean: boolean;
    
    /** 갱신될 때 유지되는 항목인지 여부 */
    keepWhenRenewBoolean: boolean;
    
    /** 최대 구매 가능 수량 (선택적) */
    maximumPurchaseQuantityInt?: number;
    
    /** 상품 코드 (선택적) */
    productCodeString?: string;
    
    /** 가격 플랜 코드 (선택적) */
    priceCodeString?: string;
    
    /** 항목 유형 */
    typeOrderItemType: OrderItemType;
    
    /** 선불인지 후불인지 정보 (선택적) */
    claimMethodTypeClaimMethodType?: ClaimMethodType;
    
    /** 가격 유형 (선택적) */
    priceTypePriceType?: PriceType;
    
    /** 선택된 옵션 번호 (선택적) */
    selectedOptionsList?: number[];
  }
  