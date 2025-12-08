import { pool } from "../../config/database";

const addBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status 
   FROM vehicles 
   WHERE id = $1`,
    [vehicle_id]
  );

  if (!vehicleRes || !vehicleRes.rows || vehicleRes.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }


  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);


  const diffTime = endDate.getTime() - startDate.getTime();
  const number_of_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (number_of_days <= 0) {
    throw new Error("Invalid rental date range");
  }

  const total_price = number_of_days * vehicle.daily_rent_price;

  const result = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
  );

  await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id = $2`,
    ['booked', vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price
    }
  }
}

const allBooking = async (userInfo: Record<string, unknown>) => {
  let result;
  if (userInfo.role === "admin") {
    result = await pool.query(
      `SELECT b.*,
      u.name AS customer_name,
      v.vehicle_name,
      u.email AS customer_email,
      v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id`
    );
  } else {
    result = await pool.query(
      `SELECT b.*,
      u.name AS customer_name,
      v.vehicle_name,
      u.email AS customer_email,
      v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
      WHERE b.customer_id = $1
    `, [userInfo.id]
    );
  }

  const formattedData = result.rows.map(booking => ({
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: booking.total_price,
    status: booking.status,
    customer: {
      name: booking.customer_name,
      email: booking.customer_email
    },
    vehicle: {
      vehicle_name: booking.vehicle_name,
      registration_number: booking.registration_number
    }
  }));

  return formattedData;
}

export const updateBooking = async (
  bookingId: number,
  user: { id: number; role: string }
) => {
  const { id: userId, role } = user;
  const today = new Date().toISOString().split("T")[0];

  const bookingRes = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (!bookingRes.rowCount) {
    throw { status: 404, message: "Booking not found" };
  }

  const booking = bookingRes.rows[0];

  /* ================= CUSTOMER ================= */
  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw { status: 403, message: "Unauthorized" };
    }

    if (today! >= booking.rent_start_date) {
      throw {
        status: 400,
        message: "Booking cannot be cancelled after start date",
      };
    }

    const updated = await pool.query(
      `UPDATE bookings 
       SET status='cancelled'
       WHERE id=$1
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles 
       SET availability_status='available'
       WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updated.rows[0],
    };
  }

  /* ================= ADMIN ================= */
  if (user.role === "admin") {
    const updated = await pool.query(
      `UPDATE bookings 
       SET status='returned'
       WHERE id=$1
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles 
       SET availability_status='available'
       WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updated.rows[0],
        vehicle: { availability_status: "available" },
      },
    };
  }

  throw { status: 403, message: "Invalid role" };
};



export const bookingService = {
  addBooking, allBooking, updateBooking
}
