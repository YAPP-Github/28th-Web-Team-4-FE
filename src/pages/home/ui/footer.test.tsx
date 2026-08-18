import { render, screen } from '@testing-library/react';

import { Footer } from './footer';

describe('Footer', () => {
  it('renders the footer landmark and copy', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'chaesozip' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 CHAESOZIP. ALL RIGHTS RESERVED')).toBeInTheDocument();
    expect(screen.getByText('이용 약관')).toBeInTheDocument();
    expect(screen.getByText('개인정보 처리방침')).toBeInTheDocument();
    expect(screen.getByText('요금제')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '이메일' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '네이버 블로그' })).toBeInTheDocument();

    expect(screen.queryByText('내게 맞는 광고 채널을 한눈에! 채소집')).not.toBeInTheDocument();
    expect(screen.queryByText('블로그')).not.toBeInTheDocument();
    expect(screen.queryByText('문의 : channelsogae.zip@gmail.com')).not.toBeInTheDocument();
    expect(
      screen.queryByText('2026 Team Chaesozip. All right reservation'),
    ).not.toBeInTheDocument();
  });
});
