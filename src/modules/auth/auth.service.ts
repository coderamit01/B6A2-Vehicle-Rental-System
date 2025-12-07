import { pool } from "../../config/database";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";

const signUp = async (payload: Record<string, unknown>) => {
  const { id, name, email, password, phone, role } = payload;
  const stringpassword = password as string;
  if (stringpassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const hasPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`, [name, email, hasPassword, phone, role]);
  return result;
}


const signIn = async (email: string, password: string) => {
  const result = await pool.query(`SELECT id,name,email,phone,role,password FROM users WHERE email=$1 `, [email]);

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return "Invalid Email or Password";
  }
  const token = jwt.sign({ id: user.id, email:user.email, role: user.role }, config.secret_key as string,{expiresIn: '30d'});
  const {password:_, ...userData} = user;
  return {token,userData};
}

export const authService = {
  signUp, signIn
}