import PropTypes from 'prop-types';

export default function Field({ label, id, children, error }) {
    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            {children}
            <span className="error-text">{error || ''}</span>
        </div>
    );
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    error: PropTypes.string,
};

Field.defaultProps = {
    error: '',
};
