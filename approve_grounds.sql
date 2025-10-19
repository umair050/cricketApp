-- Approve all pending grounds
UPDATE grounds SET status = 'approved' WHERE status = 'pending';

-- Verify
SELECT id, name, city, status FROM grounds;

