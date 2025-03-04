'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function AuthDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkSession() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      setSessionInfo({ data, error });
      setLoading(false);
    }

    checkSession();
  }, [supabase.auth]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      {loading ? (
        <p>Loading session information...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Session Status</h2>
          <p>Session exists: {sessionInfo?.data?.session ? 'Yes' : 'No'}</p>
          
          {sessionInfo?.data?.session ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Session Info</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(sessionInfo.data.session, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-red-500">No active session found.</p>
          )}
          
          {sessionInfo?.error && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2 text-red-500">Error</h3>
              <pre className="bg-red-50 p-4 rounded text-red-700">
                {JSON.stringify(sessionInfo.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}