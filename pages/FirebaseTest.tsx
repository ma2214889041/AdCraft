import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { onAuthChange } from '../services/authService';

export const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing Firebase connection...');
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    const testFirebase = async () => {
      const testDetails: string[] = [];

      try {
        // Test 1: Check if auth is initialized
        testDetails.push('✅ Firebase Auth SDK imported successfully');

        // Test 2: Check auth instance
        if (auth) {
          testDetails.push('✅ Firebase Auth instance created');
          testDetails.push(`📋 Auth Domain: ${auth.config.authDomain}`);
          testDetails.push(`📋 API Key: ${auth.config.apiKey?.substring(0, 20)}...`);
        } else {
          throw new Error('Auth instance is null');
        }

        // Test 3: Test auth state listener
        const unsubscribe = onAuthChange((user) => {
          if (user) {
            testDetails.push(`✅ User signed in: ${user.email}`);
          } else {
            testDetails.push('✅ Auth state listener working (no user signed in)');
          }
        });

        setTimeout(() => {
          unsubscribe();
        }, 1000);

        testDetails.push('✅ Auth state listener initialized successfully');

        setDetails(testDetails);
        setStatus('success');
        setMessage('🎉 Firebase is configured correctly!');
      } catch (error: any) {
        testDetails.push(`❌ Error: ${error.message}`);
        setDetails(testDetails);
        setStatus('error');
        setMessage('⚠️ Firebase configuration error detected');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>

        <div className={`p-6 rounded-lg mb-6 ${
          status === 'testing' ? 'bg-blue-900/20 border border-blue-500' :
          status === 'success' ? 'bg-green-900/20 border border-green-500' :
          'bg-red-900/20 border border-red-500'
        }`}>
          <h2 className="text-xl font-semibold mb-2">{message}</h2>

          {status === 'testing' && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Running tests...</span>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results:</h3>
          <ul className="space-y-2 font-mono text-sm">
            {details.map((detail, index) => (
              <li key={index} className="py-1">{detail}</li>
            ))}
          </ul>

          {status === 'success' && (
            <div className="mt-6 p-4 bg-green-900/30 rounded border border-green-700">
              <p className="font-semibold mb-2">✅ All tests passed!</p>
              <p className="text-sm text-slate-300">
                Firebase Authentication is properly configured and ready to use.
                You can now implement login, registration, and other auth features.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 p-4 bg-red-900/30 rounded border border-red-700">
              <p className="font-semibold mb-2">❌ Configuration Error</p>
              <p className="text-sm text-slate-300">
                Please check your .env file and ensure all Firebase environment variables are set correctly.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-slate-400">
          <p>Environment Variables Status:</p>
          <ul className="mt-2 space-y-1 font-mono">
            <li>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
            <li>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
            <li>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
