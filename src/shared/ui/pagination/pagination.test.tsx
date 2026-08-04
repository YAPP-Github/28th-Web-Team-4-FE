import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders page buttons and marks the current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn<(page: number) => void>()} />,
    );

    expect(screen.getByRole('navigation', { name: '페이지네이션' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '페이지 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '페이지 1' })).not.toHaveAttribute('aria-current');
  });

  it('changes to a selected page and disables controls at the boundaries', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn<(page: number) => void>();

    render(<Pagination currentPage={1} totalPages={3} onPageChange={handlePageChange} />);

    expect(screen.getByRole('button', { name: '첫 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '마지막 페이지' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '페이지 2' }));
    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    await user.click(screen.getByRole('button', { name: '마지막 페이지' }));

    expect(handlePageChange).toHaveBeenNthCalledWith(1, 2);
    expect(handlePageChange).toHaveBeenNthCalledWith(2, 2);
    expect(handlePageChange).toHaveBeenNthCalledWith(3, 3);
  });

  it('supports a custom navigation label', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn<(page: number) => void>()}
        ariaLabel="검색 결과 페이지"
      />,
    );

    expect(screen.getByRole('navigation', { name: '검색 결과 페이지' })).toBeInTheDocument();
  });
});
