import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

describe('Layout', () => {
  it('should render children', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass('font-sans', 'antialiased');
  });

  it('should render multiple children', () => {
    render(
      <Layout>
        <div>Child 1</div>
        <div>Child 2</div>
      </Layout>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

