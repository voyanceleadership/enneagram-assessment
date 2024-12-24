import React from 'react';
import { UserInfo } from '../assessment/EnneagramAssessment';

interface UserInfoFormProps {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  onNext: () => void;
}

export default function UserInfoForm({ userInfo, setUserInfo, onNext }: UserInfoFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
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
              onChange={(e) => setUserInfo({
                ...userInfo,
                firstName: e.target.value
              })}
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
              onChange={(e) => setUserInfo({
                ...userInfo,
                lastName: e.target.value
              })}
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
              onChange={(e) => setUserInfo({
                ...userInfo,
                email: e.target.value
              })}
            />
          </div>
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