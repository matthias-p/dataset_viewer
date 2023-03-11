export interface PlotlyGraph {
    data?: PlotlyData[],
    layout: PlotlyLayout,
    config: PlotlyConfig
}

export interface PlotlyData {
    x: number[],
    y: number[],
    type: string,
    mode: string,
    marker: {
        opacity: number
    },
    name?: string,
    showlegend?: boolean,
    fill?: string,
    hoveron?: string,
    hoverinfo?: string,
}

export interface PlotlyLayout {
    xaxis: {
        visible: boolean, range?: number[]
    },
    yaxis: {
        visible: boolean, range?: number[], scaleanchor: string
    },
    images: {
        x: number,
        sizex?: number,
        y?: number,
        sizey?: number,
        xref: string,
        yref: string,
        opacity: number,
        layer: string,
        sizing: string,
        source?: string
    }[],
    width: number,
    height: number,
    margin: {l: number, r: number, t: number, b: number},
    showlegend: boolean,
    paper_bgcolor: string,
    plot_bgcolor: string,
}

export interface PlotlyConfig {
    doubleClick: string,
    displayModeBar: boolean
}
