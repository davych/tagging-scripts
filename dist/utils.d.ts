export declare const flattenKeys: (obj: Record<string, unknown>, path?: string[]) => Record<string, string>;
export declare const replace: (str: string, obj: any) => string;
export declare const getPictureFromDom: (domTarget: any) => {
    dataset: any;
    classList: any;
    id: any;
};
export declare const getPathname: (locationInstance?: any) => any;
export declare const getAppConfig: () => any;
export declare const setAppConfig: (config: any) => void;
export declare const updateInfos: (infos: any) => void;
export declare const updateAuth: (auth: any) => void;
