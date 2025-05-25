import React, { useState } from 'react';
import { useGlobalContext } from '../Context/GlobalContext';
import './Auth.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useGlobalContext();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login({ email, password });
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Welcome Back 👋</h2>
                {error && <p className="auth-error">{error}</p>}

                <div className="auth-input">
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="auth-input">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button" 
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">Sign Up Now</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
