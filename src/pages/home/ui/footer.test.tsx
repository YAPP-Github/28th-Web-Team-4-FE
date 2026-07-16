import { render, screen } from '@testing-library/react';

import { Footer } from './footer';

const FOOTER_PROPS = {
  title: 'Chaeso.zip',
  descriptionLines: [
    '채소집 설명 어쩌고저쩌고 채소집 설명 어쩌고저쩌고',
    '채소집 설명 어쩌고저쩌고',
  ],
} as const;

describe('Footer', () => {
  it('renders the footer landmark and copy', () => {
    render(<Footer {...FOOTER_PROPS} />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(FOOTER_PROPS.title)).toBeInTheDocument();
    for (const descriptionLine of FOOTER_PROPS.descriptionLines) {
      expect(screen.getByText(descriptionLine)).toBeInTheDocument();
    }
  });
});
