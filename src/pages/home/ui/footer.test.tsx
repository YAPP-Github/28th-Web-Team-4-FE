import { render, screen } from '@testing-library/react';

import { Footer } from './footer';

describe('Footer', () => {
  it('renders the footer landmark and copy', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'chaesozip' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 CHAESOZIP. ALL RIGHTS RESERVED')).toBeInTheDocument();
    const termsLink = screen.getByRole('link', { name: '이용 약관' });
    expect(termsLink).toHaveAttribute(
      'href',
      'https://extreme-moonstone-8ae.notion.site/3b2b0b17e916806c92cdec7eac6c0f7c',
    );
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');

    const privacyLink = screen.getByRole('link', { name: '개인정보 처리방침' });
    expect(privacyLink).toHaveAttribute(
      'href',
      'https://extreme-moonstone-8ae.notion.site/3b2b0b17e91680dc9567c8db372aa63d',
    );
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByText('요금제')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '요금제' })).not.toBeInTheDocument();
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
