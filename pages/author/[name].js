import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Breadcrumb = styled.div`
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;

const AuthorInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Highlight = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  background-color: #e5edff;
  color: #1d4ed8;
  font-size: 0.9rem;
  align-self: flex-start;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 1.05rem;
`;

export default function AuthorPage({author, books}) {
  if (!author) {
    return (
      <>
        <Header />
        <Center>
          <Title>Авторът не е намерен</Title>
          <p>Страницата не съществува или авторът няма налични книги.</p>
          <Link href="/authors">← Върни се към авторите</Link>
        </Center>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${author} - Книги | Библиотека с. Мосомище`}
        description={`Книги от ${author} в библиотека с. Мосомище. ${books.length} ${books.length === 1 ? 'книга' : 'книги'} безплатно за четене.`}
        keywords={`${author}, книги, библиотека Мосомище, безплатни книги`}
        url={`/author/${encodeURIComponent(author)}`}
        author={author}
      />
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Начало</Link> / <Link href="/authors">Автори</Link> / {author}
        </Breadcrumb>
        <AuthorInfo>
          <Title style={{margin: 0}}>{author}</Title>
          <Highlight>{books.length} {books.length === 1 ? 'книга' : 'книги'}</Highlight>
        </AuthorInfo>
        {books.length === 0 ? (
          <EmptyState>Няма намерени книги от този автор.</EmptyState>
        ) : (
          <ProductsGrid products={books} />
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps({params}) {
  try {
    await mongooseConnect();
    const name = decodeURIComponent(params.name);
    const books = await Product.find({ author: name }).lean();
    return {
      props: {
        author: books.length > 0 ? name : null,
        books: JSON.parse(JSON.stringify(books)),
      }
    };
  } catch (error) {
    console.error('Error fetching author:', error);
    return {
      props: {
        author: null,
        books: [],
      }
    };
  }
}

