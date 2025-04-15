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
| creation_method | creation_method_enum | NOT NULL | How the flashcard was created (AI_full, AI_edited or manually) |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the flashcard was created |
| updated_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the flashcard was last updated |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Owner of the flashcard |

### generations
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the generation |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User who generated the flashcards |
| total_generated | integer | NOT NULL | Number of flashcards generated in this session |
| accepted_full | integer | NOT NULL, DEFAULT 0 | Number of accepted flashcards without edits |
| accepted_edited | integer | NOT NULL, DEFAULT 0 | Number of accepted flashcards with edits |
| generation_time_ms | integer | NOT NULL | Time taken to generate the flashcards in milliseconds |
| ai_model | text | NOT NULL | Name of the AI model used for generation |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the generation was performed |
| updated_at | timestamp with time zone | NOT NULL, DEFAULT now() | When the generation record was last updated |

## 2. Custom Types

```sql
CREATE TYPE creation_method_enum AS ENUM ('AI_full', 'AI_edited', 'manual');
```

## 3. Indexes

```sql
-- Indexes for flashcards table
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);
CREATE INDEX idx_flashcards_creation_method ON flashcards(creation_method);

-- Indexes for generations table
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at);
```

## 4. Row Level Security (RLS) Policies

```sql
-- Enable RLS on flashcards table
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policy to ensure users can only see their own flashcards
CREATE POLICY flashcards_user_isolation ON flashcards
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Enable RLS on generations table
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Policy to ensure users can only see their own generations
CREATE POLICY generations_user_isolation ON generations
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

CREATE TRIGGER update_generations_updated_at
BEFORE UPDATE ON generations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

## 6. Relationships

- One-to-Many: `users` to `flashcards` (One user can have many flashcards)
- One-to-Many: `users` to `generations` (One user can have many generation sessions)

## 7. Notes

1. Authentication is handled by Supabase Auth, which stores passwords securely.
2. The schema follows 3NF normalization for data integrity.
3. RLS policies ensure data security by restricting access to user-specific data.
4. Spaced repetition algorithm will be implemented on the frontend.
5. All timestamps use time zones to ensure global accessibility.
6. Content validations are implemented using CHECK constraints to ensure data quality.
7. The generations table tracks AI generations and acceptance rates to calculate metrics. 
