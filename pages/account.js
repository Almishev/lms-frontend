import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {useState, useEffect} from "react";
import axios from "axios";
import {useWishlist} from "@/components/WishlistContext";
import ProductBox from "@/components/ProductBox";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: ${props => props.active ? '#000' : '#666'};
  border-bottom-color: ${props => props.active ? '#000' : 'transparent'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    color: #000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
  
  &:hover {
    background-color: #333;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const {wishlistProducts, loading: wishlistLoading} = useWishlist();
  

  useEffect(() => {
    // Зареждаме данните от localStorage или prompt за email
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      fetchUserData(savedEmail);
    } else {
      const userEmail = prompt('Моля, въведете вашия имейл:');
      if (userEmail) {
        setEmail(userEmail);
        localStorage.setItem('userEmail', userEmail);
        fetchUserData(userEmail);
      }
    }
  }, []);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`/api/user?email=${userEmail}`);
      if (response.data) {
        setName(response.data.name || '');
        setCity(response.data.city || '');
        setPostalCode(response.data.postalCode || '');
        setStreetAddress(response.data.streetAddress || '');
        setCountry(response.data.country || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSave = async () => {
    if (!email || !name || !city || !postalCode || !streetAddress || !country) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/api/user', {
        email,
        name,
        city,
        postalCode,
        streetAddress,
        country
      });
      alert('Детайлите за акаунта са запазени успешно!');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Грешка при запазване на детайлите за акаунта');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setEmail('');
    setName('');
    setCity('');
    setPostalCode('');
    setStreetAddress('');
    setCountry('');
    window.location.href = '/';
  };

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <TabsWrapper>
              <Tab 
                active={activeTab === 'wishlist'} 
                onClick={() => setActiveTab('wishlist')}
              >
                Желани книги
              </Tab>
            </TabsWrapper>

            {activeTab === 'wishlist' && (
              <div>
                <h2>Вашите желани книги</h2>
                {wishlistLoading ? (
                  <div>Зареждане на желани книги...</div>
                ) : wishlistProducts.length === 0 ? (
                  <div>Все още няма книги в желаните.</div>
                ) : (
                  <ProductsGrid products={wishlistProducts} />
                )}
              </div>
            )}
          </Box>

          <Box>
            <h2>Детайли за акаунта</h2>
            <Input
              type="text"
              placeholder="Име"
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
            <Input
              type="email"
              placeholder="Имейл"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Град"
              value={city}
              onChange={ev => setCity(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Пощенски код"
              value={postalCode}
              onChange={ev => setPostalCode(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Адрес"
              value={streetAddress}
              onChange={ev => setStreetAddress(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Държава"
              value={country}
              onChange={ev => setCountry(ev.target.value)}
            />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Запазване...' : 'Запази'}
            </Button>
            <LogoutButton onClick={handleLogout}>Изход</LogoutButton>
          </Box>
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}
