/**
 * 주문 타입
 */
export enum OrderType {
    RECURRING = "RECURRING",
    ONE_TIME = "ONE_TIME",
    PAYMENT_METHOD = "PAYMENT_METHOD",
    RECURRING_INITIAL = "RECURRING_INITIAL",
    ADD_USAGE = "ADD_USAGE",
    ADDITIONAL = "ADDITIONAL",
    ADD_PAYMENT_METHOD = "ADD_PAYMENT_METHOD"
  }
  
  /**
   * 결제 수단
   */
  export enum PaymentMethod {
    CARD = "CARD",
    VBANK = "VBANK",
    BANK = "BANK",
    BANK_TRANSFER = "BANK_TRANSFER",
    CELLPHONE = "CELLPHONE",
    SIMPLE_PAY = "SIMPLE_PAY",
    CMS = "CMS",
    CARD_BILL = "CARD_BILL",
    CELLPHONE_BILL = "CELLPHONE_BILL",
    CMS_BILL = "CMS_BILL",
    PAYPAL = "PAYPAL"
  }
  
  /**
   * 주문 상세 정보
   */
  export interface ProductOrderdto {
    /**
     * 주문 번호
     */
    orderId: number;
    
    /**
     * 주문 코드
     */
    orderCode: string;
    
    /**
     * 주문 타입
     */
    type: OrderType;
    
    /**
     * 주문 금액
     */
    paidAmount: number;
    
    /**
     * 환불된 금액
     */
    returnedAmount: number;
    
    /**
     * 남은 금액
     */
    leftAmount: number;
    
    /**
     * 할인 금액
     */
    discountedAmount: number;
    
    /**
     * 상품 이름
     */
    productName: string;
    
    /**
     * 결제 시점
     */
    paymentDate?: string;
    
    /**
     * 결제일 지정
     */
    paymentDueDate?: string;
    
    /**
     * 청구서 사용시, 구매 기한 시점
     */
    purchaseDeadline?: string;

    /**
     * 생성된 시점
     */
    createdAt?: string;
    
    /**
     * 수정된 시점
     */
    modifiedAt?: string;
    
    /**
     * 주문 코드
     */
    code: string;
    
    /**
     * 결제 정보 조회용 idKey
     */
    idKey?: string;
    
    /**
     * 합산 시작 시점
     */
    calculateStartDate?: string;
    
    /**
     * 합산 끝 시점
     */
    calculateEndDate?: string;
    
    /**
     * 하위 벤더의 주문
     */
    childOrders?: ProductOrderdto[];
    
    /**
     * 결제 수단
     */
    paymentMethod?: PaymentMethod;
    
    /**
     * 결제 통화
     */
    currency: string;
    
    /**
     * 환율(금액에 곱할 값)
     */
    exchangeRate: number;
    
    /**
     * 주문 생성 당시 기준 통화
     */
    baseCurrency: string;
    
    /**
     * 표시 통화 가격
     */
    totalDisplayAmount?: number;
  }
