export interface DatasetMetadata {
    dataset_name: string,
    number_of_images: number,
    number_of_categories: number,
    number_of_annotations: number,
    categories: string[]
}

export interface DatasetNames {
    datasets: string[]
}

export interface DatasetIndexes {
    indexes: number[]
}
