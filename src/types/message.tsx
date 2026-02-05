export interface Negociation {
    _id: string;
    productRef: string | { _id: string; title: string };
    messages: [{
        _id: string;
        sender: {
            _id: string;
            name: string;
            surname: string;
        };
        receiver: {
            _id: string;
            name: string;
            surname: string;
        };
        content: string;
        timestamp: string;
    }]
}
    