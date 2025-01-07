// src/services/emailValidation.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EmailValidationService {
  async isEmailValid(email: string): Promise<boolean> {
    try {
      const validEmail = await prisma.validEmail.findFirst({
        where: {
          email,
          active: true,
          AND: [
            {
              validFrom: {
                lte: new Date(),
              },
            },
            {
              OR: [
                {
                  validUntil: null,
                },
                {
                  validUntil: {
                    gt: new Date(),
                  },
                },
              ],
            },
          ],
        },
      });

      return !!validEmail;
    } catch (error) {
      console.error('Error validating email:', error);
      return false;
    }
  }

  async addValidEmail({
    email,
    source = 'manual',
    sourceId = null,
    cohortId = null,
    cohortName = null,
    validUntil = null,
  }: {
    email: string;
    source?: string;
    sourceId?: string | null;
    cohortId?: string | null;
    cohortName?: string | null;
    validUntil?: Date | null;
  }) {
    try {
      return await prisma.validEmail.create({
        data: {
          email,
          source,
          sourceId,
          cohortId,
          cohortName,
          validUntil,
        },
      });
    } catch (error) {
      console.error('Error adding valid email:', error);
      throw error;
    }
  }

  async addCohortEmails({
    emails,
    cohortId,
    cohortName,
    validUntil,
  }: {
    emails: string[];
    cohortId: string;
    cohortName: string;
    validUntil?: Date;
  }) {
    try {
      return await prisma.$transaction(
        emails.map((email) =>
          prisma.validEmail.create({
            data: {
              email,
              source: 'cohort',
              cohortId,
              cohortName,
              validUntil,
            },
          })
        )
      );
    } catch (error) {
      console.error('Error adding cohort emails:', error);
      throw error;
    }
  }
}