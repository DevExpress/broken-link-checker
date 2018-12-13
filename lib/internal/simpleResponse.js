"use strict";



function simpleResponse(response)
{
	var simplified = simplify(response);
	simplified.redirects = [];
	
	for (var i=0; i<response.redirects.length; i++)
	{
		simplified.redirects.push( simplify(response.redirects[i]) );
	}
	
	return simplified;
}



function simplify(response)
{
	return {
		headers:       response.headers,
		httpVersion:   response.httpVersion,
		statusCode:    response.statusCode,
		statusMessage: response.statusMessage,
		url:           response.url
	};
}



module.exports = simpleResponse;
