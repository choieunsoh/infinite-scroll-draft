import { useQuery } from '@tanstack/react-query';
import axios, { GenericAbortSignal } from 'axios';

interface IBook {
  id: string;
  volumeInfo: {
    title: string;
  };
}
interface ISearchResponse {
  items: IBook[];
  totalItems: number;
}

export type Book = {
  id: string;
  title: string;
};

async function fetchBooks(q: string, offset: number, signal: GenericAbortSignal): Promise<ReadonlyArray<Book>> {
  if (!q) return [];

  const url = `https://www.googleapis.com/books/v1/volumes`;
  const response = await axios.get<ISearchResponse>(url, {
    params: { q, startIndex: offset, maxResults: 20 },
    signal,
  });
  return response.data.items.map((book: IBook) => ({ id: book.id, title: book.volumeInfo.title }));
}

export default function useBookSearch(query = '', offset = 0) {
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['books', query, offset],
    queryFn: ({ signal }) => fetchBooks(query, offset, signal),
    refetchOnWindowFocus: false,
  });

  return {
    books,
    isLoading,
    isError,
  };
}
