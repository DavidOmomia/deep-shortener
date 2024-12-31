import { logger } from './logger';
import { InternalServerError, JoiValidationError } from './errors';
import Joi from 'joi';

interface HostnameValidationRules {
  validChars: RegExp;
  noConsecutiveSpecials: RegExp;
  validStart: RegExp;
  validEnd: RegExp;
  minLength: number;
  maxLength: number;
}

export const env = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    const envErrorMessage = `Missing: process.env['${name}'].`;
    console.error(envErrorMessage);
    throw new Error(envErrorMessage);
  }
  return value;
};

export const isLengthy = (data: any): boolean => {
  return data && data.length > 0;
};

export const isNotLengthy = (data: any | undefined): boolean => {
  return !data || data.length <= 0;
};

export const isTruthy = <T>(data: T): boolean => {
  return data && data !== undefined;
};

export const isFalsy = <T>(data: T): boolean => {
  return !data || data === undefined || data === null;
};

export const isEmpty = (data: any): boolean => {
  return !data || data === undefined || data === null || data === '';
};

export const isNotEmpty = (data: any): boolean => {
  return data !== undefined && data !== null && data !== '';
};

export const validate = <T>(data: T, schema: Joi.Schema): T => {
  const { error, value } = schema.validate(data);

  if (error) {
    throw new JoiValidationError({
      message: 'Validation failed',
      verboseMessage: error,
    });
  }

  return value;
};

export const isValidUrl = (urlString: string): boolean => {
  // Handle empty or non-string input
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  try {
    const normalizedUrl = normalizeUrl(urlString);
    const url = new URL(normalizedUrl);
    return (
      isValidProtocol(url.protocol) &&
      isValidHostname(url.hostname, hostnameRules) &&
      isValidLabels(url.hostname) &&
      isValidTld(url.hostname) &&
      isValidPort(url.port) &&
      isValidPath(url.pathname) &&
      isValidQuery(url.search)
    );
  } catch {
    return false;
  }
};

const hostnameRules: HostnameValidationRules = {
  validChars: /^[a-zA-Z0-9-._]+$/,
  noConsecutiveSpecials: /^(?!.*[._-]{2})[a-zA-Z0-9-._]+$/,
  validStart: /^[a-zA-Z0-9]/,
  validEnd: /[a-zA-Z0-9]$/,
  minLength: 1,
  maxLength: 253,
};

export const normalizeUrl = (urlString: string): string => {
  let normalized = urlString.trim();
  
  if (normalized.startsWith('www.')) {
    normalized = `http://${normalized}`;
  }
  
  if (!/^(?:https?:)?\/\//i.test(normalized)) {
    normalized = `http://${normalized}`;
  }
  
  try {
    const url = new URL(normalized);
    normalized = url.toString(); 
  } catch {
    return urlString
  }
  
  return normalized;
};


const isValidProtocol = (protocol: string): boolean => {
  return ['http:', 'https:'].includes(protocol);
};

const isValidHostname = (hostname: string, rules: HostnameValidationRules): boolean => {
  if (hostname.startsWith('www.')) {
    hostname = hostname.slice(4);
  }

  if (
    !hostname ||
    hostname.length < rules.minLength ||
    hostname.length > rules.maxLength ||
    !rules.validChars.test(hostname) ||
    !rules.noConsecutiveSpecials.test(hostname) ||
    !rules.validStart.test(hostname) ||
    !rules.validEnd.test(hostname) ||
    !hostname.includes('.')
  ) {
    return false;
  }

  return true;
};

const isValidLabels = (hostname: string): boolean => {
  const labels = hostname.split('.');
  const validLabel = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  return labels.every((label) => label.length <= 63 && validLabel.test(label));
};

const isValidTld = (hostname: string): boolean => {
  const tld = hostname.split('.').pop() || '';
  return /^[a-zA-Z]{2,}$/.test(tld);
};

const isValidPort = (port: string): boolean => {
  if (!port) return true;
  const portNum = parseInt(port, 10);
  return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
};

const isValidPath = (pathname: string): boolean => {
  if (pathname === '/') return true;
  const validPath = /^[a-zA-Z0-9-._~!$&'()*+,;=:@/%]*$/;
  return validPath.test(pathname);
};

const isValidQuery = (search: string): boolean => {
  if (!search || search === '?') return true;
  const validQuery = /^[a-zA-Z0-9-._~!$&'()*+,;=:@/?%]*$/;
  return validQuery.test(search.slice(1));
};