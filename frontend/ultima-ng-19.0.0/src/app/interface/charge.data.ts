export interface ChargeData {
    libele?: string;
    prix_unit?: number; // Note: utilise prix_unit (snake_case) comme dans le JSON
    prixUnit?: number; // Alternative en camelCase pour compatibilité
    qte?: number;
    create_at?: string;
    createAt?: string; // Alternative en camelCase
}
