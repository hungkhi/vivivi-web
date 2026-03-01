export interface Character {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  avatar: string;
  base_model_url: string;
  full_model: string | null;
  agent_elevenlabs_id: string;
  tier: 'free' | 'pro' | 'unlimited';
  available: boolean;
  price_vcoin: number;
  price_ruby: number;
  default_costume_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id?: string;
  user_id?: string;
  client_id?: string;
  character_id: string;
  message: string;
  is_agent: boolean;
  is_seen: boolean;
  created_at: string;
}

export interface UserCurrency {
  vcoin: number;
  ruby: number;
}

export interface UserStats {
  id: string;
  user_id?: string;
  client_id?: string;
  level: number;
  xp: number;
  energy: number;
  energy_updated_at: string;
  login_streak: number;
  last_login_date: string;
  total_logins: number;
  total_messages_sent: number;
  total_voice_minutes: number;
  total_video_minutes: number;
}

export interface Background {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  tier: string;
  available: boolean;
  price_vcoin: number;
  price_ruby: number;
}

export interface Costume {
  id: string;
  character_id: string;
  costume_name: string;
  url: string;
  thumbnail: string;
  model_url: string | null;
  tier: string;
  available: boolean;
  price_vcoin: number;
  price_ruby: number;
}

export interface CharacterRelationship {
  id: string;
  character_id: string;
  affection_level: number;
  affection_xp: number;
  total_chats: number;
  total_voice_calls: number;
  total_video_calls: number;
  current_stage_key: string;
  last_interaction: string;
}
