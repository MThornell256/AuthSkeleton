-- Create Users Database
Drop Table If Exists public.users;

CREATE TABLE IF NOT EXISTS public.users (
	userid SERIAL,
	username VARCHAR(50) UNIQUE NOT NULL,
	passwordHash VARCHAR(128) NOT NULL,
	passwordSalt VARCHAR(64) NOT NULL,
	failedLogins INTEGER NOT NULL DEFAULT(0),
	lastFailedLogin TIMESTAMPTZ,
	lastLogin TIMESTAMPTZ,
	PRIMARY KEY (userid)
)

-- Insert Admin User
-- Admin/password1
INSERT INTO public.users (username, passwordHash, passwordSalt) 
VALUES ('Admin','5d85dd6412ef3d2732c7cd17fafe71b0d8e54936d8cabab1b13a745fe50f2524','973e4424b0ba5077c840eb20ab1d6af2446e331f7daa5f6bd960741f15db85c8')

SELECT * FROM public.users