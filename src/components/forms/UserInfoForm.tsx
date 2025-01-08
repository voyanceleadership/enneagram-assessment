import React, { useState } from 'react';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  assessmentId: string;  // Added assessmentId
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isWorkAssessment) {
      const emailDomain = userInfo.email.split('@')[1];
      const isApproved = approvedDomains.some((domain) => emailDomain.includes(domain));
      
      if (!isApproved) {
        alert('Please use your work email address to take the assessment.');
        return;
      }

      if (!companySelected) {
        alert('Please select a valid company from the list.');
        return;
      }
    }

    // Check if email is in ValidEmail database
    try {
      const validateResponse = await fetch('/api/assessment/payment-flow/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userInfo.email,
          assessmentId: userInfo.assessmentId
        })
      });

      const validateResult = await validateResponse.json();
      console.log('Email validation result:', validateResult);

      if (validateResult.valid) {
        // If email is valid, create checkout session for $0
        const checkoutResponse = await fetch('/api/assessment/payment-flow/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            assessmentId: userInfo.assessmentId
          })
        });

        const checkoutResult = await checkoutResponse.json();
        console.log('Checkout result:', checkoutResult);

        if (checkoutResult.url === '/assessment/results') {
          // Redirect to results page
          window.location.href = checkoutResult.url;
          return;
        }
      }
    } catch (error) {
      console.error('Error during validation:', error);
    }

    // If we get here, either the email wasn't valid or there was an error
    // Proceed with normal flow
    onNext();
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
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
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
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
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
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
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
                readOnly={companySelected}  // Prevent typing after selection
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Begin Assessment
          </button>
        </div>
      </form>
    </div>
  );
}