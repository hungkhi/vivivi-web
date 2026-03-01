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

// ── Gamification Types ──────────────────────────────────────────────

export interface DailyQuest {
  id: string;
  quest_type: string;
  quest_category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  target_value: number;
  reward_vcoin: number;
  reward_ruby: number;
  reward_xp: number;
  is_active: boolean;
}

export interface UserDailyQuest {
  id: string;
  quest_id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  quest_date: string;
  quest?: DailyQuest;
}

export interface LevelQuest {
  id: string;
  level_required: number;
  quest_type: string;
  quest_category: string;
  difficulty: string;
  description: string;
  target_value: number;
  reward_vcoin: number;
  reward_ruby: number;
  reward_xp: number;
}

export interface UserLevelQuest {
  id: string;
  quest_id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  unlocked_at: string;
  quest?: LevelQuest;
}

export interface LoginReward {
  id: string;
  day_number: number;
  reward_vcoin: number;
  reward_ruby: number;
  reward_energy: number;
}

export interface UserLoginReward {
  id: string;
  current_day: number;
  last_claim_date: string;
  total_days_claimed: number;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement_type: string;
  requirement_value: number;
}

export interface UserMedal {
  id: string;
  medal_id: string;
  unlocked_at: string;
  medal?: Medal;
}

// ── Phase 5: Costumes, Backgrounds, Media, Stories ────────────────

export interface CharacterStory {
  id: string;
  character_id: string;
  chapter_number: number;
  title: string;
  content: string;
  summary: string;
  energy_cost: number;
  reward_vcoin: number;
  reward_xp: number;
  reward_ruby: number;
  display_order: number;
  is_active: boolean;
}

export interface UserCharacterStory {
  id: string;
  story_id: string;
  is_unlocked: boolean;
  is_read: boolean;
  unlocked_at: string | null;
  read_at: string | null;
}

export interface MediaItem {
  id: string;
  character_id: string;
  url: string;
  thumbnail: string;
  media_type: 'image' | 'video';
  tier: string;
  price_vcoin: number;
  price_ruby: number;
}

export interface UserAsset {
  id: string;
  item_id: string;
  item_type: 'character' | 'character_costume' | 'background' | 'media';
}
