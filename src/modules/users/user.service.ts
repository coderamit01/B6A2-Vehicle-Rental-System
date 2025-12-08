import { pool } from "../../config/database"

const getUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result;
}

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(`UPDATE users SET 
    name= COALESCE($1,name),
    email=COALESCE($2,email),
    phone=COALESCE($3,phone),
    role=COALESCE($4,role)
    WHERE id=$5 RETURNING id,name,email,phone,role`, [name??null, email??null, phone??null, role??null, id]);

  return result;
}
const deleteUser = async (userId:string) => {
      const result = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw { status: 404, message: 'User not found' };
      }

      const bookingsResult = await pool.query(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE customer_id = $1 AND status =$2`,
        [userId,'active']
      );

      if (parseInt(bookingsResult.rows[0].count) > 0) {
        throw { status: 400, message: 'Cannot delete user with active bookings' };
      }

      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
}


export const userService = {
  getUsers, updateUser, deleteUser
}