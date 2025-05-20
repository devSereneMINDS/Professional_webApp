import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Input } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SearchResult {
  id: string;
  name: string;
  type: 'client' | 'professional';
}

interface SearchResponse {
  clients?: SearchResult[];
  professionals?: SearchResult[];
}

export function SearchInput({ professionalId }: { professionalId: string }): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search results with debouncing
  const fetchSearchResults = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResponse>(
        `${API_BASE_URL}/professionals/search/${query}/${professionalId}`
      );
      
      const results: SearchResult[] = [
        ...(response.data.clients?.map(c => ({ ...c, type: 'client' as const })) || []),
        ...(response.data.professionals?.map(p => ({ ...p, type: 'professional' as const })) || [])
      ];
      
      setSearchResults(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/${result.type}s/${result.id}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };
  

  return (
    <div ref={searchRef} style={{ position: 'relative', width: 300 }}>
      <Input
        size="sm"
        placeholder="Search clients or professionals"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => searchTerm && setShowSuggestions(true)}
        startDecorator={<SearchIcon />}
        endDecorator={isLoading ? <CircularProgress size="sm" /> : null}
        sx={{ width: '100%' }}
      />

      {showSuggestions && searchResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'background.popup',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            borderRadius: 'sm',
            boxShadow: 'md',
            marginTop: 4,
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              style={{
                padding: '8px 12px',
                cursor: 'pointer'
              }}
              onClick={() => handleResultClick(result)}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '')}
            >
              {result.name} ({result.type})
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchResults.length === 0 && searchTerm && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'background.popup',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            borderRadius: 'sm',
            boxShadow: 'md',
            marginTop: 4,
            padding: '8px 12px',
            color: 'text.tertiary'
          }}
        >
          No results found
        </div>
      )}
    </div>
  );
};