export class PrepareImageResponse {
  private url: string;
  private sessionKey: string;
  private urlExpires: number;

  static of(url: string, sessionKey: string, urlExpires: number) {
    const response = new PrepareImageResponse();
    response.url = url;
    response.sessionKey = sessionKey;
    response.urlExpires = urlExpires;
    return response;
  }
}
