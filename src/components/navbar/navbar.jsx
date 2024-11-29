import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown } from 'antd';
import './navbar.css';
import {BookOutlined} from '@ant-design/icons';


const { Header } = Layout;

const Navbar = () => {

  const navigate = useNavigate();

  const menu1 = (
    <Menu>
      <Menu.Item onClick={() => navigate('/homepage')}>New Page</Menu.Item>
      <Menu.Item onClick={() => navigate('/written_diaries')}>Written Diaries</Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu>
      <Menu.Item onClick={() => navigate('/pre_builds')}>Random Meal</Menu.Item>
    </Menu>
  );

  const menu3 = (
    <Menu>
      <Menu.Item onClick={() => navigate('/bmi_calculator')}>BMI</Menu.Item>
      <Menu.Item onClick={() => navigate('/nutritions_calculator')}>Nutritions</Menu.Item>
    </Menu>
  );

  // Fix : Use menu instead of overlay but using menu gives errors
  return (
    <Header className="navbar">
      <div 
        className="logo"
        style={{cursor: 'pointer', paddingBottom: '8px'}}
        onClick={() => navigate('/homepage')

        }> <BookOutlined> </BookOutlined> My Diary
      </div>
      <div className="nav-labels">
        <Dropdown overlay={menu1} placement="bottom" arrow>
          <span className="nav-label">Diaries</span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;