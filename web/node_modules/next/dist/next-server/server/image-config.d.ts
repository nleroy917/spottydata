export declare const VALID_LOADERS: readonly ["default", "imgix", "cloudinary", "akamai"];
export declare type LoaderValue = typeof VALID_LOADERS[number];
export declare type ImageConfig = {
    deviceSizes: number[];
    imageSizes: number[];
    loader: LoaderValue;
    path: string;
    domains?: string[];
    disableStaticImages: boolean;
};
export declare const imageConfigDefault: ImageConfig;
