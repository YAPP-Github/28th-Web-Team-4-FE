import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import { useCompareQueryState } from './use-compare-query-state';

function QueryStateProbe() {
  const { q, category, page, setSearchQuery, setCategories, setPage, resetFilters } =
    useCompareQueryState();

  return (
    <div>
      <output data-testid="query">{q}</output>
      <output data-testid="category">{category.join(',')}</output>
      <output data-testid="page">{page}</output>
      <button type="button" onClick={() => setSearchQuery('새 검색어')}>
        검색 변경
      </button>
      <button type="button" onClick={() => setCategories(['EDUCATION'])}>
        카테고리 변경
      </button>
      <button type="button" onClick={() => setCategories(['GAME', 'EDUCATION'])}>
        여러 카테고리 변경
      </button>
      <button type="button" onClick={() => setPage(3)}>
        페이지 변경
      </button>
      <button type="button" onClick={resetFilters}>
        필터 초기화
      </button>
    </div>
  );
}

function renderQueryStateProbe(
  searchParams: string,
  onUrlUpdate: (event: Parameters<OnUrlUpdateFunction>[0]) => void = () => {},
) {
  return render(<QueryStateProbe />, {
    wrapper: withNuqsTestingAdapter({
      searchParams,
      onUrlUpdate,
    }),
  });
}

describe('useCompareQueryState', () => {
  it('URL의 q, category, page를 읽고 검색 변경 시 page를 1로 초기화한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderQueryStateProbe('?q=기존%20검색어&category=GAME&page=4', onUrlUpdate);

    expect(screen.getByTestId('query')).toHaveTextContent('기존 검색어');
    expect(screen.getByTestId('category')).toHaveTextContent('GAME');
    expect(screen.getByTestId('page')).toHaveTextContent('4');

    await user.click(screen.getByRole('button', { name: '검색 변경' }));

    expect(screen.getByTestId('query')).toHaveTextContent('새 검색어');
    expect(screen.getByTestId('page')).toHaveTextContent('1');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('q')).toBe('새 검색어');
    expect(event?.searchParams.get('category')).toBe('GAME');
    expect(event?.searchParams.has('page')).toBe(false);
    expect(event?.options.history).toBe('replace');
  });

  it('여러 카테고리 변경 시 page를 1로 초기화하고 push history를 사용한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderQueryStateProbe('?q=검색&page=4', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: '여러 카테고리 변경' }));

    expect(screen.getByTestId('category')).toHaveTextContent('GAME,EDUCATION');
    expect(screen.getByTestId('page')).toHaveTextContent('1');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('category')).toBe('GAME,EDUCATION');
    expect(event?.searchParams.get('q')).toBe('검색');
    expect(event?.searchParams.has('page')).toBe(false);
    expect(event?.options.history).toBe('push');
  });

  it('단일 카테고리를 URL 값으로 저장한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderQueryStateProbe('?page=3', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: '카테고리 변경' }));

    expect(screen.getByTestId('category')).toHaveTextContent('EDUCATION');
    expect(screen.getByTestId('page')).toHaveTextContent('1');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('category')).toBe('EDUCATION');
  });

  it('페이지 변경 시 입력한 page를 push history로 저장한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderQueryStateProbe('', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: '페이지 변경' }));

    expect(screen.getByTestId('page')).toHaveTextContent('3');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('page')).toBe('3');
    expect(event?.options.history).toBe('push');
  });

  it('필터 초기화 시 검색어, 카테고리, 페이지를 기본값으로 되돌린다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderQueryStateProbe('?q=검색&category=GAME&page=4', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(screen.getByTestId('query')).toBeEmptyDOMElement();
    expect(screen.getByTestId('category')).toBeEmptyDOMElement();
    expect(screen.getByTestId('page')).toHaveTextContent('1');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.has('q')).toBe(false);
    expect(event?.searchParams.has('category')).toBe(false);
    expect(event?.searchParams.has('page')).toBe(false);
    expect(event?.options.history).toBe('push');
  });
});
