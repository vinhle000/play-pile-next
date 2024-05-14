import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


function LinkEmbedder({ embeddedLinks, setEmbeddedLinks }) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputUrlError, setInputError] = useState('')


  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false
    }
  }
  const handleAddEmbeddedLink = (url) => {
    if(isValidUrl(url)) {
      setInputUrl('');
      setEmbeddedLinks([...embeddedLinks, url]);
      setInputError('');
    } else {
      setInputError('Please enter a valid URL')
    }
  };

  const handleRemoveEmbeddedLink = (url) => {
    setEmbeddedLinks(embeddedLinks.filter((embeddedLink) => embeddedLink !== url));
  };

  const extractedYouTubeId = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };



  const renderContent = (url, index) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractedYouTubeId(url);
      const src = `https://www.youtube.com/embed/${videoId}`;
      return (
        <div key={index} className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-full"
            src={src}
            frameBorder="0"
            allowFullScreen
            title="YouTube Video"
          ></iframe>
        </div>
      );
    } else {
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
      return (
        <div key={index} className="flex items-center justify-center shadow-md rounded-lg -space-x-3 p-2">
          <img src={faviconUrl} alt="Favicon" className="w-5 h-5" />
          <Button className="flex-grow bg-transparent max-w-xs">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-600 truncate overflow-hidden whitespace-nowrap"
            >
             {url.split('.com')[1]}
            </a>
          </Button>
          <Button className="bg-gray-300" onClick={() => handleRemoveEmbeddedLink(url)}>
            -
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="p-4 mx-auto max-w-lg w-full">
      {embeddedLinks.map((url, index) => (
        <div key={index}>{renderContent(url, index)}</div>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter URL here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className={`p-2 border ${inputUrlError ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
        />
        <Button onClick={() => handleAddEmbeddedLink(inputUrl)} className="bg-blue-500 text-white rounded-md">
          +
        </Button>
      </div>
    </div>
  );
}

export default LinkEmbedder;
