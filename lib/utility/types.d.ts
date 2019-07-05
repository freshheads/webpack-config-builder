export type RecursivePartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer R>
        ? Array<RecursivePartial<R>>
        : RecursivePartial<T[K]>
};
