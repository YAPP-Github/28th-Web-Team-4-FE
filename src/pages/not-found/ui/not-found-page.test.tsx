import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  it('renders a not found message and home link', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('페이지를 찾을 수 없어요')).toBeVisible();
    expect(screen.getByText('주소를 다시 확인해 주세요')).toBeVisible();
    expect(screen.getByRole('button', { name: '홈으로 가기' })).toHaveAttribute('href', '/');
  });
});
