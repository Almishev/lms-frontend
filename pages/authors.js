import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AuthorCard = styled(Link)`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const BookPreview = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  img {
    width: 48px;
    height: 68px;
    object-fit: cover;
    border-radius: 6px;
    background: #f3f3f3;
    border: 1px solid #e5e7eb;
  }
  span {
    font-size: 0.9rem;
    color: #555;
  }
`;
const PreviewPlaceholder = styled.div`
  width: 48px;
  height: 68px;
  border-radius: 10px;
  border: 1px dashed #d4d4d8;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthorName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #111;
`;

const BookCount = styled.span`
  display: inline-block;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
`;

export default function AuthorsPage({authors, page, totalPages, totalCount}) {
  return (
    <>
      <Header />
      <Center>
        <Title>Автори</Title>
        <p style={{color:'#6b7280', marginTop:'-8px'}}>Общо автори: {totalCount}</p>
        {authors.length === 0 ? (
          <div>Все още няма добавени автори.</div>
        ) : (
          <>
            <AuthorsGrid>
              {authors.map(author => (
                <AuthorCard key={author.name} href={`/author/${encodeURIComponent(author.name)}`}>
                  <AuthorName>{author.name}</AuthorName>
                  <BookCount>{author.count} {author.count === 1 ? 'книга' : 'книги'}</BookCount>
                  {author.sample && (
                    <BookPreview>
                      {author.sample.image ? (
                        <img src={author.sample.image} alt={author.sample.title} />
                      ) : (
                        <PreviewPlaceholder>
                          <BookPlaceholderIcon size={36} />
                        </PreviewPlaceholder>
                      )}
                      <span>{author.sample.title}</span>
                    </BookPreview>
                  )}
                </AuthorCard>
              ))}
            </AuthorsGrid>
            <Pagination page={page} totalPages={totalPages} basePath="/authors" />
          </>
        )}
      </Center>
      <Footer />
    </>
  );
}

const PAGE_SIZE = 20;

export async function getServerSideProps({query}) {
  try {
    await mongooseConnect();
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    const countResult = await Product.aggregate([
      {
        $match: {
          author: {$exists: true, $ne: null, $ne: ""},
        }
      },
      {
        $addFields: {
          authorTrimmed: {$trim: {input: "$author"}}
        }
      },
      {$match: {authorTrimmed: {$ne: ""}}},
      {
        $group: {_id: "$authorTrimmed"}
      },
      {$count: "total"}
    ]);
    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = totalCount === 0 ? 1 : Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const authorsAgg = await Product.aggregate([
      {
        $match: {
          author: {$exists: true, $ne: null, $ne: ""},
        }
      },
      {
        $addFields: {
          authorTrimmed: {$trim: {input: "$author"}}
        }
      },
      {$match: {authorTrimmed: {$ne: ""}}},
      {$sort: {_id: -1}},
      {
        $group: {
          _id: "$authorTrimmed",
          count: {$sum: 1},
          sample: {
            $first: {
              title: "$title",
              image: {$arrayElemAt: ["$images", 0]}
            }
          }
        }
      },
      {$sort: {_id: 1}},
      {$skip: skip},
      {$limit: PAGE_SIZE},
    ]);

    const authors = authorsAgg.map(item => ({
      name: item._id,
      count: item.count,
      sample: item.sample || null,
    }));

    return {
      props: {
        authors: JSON.parse(JSON.stringify(authors)),
        page: currentPage,
        totalPages,
        totalCount,
      }
    };
  } catch (error) {
    console.error('Error fetching authors:', error);
    return {
      props: {
        authors: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
      }
    };
  }
}

