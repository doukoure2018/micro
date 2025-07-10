import { CautionData } from './caution.data';
import { ChargeData } from './charge.data';
import { CreditDataResponse } from './credit.data.response';
import { ProduitData } from './produit.data';

export interface CreditDataDetailedResponse {
    creditData?: CreditDataResponse;
    produits?: ProduitData[];
    charges?: ChargeData[];
    cautions?: CautionData[];
}
