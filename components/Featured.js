import Center from "@/components/Center";
import styled from "styled-components";
import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";

const Bg = styled.div`
  background-color: #222;
  color:#fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size:1.5rem;
  @media screen and (min-width: 768px) {
    font-size:3rem;
  }
`;
const Desc = styled.p`
  color:#aaa;
  font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap:10px;
  margin-top:25px;
`;

export default function Featured({product}) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink href={'/product/'+product._id} outline={1} white={1}>Прочети повече</ButtonLink>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            {product.images?.[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.title}
                width={400}
                height={200}
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                loading="lazy"
                unoptimized={product.images[0]?.includes('s3.amazonaws.com')}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
              }}>
                <span style={{color: '#999'}}>Няма снимка</span>
              </div>
            )}
          </Column>
        </ColumnsWrapper>
      </Center>

    </Bg>
  );
}