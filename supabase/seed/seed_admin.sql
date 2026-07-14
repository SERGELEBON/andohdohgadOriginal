-- Seed initial admin user
-- NOTE: This creates a profile, but you need to manually create the auth.users entry via Supabase Dashboard
-- Email: contact@andoh-dohgad.com
-- Password: Set securely via Supabase Dashboard

-- Insert admin profile (will be linked once auth.users is created)
-- The trigger will handle this automatically, but we can also seed manually

-- Create placeholder for admin (update with real UUID after creating auth user)
DO $$
DECLARE
    admin_email TEXT := 'contact@andoh-dohgad.com';
    existing_user UUID;
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO existing_user
    FROM auth.users
    WHERE email = admin_email;

    -- If exists, ensure profile exists with admin role
    IF existing_user IS NOT NULL THEN
        INSERT INTO profiles (id, email, first_name, last_name, role)
        VALUES (
            existing_user,
            admin_email,
            'Admin',
            'Andoh & Dohgad',
            'admin'
        )
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin';

        RAISE NOTICE 'Admin profile created/updated for existing user: %', existing_user;
    ELSE
        RAISE NOTICE 'Admin user not found in auth.users. Please create via Supabase Dashboard with email: %', admin_email;
    END IF;
END $$;

-- Comments
COMMENT ON SCHEMA public IS 'Admin seed data - creates admin profile for contact@andoh-dohgad.com';
