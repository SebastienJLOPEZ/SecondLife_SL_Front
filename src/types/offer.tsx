export interface Offer {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    price?: number;
    demand?: string;
    owner: {
        _id: string;
        name: string;
        surname: string;
    };
    buyer?: {
        _id: string;
        name: string;
        surname: string;
    };
    status: string;
    uptadedAt: string;
}

export interface OfferListOption {
    offers: Offer[];
    isPublic: boolean;
    hasBrought?: boolean;
}