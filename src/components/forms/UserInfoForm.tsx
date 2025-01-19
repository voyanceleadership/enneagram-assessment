import React, { useState } from 'react';
import { theme, styleUtils } from '@/styles/theme';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

interface UserInfoFormProps {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  onNext: () => void;
}

const approvedDomains = ['company.com', 'organization.org'];
const companyList = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'];

export default function UserInfoForm({ userInfo, setUserInfo, onNext }: UserInfoFormProps) {
  const [isWorkAssessment, setIsWorkAssessment] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const [companySelected, setCompanySelected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Work assessment validation
      if (isWorkAssessment) {
        const emailDomain = userInfo.email.split('@')[1];
        const isApproved = approvedDomains.some((domain) => emailDomain.includes(domain));
        
        if (!isApproved) {
          setError('Please use your work email address to take the assessment.');
          setIsSubmitting(false);
          return;
        }

        if (!companySelected) {
          setError('Please select a valid company from the list.');
          setIsSubmitting(false);
          return;
        }
      }

      // Create initial assessment record
      const saveResponse = await fetch('/api/assessment/save-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo,
          responses: {
            weightingResponses: {},
            rankings: {}
          },
          assessmentType: 'standard',
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save initial assessment');
      }

      const saveData = await saveResponse.json();
      if (!saveData.success || !saveData.assessmentId) {
        throw new Error(saveData.error || 'Failed to create assessment');
      }

      // Simply proceed to questions - payment validation will happen at the end
      onNext();

    } catch (err) {
      console.error('Error during form submission:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySearch = (value: string) => {
    if (value.length > 0) {
      const filtered = companyList.filter((company) =>
        company.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setShowSuggestions(true);
      setCompanySelected(false);
    } else {
      setFilteredCompanies([]);
      setShowSuggestions(false);
    }
    setUserInfo({ ...userInfo, companyName: value });
  };

  const handleCompanySelect = (company: string) => {
    setUserInfo({ ...userInfo, companyName: company });
    setCompanySelected(true);
    setShowSuggestions(false);
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-sm space-y-6" 
      style={{ backgroundColor: 'white' }}
    >
      <h2 
        className="mb-4"
        style={{ 
          ...styleUtils.headingStyles, 
          color: theme.colors.text,
          fontSize: '1.5rem'
        }}
      >
        Start Your Enneagram Assessment
      </h2>
      
      {error && (
        <div 
          className="px-4 py-3 rounded relative" 
          style={{ 
            backgroundColor: `${theme.colors.accent2}15`,
            borderLeft: `4px solid ${theme.colors.accent2}`,
            color: theme.colors.text 
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label 
              className="block mb-1 text-sm"
              style={{ 
                ...styleUtils.bodyStyles,
                color: theme.colors.text,
                fontWeight: 500
              }}
            >
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-lg border transition-colors focus:outline-none focus:border-primary"
              style={{
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text,
                ...styleUtils.bodyStyles,
              }}
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            />
          </div>

          <div>
            <label 
              className="block mb-1 text-sm"
              style={{ 
                ...styleUtils.bodyStyles,
                color: theme.colors.text,
                fontWeight: 500
              }}
            >
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-lg border transition-colors focus:outline-none focus:border-primary"
              style={{
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text,
                ...styleUtils.bodyStyles,
              }}
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            />
          </div>

          <div>
            <label 
              className="block mb-1 text-sm"
              style={{ 
                ...styleUtils.bodyStyles,
                color: theme.colors.text,
                fontWeight: 500
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-2 rounded-lg border transition-colors focus:outline-none focus:border-primary"
              style={{
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text,
                ...styleUtils.bodyStyles,
              }}
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>

          <div>
            <label 
              className="block mb-1 text-sm"
              style={{ 
                ...styleUtils.bodyStyles,
                color: theme.colors.text,
                fontWeight: 500
              }}
            >
              Is this for work or personal use?
            </label>
            <select
              className="w-full p-2 rounded-lg border transition-colors focus:outline-none focus:border-primary"
              style={{
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text,
                ...styleUtils.bodyStyles,
              }}
              value={isWorkAssessment ? 'work' : 'personal'}
              onChange={(e) => setIsWorkAssessment(e.target.value === 'work')}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
            </select>
          </div>

          {isWorkAssessment && (
            <div className="relative">
              <label 
                className="block mb-1 text-sm"
                style={{ 
                  ...styleUtils.bodyStyles,
                  color: theme.colors.text,
                  fontWeight: 500
                }}
              >
                Company Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2 rounded-lg border transition-colors focus:outline-none focus:border-primary"
                style={{
                  borderColor: `${theme.colors.text}20`,
                  color: theme.colors.text,
                  ...styleUtils.bodyStyles,
                }}
                value={userInfo.companyName || ''}
                onChange={(e) => handleCompanySearch(e.target.value)}
                readOnly={companySelected}
              />
              
              {showSuggestions && filteredCompanies.length > 0 && (
                <ul 
                  className="absolute z-10 border rounded-lg w-full mt-1"
                  style={{ backgroundColor: 'white' }}
                >
                  {filteredCompanies.map((company) => (
                    <li
                      key={company}
                      className="p-2 cursor-pointer transition-colors"
                      style={{ 
                        ...styleUtils.bodyStyles,
                        color: theme.colors.text,
                        '&:hover': {
                          backgroundColor: `${theme.colors.primary}10`
                        }
                      }}
                      onClick={() => handleCompanySelect(company)}
                    >
                      {company}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg transition-opacity ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{ 
              backgroundColor: theme.colors.primary,
              color: 'white',
              ...styleUtils.bodyStyles,
              fontWeight: 500
            }}
          >
            {isSubmitting ? 'Processing...' : 'Begin Assessment'}
          </button>
        </div>
      </form>
    </div>
);
}