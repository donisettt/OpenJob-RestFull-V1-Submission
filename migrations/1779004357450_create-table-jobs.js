/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
    },
    company_id: {
      type: 'uuid',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'uuid',
      notNull: true,
      references: '"categories"',
      onDelete: 'RESTRICT',
    },
    title: {
      type: 'varchar(200)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    requirements: {
      type: 'text',
    },
    salary_min: {
      type: 'integer',
    },
    salary_max: {
      type: 'integer',
    },
    location: {
      type: 'varchar(150)',
    },
    location_type: {
      type: 'varchar(50)',
    },
    job_type: {
      type: 'varchar(20)',
      notNull: true,
      default: 'full-time',
    },
    experience_level: {
      type: 'varchar(50)',
    },
    status: {
      type: 'varchar(10)',
      notNull: true,
      default: 'open',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('jobs', 'title');
  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
