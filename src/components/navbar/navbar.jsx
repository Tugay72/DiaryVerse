import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Menu } from 'antd';
import './navbar.css';
import { UserContext } from '../../context/userContext';
import { BookOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const {userData, setUserData} = useContext(UserContext);
  const navigate = useNavigate();


  const logout = () => {

    setUserData(null);
    navigate('/login_page')
  }

  const menu1 = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate('/homepage')}>New Page</Menu.Item>
      <Menu.Item key="2" onClick={() => navigate('/written_diaries')}>Written Diaries</Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate('/daily_quote')}>Quote of the Day</Menu.Item>
    </Menu>
  );

  const menu3 = (
    <Menu style={{
      marginRight: '16px'
    }}>
      <Menu.Item key="1" onClick={() => navigate('/profile')}>Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Header className="navbar">
      <div
        className="logo"
        style={{ cursor: 'pointer'}}
        onClick={() => navigate('/homepage')}
      >
        <BookOutlined /> DiaryVerse
      </div>
      <div className="nav-labels">
        <Dropdown overlay={menu1} placement="bottom" arrow>
          <span className="nav-label">Diaries</span>
        </Dropdown>
        <Dropdown overlay={menu2} placement="bottom" arrow>
          <span className="nav-label">Quotes</span>
        </Dropdown>
      </div>
      <div className="username">
        <Dropdown overlay={menu3} placement="bottom" arrow>
          <span className="nav-label" style={{display: 'flex', gap: '4px'}}><UserOutlined />{userData ? userData.name : 'Guest'}</span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
