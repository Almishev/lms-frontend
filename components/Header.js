import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import BarsIcon from "@/components/icons/Bars";

const StyledHeader = styled.header`
  background-color: #222;
  padding: 12px 0;
`;
const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
`;
const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 500;
  
  @media screen and (max-width: 768px) {
    gap: 8px;
    font-size: 14px;
  }
`;

const LogoImage = styled(Image)`
  @media screen and (max-width: 768px) {
    width: 60px !important;
    height: 24px !important;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;
const NavArea = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: flex-end;
  flex-wrap: wrap;
  @media screen and (min-width: 768px) {
    width: auto;
  }
`;
const StyledNav = styled.nav`
  ${props => props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  z-index: 9999; /* над всичко */
  overflow-y: auto;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding:0;
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 360px;
  @media screen and (min-width: 768px) {
    width: 300px;
  }
  input {
    flex: 1;
    border: 1px solid #444;
    border-radius: 20px;
    padding: 8px 16px;
    background: #111;
    color: #eee;
    outline: none;
    ::placeholder {
      color: #777;
    }
  }
  @media screen and (min-width: 768px) {
    margin: 0 0 0 20px;
    input {
      background: #fff;
      color: #111;
      border-color: #ddd;
    }
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border:0;
  color: white;
  cursor: pointer;
  ${props => props.mobileOpen ? `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
  ` : `
    position: relative;
    z-index: 3;
  `}
  @media screen and (min-width: 768px) {
    display: none;
  }
`;


export default function Header() {
  const router = useRouter();
  const [mobileNavActive,setMobileNavActive] = useState(false);
  const [query,setQuery] = useState('');
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('menu-open', mobileNavActive);
    }
  }, [mobileNavActive]);
  return (
    <StyledHeader>
      <HeaderInner>
        <Wrapper>
          <Logo href={'/'}>
            <LogoImage 
              src="/натруфенка.png" 
              alt="Natrufenka" 
              width={100} 
              height={40}
              style={{objectFit: 'contain'}}
            />
            Библиотека с. Мосомище
          </Logo>
          <NavArea>
            <StyledNav className={mobileNavActive ? 'mobile-nav' : ''} mobileNavActive={mobileNavActive}>
              <NavLink href={'/'}>Начало</NavLink>
              <NavLink href={'/products'}>Всички книги</NavLink>
              <NavLink href={'/categories'}>Жанрове</NavLink>
              <NavLink href={'/authors'}>Автори</NavLink>
              <NavLink href={'/account'}>Акаунт</NavLink>
            </StyledNav>
            <SearchForm onSubmit={ev => {
              ev.preventDefault();
              const q = query.trim();
              if (!q) return;
              router.push(`/search?q=${encodeURIComponent(q)}`);
              setMobileNavActive(false);
            }}>
              <input
                type="text"
                placeholder="Търсене"
                value={query}
                onChange={ev => setQuery(ev.target.value)}
              />
            </SearchForm>
          </NavArea>
          <NavButton className="nav-toggle" mobileOpen={mobileNavActive} onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </HeaderInner>
    </StyledHeader>
  );
}