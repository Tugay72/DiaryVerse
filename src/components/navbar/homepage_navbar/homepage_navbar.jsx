import './homepage_navbar.css';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HomepageNavbar = () => {
    const navigate = useNavigate();

    return (
        <Header className="homepage-navbar">
            <div
                className="logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <BookOutlined /> DiaryVerse
            </div>
            <div className="nav-labels">
                <span className="nav-label" onClick={() => navigate('/login_page')}>Log In</span>
                <span className="nav-label" onClick={() => navigate('/signup_page')}>Sign Up</span>
            </div>
        </Header>
    );
};

export default HomepageNavbar;
