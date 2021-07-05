export class IdentityAPI {
  constructor(apiURL, token) {
    this.apiURL = apiURL;
    this.token = token;
  }

  headers(headers = {}) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.token}`,
      ...headers
    };
  }

  parseJsonResponse(response) {
    return response.json().then(json => {
      if (!response.ok) {
        return Promise.reject({ status: response.status, json });
      }

      return json;
    });
  }

  request(path, options = {}) {
    const headers = this.headers(options.headers || {});
    return fetch(this.apiURL + path, { ...options, headers }).then(response => {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.match(/json/)) {
        return this.parseJsonResponse(response);
      }

      if (!response.ok) {
        return response.text().then(data => {
          return Promise.reject({ stauts: response.status, data });
        });
      }
      return response.text().then(data => {
        data;
      });
    });
  }
}