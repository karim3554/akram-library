
import { OPEN_LIBRARY_API, OPEN_LIBRARY_COVERS, OPEN_LIBRARY_AUTHORS_IMG } from '../constants';
import { Book, Author, SearchResult } from '../types';

const SEARCH_FIELDS = 'key,title,author_name,author_key,first_publish_year,cover_i,number_of_pages_median,isbn,cover_edition_key';

/**
 * Searches for books using the Open Library Search API.
 */
export const searchBooks = async (
  query: string, 
  page: number = 1, 
  sort: string = '', 
  limit: number = 20
): Promise<SearchResult> => {
  const url = new URL(`${OPEN_LIBRARY_API}/search.json`);
  url.searchParams.append('q', query);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('fields', SEARCH_FIELDS);
  if (sort) {
    url.searchParams.append('sort', sort);
  }

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to search books');
  return response.json();
};

/**
 * Fetches structured data for a work or edition.
 * Example: https://openlibrary.org/works/OL15626917W.json
 */
export const getBookDetails = async (identifier: string): Promise<Book> => {
  const cleanId = identifier.startsWith('/') ? identifier : `/${identifier}`;
  const response = await fetch(`${OPEN_LIBRARY_API}${cleanId}.json`);
  if (!response.ok) throw new Error('Failed to fetch book details');
  return response.json();
};

/**
 * Fetches structured data for an author.
 * Example: https://openlibrary.org/authors/OL33421A.json
 */
export const getAuthorDetails = async (authorId: string): Promise<Author> => {
  // Ensure we use the full /authors/ID path if it's just the OLID
  const path = authorId.includes('/') ? authorId : `/authors/${authorId}`;
  const response = await fetch(`${OPEN_LIBRARY_API}${path}.json`);
  if (!response.ok) throw new Error('Failed to fetch author details');
  return response.json();
};

/**
 * Generates a cover URL based on the Open Library Covers API.
 */
export const getCoverUrl = (
  value?: string | number, 
  key: 'id' | 'isbn' | 'olid' | 'lccn' | 'oclc' = 'id',
  size: 'S' | 'M' | 'L' = 'M'
) => {
  if (!value) return `https://picsum.photos/seed/${Math.random()}/300/450?grayscale&blur=2`;
  return `${OPEN_LIBRARY_COVERS}/${key}/${value}-${size}.jpg`;
};

/**
 * Generates an author photo URL.
 */
export const getAuthorPhotoUrl = (olid?: string, size: 'S' | 'M' | 'L' = 'M') => {
  if (!olid) return 'https://picsum.photos/200/200?text=Author';
  return `${OPEN_LIBRARY_AUTHORS_IMG}/olid/${olid}-${size}.jpg`;
};
