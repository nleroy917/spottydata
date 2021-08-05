/// <reference types="react" />
declare const VALID_LOADING_VALUES: readonly ["lazy", "eager", undefined];
declare type LoadingValue = typeof VALID_LOADING_VALUES[number];
export declare type ImageLoader = (resolverProps: ImageLoaderProps) => string;
export declare type ImageLoaderProps = {
    src: string;
    width: number;
    quality?: number;
};
declare const VALID_LAYOUT_VALUES: readonly ["fill", "fixed", "intrinsic", "responsive", undefined];
declare type LayoutValue = typeof VALID_LAYOUT_VALUES[number];
declare type PlaceholderValue = 'blur' | 'empty';
declare type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>;
interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
}
interface StaticRequire {
    default: StaticImageData;
}
declare type StaticImport = StaticRequire | StaticImageData;
declare type StringImageProps = {
    src: string;
} & ({
    width?: never;
    height?: never;
    layout: 'fill';
} | {
    width: number | string;
    height: number | string;
    layout?: Exclude<LayoutValue, 'fill'>;
}) & ({
    placeholder?: Exclude<PlaceholderValue, 'blur'>;
    blurDataURL?: never;
} | {
    placeholder: 'blur';
    blurDataURL: string;
});
declare type ObjectImageProps = {
    src: StaticImport;
    width?: number | string;
    height?: number | string;
    layout?: LayoutValue;
    placeholder?: PlaceholderValue;
    blurDataURL?: never;
};
export declare type ImageProps = Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading' | 'style'> & {
    loader?: ImageLoader;
    quality?: number | string;
    priority?: boolean;
    loading?: LoadingValue;
    unoptimized?: boolean;
    objectFit?: ImgElementStyle['objectFit'];
    objectPosition?: ImgElementStyle['objectPosition'];
} & (StringImageProps | ObjectImageProps);
export default function Image({ src, sizes, unoptimized, priority, loading, className, quality, width, height, objectFit, objectPosition, loader, placeholder, blurDataURL, ...all }: ImageProps): JSX.Element;
export {};
