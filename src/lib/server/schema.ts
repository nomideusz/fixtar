import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const userAddress = sqliteTable('user_address', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	type: text('type').notNull().default('Home'),
	street: text('street').notNull(),
	city: text('city').notNull(),
	postalCode: text('postal_code').notNull(),
	country: text('country').notNull(),
	isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const userProfile = sqliteTable('user_profile', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	firstName: text('first_name'),
	lastName: text('last_name'),
	phone: text('phone'),
	company: text('company'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const userPreferences = sqliteTable('user_preferences', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	emailNotifications: integer('email_notifications', { mode: 'boolean' }).notNull().default(true),
	smsNotifications: integer('sms_notifications', { mode: 'boolean' }).notNull().default(false),
	marketingEmails: integer('marketing_emails', { mode: 'boolean' }).notNull().default(true),
	orderUpdates: integer('order_updates', { mode: 'boolean' }).notNull().default(true),
	newsletter: integer('newsletter', { mode: 'boolean' }).notNull().default(false),
	language: text('language').notNull().default('pl'),
	currency: text('currency').notNull().default('PLN'),
	theme: text('theme').notNull().default('light'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const orders = sqliteTable('orders', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	orderNumber: text('order_number').notNull(),
	baselinkerOrderId: integer('baselinker_order_id'),
	status: text('status').notNull().default('pending'),
	total: integer('total').notNull().default(0),
	subtotal: integer('subtotal').notNull().default(0),
	shippingCost: integer('shipping_cost').notNull().default(0),
	paymentMethod: text('payment_method'),
	shippingMethod: text('shipping_method'),
	email: text('email'),
	phone: text('phone'),
	shippingAddress: text('shipping_address'),
	items: text('items'),
	userComments: text('user_comments'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const shippingMethods = sqliteTable('shipping_methods', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	cost: integer('cost').notNull().default(0),
	freeShippingThreshold: integer('free_shipping_threshold'),
	estimatedDays: integer('estimated_days'),
	baselinkerName: text('baselinker_name'),
	enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const magicLink = sqliteTable('magic_link', {
	id: text('id').primaryKey(),
	token: text('token').notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	used: integer('used', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});
