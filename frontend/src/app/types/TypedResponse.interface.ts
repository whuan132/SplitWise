export default interface TypedResponse<T = unknown> {
  success: boolean;
  data: T;
}
