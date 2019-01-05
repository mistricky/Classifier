export type Status = "error" | "success";

export interface ReplyMessage {
  status: Status;
  payload: unknown;
}
