export interface Dataset {
    dataset: string,
    annotations: AnnotationFile[]
}

export interface AnnotationFile {
    name: string,
    categories: string[]
}

export interface DatasetIds {
    ids: string[]
}

export interface DatasetImage {
    _id: string,
    height: number,
    width: number
}

export interface DatasetAnnotation {
    source: string,
    annotations: Annotation[]
}

interface Annotation {
    category: string,
    xtl: number,
    ytl: number,
    width: number,
    height: number,
    area: number,
    segmentation: [],
    iscrowd: number
}
