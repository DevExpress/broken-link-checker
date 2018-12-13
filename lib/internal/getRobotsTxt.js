"use strict";
var guard = require("robots-txt-guard");
var parse = require("robots-txt-parse");

var got = require("got");
var urllib = require("url");
var urlobj = require("urlobj");



function getRobotsTxt(url, options)
{
	url = urlobj.parse(url);
	
	// TODO :: this mutates the original (if was an object)
	url.hash = null;
	url.path = url.pathname = "/robots.txt";
	url.query = null;
	url.search = null;
	
	var stream = new Promise((resolve, reject) => {
		const request = got(urllib.format(url),  // TODO :: https://github.com/joepie91/node-bhttp/issues/3
		{
			throwHttpErrors: false,
			headers: { "user-agent":options.userAgent },
			stream: true
		});

		request.on('error', reject);
		request.on('response', resolve);
	});

	return stream
	.then(parse)
	.then(guard);
}



module.exports = getRobotsTxt;
