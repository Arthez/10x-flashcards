# Database Schema for 10x-Flashcards

## 1. Tables

### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the user |
| email | text | UNIQUE, NOT NULL | User's email address |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the user was created |
| updated_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the user was last updated |

*Note: Password handling will be managed by Supabase Authentication*

### flashcards
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the flashcard |
| front_content | text | NOT NULL, CHECK (length(front_content) >= 2 AND length(front_content) <= 200) | Content of the front side |
| back_content | text | NOT NULL, CHECK (length(back_content) >= 2 AND length(back_content) <= 200) | Content of the back side |
| creation_method | creation_method_enum | NOT NULL | How the flashcard was created (AI or manually) |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the flashcard was created |
| updated_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the flashcard was last updated |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Owner of the flashcard |

### user_actions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the action |
| action_type | action_type_enum | NOT NULL | Type of action performed |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the action was performed |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User who performed the action |

## 2. Custom Types

```sql
CREATE TYPE creation_method_enum AS ENUM ('ai', 'manual');
CREATE TYPE action_type_enum AS ENUM ('manual_create', 'ai_accept', 'ai_reject');
```

## 3. Indexes

```sql
-- Indexes for flashcards table
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);
CREATE INDEX idx_flashcards_creation_method ON flashcards(creation_method);

-- Indexes for user_actions table
CREATE INDEX idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX idx_user_actions_action_type ON user_actions(action_type);
```

## 4. Row Level Security (RLS) Policies

```sql
-- Enable RLS on flashcards table
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policy to ensure users can only see their own flashcards
CREATE POLICY flashcards_user_isolation ON flashcards
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Enable RLS on user_actions table
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Policy to ensure users can only see their own actions
CREATE POLICY user_actions_user_isolation ON user_actions
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
```

## 5. Triggers

```sql
-- Trigger to update updated_at timestamp on flashcards
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

## 6. Relationships

- One-to-Many: `users` to `flashcards` (One user can have many flashcards)
- One-to-Many: `users` to `user_actions` (One user can perform many actions)

## 7. Notes

1. Authentication is handled by Supabase Auth, which stores passwords securely.
2. The schema follows 3NF normalization for data integrity.
3. RLS policies ensure data security by restricting access to user-specific data.
4. Spaced repetition algorithm will be implemented on the frontend.
5. All timestamps use time zones to ensure global accessibility.
6. Content validations are implemented using CHECK constraints to ensure data quality. 
