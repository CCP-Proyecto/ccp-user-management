-- Create account table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'account') THEN
        CREATE TABLE "account" (
            "id" text PRIMARY KEY NOT NULL,
            "account_id" text NOT NULL,
            "provider_id" text NOT NULL,
            "user_id" text NOT NULL,
            "access_token" text,
            "refresh_token" text,
            "id_token" text,
            "access_token_expires_at" timestamp,
            "refresh_token_expires_at" timestamp,
            "scope" text,
            "password" text,
            "created_at" timestamp NOT NULL,
            "updated_at" timestamp NOT NULL
        );
    END IF;
END $$;

-- Create session table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'session') THEN
        CREATE TABLE "session" (
            "id" text PRIMARY KEY NOT NULL,
            "expires_at" timestamp NOT NULL,
            "token" text NOT NULL,
            "created_at" timestamp NOT NULL,
            "updated_at" timestamp NOT NULL,
            "ip_address" text,
            "user_agent" text,
            "user_id" text NOT NULL,
            CONSTRAINT "session_token_unique" UNIQUE("token")
        );
    END IF;
END $$;

-- Create user table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user') THEN
        CREATE TABLE "user" (
            "id" text PRIMARY KEY NOT NULL,
            "name" text NOT NULL,
            "email" text NOT NULL,
            "email_verified" boolean NOT NULL,
            "image" text,
            "created_at" timestamp NOT NULL,
            "updated_at" timestamp NOT NULL,
            "roles" text[] NOT NULL,
            "user_id" text NOT NULL,
            CONSTRAINT "user_email_unique" UNIQUE("email"),
            CONSTRAINT "user_user_id_unique" UNIQUE("user_id")
        );
    END IF;
END $$;

-- Create verification table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'verification') THEN
        CREATE TABLE "verification" (
            "id" text PRIMARY KEY NOT NULL,
            "identifier" text NOT NULL,
            "value" text NOT NULL,
            "expires_at" timestamp NOT NULL,
            "created_at" timestamp,
            "updated_at" timestamp
        );
    END IF;
END $$;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'account_user_id_user_id_fk'
    ) THEN
        ALTER TABLE "account"
        ADD CONSTRAINT "account_user_id_user_id_fk"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."user"("id")
        ON DELETE cascade
        ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'session_user_id_user_id_fk'
    ) THEN
        ALTER TABLE "session"
        ADD CONSTRAINT "session_user_id_user_id_fk"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."user"("id")
        ON DELETE cascade
        ON UPDATE no action;
    END IF;
END $$;
