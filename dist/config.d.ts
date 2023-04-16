declare const _default: {
    name: string;
    pushTargets: {
        gtm: string;
    };
    eventLabel: string;
    auth: {};
    infos: {
        region: string;
    };
    pages: {
        tag: {
            name: string;
            section: string;
        };
        name: string;
        meta: {};
        id: string;
        event: string;
        type: string;
        dynamicKeys: string[];
        rules: {
            page: {
                pageName: string;
                section: string;
            };
        };
        actions: {
            clicks: {
                tag: {
                    buttonName: string;
                };
                type: string;
                event: string;
                meta: {};
                rules: {
                    button: {
                        buttonName: string;
                    };
                };
                dynamicKeys: string[];
                id: string;
                class: string;
            }[];
            toggle: {
                tag: {};
                event: string;
                id: string;
                class: string;
                type: string;
            }[];
            errors: ({
                tag: {};
                event: string;
                type: string;
                id?: undefined;
                class?: undefined;
            } | {
                tag: {};
                event: string;
                id: string;
                class: string;
                type: string;
            })[];
        };
    }[];
};
export default _default;
