import { render, screen } from '@testing-library/react';

import { Footer } from './footer';

describe('Footer', () => {
  it('renders the footer landmark and copy', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'chaesozip' })).toBeInTheDocument();
    expect(screen.getByText('내게 맞는 광고 채널을 한눈에! 채소집')).toBeInTheDocument();
    expect(screen.getByText('이용 약관')).toBeInTheDocument();
    expect(screen.getByText('개인정보 처리 방침')).toBeInTheDocument();
    expect(screen.getByText('블로그')).toBeInTheDocument();
    expect(screen.getByText('요금제')).toBeInTheDocument();
    expect(screen.getByText('문의 : channelsogae.zip@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('2026 Team Chaesozip. All right reservation')).toBeInTheDocument();
  });
});
