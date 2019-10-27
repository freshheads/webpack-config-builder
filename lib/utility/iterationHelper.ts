type TCallback = (value: any, key: string) => void;

export const iterateObjectValues = <TValue>(
    object: { [key: string]: TValue },
    callback: TCallback
): void => {
    Object.keys(object).forEach(key => callback(object[key], key));
};
