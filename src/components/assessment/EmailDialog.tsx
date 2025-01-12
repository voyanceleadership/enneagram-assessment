// src/components/assessment/EmailDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail: string;
  onSendEmail: (emails: string[], message: string) => Promise<void>;
  isSending: boolean;
}

export default function EmailDialog({ isOpen, onClose, defaultEmail, onSendEmail, isSending }: EmailDialogProps) {
  const [emails, setEmails] = useState([defaultEmail]);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEmails([defaultEmail]);
      setNewEmail('');
      setMessage('');
      setError(null);
    }
  }, [isOpen, defaultEmail]);

  const handleAddEmail = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      if (!emails.includes(newEmail)) {
        setEmails([...emails, newEmail]);
      }
      setNewEmail('');
      setError(null);
    } else {
      setError('Please enter a valid email address');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSendEmail = async () => {
    if (emails.length === 0) {
      setError('Please add at least one email address');
      return;
    }
    try {
      console.log('EmailDialog sending to:', emails, 'with message:', message);
      await onSendEmail(emails, message);
      onClose();
    } catch (error) {
      setError('Failed to send email. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Assessment Results</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Email Addresses</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {emails.map(email => (
                <div key={email} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                  <span className="text-sm">{email}</span>
                  <button 
                    onClick={() => handleRemoveEmail(email)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail} type="button">Add</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Message (Optional)</Label>
            <Textarea
              placeholder="Add a personal message to the email..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || emails.length === 0}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Results'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}