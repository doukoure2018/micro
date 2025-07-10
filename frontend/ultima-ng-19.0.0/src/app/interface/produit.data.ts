export interface ProduitData {
    libele?: string;
    prix_unit?: number; // Note: utilise prix_unit (snake_case) comme dans le JSON
    prixUnit?: number; // Alternative en camelCase pour compatibilité
    qte?: number;
    observation?: string;
    created_at?: string;
    createdAt?: string; // Alternative en camelCase
}
