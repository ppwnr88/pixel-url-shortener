CREATE TABLE short_links (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE,
  original_url TEXT NOT NULL,
  click_count BIGINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expired_at DATETIME NULL
);

CREATE INDEX idx_code ON short_links(short_code);