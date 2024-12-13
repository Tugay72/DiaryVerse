import { useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import './homepage_navbar.css';
import { BookOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HomepageNavbar = () => {
  const navigate = useNavigate();

  return (
    <Header className="homepage-navbar">
      <div
        className="logo"
        style={{ cursor: 'pointer'}}
      >
        <BookOutlined /> DiaryVerse
      </div>
      <div className="nav-labels">
          <span className="nav-label">Log In</span>
          <span className="nav-label">Sign Up</span>
      </div>
    </Header>
  );
};

export default HomepageNavbar;
