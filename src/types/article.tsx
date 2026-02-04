export interface Article {
    _id: string;
    title: string;
    category: string;
    type: string;
    content?: string;
    description?: string;
    video?: string;
    writer: string;
    createdAt: string;
    updatedAt: string;
}