const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    role: z.enum(['student', 'company']),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const jobSchema = z.object({
  body: z.object({
    role: z.string().min(2, 'Job role is required'),
    location: z.string().min(2, 'Location is required'),
    type: z.string().min(2, 'Job type is required'),
    duration: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(['Active', 'Closed', 'Draft', 'Blocked']).optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  jobSchema,
};
