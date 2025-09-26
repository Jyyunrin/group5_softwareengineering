CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',    -- 'user', 'admin'
    status VARCHAR(20) NOT NULL DEFAULT 'active',    -- 'active', 'banned'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP DEFAULT
);

CREATE TABLE languages (
    code VARCHAR(10) PRIMARY KEY,   -- 'en', 'fr', 'es'
    lang VARCHAR(50) NOT NULL       -- e.g., 'English', 'French', 'Spanish'
);

CREATE TABLE words (
    id SERIAL PRIMARY KEY,               
    label_en VARCHAR(255) NOT NULL,     -- word in english
    meaning TEXT NOT NULL,     -- meaning in english
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE translations (
    id SERIAL PRIMARY KEY,      
    target_lang VARCHAR(10) NOT NULL REFERENCES languages(code),
    word_id INTEGER NOT NULL REFERENCES words(id),
    label_target VARCHAR(255) NOT NULL,     -- word in target lang
    example_target_easy TEXT NOT NULL,      -- redundant but do not want 3 relations
    example_en_easy TEXT NOT NULL,
    example_target_med TEXT NOT NULL,
    example_en_med TEXT NOT NULL,
    example_target_hard TEXT NOT NULL,
    example_en_hard TEXT NOT NULL,
    audio_name VARCHAR(255) NOT NULL,    
    audio_path VARCHAR(255) NOT NULL,

    UNIQUE (target_lang, word_id)
);

CREATE TABLE user_history (
    id SERIAL PRIMARY KEY,   
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- delete if user is deleted
    translation_id INTEGER NOT NULL REFERENCES translations(id),
    img_name VARCHAR(255) NOT NULL,     -- original file name
    img_path VARCHAR(255) NOT NULL,     -- path in container, i think append user id to it?
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- delete if user is deleted
    target_lang VARCHAR(10) NOT NULL REFERENCES languages(code),
    quiz_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMP,

    UNIQUE (user_id, quiz_name)   -- ensures uniqueness per user
);

CREATE TABLE quiz_words (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    translation_id INTEGER NOT NULL REFERENCES translations(id) ON DELETE CASCADE,

    UNIQUE (quiz_id, translation_id)
);
