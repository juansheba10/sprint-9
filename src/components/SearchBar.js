import React, {useState} from 'react';

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center bg-gray-800 text-white rounded overflow-hidden shadow-lg max-w-md mx-auto">
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="Buscar película..." 
        className="rounded-l pl-4 py-2 w-full text-gray-900" 
      />
      <button 
        type="submit" 
        className="px-5 text-white"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
