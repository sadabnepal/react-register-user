import PropTypes from 'prop-types';
import UserSearch from '../UserSearch/UserSearch';

export default function UserDashboard({ user, onLogout }) {
    return (
        <div className="card card-wide">
            <h1>Welcome back, {user.firstName}!</h1>
            <p className="subtitle">You are signed in with {user.email}.</p>

            <div className="dashboard-details">
                <p>
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                {user.phone && (
                    <p>
                        <strong>Phone:</strong> {user.phone}
                    </p>
                )}
                {user.gender && (
                    <p>
                        <strong>Gender:</strong> {user.gender}
                    </p>
                )}
                {user.dob && (
                    <p>
                        <strong>Date of birth:</strong> {user.dob}
                    </p>
                )}
            </div>

            <UserSearch />

            <button type="button" className="reset-btn" onClick={onLogout}>
                Log out
            </button>
        </div>
    );
}

UserDashboard.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
        gender: PropTypes.string,
        dob: PropTypes.string,
    }).isRequired,
    onLogout: PropTypes.func.isRequired,
};
