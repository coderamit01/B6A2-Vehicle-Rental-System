import { pool } from "../../config/database";

const addVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = payload;

  const result = await pool.query(`INSERT INTO vehicles
   (vehicle_name, type, registration_number, daily_rent_price, availability_status)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result;
}

const getVehicle = async () => {
  const result = await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`);
  return result;
}
const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT id,vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1`, [id]);
  return result;
}

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = payload;

  const result = await pool.query(
    `UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
     WHERE id = $6 RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name ?? null, type ?? null, registration_number ?? null, daily_rent_price ?? null, availability_status ?? null, id]
  );

  return result;
};
const deleteVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    'SELECT id, vehicle_name, registration_number FROM vehicles WHERE id = $1',
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: 'Vehicle not found' };
  }

  const bookingsResult = await pool.query(
    `SELECT COUNT(*) as count FROM bookings 
         WHERE vehicle_id = $1 AND status =$2`,
    [vehicleId,'active']
  );

  if (parseInt(bookingsResult.rows[0].count) > 0) {
    throw { status: 400, message: 'Cannot delete vehicle with active bookings' };
  }

  await pool.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);

};



export const vehicleService = {
  addVehicle, getVehicle, getSingleVehicle, updateVehicle, deleteVehicle
}