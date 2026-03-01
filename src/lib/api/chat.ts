import { getSupabase } from '@/lib/supabase/client';
import { getClientId } from '@/lib/utils/client-id';
import type { ConversationMessage } from '@/lib/supabase/types';

export async function sendMessageToGemini(
  message: string,
  characterId: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gemini-chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'X-Client-Id': getClientId(),
      },
      body: JSON.stringify({
        message,
        character_id: characterId,
        user_id: session?.user?.id || null,
        client_id: session ? null : getClientId(),
        conversation_history: conversationHistory,
      }),
    }
  );

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result.response;
}

export async function fetchConversation(
  characterId: string,
  limit = 20,
  before?: string
): Promise<ConversationMessage[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('conversation')
    .select('id,message,is_agent,created_at,is_seen,character_id')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).reverse() as ConversationMessage[];
}

export async function persistMessage(
  characterId: string,
  message: string,
  isAgent: boolean
): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const clientId = getClientId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('conversation') as any).insert({
    character_id: characterId,
    message,
    is_agent: isAgent,
    is_seen: !isAgent,
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: clientId }),
  });
}

export async function markMessagesSeen(characterId: string): Promise<void> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('conversation') as any)
    .update({ is_seen: true })
    .eq('character_id', characterId)
    .eq('is_seen', false);
}
