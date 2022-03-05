export interface IGrfikon {
  id?: number;
  region?: string | null;
  promet?: number | null;
}

export class Grfikon implements IGrfikon {
  constructor(public id?: number, public region?: string | null, public promet?: number | null) {}
}

export function getGrfikonIdentifier(grfikon: IGrfikon): number | undefined {
  return grfikon.id;
}
