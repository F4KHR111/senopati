import { SetMetadata } from '@nestjs/common';

export const SCOPE_KEY = 'scopes';

/**
 * Decorator to define authorization scope constraints (e.g. 'department', 'building', 'global')
 */
export const Scope = (...scopes: string[]) => SetMetadata(SCOPE_KEY, scopes);
