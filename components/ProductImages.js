import styled from "styled-components";
import {useEffect, useState} from "react";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
  `;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;
const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 10px;
  `;
const ImageButton = styled.div`
    border: 2px solid #ccc;
    ${props => props.active ? `
      border-color: #ccc;
    ` : `
      border-color: transparent;
    `}
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
  `;
const BigImageWrapper = styled.div`
  text-align: center;
`;
const PlaceholderWrapper = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InnerPlaceholder = styled.div`
  width: 90%;
  height: 90%;
  border: 1px dashed #d4d4d8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
`;

export default function ProductImages({images = []}) {
  const hasImages = images.length > 0;
  const [activeImage,setActiveImage] = useState(hasImages ? images[0] : null);

  useEffect(() => {
    setActiveImage(hasImages ? images[0] : null);
  }, [hasImages, images]);

  if (!hasImages) {
    return (
      <PlaceholderWrapper>
        <InnerPlaceholder>
          <BookPlaceholderIcon size={64} />
        </InnerPlaceholder>
      </PlaceholderWrapper>
    );
  }

  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrapper>
      <ImageButtons>
        {images.map(image => (
          <ImageButton
            key={image}
            active={image===activeImage}
            onClick={() => setActiveImage(image)}>
            <Image src={image} alt=""/>
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}