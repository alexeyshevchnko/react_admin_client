interface FilterParams {
  ID?: string;
  NICKNAME?: string;
  [key: string]: any;
}

export function applyStandardFilters(filter: FilterParams = {}) {
  const mongoFilter: any = {};

  if (filter.ID) {
    mongoFilter.ID = isNaN(Number(filter.ID)) ? filter.ID : Number(filter.ID);
  }

  if (filter.NICKNAME) {
    mongoFilter.NICKNAME = { $regex: new RegExp(filter.NICKNAME, 'i') };
  }

  return mongoFilter;
}
