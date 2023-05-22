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
<form onSubmit={handleSearch}>
<input type="text" value={inputValue} onChange={handleInputChange} className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 focus:ring-offset-2px py-2 px-4 block w-full" />
<button type="submit" className="mt-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-md">Search</button>
</form>
);
};

export default SearchBar;