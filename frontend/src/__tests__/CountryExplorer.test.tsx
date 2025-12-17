import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CountryExplorer from '../components/CountryExplorer';
import localCountries from '../../../collections/countries.json';

vi.mock('axios');

vi.mock('../components/FlowingMenu', () => {
  return {
    __esModule: true,
    default: ({ items, onItemClick }: any) => {
      return (
        <div data-testid="flowing-menu">
          {items.map((it: any) => (
            <button key={it.id} data-testid={`item-${it.id}`} onClick={() => onItemClick(it.id)}>
              {it.text}
            </button>
          ))}
        </div>
      );
    },
  };
});

vi.mock('../components/SpotlightCards', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="spotlight-cards">Spotlight</div>,
  };
});

describe('CountryExplorer (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // ensure a clean history state for pushState tests
    window.history.pushState({}, '', '/');
  });

  it('shows loading and then renders countries from API', async () => {
    const apiCountries = [
      { _id: '1', name: 'Aland', imageUrl: '', achievements: [] },
      { _id: '2', name: 'Berea', imageUrl: '', achievements: [] },
    ];
    (axios.get as any).mockResolvedValue({ data: apiCountries });

    render(<CountryExplorer />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('flowing-menu')).toBeInTheDocument();
    expect(screen.getByText('Aland')).toBeInTheDocument();
    expect(screen.getByText('Berea')).toBeInTheDocument();
    expect(screen.getByTestId('spotlight-cards')).toBeInTheDocument();
  });

  it('falls back to bundled localCountries when API fails', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network error'));

    render(<CountryExplorer />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Ensure at least one local country from collections appears
    const local = (localCountries as any[])[0];
    expect(screen.getByText(local.name)).toBeInTheDocument();
  });

  it('navigates when FlowingMenu item clicked', async () => {
    const apiCountries = [
      { _id: 'c1', name: 'Clickland', imageUrl: '', achievements: [] },
    ];
    (axios.get as any).mockResolvedValue({ data: apiCountries });

    render(<CountryExplorer />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const btn = screen.getByTestId('item-c1');
    fireEvent.click(btn);

    // After click, the history URL should change to the country's path
    expect(window.location.pathname).toContain('/countries/c1');
  });
});
