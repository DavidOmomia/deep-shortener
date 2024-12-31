import Joi from 'joi';

export const signupSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .regex(/[A-Z]/, 'upper-case')
    .regex(/[a-z]/, 'lower-case')
    .regex(/[\W_]+/, 'special character')
    .regex(/[0-9]/, 'digits')
    .required(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .regex(/[A-Z]/, 'upper-case')
    .regex(/[a-z]/, 'lower-case')
    .regex(/[\W_]+/, 'special character')
    .regex(/[0-9]/, 'digits')
    .required(),
});