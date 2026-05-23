CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latin_name VARCHAR(100),
    description TEXT,
    origin_country VARCHAR(100),
    rarity_level VARCHAR(50),

    category_id INT,
    created_by INT,

    FOREIGN KEY (category_id)
        REFERENCES categories(id),

    FOREIGN KEY (created_by)
        REFERENCES users(id)
);

CREATE TABLE plant_images (
    id SERIAL PRIMARY KEY,
    plant_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,

    FOREIGN KEY (plant_id)
        REFERENCES plants(id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    plant_id INT NOT NULL,
    admin_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    comment TEXT,

    FOREIGN KEY (plant_id)
        REFERENCES plants(id),

    FOREIGN KEY (admin_id)
        REFERENCES users(id)
);

INSERT INTO users (username, email, password, role)
VALUES
('admin', 'admin@example.com', 'admin123', 'admin'),
('flowerlover', 'user@example.com', 'user123', 'user');

INSERT INTO categories (name)
VALUES
('Tropical Flowers'),
('Rare Flowers'),
('Poisonous Plants');

INSERT INTO plants (
    name,
    latin_name,
    description,
    origin_country,
    rarity_level,
    category_id,
    created_by
)
VALUES
(
    'Blood Lily',
    'Scadoxus multiflorus',
    'Rare exotic flower with bright red petals',
    'South Africa',
    'Rare',
    2,
    2
),
(
    'Ghost Orchid',
    'Dendrophylax lindenii',
    'Unusual orchid with ghost-like appearance',
    'Cuba',
    'Very Rare',
    1,
    2
);

INSERT INTO plant_images (plant_id, image_url)
VALUES
(1, 'blood-lily.jpg'),
(2, 'ghost-orchid.jpg');

INSERT INTO reviews (plant_id, admin_id, status, comment)
VALUES
(1, 1, 'approved', 'Plant approved'),
(2, 1, 'pending', 'Waiting for review');
