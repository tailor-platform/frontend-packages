export type ErrorResponse = {
  error: string;
};

export type Session = {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type SessionResult = {
  token: string;
};

export type SessionOption = {
  /**
   * If true, the hook will redirect users to the unauthorized path.
   */
  required: boolean;
};
