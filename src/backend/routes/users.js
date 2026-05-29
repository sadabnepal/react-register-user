import { Router } from 'express';
import db from '../db.js';
import { toPublicUser } from '../lib/publicUser.js';

const router = Router();

const USER_COLUMNS = `
  id, first_name, last_name, email, phone, gender, date_of_birth, created_at
`;

function escapeLike(value) {
    return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

router.get('/search', (req, res) => {
    const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
    const firstName = typeof req.query.firstName === 'string' ? req.query.firstName.trim() : '';
    const lastName = typeof req.query.lastName === 'string' ? req.query.lastName.trim() : '';

    if (!email && !firstName && !lastName) {
        return res.status(400).json({
            error: 'Provide at least one search field: email, firstName, or lastName',
        });
    }

    const conditions = [];
    const params = {};

    if (email) {
        conditions.push('email = @email COLLATE NOCASE');
        params.email = email;
    }
    if (firstName) {
        conditions.push("LOWER(first_name) LIKE LOWER(@firstName) ESCAPE '\\'");
        params.firstName = `%${escapeLike(firstName)}%`;
    }
    if (lastName) {
        conditions.push("LOWER(last_name) LIKE LOWER(@lastName) ESCAPE '\\'");
        params.lastName = `%${escapeLike(lastName)}%`;
    }

    const sql = `
    SELECT ${USER_COLUMNS}
    FROM users
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
  `;

    try {
        const rows = db.prepare(sql).all(params);
        return res.status(200).json({
            users: rows.map(toPublicUser),
            count: rows.length,
        });
    } catch (err) {
        console.error('User search error:', err);
        return res.status(500).json({ error: 'Unable to search users. Please try again.' });
    }
});

export default router;
