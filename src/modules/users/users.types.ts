import type * as $Enums from '../../generated/prisma/enums.js';

export interface UserRT {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: $Enums.Role | null;
  verifiedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
