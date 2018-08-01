var cron = require('cron');
var fetchUrl = require("fetch").fetchUrl;
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;

var min_price = '1800';
var max_price = '2300';



var job = new cron.CronJob('* * * * *', function() {
  fetchInfo();
}, null, true);

async function fetchInfo() {
  fetchUrl(`https://sfbay.craigslist.org/search/sfc/apa?postedToday=1&min_price=${min_price}&max_price=${max_price}&availabilityMode=0&sale_date=all+dates`, function(error, meta, body) {
    let response = body.toString();
    let dom = new JSDOM(response);
    let result_row_responses = dom.window.document.querySelectorAll("li.result-row");
    let results_count = 0;
    let response_array = new Array();
    for (const result_row_response of result_row_responses) {
      let result_row_response_dom = new JSDOM(result_row_response.innerHTML);
      let result_row_link = result_row_response_dom.window.document.querySelector("a") ? result_row_response_dom.window.document.querySelector("a").href : 'N/A';
      let result_row_title = result_row_response_dom.window.document.querySelector(".result-title") ? result_row_response_dom.window.document.querySelector(".result-title").innerHTML : 'N/A';
      let result_row_meta = result_row_response_dom.window.document.querySelector("span.result-meta").innerHTML;
      let result_row_meta_dom = new JSDOM(result_row_meta);
      let result_row_price = result_row_meta_dom.window.document.querySelector(".result-price") ? result_row_meta_dom.window.document.querySelector(".result-price").innerHTML : 'N/A';
      let result_row_hood = result_row_meta_dom.window.document.querySelector(".result-hood") ? result_row_meta_dom.window.document.querySelector(".result-hood").innerHTML : 'N/A';
      const result_row_response_object = {
        title: result_row_link,
        link: result_row_link,
        price: result_row_price,
        hood: result_row_hood
      };
      response_array.push(result_row_response_object);
      //console.dir(result_row_response_object);
      results_count++;
    }
    console.dir(groupBy(response_array, 'hood'));
  });

}

/*
 *This function groups an array of result_row_response_objects by unique user defined field combination
 */
function groupBy(data, group_by_field) {
  unique_group_by_field_values = [...new Set(data.map(result_row_response => {
    return result_row_response[group_by_field];
  }))];
  return unique_group_by_field_values.map(unique_group_by_field_value => {
    let filtered_data_results = data.filter(result_row_response => {
      let result_response_row_group_by_field_value = result_row_response[group_by_field].toString().trim();
      return result_response_row_group_by_field_value === unique_group_by_field_value.toString().trim();

    });
    let group_by_field_object = {
      field: unique_group_by_field_value,
      results: filtered_data_results,
    };
    return group_by_field_object;
  });
}
