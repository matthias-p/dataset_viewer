export interface DatasetImage {
    _id: number,
    name: string,
    height: number,
    width: number,
    annotations: DatasetAnnotation[]
}

export interface DatasetAnnotation {
    category: string,
    xtl: number,
    ytl: number,
    width: number,
    height: number,
    iscrowd: number,
    segmentation: [],
}
