-- Ground Booking Marketplace Database Migration
-- Run this SQL to create all necessary tables

-- Create enum types
CREATE TYPE ground_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE pitch_type AS ENUM ('turf', 'cement', 'matting', 'astro_turf');
CREATE TYPE slot_type AS ENUM ('hourly', 'daily', 'multi_day');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_method AS ENUM ('card', 'upi', 'net_banking', 'wallet', 'cash');

-- =====================================================
-- 1. GROUNDS TABLE
-- =====================================================
CREATE TABLE grounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    pitch_type pitch_type NOT NULL DEFAULT 'turf',
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    amenities JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    status ground_status NOT NULL DEFAULT 'pending',
    capacity INTEGER DEFAULT 0,
    size DECIMAL(10, 2),
    total_bookings INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for grounds table
CREATE INDEX idx_grounds_owner_id ON grounds(owner_id);
CREATE INDEX idx_grounds_city ON grounds(city);
CREATE INDEX idx_grounds_state ON grounds(state);
CREATE INDEX idx_grounds_status ON grounds(status);
CREATE INDEX idx_grounds_pitch_type ON grounds(pitch_type);
CREATE INDEX idx_grounds_rating ON grounds(rating);
CREATE INDEX idx_grounds_is_active ON grounds(is_active);
CREATE INDEX idx_grounds_created_at ON grounds(created_at);

-- =====================================================
-- 2. GROUND SLOTS TABLE
-- =====================================================
CREATE TABLE ground_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ground_id UUID NOT NULL REFERENCES grounds(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    booking_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for ground_slots table
CREATE INDEX idx_ground_slots_ground_id ON ground_slots(ground_id);
CREATE INDEX idx_ground_slots_date ON ground_slots(date);
CREATE INDEX idx_ground_slots_is_booked ON ground_slots(is_booked);
CREATE INDEX idx_ground_slots_is_blocked ON ground_slots(is_blocked);
CREATE INDEX idx_ground_slots_booking_id ON ground_slots(booking_id);

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ground_id UUID NOT NULL REFERENCES grounds(id) ON DELETE CASCADE,
    slot_type slot_type NOT NULL DEFAULT 'hourly',
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    status booking_status NOT NULL DEFAULT 'pending',
    is_paid BOOLEAN DEFAULT FALSE,
    purpose TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for bookings table
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_ground_id ON bookings(ground_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_is_paid ON bookings(is_paid);
CREATE INDEX idx_bookings_start_datetime ON bookings(start_datetime);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- =====================================================
-- 4. PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method payment_method NOT NULL DEFAULT 'card',
    status payment_status NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(100),
    gateway_response JSONB,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for payments table
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- =====================================================
-- 5. FOREIGN KEY FOR GROUND_SLOTS
-- =====================================================
ALTER TABLE ground_slots
ADD CONSTRAINT fk_ground_slots_booking
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- =====================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_grounds_updated_at BEFORE UPDATE ON grounds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ground_slots_updated_at BEFORE UPDATE ON ground_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. SAMPLE DATA (Optional)
-- =====================================================

-- Note: Update user_id to match an existing user in your database
-- Insert sample ground
/*
INSERT INTO grounds (
    owner_id, name, description, address, city, state, country,
    latitude, longitude, pitch_type, hourly_rate, daily_rate,
    open_time, close_time, amenities, images, status
) VALUES (
    1, -- Replace with actual user ID
    'MCG Cricket Ground',
    'Premium cricket ground with world-class facilities',
    '123 Cricket Street, Andheri',
    'Mumbai',
    'Maharashtra',
    'India',
    19.0760,
    72.8777,
    'turf',
    5000,
    40000,
    '06:00:00',
    '22:00:00',
    '{"lighting": true, "dressingRoom": true, "parking": true, "waterSupply": true, "firstAid": true, "cafeteria": true, "scoreboard": true, "seatingCapacity": 500}',
    '["https://example.com/ground1.jpg", "https://example.com/ground2.jpg"]',
    'approved'
);
*/

-- =====================================================
-- 8. CLEANUP (if needed)
-- =====================================================

-- To rollback/drop all tables:
/*
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS ground_slots CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS grounds CASCADE;
DROP TYPE IF EXISTS ground_status;
DROP TYPE IF EXISTS pitch_type;
DROP TYPE IF EXISTS slot_type;
DROP TYPE IF EXISTS booking_status;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS payment_method;
DROP FUNCTION IF EXISTS update_updated_at_column();
*/

-- =====================================================
-- END OF MIGRATION
-- =====================================================

