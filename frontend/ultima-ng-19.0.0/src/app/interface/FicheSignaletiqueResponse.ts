import { FicheSignaletiqueMetadata, FicheSignaletiqueWithSolde } from './FicheSignaletiqueWithSolde';

export interface FicheSignaletiqueResponse {
    time: number;
    timeStamp: number;
    code: number;
    statusCode: number;
    path: string;
    httpStatus: string;
    status: string;
    message: string;
    data: {
        metadata: FicheSignaletiqueMetadata;
        code: number;
        data: FicheSignaletiqueWithSolde;
        status: string;
    };
}
