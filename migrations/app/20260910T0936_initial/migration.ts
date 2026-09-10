#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/ac550a30222ec95b7b2ffb17a8650b328fe37603400e0beb07bd20f0926ae5dc/contract';
import endContract from '../../snapshots/ac550a30222ec95b7b2ffb17a8650b328fe37603400e0beb07bd20f0926ae5dc/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'BatteryType',
        columns: [
          col('dod', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'BatteryType_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Lesson',
        columns: [
          col('category', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('contentJson', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('intro', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('number', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('published', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'Lesson_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'News',
        columns: [
          col('contentJson', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('excerpt', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('published', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('publishedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'News_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'PanelSpec',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('watts', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'PanelSpec_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Region',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('peakSunHours', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'Region_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Resource',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('source', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'Resource_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'RoofOrientation',
        columns: [
          col('factor', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'RoofOrientation_pkey' })],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BatteryType',
        index: 'BatteryType_name_key',
        columns: ['name'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_category_number_idx',
        columns: ['category', 'number'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_slug_key',
        columns: ['slug'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'News',
        index: 'News_published_publishedAt_idx',
        columns: ['published', 'publishedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'News',
        index: 'News_slug_key',
        columns: ['slug'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'PanelSpec',
        index: 'PanelSpec_watts_key',
        columns: ['watts'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Region',
        index: 'Region_name_key',
        columns: ['name'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Resource',
        index: 'Resource_category_position_idx',
        columns: ['category', 'position'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RoofOrientation',
        index: 'RoofOrientation_name_key',
        columns: ['name'],
        extras: { unique: true },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
