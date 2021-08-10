class Collector {
  fun(params: { name: string; counts: number }): number
  fun(params: { name: string }): string
  fun(params: any): any {
    if (params.counts) {
      return params.counts
    } else {
      return params.name
    }
  }
}

const result = new Collector().fun({ name: 'tom'})