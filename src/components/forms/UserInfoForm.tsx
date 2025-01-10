import React, { useState } from 'react';

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
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Start Your Enneagram Assessment</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded-lg"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is this for work or personal use?
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={isWorkAssessment ? 'work' : 'personal'}
              onChange={(e) => setIsWorkAssessment(e.target.value === 'work')}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
            </select>
          </div>

          {isWorkAssessment && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg"
                value={userInfo.companyName || ''}
                onChange={(e) => handleCompanySearch(e.target.value)}
                readOnly={companySelected}
              />
              
              {showSuggestions && filteredCompanies.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-lg w-full mt-1">
                  {filteredCompanies.map((company) => (
                    <li
                      key={company}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
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
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Begin Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}