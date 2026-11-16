CREATE TABLE nc_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT, hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL, class_id TEXT, friend_code TEXT UNIQUE);
CREATE TABLE nc_sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE nc_invites (token TEXT PRIMARY KEY, email TEXT NOT NULL, role TEXT NOT NULL, expires INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
CREATE TABLE nc_classes (id TEXT PRIMARY KEY, owner TEXT NOT NULL, name TEXT NOT NULL, code TEXT NOT NULL UNIQUE, settings TEXT NOT NULL);
CREATE TABLE nc_games (user_id TEXT PRIMARY KEY, state TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0);
CREATE TABLE nc_posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, class_id TEXT NOT NULL, body TEXT NOT NULL, budget INTEGER NOT NULL, area TEXT NOT NULL, move_month TEXT NOT NULL, status TEXT NOT NULL, created INTEGER NOT NULL);
CREATE TABLE nc_links (id TEXT PRIMARY KEY, class_a TEXT NOT NULL, class_b TEXT NOT NULL, approval_a INTEGER NOT NULL DEFAULT 1, approval_b INTEGER NOT NULL DEFAULT 0);
CREATE TABLE nc_pairs (id TEXT PRIMARY KEY, player_a TEXT NOT NULL, player_b TEXT NOT NULL, accepted INTEGER NOT NULL DEFAULT 0, approval_a INTEGER NOT NULL DEFAULT 0, approval_b INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 0);
CREATE TABLE nc_rent (pair_id TEXT NOT NULL, month INTEGER NOT NULL, user_id TEXT NOT NULL, paid INTEGER NOT NULL DEFAULT 0, covered INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(pair_id,month,user_id));
CREATE TABLE nc_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, window INTEGER NOT NULL);
CREATE INDEX nc_posts_class ON nc_posts(class_id,status);
CREATE INDEX nc_sessions_expiry ON nc_sessions(expires);

CREATE UNIQUE INDEX nc_teacher_email ON nc_users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX nc_single_owner ON nc_users(role) WHERE role='admin';
CREATE INDEX nc_user_classes ON nc_users(class_id);
CREATE INDEX nc_board_class ON nc_posts(class_id,status);
