import { extractTakeAndSkipFrom } from '@/repositories/utils';

describe('Repositories Utils', () => {
  it('returns default take&skip values', () => {
    const { take, skip } = extractTakeAndSkipFrom();
    expect(take).toBe(5);
    expect(skip).toBe(0);
  });

  it('returns correct take&skip values', () => {
    let values;
    values = extractTakeAndSkipFrom({ page: 1, itemsPerPage: 5 });
    expect(values.take).toBe(5);
    expect(values.skip).toBe(0);

    values = extractTakeAndSkipFrom({ page: 2, itemsPerPage: 10 });
    expect(values.take).toBe(10);
    expect(values.skip).toBe(10);
  });
});
