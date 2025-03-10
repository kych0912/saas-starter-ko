import { Team, User } from '../../db/schema';
import { CheckoutData } from '../types';
import { getPriceById, getProductById, getUser } from '../../db/queries'; // 경로는 실제 프로젝트에 맞게 조정

export async function validateCheckoutData(team: Team, priceId: string): Promise<CheckoutData> {
  try {
    const price = await getPriceById(priceId);
    
    if(!price?.productId){
      throw new Error('product_not_found');
    }
    
    const product = await getProductById(price.productId);
    if(!product) {
      throw new Error('product_not_found');
    }
    
    const user = await getUser();
    if(!user) {
      throw new Error('user_not_found');
    }
    
    return { price, product, user };
  } catch (error) {
    console.error('결제 데이터 검증 실패', { error, team: team.id, priceId });
    throw new Error('validation_failed');
  }
}