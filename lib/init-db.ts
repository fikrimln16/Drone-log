import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import mysql from "mysql2/promise";

export async function initDatabase() {
  console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const database = process.env.DB_NAME!;

  await connection.query(`
    CREATE DATABASE IF NOT EXISTS \`${database}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
  `);

  await connection.query(`USE \`${database}\``);

  // AMAS
  await connection.query(`
    CREATE TABLE IF NOT EXISTS amas (
      id INT NOT NULL AUTO_INCREMENT,
      ama_name VARCHAR(255) NOT NULL,
      latitude DECIMAL(12,8) NOT NULL,
      longitude DECIMAL(12,8) NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(255) DEFAULT NULL,
      planning_date DATE DEFAULT NULL,
      actual_date DATE DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // SEED AMAS
  await connection.query(`
      INSERT IGNORE INTO amas (
      id,
      ama_name,
      latitude,
      longitude,
      created_at,
      status,
      planning_date,
      actual_date
      ) VALUES
      (1, 'AMA Bingin Teluk', -2.56996700, 103.16835100, '2026-06-08 11:41:49', 'WAITING', '2026-05-31', NULL),
      (2, 'AMA Cengal', -3.55354900, 105.47078500, '2026-06-08 11:41:49', 'ONGOING', '2026-06-01', NULL),
      (3, 'AMA Jade', -2.85080700, 103.52976000, '2026-06-08 11:41:49', 'SUCCESS', '2026-06-01', NULL),
      (4, 'AMA Kalimantan', -0.54364300, 116.06913300, '2026-06-08 11:41:49', 'SUCCESS', '2026-06-01', NULL),
      (5, 'AMA Lahat', -3.59587300, 103.42064800, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL),
      (6, 'AMA Lima Puluh', 2.70683400, 99.57797500, '2026-06-08 11:41:49', 'SUCCESS', '2026-06-01', NULL),
      (7, 'AMA Muara Rupit', -2.85149800, 103.14784700, '2026-06-08 11:41:49', 'SUCCESS', '2026-06-01', NULL),
      (8, 'AMA Muba', -2.16879900, 103.99987300, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL),
      (9, 'AMA Serdang', 3.49346000, 98.25998600, '2026-06-08 11:41:49', 'SUCCESS', '2026-06-01', NULL),
      (10, 'AMA Jawa Sulawesi', -5.37806600, 120.26483800, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL),
      (11, 'AMA Jawa Sulawesi', 1.31475500, 124.51832900, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL),
      (12, 'AMA Jawa Sulawesi', -8.38473100, 113.97727200, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL),
      (13, 'AMA Jawa Sulawesi', -7.21313700, 107.65106100, '2026-06-08 11:41:49', 'WAITING', '2026-06-01', NULL);
      `);

  // PILOTS
  await connection.query(`
    CREATE TABLE IF NOT EXISTS pilots (
      id INT NOT NULL AUTO_INCREMENT,
      pilot_code VARCHAR(50) DEFAULT NULL,
      pilot_name VARCHAR(255) NOT NULL,
      license_number VARCHAR(100) DEFAULT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      photo_url VARCHAR(500) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY pilot_code (pilot_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // SEED PILOTS
  await connection.query(`
    INSERT IGNORE INTO pilots (
      pilot_code,
      pilot_name,
      license_number,
      phone,
      status,
      photo_url
    ) VALUES
    ('PLT001', 'Maza Yudhistira', 'LIC-2026-001', '081234567001', 'ACTIVE', '/uploads/pilots/Maza Yudhistira.jpeg'),
    ('PLT002', 'Annisa Putri Graciella', 'LIC-2026-002', '081234567002', 'ACTIVE', '/uploads/pilots/Annisa Putri Graciella.jpeg'),
    ('PLT003', 'Rizki Ikhwansyah Purba', 'LIC-2026-003', '081234567003', 'ACTIVE', '/uploads/pilots/Rizki Ikhwansyah Purba.jpeg'),
    ('PLT004', 'Theo Ivan Imanuel', 'LIC-2026-004', '081234567004', 'ACTIVE', '/uploads/pilots/Theo Ivan Imanuel.jpeg'),
    ('PLT005', 'Muhammad Fatahillah Putra Joni', 'LIC-2026-005', '081234567005', 'ACTIVE', '/uploads/pilots/Muhammad Fatahillah Putra Joni.jpeg'),
    ('PLT006', 'Kristiawan Kristanto', 'LIC-2026-006', '081234567006', 'ACTIVE', '/uploads/pilots/Kristiawan Kristanto.jpeg'),
    ('PLT007', 'Bagas Andhika Aryo T', 'LIC-2026-007', '081234567007', 'ACTIVE', '/uploads/pilots/Bagas Andhika Aryo T.jpeg'),
    ('PLT008', 'M. Pandu Prabowo', 'LIC-2026-008', '081234567008', 'ACTIVE', '/uploads/pilots/M. Pandu Prabowo.jpeg'),
    ('PLT009', 'Afifah Faizah', 'LIC-2026-009', '081234567009', 'ACTIVE', '/uploads/pilots/Afifah Faizah.jpeg'),
    ('PLT010', 'Rizki Subekti', 'LIC-2026-010', '081234567010', 'ACTIVE', '/uploads/pilots/Rizki Subekti.jpeg'),
    ('PLT011', 'M Yovi Perdana', 'LIC-2026-011', '081234567011', 'ACTIVE', NULL),
    ('PLT012', 'Deven Fernanda', 'LIC-2026-012', '081234567012', 'ACTIVE', NULL);
  `);

  // FLIGHT HISTORY
  await connection.query(`
    CREATE TABLE IF NOT EXISTS drone_flight_history (
      id INT NOT NULL AUTO_INCREMENT,
      flight_date DATE NOT NULL,
      ama VARCHAR(255) DEFAULT NULL,
      estate VARCHAR(255) DEFAULT NULL,
      pilot VARCHAR(255) DEFAULT NULL,
      uav_unit VARCHAR(255) DEFAULT NULL,
      flight_id VARCHAR(255) DEFAULT NULL,
      mission_name VARCHAR(255) DEFAULT NULL,
      battery_id VARCHAR(255) DEFAULT NULL,
      battery_id_2 VARCHAR(255) DEFAULT NULL,
      battery_color VARCHAR(100) DEFAULT NULL,
      start_percent INT DEFAULT NULL,
      end_percent INT DEFAULT NULL,
      start_volt DECIMAL(5,2) DEFAULT NULL,
      end_volt DECIMAL(5,2) DEFAULT NULL,
      start_time TIME DEFAULT NULL,
      end_time TIME DEFAULT NULL,
      duration_min INT DEFAULT NULL,
      notes TEXT,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      ama_id INT DEFAULT NULL,

      PRIMARY KEY (id),

      UNIQUE KEY flight_id (flight_id),

      CONSTRAINT fk_flight_ama
      FOREIGN KEY (ama_id)
      REFERENCES amas(id)
      ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // FLIGHT PILOTS
  await connection.query(`
    CREATE TABLE IF NOT EXISTS flight_pilots (
      id INT NOT NULL AUTO_INCREMENT,
      flight_id INT NOT NULL,
      pilot_id INT NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (id),

      CONSTRAINT flight_pilots_ibfk_1
      FOREIGN KEY (flight_id)
      REFERENCES drone_flight_history(id)
      ON DELETE CASCADE,

      CONSTRAINT flight_pilots_ibfk_2
      FOREIGN KEY (pilot_id)
      REFERENCES pilots(id)
      ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.end();

  console.log("Database initialized successfully");
}
