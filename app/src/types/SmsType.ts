export interface Sms {
  id: string;
  type: SmsType;
  phone_number: string;
  text: string;
  status: SmsStatus;
  external_id: string;
  error_message: string | null;
  scheduled_at: string | null;
  created_at: string;
  device_name: string;
  sim_slot: number;
}

export type SmsType = 'outgoing' | 'incoming';
export type SmsStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'failed' | 'received';

export interface SmsStats {
  total: number;
  incoming: number;
  outgoing: number;
  delivered: number;
  failed: number;
  pending: number;
  last_message_at: string;
}
