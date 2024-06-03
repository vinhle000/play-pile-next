import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


function LinkEmbedder({ links , updateGame }) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputUrlError, setInputError] = useState('')
  const [embeddedLinks, setEmbeddedLinks] = useState(links);
  const [linkToRemove, setLinkToRemove] = useState('');

  // FIXME: Currently moving the state down to child component, separation of concerns

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
      setLinkToRemove(''); //Make sure to reset the linkToRemove state when adding a new link
      updateGame({embeddedLinks: [...embeddedLinks, url]});
      setEmbeddedLinks([...embeddedLinks, url]);
      setInputError('');
    } else {
      setInputError('Please enter a valid URL')
    }
  };

  const handleRemoveEmbeddedLink = (url) => {
    updateGame({embeddedLinks: embeddedLinks.filter((embeddedLink) => embeddedLink !== url)});
    setEmbeddedLinks(embeddedLinks.filter((embeddedLink) => embeddedLink !== url));
  };

  const extractedYouTubeId = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };



  const renderContent = (url, index) => {
    return (

      <div key={index} className="flex items-center  mb-4">
      {(url.includes('youtube.com') || url.includes('youtu.be')) ? (

        <div key={index} className="aspect-w-16 aspect-h-9">
            <iframe
              className="flex-grow rounded-lg"
              src={`https://www.youtube.com/embed/${extractedYouTubeId(url)}`}
              frameBorder="0"
              allowFullScreen
              title="YouTube Video"
              ></iframe>
          </div>
        )   :  (
        <Button className="flex-grow bg-transparent max-w-xs justify-start space-x-2 mr-3 rounded-md shadow-sm hover:bg-gray-100">
          <img src={`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`} alt="Favicon" className="w-4 h-4 -ml-1" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-600 truncate overflow-hidden whitespace-nowrap"
              >
              {url}
            </a>
          </Button>
        )}
        <div className="ml-2">
          {linkToRemove === url ? (
            <div className="flex gap-1">
                 <Button className="bg-gray-300 hover:bg-gray-400 text-white rounded-md text-xs" onClick={() => setLinkToRemove('')}>
                X
              </Button>
              <Button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs" onClick={() => handleRemoveEmbeddedLink(url)}>
                Remove
              </Button>

            </div>
          ) : (
            <div className="flex ">
            <Button className="bg-gray-300 hover:bg-gray-400 text-white rounded-md" onClick={() => setLinkToRemove(url)}>
              -
            </Button>
          </div>
          )}
          </div>
      </div>
    )
  };


  return (
    <div className="p-1 mx-auto max-w-lg w-full">
      {embeddedLinks && embeddedLinks.map((url, index) => (
        <div key={index}>{renderContent(url, index)}</div>
      ))}
      <div className="flex items-center justify-start gap-2 mr-11">
        <Input
          type="text"
          placeholder="Enter URL here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className={` bg-transparent rounded-md w-full
                    border ${inputUrlError ? 'border-red-500' : 'border-gray-300'} `}
        />
        <Button onClick={() => handleAddEmbeddedLink(inputUrl)} className="ml-1 text-white/90  bg-purple-500/50  hover:bg-purple-500/80  rounded-md">
          +
        </Button>
      </div>
      {inputUrlError && <span className="text-red-500 text-xs ml-3 mt-1">{inputUrlError}</span>}
    </div>
  );
}

export default LinkEmbedder;
