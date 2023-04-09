import { useState, useEffect } from 'react';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { fetchImg } from 'services/Api';
import PropTypes from 'prop-types';
import { ImageGalleryList, ButtonLoadMore } from './ImageGallery.styled';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function ImageGallery({ imgTheme }) {
  // state = {
  //   images: [],
  //   error: null,
  //   status: Status.IDLE,
  //   page: null,
  //   totalHits: null,
  // };

  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [search, setSearch] = useState('');

  // async componentDidUpdate(prevProps, prevState) {
  //   if (
  //     this.state.status === Status.RESOLVED &&
  //     this.state.images.length === this.state.totalHits &&
  //     prevState.images.length !== this.state.totalHits
  //   ) {
  //     toast.warn('Sorry, there are no images matching your search query.');
  //   }
  //   const { imgTheme } = this.props;

  //   if (imgTheme && prevProps.imgTheme !== imgTheme) {
  //     await this.setState({
  //       images: [],
  //       page: 1,
  //     });

  //     await this.loadImg();
  //   }
  // }

  useEffect(() => {
    if (!imgTheme) return;

    setSearch(imgTheme);
    setImages([]);
    setPage(1);
  }, [imgTheme]);

  useEffect(() => {
    if (!search) return;

    async function loadImg() {
      setStatus(Status.PENDING);

      try {
        const { hits, totalHits } = await fetchImg(imgTheme, page);

        const normalizedImages = hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => {
            return {
              id,
              webformatURL,
              largeImageURL,
              tags,
            };
          }
        );

        setImages(prevState => [...prevState, ...normalizedImages]);
        setError('');
        setStatus(Status.RESOLVED);
        setTotalHits(totalHits);
      } catch (error) {
        setError('error');
        setStatus(Status.REJECTED);
      }
    }
    loadImg();
  }, [search, page]);

  useEffect(() => {
    if (
      status === Status.RESOLVED &&
      images.length === totalHits &&
      images.length !== totalHits
    ) {
      toast.warn('Sorry, there are no images matching your search query.');
    }
  }, [images.length, totalHits]);

  return (
    <>
      {images.length > 0 && (
        <ImageGalleryList className="gallery">
          {images.map(({ id, ...restProps }) => {
            return <ImageGalleryItem key={id} image={restProps} />;
          })}
        </ImageGalleryList>
      )}
      {!(images.length >= totalHits) && status === Status.RESOLVED && (
        <ButtonLoadMore
          type="button"
          onClick={() => setPage(prevState => prevState + 1)}
        >
          Load More
        </ButtonLoadMore>
      )}
      {status === Status.PENDING && <Loader />}
      {status === Status.REJECTED && (
        <h2>
          An error occurred, we could not upload the photo, please try reloading
          the page and try again :)
        </h2>
      )}
      {images.length === 0 && status === Status.RESOLVED && (
        <h2>We didn't find anything according to your request</h2>
      )}
    </>
  );
}
ImageGallery.propTypes = {
  imgTheme: PropTypes.string.isRequired,
};
