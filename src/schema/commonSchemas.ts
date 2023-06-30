import { string, nativeEnum } from 'zod';

import { Role } from '@prisma/client';

export const emailSchema = string({
	required_error: 'Email is required.',
	invalid_type_error: 'Email must be a string.',
}).email('Email is not valid.');

export const firstNameSchema = string({
	required_error: 'First name is required.',
	invalid_type_error: 'First name must be a string.',
})
	.min(3, 'First name must be at least 3 characters long.')
	.max(10, "First name can't be more than 10 characters long.");

export const lastNameSchema = string({
	required_error: 'Last name is required.',
	invalid_type_error: 'Last name must be a string.',
})
	.min(3, 'Last name must be at least 3 characters long.')
	.max(10, "Last name can't be more than 10 characters long.");

export const passwordSchema = string({
	required_error: 'Password is required.',
	invalid_type_error: 'Password must be a string.',
})
	.min(6, 'Password must be at least 6 characters long.')
	.refine(value => /[A-Z]/.test(value), {
		message: 'Password must contain at least one uppercase letter.',
	})
	.refine(value => /\d/.test(value), {
		message: 'Password must contain at least one number.',
	})
	.refine(value => /[^A-Za-z0-9]/.test(value), {
		message: 'Password must contain at least one non-alphanumeric character.',
	});

export const roleSchema = nativeEnum(Role, {
	errorMap: () => ({ message: 'Role is not valid.' }),
}).optional();
