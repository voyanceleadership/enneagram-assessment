// scripts/manage-emails.ts
import { EmailValidationService } from '../src/services/emailValidation';
import { PrismaClient, Prisma } from '@prisma/client';

const emailValidationService = new EmailValidationService();
const prisma = new PrismaClient();

// Function to add a single email
async function addEmail(email: string) {
  try {
    const result = await emailValidationService.addValidEmail({
      email,
      source: 'manual'
    });
    console.log('Added email successfully:', result);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      console.log(`Email ${email} already exists in the database`);
    } else {
      console.error('Error adding email:', error);
    }
  }
}

// Function to list all valid emails
async function listEmails() {
  try {
    const emails = await prisma.validEmail.findMany({
      where: { active: true }
    });
    console.log('\nCurrent valid emails in database:');
    emails.forEach(email => {
      console.log(`- ${email.email} (added ${email.createdAt.toLocaleDateString()})`);
    });
  } catch (error) {
    console.error('Error listing emails:', error);
  }
}

async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const command = args[0];
  const email = args[1];

  switch (command) {
    case 'add':
      if (!email) {
        console.log('Please provide an email address. Usage: npx ts-node -P scripts/tsconfig.json scripts/manage-emails.ts add email@example.com');
        break;
      }
      await addEmail(email);
      await listEmails(); // Show the updated list after adding
      break;

    case 'list':
      await listEmails();
      break;

    default:
      console.log(`
Available commands:
  add <email>  - Add a new valid email
  list         - Show all valid emails

Examples:
  npx ts-node -P scripts/tsconfig.json scripts/manage-emails.ts add raena@voyanceleadership.com
  npx ts-node -P scripts/tsconfig.json scripts/manage-emails.ts list
      `);
  }

  await prisma.$disconnect();
}

main();