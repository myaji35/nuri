import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { data, error } = await supabase
    .from('market_tiers')
    .select('country_code, tier');

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <h1>Supabase Connection Test Page</h1>
      <hr />
      
      <h2>Query Result:</h2>
      
      {error && (
        <div>
          <h3>Error:</h3>
          <p style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</p>
        </div>
      )}

      {data && (
        <div>
          <h3>Data:</h3>
          <p>
            {data.length > 0
              ? JSON.stringify(data, null, 2)
              : 'No rows returned. (This is OK if the table is empty)'}
          </p>
        </div>
      )}
    </div>
  );
}
