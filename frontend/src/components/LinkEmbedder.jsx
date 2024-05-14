import {useState} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LinkEmbedder({ embeddedLinks, setEmbeddedLinks }) {
  const [inputUrl, setInputUrl] = useState('');

  const handleAddEmbeddedLink = (url) => {
    console.log('handleAddEmbeddedLink ---> ', url)
    setInputUrl('')
    setEmbeddedLinks([...embeddedLinks, url]);

  }
  const handleRemoveEmbeddedLink = (url) => {

    setEmbeddedLinks(embeddedLinks.filter((embeddedLink) => embeddedLink !== url))
  }

  const extractedYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const renderContent = (url) => {
    if (url.includes('youtube.com') || url.includes('youtube.be')) {
      const videoId = extractedYouTubeId(url);
      const src = `https://www.youtube.com/embed/${videoId}`;
      return (
        <iframe
          className="w-full aspect-video"
          src={src}
          frameBorder="2"
          allowFullScreen
          title="YouTube Video"
        >
        </iframe>
      )
    } else {
      return (
        <div className="flex ">
          <Button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400" >
              {url}
            </a>
          </Button>
          <Button variant="destructive" onClick={()=> handleRemoveEmbeddedLink(url)}>
            -
          </Button>
        </div>


      )
    }
  }

  return (
    <div className="p-4 mx-auto max-w-lg w-full">
      {embeddedLinks.map((url, index) =>
        <div key={index} className='m-1'>
          {renderContent(url, index)}
        </div>
      )}
      <div className="flex items-center space-x-2 *:">
        <Input
          type="text"
          placeholder="Enter URL here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          />
           <Button onClick={()=> handleAddEmbeddedLink(inputUrl)} className=" bg-blue-500 text-white rounded-md ">
          +
        </Button>
      </div>
    </div>
  )
}

export default LinkEmbedder