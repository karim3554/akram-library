
import React from 'react';
import { Book } from '../types';
import { getCoverUrl } from '../services/openLibrary';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const author = book.author_name?.[0] || 'Unknown Author';
  
  // Prefer internal cover ID (cover_i), fallback to edition key if available
  const coverUrl = book.cover_i 
    ? getCoverUrl(book.cover_i, 'id', 'M') 
    : (book as any).cover_edition_key 
      ? getCoverUrl((book as any).cover_edition_key, 'olid', 'M')
      : getCoverUrl(undefined);

  // Generate a pseudo-LOA number based on the key for the academic look in the image
  const loaNumber = book.key ? parseInt(book.key.replace(/\D/g, '').slice(-3)) || 101 : 101;

  return (
    <div 
      onClick={() => onClick(book)}
      className="group cursor-pointer flex flex-col h-full bg-white transition-all"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 border border-gray-200 book-spine-effect book-shadow group-hover:shadow-md transition-shadow">
        <img 
          src={coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      
      <div className="mt-4 flex flex-col space-y-0.5">
        <h3 className="font-serif text-[15px] leading-[1.3] font-medium text-gray-900 group-hover:text-indigo-800 transition-colors">
          <span className="font-bold">{author}:</span> {book.title}
        </h3>
        <p className="text-[11px] font-bold text-[#e63946] uppercase tracking-widest mt-1">
          LOA N°{loaNumber}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
