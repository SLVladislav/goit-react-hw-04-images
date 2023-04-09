import { useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { Container } from './App.styled';
import { MyGlobalStyles } from 'globalStyles/GlobalStyles.styled';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const [imgTheme, setImgTheme] = useState('');

  const handleFormSubmit = imgTheme => {    
    setImgTheme(imgTheme);
  };

  return (
    <div>
      <Container>
        <MyGlobalStyles />
        <Searchbar onSubmit={handleFormSubmit} />
        <ImageGallery imgTheme={imgTheme} />
        <ToastContainer />
      </Container>
    </div>
  );
}
