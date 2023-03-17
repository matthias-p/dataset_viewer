export interface DatasetStatistics {
    instances_per_category: {
        key: string,
        value: number
    }[],
    categories_per_image: {
        key: string,
        value: number
    }[],
    instances_per_image: {
        key: string,
        value: number
    }[],
    instance_size: {
        bins: number[],
        values: number[]
    }
}
