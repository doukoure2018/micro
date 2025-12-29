export interface AuthorizeSalaireDto {
    id?: number;
    isAuthorized: boolean;
    message: string;
    authorizedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}
