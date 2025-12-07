import { pool } from "../../config/database";

const addBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const number_of_days = rent_end_date - rent_start_date;
  const total_price = daily_rent_price × number_of_days;
  const result = await pool.query(`INSERT INTO bookings
   (customer_id, vehicle_id, rent_start_date, rent_end_date)
   VALUES ($1, $2, $3, $4)
   RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date`,
    [ customer_id, vehicle_id, rent_start_date, rent_end_date]
  );
  return result;
}

export const bookingService = {
  addBooking,
}
