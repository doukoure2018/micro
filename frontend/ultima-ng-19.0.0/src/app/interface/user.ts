export interface IUser {
    userId: number;
    userUuid: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password?: string | null;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
    imageUrl?: string | null;
    qrCodeImageUri?: string | null;
    qrCodeSecret?: string | null;
    lastLogin?: string | null;
    loginAttempts: number;
    createdAt: string;
    updatedAt: string;
    role: string;
    authorities: string;
    mfa: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
    /** Blocage définitif par l'administrateur (V182). */
    bloque?: boolean;
    bloqueMotif?: string | null;
    agenceId?: number;
    delegationId?: number;
    pointventeId?: number;
    service?: string;
    authorized?: boolean;
}
