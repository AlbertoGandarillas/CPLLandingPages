import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from '@/app/chancellor/page';
import { renderWithClient } from '@/utils/test-utils';

describe("Homepage", () => {
  it("renders the homepage", () => {
    renderWithClient(<Homepage />);
    expect(screen.getByText("Potential CPL Savings")).toBeInTheDocument();
  });
});
