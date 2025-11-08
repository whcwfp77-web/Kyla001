import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        preferred_languages VARCHAR(10)[] DEFAULT '{}',
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create media table
    await queryRunner.query(`
      CREATE TABLE media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        platform VARCHAR(100) NOT NULL,
        season_episode VARCHAR(50),
        publication_date DATE,
        media_type VARCHAR(50) NOT NULL,
        embed_url TEXT,
        compliance_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create entries table
    await queryRunner.query(`
      CREATE TABLE entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        term VARCHAR(255) NOT NULL,
        language VARCHAR(10) NOT NULL,
        pronunciation VARCHAR(255),
        meaning_summary TEXT NOT NULL,
        usage_bucket VARCHAR(50),
        emotion_tags TEXT[] DEFAULT '{}',
        politeness_level VARCHAR(50),
        context_summary TEXT,
        srs_default_interval INT DEFAULT 3,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create clips table with vector embedding
    await queryRunner.query(`
      CREATE TABLE clips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
        start_time_ms INT NOT NULL,
        end_time_ms INT NOT NULL,
        duration_sec DECIMAL(5,2) NOT NULL,
        original_subtitle TEXT NOT NULL,
        translations JSONB,
        speakers TEXT[] DEFAULT '{}',
        thumbnail_url TEXT,
        embed_policy VARCHAR(50) DEFAULT 'embed',
        embed_url TEXT,
        redirect_url TEXT,
        shadow_lab_ready BOOLEAN DEFAULT false,
        replacement_variants TEXT[] DEFAULT '{}',
        grammar_links TEXT[] DEFAULT '{}',
        exam_topics TEXT[] DEFAULT '{}',
        notes TEXT,
        ingest_source VARCHAR(50) DEFAULT 'manual',
        review_status VARCHAR(50) DEFAULT 'pending',
        auditor VARCHAR(255),
        reviewed_at TIMESTAMP,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create entry_clips junction table
    await queryRunner.query(`
      CREATE TABLE entry_clips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        clip_id UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(entry_id, clip_id)
      );
    `);

    // Create entry_relations table
    await queryRunner.query(`
      CREATE TABLE entry_relations (
        entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        related_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        PRIMARY KEY (entry_id, related_entry_id)
      );
    `);

    // Create review_cards table
    await queryRunner.query(`
      CREATE TABLE review_cards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        clip_id UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
        interval INT DEFAULT 0,
        repetitions INT DEFAULT 0,
        ease_factor DECIMAL(5,2) DEFAULT 2.5,
        due_date TIMESTAMP NOT NULL,
        last_reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create shadow_records table
    await queryRunner.query(`
      CREATE TABLE shadow_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        clip_id UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
        metrics JSONB NOT NULL,
        audio_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create suggestions table
    await queryRunner.query(`
      CREATE TABLE suggestions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        entry_term VARCHAR(255) NOT NULL,
        language VARCHAR(10) NOT NULL,
        media_url TEXT NOT NULL,
        start_time VARCHAR(20) NOT NULL,
        end_time VARCHAR(20) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        approved_clip_id UUID REFERENCES clips(id),
        reviewed_by VARCHAR(255),
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX idx_clips_media_id ON clips(media_id);`);
    await queryRunner.query(`CREATE INDEX idx_clips_embed_policy ON clips(embed_policy);`);
    await queryRunner.query(`CREATE INDEX idx_clips_review_status ON clips(review_status);`);
    await queryRunner.query(`CREATE INDEX idx_entries_language ON entries(language);`);
    await queryRunner.query(`CREATE INDEX idx_entries_term ON entries(term);`);
    await queryRunner.query(`CREATE INDEX idx_review_cards_user_due ON review_cards(user_id, due_date);`);
    await queryRunner.query(`CREATE INDEX idx_shadow_records_user_clip ON shadow_records(user_id, clip_id);`);
    await queryRunner.query(`CREATE INDEX idx_suggestions_status ON suggestions(status);`);
    
    // Vector similarity search index (using ivfflat for pgvector)
    await queryRunner.query(`
      CREATE INDEX idx_clips_embedding ON clips 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS suggestions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS shadow_records;`);
    await queryRunner.query(`DROP TABLE IF EXISTS review_cards;`);
    await queryRunner.query(`DROP TABLE IF EXISTS entry_relations;`);
    await queryRunner.query(`DROP TABLE IF EXISTS entry_clips;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clips;`);
    await queryRunner.query(`DROP TABLE IF EXISTS entries;`);
    await queryRunner.query(`DROP TABLE IF EXISTS media;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
