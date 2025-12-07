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


export const userService = {
  getUsers, updateUser
}