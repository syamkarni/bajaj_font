import React, { useState } from 'react';
import axios from 'axios';

function BfhlForm() {
  const [data, setData] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  // Handle input change for the data array
  const handleInputChange = (e) => {
    setData(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);  // Capture the file name
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      setFile(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      data: data.split(',').map(item => item.trim()),
      file_b64: file || '',
      file_name: fileName || ''
    };

    try {
      const res = await axios.post('https://bajajback-pi.vercel.app/bfhl', payload); 
      setResponse(res.data);
      setError('');
    } catch (err) {
      setError('Error submitting the form. Please check your input.');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Data (comma-separated):
          <input type="text" value={data} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Upload a file (optional):
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{color: 'red'}}>{error}</p>}

      {response && (
        <div>
          <h3>Response from Server</h3>
          <p><strong>Numbers:</strong> {response.numbers.join(', ')}</p>
          <p><strong>Alphabets:</strong> {response.alphabets.join(', ')}</p>
          <p><strong>Highest Lowercase Alphabet:</strong> {response.highest_lowercase_alphabet.join(', ')}</p>
          <p><strong>File Valid:</strong> {response.file_valid ? 'Yes' : 'No'}</p>
          {response.file_mime_type && <p><strong>MIME Type:</strong> {response.file_mime_type}</p>}
          {response.file_size_kb && <p><strong>File Size (KB):</strong> {response.file_size_kb}</p>}
        </div>
      )}
    </div>
  );
}

export default BfhlForm;
