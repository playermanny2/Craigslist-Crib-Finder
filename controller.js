var cron = require('cron');
var fetchUrl = require("fetch").fetchUrl;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var job = new cron.CronJob('* * * * *', function() {  
var response = "";
fetchUrl("https://sfbay.craigslist.org/search/sfc/apa?postedToday=1&min_price=1800&max_price=2300&availabilityMode=0&sale_date=all+dates", function(error, meta, body){
    response = body.toString();
    let dom = new JSDOM(response);
	let result_row_responses = dom.window.document.querySelectorAll("li.result-row");
	let results_count = 0;
    for (const result_row_response of result_row_responses) {
     let result_row_response_dom = new JSDOM(result_row_response.innerHTML);
     	let result_row_link = result_row_response_dom.window.document.querySelector("a").href;
     	 let result_row_title = result_row_response_dom.window.document.querySelector(".result-title").innerHTML;
     	          	 let result_row_meta = result_row_response_dom.window.document.querySelector("span.result-meta").innerHTML;
     let result_row_meta_dom = new JSDOM(result_row_meta);

     	 let result_row_price = result_row_meta_dom.window.document.querySelector(".result-price").innerHTML;
     	 let result_row_hood = result_row_meta_dom.window.document.querySelector(".result-hood").innerHTML;
     	      	 	const result_row_response_object = {title: result_row_link,link:result_row_link,price:result_row_price,hood:result_row_hood};
     	     	console.dir(result_row_response_object);
   		results_count++;
}
console.log('count is: '+count);
});

}, null, true);

