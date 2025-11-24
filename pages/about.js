import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO 
        title="За нас | Библиотека с. Мосомище"
        description="Библиотека с. Мосомище, община Гоце Делчев, Югозападна България. Безплатни книги за четене - българска и световна литература. Посетете библиотеката!"
        keywords="библиотека Мосомище, Гоце Делчев, безплатни книги, библиотека България, четене книги"
        url="/about"
      />
      <Header />
      <Center>
        <Title>За нас</Title>
        <div style={{maxWidth: '800px', lineHeight: '1.8', fontSize: '1.05rem', color: '#333'}}>
          <h2 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px'}}>Библиотека с. Мосомище</h2>
          <p>
            Библиотека с. Мосомище е местна библиотека в община Гоце Делчев, Югозападна България, 
            която предлага широк асортимент от безплатни книги за четене за всички възрасти.
          </p>
          
          <h2 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px'}}>Нашата мисия</h2>
          <p>
            Нашата цел е да направим четенето достъпно за всички жители на село Мосомище и региона. 
            Вместо да купувате книги от книжарницата, можете да ги четете безплатно от нашата библиотека!
          </p>
          
          <h2 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px'}}>Какво предлагаме</h2>
          <ul style={{paddingLeft: '20px'}}>
            <li>Вземете книга безплатно</li>
            <li>Голяма колекция от българска и световна литература</li>
            <li>Различни жанрове: роман, фантастика, детективски роман, поезия, драма и други</li>
            <li>Книги за всички възрасти</li>
            <li>Онлайн каталог за преглед на наличните книги</li>
          </ul>
          
          <h2 style={{fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px'}}>Контакти</h2>
          <p>
            <strong>Адрес:</strong> с. Мосомище, община Гоце Делчев, България<br/>
            <strong>Телефон:</strong> +359 888 123 456<br/>
            <strong>Email:</strong> info@library-mosomishche.bg
          </p>
          
          <p style={{marginTop: '30px', fontStyle: 'italic', color: '#666'}}>
            Посетете библиотеката и изберете книга за четене! Четенето е безплатно и достъпно за всички!
          </p>
        </div>
      </Center>
      <Footer />
    </>
  );
}


