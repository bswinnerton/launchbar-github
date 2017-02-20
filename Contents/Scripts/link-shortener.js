class LinkShortener {
  constructor(link) {
    this.link = link;
  }

  run() {
    const baseURL     = 'https://git.io/create';
    const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';

    let result = HTTP.post(baseURL, {
      headerFields: { 'Content-Type': contentType },
      body: "url=" + encodeURIComponent(this.link),
    });

    return 'https://git.io/' + result.data;
  }
}

module.exports.LinkShortener = LinkShortener;
