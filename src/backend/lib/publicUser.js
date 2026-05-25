export function toPublicUser(row) {
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        gender: row.gender,
        dob: row.date_of_birth,
        createdAt: row.created_at,
    };
}
