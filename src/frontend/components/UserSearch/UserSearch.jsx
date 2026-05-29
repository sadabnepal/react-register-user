import { useState } from 'react';
import { UserSearchError, searchUsers } from '../../api/users';

export default function UserSearch() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [results, setResults] = useState(null);
    const [searching, setSearching] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSearch = async () => {
        setFormError('');
        setResults(null);

        const hasEmail = email.trim().length > 0;
        const hasFirstName = firstName.trim().length > 0;
        const hasLastName = lastName.trim().length > 0;

        if (!hasEmail && !hasFirstName && !hasLastName) {
            setFormError('Enter at least one of email, first name, or last name');
            return;
        }

        setSearching(true);
        try {
            const data = await searchUsers({ email, firstName, lastName });
            setResults(data.users);
        } catch (err) {
            if (err instanceof UserSearchError) {
                setFormError(err.message);
            } else {
                setFormError('Unable to reach the server. Is the API running?');
            }
        } finally {
            setSearching(false);
        }
    };

    return (
        <section className="dashboard-search" aria-labelledby="dashboard-search-heading">
            <h2 id="dashboard-search-heading">Search users</h2>
            <p className="dashboard-search-hint">
                Use any combination of fields. Only matching users are shown.
            </p>

            {formError && <p className="form-error">{formError}</p>}

            <div className="field">
                <label htmlFor="search-email">Email</label>
                <input
                    id="search-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={searching}
                    placeholder="jane@example.com"
                />
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor="search-first-name">First name</label>
                    <input
                        id="search-first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={searching}
                        placeholder="Jane"
                    />
                </div>
                <div className="field">
                    <label htmlFor="search-last-name">Last name</label>
                    <input
                        id="search-last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={searching}
                        placeholder="Doe"
                    />
                </div>
            </div>

            <button type="button" className="btn" onClick={handleSearch} disabled={searching}>
                {searching ? 'Searching…' : 'Search'}
            </button>

            {results !== null && (
                <div className="search-results" aria-live="polite">
                    <p className="search-results-summary">
                        {results.length === 0
                            ? 'No users match your search.'
                            : `${results.length} matching user${results.length === 1 ? '' : 's'}`}
                    </p>
                    {results.length > 0 && (
                        <ul className="search-results-list">
                            {results.map((user) => (
                                <li key={user.id} className="search-result-item">
                                    <p className="search-result-name">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="search-result-email">{user.email}</p>
                                    {user.phone && <p className="search-result-meta">Phone: {user.phone}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}
