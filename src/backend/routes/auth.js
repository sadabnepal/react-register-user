import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { toPublicUser } from '../lib/publicUser.js';
import { validateSignupBody } from '../validation.js';

const router = Router();

const insertUser = db.prepare(`
  INSERT INTO users (
    first_name, last_name, email, phone, password_hash, gender, date_of_birth
  ) VALUES (
    @firstName, @lastName, @email, @phone, @passwordHash, @gender, @dateOfBirth
  )
`);

const findUserByEmail = db.prepare(`
  SELECT id, first_name, last_name, email, phone, gender, date_of_birth, created_at
  FROM users
  WHERE email = @email COLLATE NOCASE
`);

const findUserAuth = db.prepare(`
  SELECT id, first_name, last_name, email, phone, gender, date_of_birth, created_at, password_hash
  FROM users
  WHERE email = @email COLLATE NOCASE
`);

const findUserById = db.prepare(`
  SELECT id, first_name, last_name, email, phone, gender, date_of_birth, created_at
  FROM users
  WHERE id = @id
`);

router.post('/signup', async (req, res) => {
    const { errors, fields } = validateSignupBody(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const existing = findUserByEmail.get({ email: fields.email });
    if (existing) {
        return res.status(409).json({
            error: 'An account with this email already exists',
            field: 'email',
        });
    }

    try {
        const passwordHash = await bcrypt.hash(fields.password, 10);

        const result = insertUser.run({
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            phone: fields.phone,
            passwordHash,
            gender: fields.gender,
            dateOfBirth: fields.dob,
        });

        const user = findUserById.get({ id: result.lastInsertRowid });
        return res.status(201).json({
            message: 'Account created successfully',
            user: toPublicUser(user),
        });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                error: 'An account with this email already exists',
                field: 'email',
            });
        }
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Unable to create account. Please try again.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const row = findUserAuth.get({ email });
        if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, row.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        return res.status(200).json({ user: toPublicUser(row) });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Unable to process login. Please try again.' });
    }
});

export default router;