import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import UserDashboard from './components/UserDashboard/UserDashboard';

export default function App() {
    const [view, setView] = useState('welcome'); // 'welcome' | 'register' | 'login'
    const [user, setUser] = useState(null);

    if (user) {
        return (
            <UserDashboard
                user={user}
                onLogout={() => {
                    setUser(null);
                    setView('welcome');
                }}
            />
        );
    }

    if (view === 'register') {
        return <RegistrationForm onSuccess={(u) => setUser(u)} />;
    }

    if (view === 'login') {
        return <Login onSuccess={(u) => setUser(u)} onBack={() => setView('welcome')} />;
    }

    return (
        <Welcome
            onLogin={() => setView('login')}
            onSignup={() => setView('register')}
        />
    );
}
