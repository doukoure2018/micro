export interface AgentDisponibilityDto {
    userId: number;
    pointVenteId: number;
    isActive: boolean;
    currentPs?: number;
    rotationDate?: string;
    message?: string;
}
