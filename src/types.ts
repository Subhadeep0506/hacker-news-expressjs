export interface HnItem {
    id: number;
    type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
    by?: string;
    time: number;
    text?: string;
    url?: string;
    title?: string;
    score?: number;
    descendants?: number;
    kids?: number[];
    parent?: number;
    dead?: boolean;
    deleted?: boolean;
}

export interface HnUser {
    id: string;
    created: number;
    karma: number;
    about?: string;
    submitted?: number[];
}
